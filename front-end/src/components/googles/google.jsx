import { useState, useEffect } from "react";
import "./google.scss";

const API_BASE = "http://localhost:3000";

// Generate 30-min slots from 9h to 18h
function generateSlots() {
  const slots = [];
  for (let h = 9; h < 18; h++) {
    slots.push(`${String(h).padStart(2, "0")}:00`);
    slots.push(`${String(h).padStart(2, "0")}:30`);
  }
  return slots;
}

const ALL_SLOTS = generateSlots();

const DAYS_FR = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
const MONTHS_FR = [
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
];

function getMonthDays(year, month) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  // Monday-based: (getDay() + 6) % 7
  const startOffset = (firstDay.getDay() + 6) % 7;
  const days = [];
  for (let i = 0; i < startOffset; i++) days.push(null);
  for (let d = 1; d <= lastDay.getDate(); d++) days.push(d);
  return days;
}

export default function AppointmentPage() {
  const [step, setStep] = useState(1);
  const [dieticians, setDieticians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Selections
  const [selectedDietician, setSelectedDietician] = useState(null);
  const [calYear, setCalYear] = useState(new Date().getFullYear());
  const [calMonth, setCalMonth] = useState(new Date().getMonth());
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [motif, setMotif] = useState("");

  // Submission
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch(`${API_BASE}/dieticians`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        setDieticians(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => {
        setError("Impossible de charger les diététiciens.");
        setLoading(false);
      });
  }, []);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const isPastDay = (day) => {
    if (!day) return false;
    const d = new Date(calYear, calMonth, day);
    return d < today;
  };

  const isWeekend = (day) => {
    if (!day) return false;
    const d = new Date(calYear, calMonth, day);
    const wd = d.getDay();
    return wd === 0 || wd === 6;
  };

  const prevMonth = () => {
    if (calMonth === 0) { setCalMonth(11); setCalYear(y => y - 1); }
    else setCalMonth(m => m - 1);
    setSelectedDay(null);
    setSelectedSlot(null);
  };

  const nextMonth = () => {
    if (calMonth === 11) { setCalMonth(0); setCalYear(y => y + 1); }
    else setCalMonth(m => m + 1);
    setSelectedDay(null);
    setSelectedSlot(null);
  };

  const handleDayClick = (day) => {
    if (!day || isPastDay(day) || isWeekend(day)) return;
    setSelectedDay(day);
    setSelectedSlot(null);
  };

  const handleConfirm = async () => {
    if (!selectedDietician || !selectedDay || !selectedSlot) return;
    setSubmitting(true);
    setSubmitError(null);

    const token = localStorage.getItem("token");
    const [h, m] = selectedSlot.split(":").map(Number);
    const date = new Date(calYear, calMonth, selectedDay);
    const startTime = new Date(calYear, calMonth, selectedDay, h, m);
    const endTime = new Date(calYear, calMonth, selectedDay, h, m + 30);

    // Decode user id from JWT
    let userId = null;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      userId = payload.id;
    } catch {
      setSubmitError("Session invalide. Veuillez vous reconnecter.");
      setSubmitting(false);
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/appointments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId,
          dieticianId: selectedDietician.id,
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString(),
          date: date.toISOString(),
          description: motif || undefined,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Erreur lors de la création.");
      }

      setSuccess(true);
    } catch (e) {
      setSubmitError(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  const getInitials = (d) =>
    `${d.first_name?.[0] ?? ""}${d.last_name?.[0] ?? ""}`.toUpperCase();

  const formattedDate = selectedDay
    ? new Date(calYear, calMonth, selectedDay).toLocaleDateString("fr-FR", {
        weekday: "long", day: "numeric", month: "long", year: "numeric",
      })
    : null;

  const days = getMonthDays(calYear, calMonth);

  if (success) {
    return (
      <div className="appt-page">
        <div className="appt-success">
          <div className="appt-success__icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
          </div>
          <h2>Rendez-vous confirmé !</h2>
          <p>
            Votre rendez-vous avec <strong>{selectedDietician?.first_name} {selectedDietician?.last_name}</strong><br/>
            le <strong>{formattedDate}</strong> à <strong>{selectedSlot}</strong> a bien été enregistré.
          </p>
          <p className="appt-success__sub">Un événement a été ajouté à votre agenda Google.</p>
          <a href="/" className="appt-btn appt-btn--solid">Retour à l'accueil</a>
        </div>
      </div>
    );
  }

  return (
    <div className="appt-page">
      <div className="appt-hero">
        <span className="appt-hero__eyebrow">Consultation</span>
        <h1 className="appt-hero__title">Prendre un rendez-vous</h1>
        <p className="appt-hero__sub">Réservez une consultation avec l'un de nos diététiciens certifiés.</p>
      </div>

      {/* Stepper */}
      <div className="appt-stepper">
        {[
          { n: 1, label: "Diététicien" },
          { n: 2, label: "Date & Heure" },
          { n: 3, label: "Confirmation" },
        ].map(({ n, label }) => (
          <div
            key={n}
            className={`appt-stepper__item ${step === n ? "appt-stepper__item--active" : ""} ${step > n ? "appt-stepper__item--done" : ""}`}
          >
            <div className="appt-stepper__bubble">
              {step > n ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              ) : n}
            </div>
            <span className="appt-stepper__label">{label}</span>
            {n < 3 && <div className="appt-stepper__line" />}
          </div>
        ))}
      </div>

      <div className="appt-content">
        {/* ── Step 1 : Dietician ── */}
        {step === 1 && (
          <div className="appt-step appt-step--enter">
            <h2 className="appt-step__title">Choisissez votre diététicien</h2>
            {loading && <p className="appt-loading">Chargement…</p>}
            {error && <p className="appt-error">{error}</p>}
            {!loading && !error && (
              <div className="appt-dieticians">
                {dieticians.map((d) => (
                  <button
                    key={d.id}
                    className={`appt-card ${selectedDietician?.id === d.id ? "appt-card--selected" : ""}`}
                    onClick={() => setSelectedDietician(d)}
                  >
                    <div className="appt-card__avatar">{getInitials(d)}</div>
                    <div className="appt-card__info">
                      <span className="appt-card__name">{d.first_name} {d.last_name}</span>
                      {d.bio && <span className="appt-card__bio">{d.bio}</span>}
                    </div>
                    {selectedDietician?.id === d.id && (
                      <span className="appt-card__check">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
            <div className="appt-actions">
              <button
                className="appt-btn appt-btn--solid"
                disabled={!selectedDietician}
                onClick={() => setStep(2)}
              >
                Continuer
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* ── Step 2 : Date & Slot ── */}
        {step === 2 && (
          <div className="appt-step appt-step--enter">
            <h2 className="appt-step__title">Choisissez une date et un créneau</h2>

            <div className="appt-calendar">
              <div className="appt-calendar__header">
                <button className="appt-calendar__nav" onClick={prevMonth}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 18l-6-6 6-6"/>
                  </svg>
                </button>
                <span className="appt-calendar__title">{MONTHS_FR[calMonth]} {calYear}</span>
                <button className="appt-calendar__nav" onClick={nextMonth}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 18l6-6-6-6"/>
                  </svg>
                </button>
              </div>

              <div className="appt-calendar__grid">
                {DAYS_FR.map((d) => (
                  <div key={d} className="appt-calendar__dow">{d}</div>
                ))}
                {days.map((day, i) => (
                  <button
                    key={i}
                    className={[
                      "appt-calendar__day",
                      !day ? "appt-calendar__day--empty" : "",
                      day && isPastDay(day) ? "appt-calendar__day--past" : "",
                      day && isWeekend(day) ? "appt-calendar__day--weekend" : "",
                      day && selectedDay === day ? "appt-calendar__day--selected" : "",
                    ].join(" ")}
                    onClick={() => handleDayClick(day)}
                    disabled={!day || isPastDay(day) || isWeekend(day)}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>

            {selectedDay && (
              <div className="appt-slots">
                <h3 className="appt-slots__title">
                  Créneaux disponibles — <em>{formattedDate}</em>
                </h3>
                <div className="appt-slots__grid">
                  {ALL_SLOTS.map((slot) => (
                    <button
                      key={slot}
                      className={`appt-slot ${selectedSlot === slot ? "appt-slot--selected" : ""}`}
                      onClick={() => setSelectedSlot(slot)}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="appt-actions">
              <button className="appt-btn appt-btn--ghost" onClick={() => setStep(1)}>
                Retour
              </button>
              <button
                className="appt-btn appt-btn--solid"
                disabled={!selectedDay || !selectedSlot}
                onClick={() => setStep(3)}
              >
                Continuer
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* ── Step 3 : Confirm ── */}
        {step === 3 && (
          <div className="appt-step appt-step--enter">
            <h2 className="appt-step__title">Confirmer votre rendez-vous</h2>

            <div className="appt-summary">
              <div className="appt-summary__row">
                <span className="appt-summary__label">Diététicien</span>
                <span className="appt-summary__value">
                  {selectedDietician?.first_name} {selectedDietician?.last_name}
                </span>
              </div>
              <div className="appt-summary__row">
                <span className="appt-summary__label">Date</span>
                <span className="appt-summary__value" style={{ textTransform: "capitalize" }}>{formattedDate}</span>
              </div>
              <div className="appt-summary__row">
                <span className="appt-summary__label">Heure</span>
                <span className="appt-summary__value">{selectedSlot} — {
                  (() => {
                    const [h, m] = selectedSlot.split(":").map(Number);
                    const end = new Date(0, 0, 0, h, m + 30);
                    return `${String(end.getHours()).padStart(2, "0")}:${String(end.getMinutes()).padStart(2, "0")}`;
                  })()
                }</span>
              </div>
            </div>

            <div className="appt-motif">
              <label htmlFor="motif">Motif de consultation <span>(optionnel)</span></label>
              <textarea
                id="motif"
                rows={3}
                placeholder="Décrivez brièvement votre demande…"
                value={motif}
                onChange={(e) => setMotif(e.target.value)}
              />
            </div>

            {submitError && <p className="appt-error">{submitError}</p>}

            <div className="appt-actions">
              <button className="appt-btn appt-btn--ghost" onClick={() => setStep(2)}>
                Retour
              </button>
              <button
                className="appt-btn appt-btn--solid"
                onClick={handleConfirm}
                disabled={submitting}
              >
                {submitting ? "Envoi…" : "Confirmer le rendez-vous"}
                {!submitting && (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

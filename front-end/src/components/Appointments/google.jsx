import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import "./google.scss";

// ─── Constantes ───────────────────────────────────────────────────────────────

const API_BASE_URL = "http://localhost:3000";

// Durée fixe d'un créneau en heures
const SLOT_DURATION_HOURS = 1;

// Plage horaire de la journée
const DAY_START_HOUR = 8;
const DAY_END_HOUR = 19;

// ─── Utilitaires ──────────────────────────────────────────────────────────────

/**
 * Récupère le token JWT depuis le cookie "token"
 * @returns {string|null}
 */
function getTokenFromCookie() {
	const cookies = document.cookie.split(";");
	for (const cookie of cookies) {
		const [cookieName, cookieValue] = cookie.trim().split("=");
		if (cookieName === "token") return cookieValue;
	}
	return null;
}

/**
 * Génère tous les créneaux horaires de la journée ["08:00", "09:00", ...]
 * @returns {string[]}
 */
function generateDaySlots() {
	const slots = [];
	for (let hour = DAY_START_HOUR; hour < DAY_END_HOUR; hour++) {
		slots.push(`${String(hour).padStart(2, "0")}:00`);
	}
	return slots;
}

/**
 * Retourne la date d'aujourd'hui au format "YYYY-MM-DD"
 * @returns {string}
 */
function getTodayString() {
	return new Date().toISOString().split("T")[0];
}

/**
 * Construit une datetime ISO à partir d'une date et d'une heure locale
 * @param {string} dateStr - "YYYY-MM-DD"
 * @param {string} timeStr - "HH:MM"
 * @returns {string} ISO 8601
 */
function buildISODateTime(dateStr, timeStr) {
	return new Date(`${dateStr}T${timeStr}:00`).toISOString();
}

/**
 * Formate une date "YYYY-MM-DD" en label lisible
 * @param {string} dateStr
 * @returns {string}
 */
function formatDateFr(dateStr) {
	// Ajout de T12:00 pour éviter le décalage UTC qui change le jour
	return new Date(`${dateStr}T12:00:00`).toLocaleDateString("fr-FR", {
		weekday: "long",
		day: "numeric",
		month: "long",
		year: "numeric",
	});
}

// ─── Composant principal ──────────────────────────────────────────────────────

export default function BookAppointment() {
	// Infos de l'utilisateur connecté (décodées depuis le JWT)
	const { user: currentUser } = useAuth();

	// Le diététicien unique, chargé automatiquement
	const [dietician, setDietician] = useState(null);

	// Date sélectionnée par l'utilisateur (format "YYYY-MM-DD")
	const [selectedDate, setSelectedDate] = useState(getTodayString());

	// Créneau horaire sélectionné (format "HH:MM")
	const [selectedSlot, setSelectedSlot] = useState(null);

	// Créneaux déjà occupés sur Google Calendar pour la date choisie
	const [bookedSlots, setBookedSlots] = useState([]);

	// Statut de la connexion Google Calendar
	const [isGoogleConnected, setIsGoogleConnected] = useState(null);

	// États de chargement
	const [isLoadingPage, setIsLoadingPage] = useState(true);
	const [isLoadingSlots, setIsLoadingSlots] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);

	// Messages de retour utilisateur
	const [errorMessage, setErrorMessage] = useState(null);
	const [successMessage, setSuccessMessage] = useState(null);

	const allDaySlots = generateDaySlots();

	// ─── Initialisation ───────────────────────────────────────────────────────

	useEffect(() => {
		async function initPage() {
			// 2. Charger le diététicien via la route publique
			try {
				const response = await fetch(`${API_BASE_URL}/dieticians/public`);
				if (!response.ok) throw new Error("Impossible de charger le diététicien.");
				const data = await response.json();
				setDietician(data);
			} catch (err) {
				setErrorMessage(err.message);
			}

			// 3. Vérifier si Google Calendar est connecté
			await checkGoogleCalendarStatus();

			setIsLoadingPage(false);
		}

		initPage();
	}, []);

	// ─── Vérification du statut Google Calendar ───────────────────────────────

	/**
	 * Teste GET /calendar pour savoir si le token OAuth Google est actif
	 */
	async function checkGoogleCalendarStatus() {
		try {
			const response = await fetch(`${API_BASE_URL}/calendar`);
			setIsGoogleConnected(response.ok);
		} catch {
			setIsGoogleConnected(false);
		}
	}

	// ─── Connexion Google Calendar (diété/admin uniquement) ───────────────────

	/**
	 * Redirige vers l'URL d'authentification Google OAuth2
	 */
	async function handleConnectGoogle() {
		try {
			const response = await fetch(`${API_BASE_URL}/auth-url`);
			if (!response.ok) throw new Error("Impossible d'obtenir l'URL Google.");
			const { url } = await response.json();
			window.location.href = url;
		} catch (err) {
			setErrorMessage(err.message);
		}
	}

	// ─── Chargement des créneaux occupés quand la date change ─────────────────

	useEffect(() => {
		if (!isGoogleConnected || !selectedDate) return;

		async function fetchBookedSlots() {
			setIsLoadingSlots(true);
			setSelectedSlot(null);
			setErrorMessage(null);

			try {
				// Charge les RDV depuis la BDD pour la date sélectionnée
				const response = await fetch(
					`${API_BASE_URL}/appointments?dietician_id=${dietician.id}&date=${selectedDate}`
				);
				if (!response.ok) throw new Error("Impossible de charger les disponibilités.");

				const appointments = await response.json();

				// Extrait les heures occupées depuis les données BDD
				const occupiedHours = appointments.map((appt) => {
					const startDate = new Date(appt.start_time);
					return `${String(startDate.getHours()).padStart(2, "0")}:00`;
				});

				setBookedSlots(occupiedHours);
			} catch (err) {
				setErrorMessage(err.message);
			} finally {
				setIsLoadingSlots(false);
			}
		}

		fetchBookedSlots();
	}, [isGoogleConnected, selectedDate]);

	// ─── Soumission du rendez-vous ─────────────────────────────────────────────

	async function handleBookAppointment() {
		console.log("currentUser complet :", currentUser);
		if (!dietician || !selectedDate || !selectedSlot) return;

		setIsSubmitting(true);
		setErrorMessage(null);
		setSuccessMessage(null);

		try {
			const jwtToken = getTokenFromCookie();

			const [slotHour] = selectedSlot.split(":").map(Number);
			const startTime = buildISODateTime(selectedDate, selectedSlot);
			const endTime = buildISODateTime(
				selectedDate,
				`${String(slotHour + SLOT_DURATION_HOURS).padStart(2, "0")}:00`
			);

			// ── Étape 1 : Créer l'event sur Google Calendar ──────────────────────
			const googleResponse = await fetch(`${API_BASE_URL}/calendar`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					summary: `Consultation — ${currentUser?.name || "Patient"}`,
					description: `Rendez-vous avec ${dietician.first_name} ${dietician.last_name}`,
					start: startTime,
					end: endTime,
					// L'email n'est envoyé que s'il est disponible dans le JWT
					...(currentUser?.email && { attendeeEmail: currentUser.email }),
				}),
			});

			if (!googleResponse.ok) {
				const errData = await googleResponse.json();
				throw new Error(errData.error || "Erreur Google Calendar.");
			}

			const googleEvent = await googleResponse.json();

			// ── Étape 2 : Sauvegarder en base de données ─────────────────────────
			const dbResponse = await fetch(`${API_BASE_URL}/appointments`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				credentials: "include",
				body: JSON.stringify({
					dieticianId: dietician.id,
					startTime,
					endTime,
					googleEventId: googleEvent.id, // lien avec l'event Google
				}),
			});

			if (!dbResponse.ok) {
				const errData = await dbResponse.json();
				// Le RDV est dans Google Calendar mais pas en BDD — on log sans bloquer
				console.warn("RDV Google créé mais erreur BDD :", errData.message);
			}

			setSuccessMessage(
				`Rendez-vous confirmé le ${formatDateFr(selectedDate)} de ${selectedSlot} à ${String(slotHour + 1).padStart(2, "0")}:00.`
			);

			// Mise à jour locale immédiate sans refetch
			setBookedSlots((prev) => [...prev, selectedSlot]);
			setSelectedSlot(null);

		} catch (err) {
			setErrorMessage(err.message);
		} finally {
			setIsSubmitting(false);
		}
	}

	// ─── Rendu : chargement initial ───────────────────────────────────────────

	if (isLoadingPage) {
		return (
			<div className="book">
				<div className="book__container">
					<div className="book__spinner">
						<div className="book__spinner-circle" />
						<p>Chargement...</p>
					</div>
				</div>
			</div>
		);
	}

	// ─── Rendu principal ──────────────────────────────────────────────────────

	return (
		<div className="book">
			<div className="book__container">

				{/* En-tête */}
				<div className="book__header">
					<h1 className="book__title">Prendre un rendez-vous</h1>
					{dietician && (
						<p className="book__subtitle">
							avec <strong>{dietician.first_name} {dietician.last_name}</strong>
							{dietician.bio && ` — ${dietician.bio}`}
						</p>
					)}
				</div>

				{/* Bandeau statut Google Calendar */}
				<div className={`book__gcal ${isGoogleConnected ? "book__gcal--ok" : "book__gcal--warn"}`}>
					<div className="book__gcal-left">
						<svg className="book__gcal-icon" viewBox="0 0 24 24" fill="none">
							{isGoogleConnected ? (
								<>
									<circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.15" />
									<path d="M7 12l3.5 3.5L17 8" stroke="currentColor" strokeWidth="2"
										strokeLinecap="round" strokeLinejoin="round" />
								</>
							) : (
								<>
									<circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.15" />
									<path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="2"
										strokeLinecap="round" />
								</>
							)}
						</svg>
						<span>
							{isGoogleConnected
								? "Google Calendar connecté — disponibilités en temps réel"
								: "Google Calendar non connecté — la prise de RDV est désactivée"}
						</span>
					</div>

					{/* Bouton connexion : visible uniquement pour le diété et l'admin */}
					{!isGoogleConnected && (
						<button className="book__gcal-btn" onClick={handleConnectGoogle}>
							Connecter Google Calendar
						</button>
					)}
				</div>

				{/* Messages de retour */}
				{errorMessage && (
					<div className="book__alert book__alert--error">{errorMessage}</div>
				)}
				{successMessage && (
					<div className="book__alert book__alert--success">
						<svg viewBox="0 0 24 24" fill="none">
							<path d="M7 12l3.5 3.5L17 8" stroke="currentColor" strokeWidth="2.5"
								strokeLinecap="round" strokeLinejoin="round" />
						</svg>
						{successMessage}
					</div>
				)}

				{/* Formulaire désactivé si Google non connecté */}
				<div className={`book__steps ${!isGoogleConnected ? "book__steps--disabled" : ""}`}>

					{/* Étape 1 : Date */}
					<section className="book__step">
						<h2 className="book__step-title">
							<span className="book__step-number">1</span>
							Choisir une date
						</h2>
						<input
							type="date"
							className="book__date-input"
							value={selectedDate}
							min={getTodayString()}
							disabled={!isGoogleConnected}
							onChange={(e) => {
								setSelectedDate(e.target.value);
								setErrorMessage(null);
							}}
						/>
					</section>

					{/* Étape 2 : Créneau */}
					<section className="book__step">
						<h2 className="book__step-title">
							<span className="book__step-number">2</span>
							Choisir un créneau
						</h2>

						{!isGoogleConnected ? (
							<p className="book__notice">
								Connectez Google Calendar pour voir les disponibilités.
							</p>
						) : isLoadingSlots ? (
							<div className="book__slots-loading">
								{allDaySlots.map((s) => (
									<div key={s} className="book__slot book__slot--skeleton" />
								))}
							</div>
						) : (
							<div className="book__slots">
								{allDaySlots.map((slot) => {
									const isBooked = bookedSlots.includes(slot);
									const isSelected = selectedSlot === slot;

									return (
										<button
											key={slot}
											disabled={isBooked}
											className={`book__slot ${isBooked ? "book__slot--booked" : ""} ${isSelected ? "book__slot--selected" : ""}`}
											onClick={() => !isBooked && setSelectedSlot(slot)}
										>
											<span className="book__slot-time">{slot}</span>
											{isBooked && <span className="book__slot-tag">Pris</span>}
										</button>
									);
								})}
							</div>
						)}
					</section>

					{/* Étape 3 : Confirmation */}
					{selectedSlot && (
						<section className="book__step book__step--confirm">
							<h2 className="book__step-title">
								<span className="book__step-number">3</span>
								Confirmer le rendez-vous
							</h2>

							<div className="book__recap">
								<div className="book__recap-row">
									<span>Diététicien</span>
									<strong>{dietician?.first_name} {dietician?.last_name}</strong>
								</div>
								<div className="book__recap-row">
									<span>Date</span>
									<strong>{formatDateFr(selectedDate)}</strong>
								</div>
								<div className="book__recap-row">
									<span>Horaire</span>
									<strong>
										{selectedSlot} — {`${String(parseInt(selectedSlot) + 1).padStart(2, "0")}:00`}
									</strong>
								</div>
								<div className="book__recap-row">
									<span>Durée</span>
									<strong>1 heure</strong>
								</div>
							</div>

							<button
								className="book__confirm-btn"
								onClick={handleBookAppointment}
								disabled={isSubmitting}
							>
								{isSubmitting ? (
									<>
										<span className="book__btn-spinner" />
										Réservation en cours...
									</>
								) : (
									<>
										<svg viewBox="0 0 24 24" fill="none">
											<path d="M8 7V3M16 7V3M3 11h18M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
												stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
										</svg>
										Confirmer le rendez-vous
									</>
								)}
							</button>
						</section>
					)}

				</div>
			</div>
		</div>
	);
}

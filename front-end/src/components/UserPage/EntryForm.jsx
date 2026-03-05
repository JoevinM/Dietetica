import { useState } from "react";

const EMPTY = { weight: "", activity: "", calories: "", notes: "" };

// onSubmit reçoit le payload prêt à envoyer à l'API
export default function EntryForm({ onSubmit, saving }) {
  const [form, setForm] = useState(EMPTY);

  const set = (key, val) => setForm(p => ({ ...p, [key]: val }));

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.weight && !form.activity && !form.calories) return;

    onSubmit({
      date:     new Date().toISOString(),
      weight:   form.weight   ? parseFloat(form.weight) : undefined,
      calories: form.calories ? parseInt(form.calories) : undefined,
      activity: form.activity || undefined,
      notes:    form.notes    || undefined,
    });

    setForm(EMPTY);
  }

  return (
    <form className="up__form-grid" onSubmit={handleSubmit}>
      <div className="up__field">
        <label htmlFor="weight">Poids (kg)</label>
        <input id="weight" type="number" step="0.1" placeholder="62.5"
          value={form.weight} onChange={e => set("weight", e.target.value)} />
      </div>

      <div className="up__field">
        <label htmlFor="activity">Exercice</label>
        <input id="activity" type="text" placeholder="Course 45 min, Yoga…"
          value={form.activity} onChange={e => set("activity", e.target.value)} />
      </div>

      <div className="up__field">
        <label htmlFor="calories">Calories du jour (kcal)</label>
        <input id="calories" type="number" placeholder="1800"
          value={form.calories} onChange={e => set("calories", e.target.value)} />
      </div>

      <div className="up__field up__field--full">
        <label htmlFor="notes">Notes (repas, remarques…)</label>
        <input id="notes" type="text" placeholder="Petit-déj : porridge, déjeuner : salade…"
          value={form.notes} onChange={e => set("notes", e.target.value)} />
      </div>

      <div className="up__field up__field--full">
        <button className="up__btn" type="submit" disabled={saving}>
          {saving ? "Enregistrement…" : "Enregistrer l'entrée"}
        </button>
      </div>
    </form>
  );
}
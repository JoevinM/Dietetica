// Reçoit data = [{ value: Float, date: String }]
export default function WeightChart({ data }) {
  if (data.length < 2) return (
    <p className="up__empty">Ajoutez au moins 2 entrées pour afficher le graphique.</p>
  );

  const W = 500, H = 100, PX = 40, PY = 12;
  const values = data.map(d => d.value);
  const min    = Math.min(...values) - 1;
  const max    = Math.max(...values) + 1;
  const xStep  = (W - PX * 2) / (data.length - 1);
  const y      = v => PY + (1 - (v - min) / (max - min)) * (H - PY * 2);
  const pts    = data.map((d, i) => ({ x: PX + i * xStep, y: y(d.value), ...d }));
  const line   = pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" ");
  const area   = `${line} L ${pts.at(-1).x.toFixed(1)} ${H} L ${PX} ${H} Z`;

  // Créer des valeurs en ordonnée Y (poids)
  const yTicks = 5;
  const yStepValue = (max - min) / (yTicks - 1);
  const yLabels = Array.from({ length: yTicks }, (_, i) => Math.round(min + i * yStepValue));

   return (
    <svg viewBox={`0 0 ${W} ${H}`} className="wc" preserveAspectRatio="none">
      <defs>
        <linearGradient id="wg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="var(--green)" stopOpacity=".18" />
          <stop offset="100%" stopColor="var(--green)" stopOpacity="0"   />
        </linearGradient>
      </defs>

      {/* Fond et ligne */}
      <path d={area} fill="url(#wg)" />
      <path d={line} fill="none" stroke="var(--green)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

      {/* Labels de l’axe Y */}
      {yLabels.map((v, i) => {
        const yPos = y(v);
        return (
          <g key={i}>
            <text x={PX - 5} y={yPos + 3} textAnchor="end" fontSize="8" fill="var(--text-soft)">
              {v.toFixed(1)}
            </text>
            <line x1={PX - 2} x2={PX} y1={yPos} y2={yPos} stroke="var(--text-soft)" strokeWidth="0.5" />
          </g>
        );
      })}

      {/* Points et labels de l’axe X */}
      {pts.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r="3.5" fill="var(--green-deep)" />
          <text x={p.x} y={H - 1} textAnchor="middle" fontSize="8" fill="var(--text-soft)">
            {p.date}
          </text>
        </g>
      ))}
    </svg>
  );
}

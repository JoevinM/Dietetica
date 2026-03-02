// Reçoit data = [{ value: Float, date: String }]
export default function WeightChart({ data }) {
  if (data.length < 2) return (
    <p className="up__empty">Ajoutez au moins 2 entrées pour afficher le graphique.</p>
  );

  const W = 500, H = 100, PX = 20, PY = 12;
  const values = data.map(d => d.value);
  const min    = Math.min(...values) - 1;
  const max    = Math.max(...values) + 1;
  const xStep  = (W - PX * 2) / (data.length - 1);
  const y      = v => PY + (1 - (v - min) / (max - min)) * (H - PY * 2);
  const pts    = data.map((d, i) => ({ x: PX + i * xStep, y: y(d.value), ...d }));
  const line   = pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" ");
  const area   = `${line} L ${pts.at(-1).x.toFixed(1)} ${H} L ${PX} ${H} Z`;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="wc" preserveAspectRatio="none">
      <defs>
        <linearGradient id="wg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="var(--green)" stopOpacity=".18" />
          <stop offset="100%" stopColor="var(--green)" stopOpacity="0"   />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#wg)" />
      <path d={line} fill="none" stroke="var(--green)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {pts.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r="3.5" fill="var(--green-deep)" />
          <text x={p.x} y={H - 1} textAnchor="middle" fontSize="8" fill="var(--text-soft)">{p.date}</text>
        </g>
      ))}
    </svg>
  );
}

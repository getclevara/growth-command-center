import { useState, useEffect } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, Legend, AreaChart, Area, ComposedChart, Line,
} from "recharts";

// ── Data ──────────────────────────────────────────────────────────────
const FIRMS = [
  { id: 1, name: "Meridian Partners", region: "Southeast", employees: 85, revenue: 12.4, advisory_pct: 18, tax_pct: 62, audit_pct: 20, growth_rate: 8.2, cross_sell_score: 34, pipeline_value: 2.1, nps: 72, retention: 91, icp_alignment: 67, readiness: 58 },
  { id: 2, name: "Apex Advisory Group", region: "Northeast", employees: 120, revenue: 18.7, advisory_pct: 31, tax_pct: 48, audit_pct: 21, growth_rate: 14.5, cross_sell_score: 71, pipeline_value: 4.8, nps: 81, retention: 94, icp_alignment: 82, readiness: 79 },
  { id: 3, name: "Summit CPAs", region: "Midwest", employees: 45, revenue: 6.2, advisory_pct: 12, tax_pct: 71, audit_pct: 17, growth_rate: 3.1, cross_sell_score: 22, pipeline_value: 0.8, nps: 68, retention: 87, icp_alignment: 54, readiness: 41 },
  { id: 4, name: "Coastal Financial", region: "West", employees: 95, revenue: 14.1, advisory_pct: 26, tax_pct: 52, audit_pct: 22, growth_rate: 11.3, cross_sell_score: 58, pipeline_value: 3.2, nps: 77, retention: 92, icp_alignment: 73, readiness: 68 },
  { id: 5, name: "Heartland Group", region: "Midwest", employees: 60, revenue: 8.5, advisory_pct: 15, tax_pct: 65, audit_pct: 20, growth_rate: 5.4, cross_sell_score: 29, pipeline_value: 1.4, nps: 70, retention: 89, icp_alignment: 59, readiness: 47 },
  { id: 6, name: "Pacific Advisors", region: "West", employees: 75, revenue: 10.8, advisory_pct: 22, tax_pct: 55, audit_pct: 23, growth_rate: 9.7, cross_sell_score: 48, pipeline_value: 2.6, nps: 75, retention: 90, icp_alignment: 70, readiness: 62 },
  { id: 7, name: "Liberty Partners", region: "Northeast", employees: 110, revenue: 16.3, advisory_pct: 28, tax_pct: 50, audit_pct: 22, growth_rate: 12.1, cross_sell_score: 63, pipeline_value: 3.9, nps: 79, retention: 93, icp_alignment: 78, readiness: 74 },
  { id: 8, name: "Prairie Financial", region: "South", employees: 38, revenue: 4.9, advisory_pct: 9, tax_pct: 74, audit_pct: 17, growth_rate: 2.3, cross_sell_score: 18, pipeline_value: 0.5, nps: 65, retention: 85, icp_alignment: 48, readiness: 35 },
];

const SERVICE_LINES = [
  { name: "Tax Compliance", current: 58, potential: 62, margin: 42 },
  { name: "Tax Planning", current: 34, potential: 71, margin: 58 },
  { name: "Audit & Assurance", current: 45, potential: 48, margin: 38 },
  { name: "CFO Advisory", current: 18, potential: 78, margin: 72 },
  { name: "M&A Advisory", current: 12, potential: 85, margin: 68 },
  { name: "Wealth Management", current: 15, potential: 74, margin: 64 },
  { name: "Technology Consulting", current: 8, potential: 82, margin: 71 },
  { name: "ESG / Sustainability", current: 5, potential: 69, margin: 66 },
];

const PIPELINE_DATA = [
  { month: "Jul", leads: 42, qualified: 28, proposals: 14, closed: 6, value: 1.2 },
  { month: "Aug", leads: 51, qualified: 34, proposals: 18, closed: 8, value: 1.8 },
  { month: "Sep", leads: 48, qualified: 31, proposals: 16, closed: 7, value: 1.5 },
  { month: "Oct", leads: 63, qualified: 42, proposals: 22, closed: 11, value: 2.4 },
  { month: "Nov", leads: 58, qualified: 39, proposals: 21, closed: 9, value: 2.1 },
  { month: "Dec", leads: 45, qualified: 30, proposals: 15, closed: 7, value: 1.6 },
  { month: "Jan", leads: 72, qualified: 48, proposals: 26, closed: 13, value: 3.1 },
  { month: "Feb", leads: 68, qualified: 45, proposals: 24, closed: 12, value: 2.8 },
];

const CROSS_SELL_MATRIX = [
  { from: "Tax Compliance", to: "Tax Planning", strength: 85, deals: 34, value: 2.1 },
  { from: "Tax Compliance", to: "CFO Advisory", strength: 62, deals: 18, value: 3.4 },
  { from: "Tax Compliance", to: "Wealth Mgmt", strength: 54, deals: 12, value: 1.8 },
  { from: "Audit", to: "M&A Advisory", strength: 71, deals: 22, value: 4.2 },
  { from: "Audit", to: "Tech Consulting", strength: 58, deals: 15, value: 2.6 },
  { from: "Tax Planning", to: "Wealth Mgmt", strength: 76, deals: 28, value: 3.1 },
  { from: "Tax Planning", to: "CFO Advisory", strength: 68, deals: 21, value: 2.8 },
  { from: "CFO Advisory", to: "M&A Advisory", strength: 82, deals: 31, value: 5.6 },
  { from: "CFO Advisory", to: "ESG", strength: 45, deals: 8, value: 1.2 },
  { from: "Wealth Mgmt", to: "Tax Planning", strength: 73, deals: 26, value: 2.4 },
];

const ICP_CRITERIA = [
  { criterion: "Revenue $5M-$50M", weight: 25 },
  { criterion: "Multi-state operations", weight: 20 },
  { criterion: "Owner-operated / PE-backed", weight: 20 },
  { criterion: "3+ service line need", weight: 15 },
  { criterion: "Growth trajectory >10%", weight: 10 },
  { criterion: "Industry alignment", weight: 10 },
];

// ── Utility ───────────────────────────────────────────────────────────
const getScoreColor = (score) => {
  if (score >= 70) return "#22c55e";
  if (score >= 50) return "#eab308";
  return "#ef4444";
};

const getScoreBg = (score) => {
  if (score >= 70) return "rgba(34,197,94,0.12)";
  if (score >= 50) return "rgba(234,179,8,0.12)";
  return "rgba(239,68,68,0.12)";
};

const getScoreLabel = (score) => {
  if (score >= 70) return "HIGH";
  if (score >= 50) return "MEDIUM";
  return "LOW";
};

// ── Styles ────────────────────────────────────────────────────────────
const globalCSS = `
@keyframes fadeIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
@keyframes slideIn { from { opacity: 0; transform: translateX(-20px); } to { opacity: 1; transform: translateX(0); } }
@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.6; } }
@keyframes barGrow { from { transform: scaleX(0); } to { transform: scaleX(1); } }

input[type="range"]::-webkit-slider-thumb {
  appearance: none; width: 14px; height: 14px; border-radius: 50%;
  background: #D9AA4B; cursor: pointer; border: 2px solid #0a0a0a;
}
input[type="range"]::-moz-range-thumb {
  width: 14px; height: 14px; border-radius: 50%;
  background: #D9AA4B; cursor: pointer; border: 2px solid #0a0a0a;
}
::-webkit-scrollbar { width: 4px; height: 4px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }
* { box-sizing: border-box; }

@media (max-width: 768px) {
  .grid-4 { grid-template-columns: 1fr 1fr !important; }
  .grid-3 { grid-template-columns: 1fr !important; }
  .grid-2 { grid-template-columns: 1fr !important; }
  .grid-5 { grid-template-columns: 1fr 1fr !important; }
  .header-flex { flex-direction: column !important; gap: 16px !important; }
  .header-right { text-align: left !important; }
  .tabs-scroll { gap: 0 !important; }
  .tabs-scroll button { font-size: 11px !important; padding: 8px 10px !important; }
  .content-pad { padding: 20px 16px 48px !important; }
  .header-pad { padding: 20px 16px 0 !important; }
}
`;

// ── Components ────────────────────────────────────────────────────────

function MetricCard({ label, value, sub, delay = 0, accent = false }) {
  return (
    <div style={{
      background: accent ? "linear-gradient(135deg, rgba(217,170,75,0.08) 0%, rgba(217,170,75,0.02) 100%)" : "rgba(255,255,255,0.02)",
      border: accent ? "1px solid rgba(217,170,75,0.25)" : "1px solid rgba(255,255,255,0.06)",
      borderRadius: 12,
      padding: "20px 24px",
      animation: `fadeIn 0.6s ease ${delay}s both`,
    }}>
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: 1.5, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", marginBottom: 8 }}>{label}</div>
      <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 32, fontWeight: 700, color: accent ? "#D9AA4B" : "#fff", lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.45)", marginTop: 6 }}>{sub}</div>}
    </div>
  );
}

function SectionHeader({ title, subtitle, delay = 0 }) {
  return (
    <div style={{ marginBottom: 24, animation: `fadeIn 0.5s ease ${delay}s both` }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
        <div style={{ width: 3, height: 24, background: "#D9AA4B", borderRadius: 2 }} />
        <h2 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 20, fontWeight: 600, color: "#fff", margin: 0, letterSpacing: -0.3 }}>{title}</h2>
      </div>
      {subtitle && <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "rgba(255,255,255,0.45)", margin: "0 0 0 15px", lineHeight: 1.5 }}>{subtitle}</p>}
    </div>
  );
}

function FirmCard({ firm, index, onClick, selected }) {
  const [hovered, setHovered] = useState(false);
  const readinessColor = getScoreColor(firm.readiness);
  return (
    <div
      onClick={() => onClick(firm)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: selected ? "rgba(217,170,75,0.06)" : "rgba(255,255,255,0.015)",
        border: selected ? "1px solid rgba(217,170,75,0.3)" : hovered ? "1px solid rgba(255,255,255,0.12)" : "1px solid rgba(255,255,255,0.05)",
        borderRadius: 12,
        padding: 20,
        cursor: "pointer",
        transition: "all 0.25s ease",
        animation: `slideIn 0.4s ease ${0.05 * index}s both`,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
        <div>
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: 600, color: "#fff" }}>{firm.name}</div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "rgba(255,255,255,0.35)", marginTop: 2 }}>{firm.region} · {firm.employees} people</div>
        </div>
        <div style={{
          background: getScoreBg(firm.readiness),
          color: readinessColor,
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 11,
          fontWeight: 600,
          padding: "4px 10px",
          borderRadius: 6,
          letterSpacing: 0.5,
        }}>
          {firm.readiness}
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
        {[
          { label: "REVENUE", value: `$${firm.revenue}M`, color: "#fff" },
          { label: "ADVISORY", value: `${firm.advisory_pct}%`, color: firm.advisory_pct >= 25 ? "#22c55e" : "#eab308" },
          { label: "GROWTH", value: `${firm.growth_rate}%`, color: firm.growth_rate >= 10 ? "#22c55e" : firm.growth_rate >= 5 ? "#eab308" : "#ef4444" },
        ].map((m, i) => (
          <div key={i}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "rgba(255,255,255,0.3)", letterSpacing: 1 }}>{m.label}</div>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 16, fontWeight: 600, color: m.color }}>{m.value}</div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 14 }}>
        <div style={{ display: "flex", height: 4, borderRadius: 2, overflow: "hidden", gap: 2 }}>
          <div style={{ width: `${firm.tax_pct}%`, background: "#6366f1", borderRadius: 2, animation: "barGrow 0.8s ease both", transformOrigin: "left" }} />
          <div style={{ width: `${firm.advisory_pct}%`, background: "#D9AA4B", borderRadius: 2, animation: "barGrow 0.8s ease 0.1s both", transformOrigin: "left" }} />
          <div style={{ width: `${firm.audit_pct}%`, background: "#06b6d4", borderRadius: 2, animation: "barGrow 0.8s ease 0.2s both", transformOrigin: "left" }} />
        </div>
        <div style={{ display: "flex", gap: 12, marginTop: 6 }}>
          {[{ label: "Tax", color: "#6366f1" }, { label: "Advisory", color: "#D9AA4B" }, { label: "Audit", color: "#06b6d4" }].map(l => (
            <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: l.color }} />
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: "rgba(255,255,255,0.35)", letterSpacing: 0.5 }}>{l.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CrossSellHeatmap() {
  const services = ["Tax Comp.", "Tax Plan.", "Audit", "CFO Adv.", "M&A", "Wealth", "Tech", "ESG"];
  const matrix = Array(8).fill(null).map(() => Array(8).fill(0));
  const sMap = { "Tax Compliance": 0, "Tax Planning": 1, "Audit": 2, "CFO Advisory": 3, "M&A Advisory": 4, "Wealth Mgmt": 5, "Tech Consulting": 6, "ESG": 7 };
  CROSS_SELL_MATRIX.forEach(c => {
    const fi = sMap[c.from], ti = sMap[c.to];
    if (fi !== undefined && ti !== undefined) { matrix[fi][ti] = c.strength; matrix[ti][fi] = c.strength; }
  });

  return (
    <div style={{ overflowX: "auto" }}>
      <div style={{ display: "grid", gridTemplateColumns: `100px repeat(${services.length}, 1fr)`, gap: 2, minWidth: 600 }}>
        <div />
        {services.map((s, i) => (
          <div key={i} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: "rgba(255,255,255,0.45)", textAlign: "center", padding: "8px 4px", letterSpacing: 0.5 }}>{s}</div>
        ))}
        {services.map((s, ri) => (
          <div key={`row-${ri}`} style={{ display: "contents" }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: "rgba(255,255,255,0.45)", display: "flex", alignItems: "center", paddingRight: 8, letterSpacing: 0.5 }}>{s}</div>
            {services.map((_, ci) => {
              const val = matrix[ri][ci];
              const isRef = ri === ci;
              return (
                <div
                  key={`${ri}-${ci}`}
                  style={{
                    background: isRef ? "rgba(255,255,255,0.03)" : val > 0 ? `rgba(217,170,75,${val / 120})` : "rgba(255,255,255,0.01)",
                    borderRadius: 4,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: 36,
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 10,
                    color: isRef ? "rgba(255,255,255,0.15)" : val > 0 ? "#fff" : "rgba(255,255,255,0.1)",
                    fontWeight: val >= 70 ? 600 : 400,
                    animation: `fadeIn 0.3s ease ${(ri * 8 + ci) * 0.02}s both`,
                  }}
                >
                  {isRef ? "—" : val > 0 ? val : "·"}
                </div>
              );
            })}
          </div>
        ))}
      </div>
      <div style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "rgba(255,255,255,0.3)" }}>CONVERSION STRENGTH:</span>
        {[20, 40, 60, 80].map(v => (
          <div key={v} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 16, height: 10, borderRadius: 2, background: `rgba(217,170,75,${v / 120})` }} />
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: "rgba(255,255,255,0.35)" }}>{v}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ICPScorer() {
  const [scores, setScores] = useState(ICP_CRITERIA.map(() => 50));
  const total = ICP_CRITERIA.reduce((sum, c, i) => sum + (scores[i] * c.weight / 100), 0);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "rgba(255,255,255,0.35)", letterSpacing: 1.5, marginBottom: 4 }}>PROSPECT ICP SCORE</div>
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 42, fontWeight: 700, color: getScoreColor(total) }}>{Math.round(total)}</div>
        </div>
        <div style={{
          background: getScoreBg(total),
          color: getScoreColor(total),
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 12,
          fontWeight: 600,
          padding: "6px 14px",
          borderRadius: 8,
          letterSpacing: 1,
        }}>
          {getScoreLabel(total)} FIT
        </div>
      </div>
      {ICP_CRITERIA.map((c, i) => (
        <div key={i} style={{ marginBottom: 16, animation: `fadeIn 0.4s ease ${i * 0.08}s both` }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.7)" }}>{c.criterion}</span>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "rgba(255,255,255,0.3)" }}>w:{c.weight}%</span>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 600, color: getScoreColor(scores[i]), minWidth: 28, textAlign: "right" }}>{scores[i]}</span>
            </div>
          </div>
          <input
            type="range" min={0} max={100} value={scores[i]}
            onChange={e => { const ns = [...scores]; ns[i] = +e.target.value; setScores(ns); }}
            style={{
              width: "100%", height: 4, appearance: "none", WebkitAppearance: "none",
              background: `linear-gradient(to right, ${getScoreColor(scores[i])} ${scores[i]}%, rgba(255,255,255,0.08) ${scores[i]}%)`,
              borderRadius: 2, outline: "none", cursor: "pointer",
            }}
          />
        </div>
      ))}
    </div>
  );
}

function GrowthProjection({ firms }) {
  const totalRev = firms.reduce((s, f) => s + f.revenue, 0);
  const avgAdvisory = firms.reduce((s, f) => s + f.advisory_pct, 0) / firms.length;
  const targetAdvisory = 35;

  const projectionData = Array.from({ length: 13 }, (_, i) => {
    const quarter = i;
    const advisoryShift = avgAdvisory + (targetAdvisory - avgAdvisory) * (1 - Math.exp(-quarter * 0.15));
    const revGrowth = totalRev * (1 + 0.028 * quarter + 0.005 * quarter * (advisoryShift / avgAdvisory - 1));
    const baseGrowth = totalRev * (1 + 0.015 * quarter);
    return {
      quarter: `Q${(quarter % 4) + 1} '${25 + Math.floor(quarter / 4)}`,
      withCGO: +revGrowth.toFixed(1),
      baseline: +baseGrowth.toFixed(1),
      advisory: +advisoryShift.toFixed(1),
    };
  });

  return (
    <div>
      <div className="grid-3" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 24 }}>
        <div style={{ background: "rgba(34,197,94,0.06)", border: "1px solid rgba(34,197,94,0.15)", borderRadius: 10, padding: 16, textAlign: "center" }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "rgba(255,255,255,0.35)", letterSpacing: 1 }}>36-MO DELTA</div>
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 26, fontWeight: 700, color: "#22c55e" }}>+${(projectionData[12].withCGO - projectionData[12].baseline).toFixed(1)}M</div>
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "rgba(255,255,255,0.4)" }}>CGO impact vs baseline</div>
        </div>
        <div style={{ background: "rgba(217,170,75,0.06)", border: "1px solid rgba(217,170,75,0.15)", borderRadius: 10, padding: 16, textAlign: "center" }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "rgba(255,255,255,0.35)", letterSpacing: 1 }}>ADVISORY MIX TARGET</div>
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 26, fontWeight: 700, color: "#D9AA4B" }}>{targetAdvisory}%</div>
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "rgba(255,255,255,0.4)" }}>from {avgAdvisory.toFixed(0)}% current</div>
        </div>
        <div style={{ background: "rgba(99,102,241,0.06)", border: "1px solid rgba(99,102,241,0.15)", borderRadius: 10, padding: 16, textAlign: "center" }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "rgba(255,255,255,0.35)", letterSpacing: 1 }}>PLATFORM REVENUE</div>
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 26, fontWeight: 700, color: "#6366f1" }}>${projectionData[12].withCGO}M</div>
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "rgba(255,255,255,0.4)" }}>projected yr 3</div>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={projectionData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="cgGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#D9AA4B" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#D9AA4B" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="blGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1} />
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
          <XAxis dataKey="quarter" tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10, fontFamily: "'JetBrains Mono', monospace" }} axisLine={{ stroke: "rgba(255,255,255,0.06)" }} />
          <YAxis tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10, fontFamily: "'JetBrains Mono', monospace" }} axisLine={{ stroke: "rgba(255,255,255,0.06)" }} tickFormatter={v => `$${v}M`} />
          <Tooltip contentStyle={{ background: "#1a1a1a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontFamily: "'DM Sans', sans-serif", fontSize: 12 }} labelStyle={{ color: "#fff", fontWeight: 600 }} formatter={(v) => [`$${v}M`]} />
          <Area type="monotone" dataKey="baseline" stroke="#6366f1" strokeWidth={2} fill="url(#blGrad)" name="Baseline Growth" strokeDasharray="5 5" />
          <Area type="monotone" dataKey="withCGO" stroke="#D9AA4B" strokeWidth={2.5} fill="url(#cgGrad)" name="With CGO Impact" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

function PipelineView() {
  return (
    <div>
      <div className="grid-4" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 24 }}>
        {[
          { label: "Total Leads", value: PIPELINE_DATA.reduce((s, d) => s + d.leads, 0), color: "#6366f1" },
          { label: "Qualified", value: PIPELINE_DATA.reduce((s, d) => s + d.qualified, 0), color: "#D9AA4B" },
          { label: "Proposals", value: PIPELINE_DATA.reduce((s, d) => s + d.proposals, 0), color: "#06b6d4" },
          { label: "Closed Won", value: PIPELINE_DATA.reduce((s, d) => s + d.closed, 0), color: "#22c55e" },
        ].map((m, i) => (
          <div key={i} style={{ background: `${m.color}08`, border: `1px solid ${m.color}20`, borderRadius: 10, padding: "14px 16px", animation: `fadeIn 0.4s ease ${i * 0.1}s both` }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "rgba(255,255,255,0.35)", letterSpacing: 1 }}>{m.label.toUpperCase()}</div>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 24, fontWeight: 700, color: m.color }}>{m.value}</div>
          </div>
        ))}
      </div>
      <ResponsiveContainer width="100%" height={260}>
        <ComposedChart data={PIPELINE_DATA} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
          <XAxis dataKey="month" tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10, fontFamily: "'JetBrains Mono', monospace" }} axisLine={{ stroke: "rgba(255,255,255,0.06)" }} />
          <YAxis yAxisId="left" tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10, fontFamily: "'JetBrains Mono', monospace" }} axisLine={{ stroke: "rgba(255,255,255,0.06)" }} />
          <YAxis yAxisId="right" orientation="right" tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10, fontFamily: "'JetBrains Mono', monospace" }} axisLine={{ stroke: "rgba(255,255,255,0.06)" }} tickFormatter={v => `$${v}M`} />
          <Tooltip contentStyle={{ background: "#1a1a1a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontFamily: "'DM Sans', sans-serif", fontSize: 12 }} />
          <Bar yAxisId="left" dataKey="leads" fill="rgba(99,102,241,0.5)" radius={[3, 3, 0, 0]} name="Leads" />
          <Bar yAxisId="left" dataKey="qualified" fill="rgba(217,170,75,0.6)" radius={[3, 3, 0, 0]} name="Qualified" />
          <Bar yAxisId="left" dataKey="closed" fill="rgba(34,197,94,0.6)" radius={[3, 3, 0, 0]} name="Closed" />
          <Line yAxisId="right" type="monotone" dataKey="value" stroke="#D9AA4B" strokeWidth={2.5} dot={{ fill: "#D9AA4B", r: 3 }} name="Deal Value ($M)" />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

function ServiceOpportunity() {
  const chartData = SERVICE_LINES.map(s => ({
    name: s.name.length > 14 ? s.name.substring(0, 14) + "…" : s.name,
    fullName: s.name, current: s.current, gap: s.potential - s.current, margin: s.margin,
  })).sort((a, b) => b.gap - a.gap);

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
        {[{ label: "Current Penetration", color: "rgba(99,102,241,0.6)" }, { label: "Untapped Potential", color: "rgba(217,170,75,0.5)" }].map(l => (
          <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 12, height: 8, borderRadius: 2, background: l.color }} />
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "rgba(255,255,255,0.4)", letterSpacing: 0.5 }}>{l.label}</span>
          </div>
        ))}
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} layout="vertical" margin={{ top: 0, right: 20, left: 10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" horizontal={false} />
          <XAxis type="number" tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10, fontFamily: "'JetBrains Mono', monospace" }} axisLine={{ stroke: "rgba(255,255,255,0.06)" }} tickFormatter={v => `${v}%`} />
          <YAxis dataKey="name" type="category" width={110} tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 11, fontFamily: "'DM Sans', sans-serif" }} axisLine={{ stroke: "rgba(255,255,255,0.06)" }} />
          <Tooltip contentStyle={{ background: "#1a1a1a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontFamily: "'DM Sans', sans-serif", fontSize: 12 }} />
          <Bar dataKey="current" stackId="a" fill="rgba(99,102,241,0.6)" name="Current %" />
          <Bar dataKey="gap" stackId="a" fill="rgba(217,170,75,0.5)" radius={[0, 4, 4, 0]} name="Growth Potential %" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}


// ── Main App ──────────────────────────────────────────────────────────
export default function App() {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedFirm, setSelectedFirm] = useState(null);

  const totalRev = FIRMS.reduce((s, f) => s + f.revenue, 0);
  const totalPipeline = FIRMS.reduce((s, f) => s + f.pipeline_value, 0);
  const avgReadiness = FIRMS.reduce((s, f) => s + f.readiness, 0) / FIRMS.length;
  const avgCrossSell = FIRMS.reduce((s, f) => s + f.cross_sell_score, 0) / FIRMS.length;

  const tabs = [
    { id: "overview", label: "Platform Overview" },
    { id: "firms", label: "Firm Intelligence" },
    { id: "crosssell", label: "Cross-Sell Matrix" },
    { id: "pipeline", label: "Pipeline Health" },
    { id: "services", label: "Service Expansion" },
    { id: "icp", label: "ICP Scorer" },
    { id: "projection", label: "Growth Model" },
  ];

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: "#0a0a0a", color: "#fff", minHeight: "100vh" }}>
      <style>{globalCSS}</style>

      {/* ── Header ── */}
      <div className="header-pad" style={{ background: "linear-gradient(180deg, rgba(217,170,75,0.04) 0%, transparent 100%)", borderBottom: "1px solid rgba(255,255,255,0.05)", padding: "28px 32px 0" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div className="header-flex" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
            <div style={{ animation: "fadeIn 0.6s ease both" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 4 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 8px rgba(34,197,94,0.4)", animation: "pulse 2s ease infinite" }} />
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "rgba(255,255,255,0.35)", letterSpacing: 2 }}>GROWTH INTELLIGENCE · LIVE</span>
              </div>
              <h1 style={{ fontSize: 28, fontWeight: 700, margin: "8px 0 4px", letterSpacing: -0.5, lineHeight: 1.2 }}>
                Multi-Firm Growth <span style={{ color: "#D9AA4B" }}>Command Center</span>
              </h1>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.4)", margin: 0, maxWidth: 560, lineHeight: 1.5 }}>
                Centralized organic growth operations for a PE-backed CPA & advisory platform. Coordinating strategy across {FIRMS.length} member firms.
              </p>
            </div>
            <div className="header-right" style={{ textAlign: "right", animation: "fadeIn 0.6s ease 0.2s both" }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "rgba(255,255,255,0.25)", letterSpacing: 1.5, marginBottom: 4 }}>DESIGNED BY</div>
              <div style={{ fontSize: 15, fontWeight: 600, color: "rgba(255,255,255,0.7)" }}>Binil Chacko</div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "rgba(217,170,75,0.6)", marginTop: 2, letterSpacing: 0.5 }}>CGO Strategic Prototype</div>
            </div>
          </div>

          {/* ── Tabs ── */}
          <div className="tabs-scroll" style={{ display: "flex", gap: 2, marginTop: 20, overflowX: "auto" }}>
            {tabs.map((t, i) => (
              <button
                key={t.id}
                onClick={() => { setActiveTab(t.id); setSelectedFirm(null); }}
                style={{
                  fontFamily: "'DM Sans', sans-serif", fontSize: 13,
                  fontWeight: activeTab === t.id ? 600 : 400,
                  color: activeTab === t.id ? "#D9AA4B" : "rgba(255,255,255,0.4)",
                  background: activeTab === t.id ? "rgba(217,170,75,0.08)" : "transparent",
                  border: "none",
                  borderBottom: activeTab === t.id ? "2px solid #D9AA4B" : "2px solid transparent",
                  padding: "10px 16px", cursor: "pointer", transition: "all 0.2s ease",
                  whiteSpace: "nowrap", borderRadius: "6px 6px 0 0",
                  animation: `fadeIn 0.4s ease ${i * 0.05}s both`,
                }}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="content-pad" style={{ maxWidth: 1200, margin: "0 auto", padding: "28px 32px 48px" }}>

        {activeTab === "overview" && (
          <div>
            <div className="grid-4" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 36 }}>
              <MetricCard label="Platform Revenue" value={`$${totalRev.toFixed(1)}M`} sub={`${FIRMS.length} member firms`} delay={0} accent />
              <MetricCard label="Active Pipeline" value={`$${totalPipeline.toFixed(1)}M`} sub="Across all firms" delay={0.1} />
              <MetricCard label="Avg Growth Readiness" value={`${avgReadiness.toFixed(0)}`} sub={`${getScoreLabel(avgReadiness)} — needs CGO lift`} delay={0.2} />
              <MetricCard label="Cross-Sell Index" value={`${avgCrossSell.toFixed(0)}`} sub="Significant upside available" delay={0.3} />
            </div>

            <SectionHeader title="Strategic Diagnosis" subtitle="The 3 organic growth gaps a CGO must close on Day 1" delay={0.3} />
            <div className="grid-3" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 36 }}>
              {[
                { num: "01", title: "Advisory Mix Imbalance", color: "#ef4444",
                  desc: `Average advisory revenue is just ${(FIRMS.reduce((s, f) => s + f.advisory_pct, 0) / FIRMS.length).toFixed(0)}% across firms. Industry leaders are at 35%+. Every 5pt shift = ~$${(totalRev * 0.05 * 0.15).toFixed(1)}M in higher-margin revenue.`,
                  action: "Build cross-sell playbooks + firm-level advisory activation plans" },
                { num: "02", title: "Fragmented Growth Execution", color: "#eab308",
                  desc: `${FIRMS.filter(f => f.readiness < 50).length} of ${FIRMS.length} firms score below 50 on growth readiness. No centralized lead gen, inconsistent CRM adoption, and zero coordinated go-to-market.`,
                  action: "Implement centralized growth stack with firm-specific playbooks" },
                { num: "03", title: "Pipeline Conversion Leakage", color: "#6366f1",
                  desc: `Lead-to-close conversion running at ${((PIPELINE_DATA.reduce((s, d) => s + d.closed, 0) / PIPELINE_DATA.reduce((s, d) => s + d.leads, 0)) * 100).toFixed(1)}%. Best-in-class platforms convert at 22-28%. Tightening this alone adds $${(totalPipeline * 0.12).toFixed(1)}M annually.`,
                  action: "Standardize qualification criteria + implement stage-gate pipeline management" },
              ].map((gap, i) => (
                <div key={i} style={{ background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, padding: 24, animation: `fadeIn 0.5s ease ${0.4 + i * 0.1}s both` }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: gap.color, fontWeight: 600 }}>{gap.num}</span>
                    <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: 600, color: "#fff" }}>{gap.title}</span>
                  </div>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.55)", lineHeight: 1.6, margin: "0 0 14px" }}>{gap.desc}</p>
                  <div style={{ background: `${gap.color}10`, border: `1px solid ${gap.color}20`, borderRadius: 8, padding: "10px 14px" }}>
                    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: "rgba(255,255,255,0.3)", letterSpacing: 1.5, marginBottom: 4 }}>CGO ACTION</div>
                    <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "rgba(255,255,255,0.65)", lineHeight: 1.4 }}>{gap.action}</div>
                  </div>
                </div>
              ))}
            </div>

            <SectionHeader title="90-Day CGO Sprint Plan" subtitle="From diagnosis to execution — the first moves that build momentum and trust" delay={0.6} />
            <div className="grid-3" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
              {[
                { phase: "Days 1-30", title: "Listen & Diagnose", color: "#06b6d4", items: [
                  "1:1 with every managing partner — understand their growth blockers",
                  "Audit existing CRM, pipeline data, and marketing assets across all firms",
                  "Map current cross-sell pathways and identify quick wins",
                  "Establish baseline metrics and growth readiness scores per firm",
                ]},
                { phase: "Days 31-60", title: "Build the Engine", color: "#D9AA4B", items: [
                  "Deploy unified CRM standards with firm-specific customization",
                  "Launch 2-3 pilot cross-sell campaigns with highest-readiness firms",
                  "Create ICP-aligned lead generation programs for priority service lines",
                  "Build reporting dashboard for executive + board visibility",
                ]},
                { phase: "Days 61-90", title: "Activate & Scale", color: "#22c55e", items: [
                  "Roll out firm-level growth playbooks based on pilot learnings",
                  "Launch enterprise content + thought leadership strategy",
                  "Implement pipeline stage-gates and conversion optimization",
                  "Present first growth report to board with 12-month roadmap",
                ]},
              ].map((phase, i) => (
                <div key={i} style={{ background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, padding: 24, animation: `fadeIn 0.5s ease ${0.7 + i * 0.1}s both` }}>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: phase.color, letterSpacing: 1.5, marginBottom: 4 }}>{phase.phase}</div>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 16, fontWeight: 600, color: "#fff", marginBottom: 16 }}>{phase.title}</div>
                  {phase.items.map((item, j) => (
                    <div key={j} style={{ display: "flex", gap: 10, marginBottom: 10, animation: `fadeIn 0.3s ease ${0.8 + i * 0.1 + j * 0.05}s both` }}>
                      <div style={{ width: 5, height: 5, borderRadius: "50%", background: phase.color, marginTop: 6, flexShrink: 0, opacity: 0.6 }} />
                      <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12.5, color: "rgba(255,255,255,0.6)", lineHeight: 1.5 }}>{item}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "firms" && (
          <div>
            <SectionHeader title="Firm Growth Intelligence" subtitle="Click any firm to explore detailed metrics. Growth readiness scores composite: pipeline health, advisory mix, cross-sell activity, and partner engagement." />
            <div className="grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              {FIRMS.sort((a, b) => b.readiness - a.readiness).map((f, i) => (
                <FirmCard key={f.id} firm={f} index={i} onClick={setSelectedFirm} selected={selectedFirm?.id === f.id} />
              ))}
            </div>
            {selectedFirm && (
              <div style={{ marginTop: 24, background: "rgba(217,170,75,0.04)", border: "1px solid rgba(217,170,75,0.15)", borderRadius: 14, padding: 28, animation: "fadeIn 0.4s ease both" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
                  <div>
                    <h3 style={{ fontSize: 18, fontWeight: 600, margin: "0 0 4px", color: "#fff" }}>{selectedFirm.name} — Growth Deep Dive</h3>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "rgba(255,255,255,0.35)" }}>{selectedFirm.region} · ${selectedFirm.revenue}M Revenue · {selectedFirm.employees} employees</span>
                  </div>
                  <button onClick={() => setSelectedFirm(null)} style={{ background: "rgba(255,255,255,0.06)", border: "none", color: "rgba(255,255,255,0.5)", borderRadius: 6, padding: "6px 12px", cursor: "pointer", fontFamily: "'JetBrains Mono', monospace", fontSize: 11 }}>✕ Close</button>
                </div>
                <div className="grid-5" style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12 }}>
                  {[
                    { label: "Growth Rate", value: `${selectedFirm.growth_rate}%`, color: getScoreColor(selectedFirm.growth_rate * 5) },
                    { label: "Cross-Sell Score", value: selectedFirm.cross_sell_score, color: getScoreColor(selectedFirm.cross_sell_score) },
                    { label: "ICP Alignment", value: selectedFirm.icp_alignment, color: getScoreColor(selectedFirm.icp_alignment) },
                    { label: "Client NPS", value: selectedFirm.nps, color: getScoreColor(selectedFirm.nps) },
                    { label: "Retention", value: `${selectedFirm.retention}%`, color: getScoreColor(selectedFirm.retention) },
                  ].map((m, i) => (
                    <div key={i} style={{ background: "rgba(0,0,0,0.3)", borderRadius: 10, padding: "14px 16px", textAlign: "center" }}>
                      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: "rgba(255,255,255,0.3)", letterSpacing: 1 }}>{m.label.toUpperCase()}</div>
                      <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 22, fontWeight: 700, color: m.color, marginTop: 4 }}>{m.value}</div>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 16, padding: "14px 18px", background: "rgba(0,0,0,0.2)", borderRadius: 10 }}>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: "rgba(255,255,255,0.3)", letterSpacing: 1.5, marginBottom: 6 }}>CGO RECOMMENDATION</div>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.65)", lineHeight: 1.6, margin: 0 }}>
                    {selectedFirm.readiness >= 70
                      ? `${selectedFirm.name} is a prime candidate for accelerated advisory expansion. Their high growth readiness (${selectedFirm.readiness}) and strong cross-sell activity make them ideal for piloting new service line launches. Recommend as Phase 1 firm for CFO Advisory and M&A cross-sell programs.`
                      : selectedFirm.readiness >= 50
                      ? `${selectedFirm.name} shows moderate growth potential with key gaps in ${selectedFirm.advisory_pct < 20 ? "advisory mix" : "cross-sell execution"}. Prioritize CRM standardization and partner alignment before aggressive growth programs. Target moving readiness score to 70+ within 6 months.`
                      : `${selectedFirm.name} requires foundational growth infrastructure before scaling. Focus on: (1) CRM implementation, (2) ICP definition for their local market, (3) partner growth mindset development. This is a 9-12 month buildout before expecting material cross-sell contribution.`
                    }
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "crosssell" && (
          <div>
            <SectionHeader title="Cross-Sell Intelligence Matrix" subtitle="Conversion strength between service lines. Higher scores indicate stronger natural pathway from one service to another based on client behavior patterns." />
            <div style={{ background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, padding: 28 }}>
              <CrossSellHeatmap />
            </div>
            <div style={{ marginTop: 24 }}>
              <SectionHeader title="Top Cross-Sell Pathways" subtitle="Ranked by deal value and conversion probability" />
              <div className="grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                {CROSS_SELL_MATRIX.sort((a, b) => b.value - a.value).slice(0, 6).map((cs, i) => (
                  <div key={i} style={{
                    background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10,
                    padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center",
                    animation: `slideIn 0.4s ease ${i * 0.06}s both`,
                  }}>
                    <div>
                      <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 500, color: "#fff" }}>
                        {cs.from} <span style={{ color: "#D9AA4B", margin: "0 6px" }}>→</span> {cs.to}
                      </div>
                      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "rgba(255,255,255,0.35)", marginTop: 2 }}>{cs.deals} deals closed · {cs.strength}% conversion</div>
                    </div>
                    <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 20, fontWeight: 700, color: "#D9AA4B" }}>${cs.value}M</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "pipeline" && (
          <div>
            <SectionHeader title="Platform Pipeline Health" subtitle="Aggregate funnel performance across all member firms." />
            <div style={{ background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, padding: 28 }}>
              <PipelineView />
            </div>
          </div>
        )}

        {activeTab === "services" && (
          <div>
            <SectionHeader title="Service Line Expansion Opportunity" subtitle="Current penetration vs addressable potential. Largest gaps represent highest-ROI growth targets." />
            <div style={{ background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, padding: 28 }}>
              <ServiceOpportunity />
            </div>
            <div style={{ marginTop: 24, background: "rgba(217,170,75,0.04)", border: "1px solid rgba(217,170,75,0.12)", borderRadius: 12, padding: 24 }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "#D9AA4B", letterSpacing: 1.5, marginBottom: 8 }}>STRATEGIC INSIGHT</div>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "rgba(255,255,255,0.65)", lineHeight: 1.7, margin: 0 }}>
                The largest growth opportunity sits in <strong style={{ color: "#fff" }}>CFO Advisory</strong> (60pt gap) and <strong style={{ color: "#fff" }}>Technology Consulting</strong> (74pt gap) — both are high-margin services (70%+) that naturally cross-sell from existing tax and audit relationships. A CGO should prioritize building go-to-market playbooks for these two service lines first, using the strongest firms as pilot programs before rolling out platform-wide.
              </p>
            </div>
          </div>
        )}

        {activeTab === "icp" && (
          <div>
            <SectionHeader title="Ideal Client Profile Scorer" subtitle="Interactive tool for firm partners to qualify prospects against the platform's ideal client criteria." />
            <div className="grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
              <div style={{ background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, padding: 28 }}>
                <ICPScorer />
              </div>
              <div>
                <div style={{ background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, padding: 24, marginBottom: 16 }}>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "rgba(255,255,255,0.35)", letterSpacing: 1.5, marginBottom: 12 }}>HOW TO USE THIS TOOL</div>
                  {[
                    "Rate each prospect criterion from 0-100 based on available information",
                    "Weights reflect platform priority — revenue size and ownership structure matter most",
                    "Scores 70+ = prioritize for partner introduction and full pursuit",
                    "Scores 50-70 = nurture with content and targeted outreach",
                    "Scores below 50 = deprioritize or refer to single-service engagement",
                  ].map((t, i) => (
                    <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                      <span style={{ color: "#D9AA4B", fontSize: 12, marginTop: 1 }}>›</span>
                      <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.55)", lineHeight: 1.5 }}>{t}</span>
                    </div>
                  ))}
                </div>
                <div style={{ background: "rgba(217,170,75,0.04)", border: "1px solid rgba(217,170,75,0.12)", borderRadius: 12, padding: 24 }}>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "#D9AA4B", letterSpacing: 1.5, marginBottom: 8 }}>WHY THIS MATTERS</div>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.55)", lineHeight: 1.6, margin: 0 }}>
                    Most CPA platforms waste 40-60% of business development effort on poorly-aligned prospects. A standardized ICP scorer gives every firm partner a common language for qualification, reduces wasted pursuit time, and focuses the platform's resources on the highest-value opportunities.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "projection" && (
          <div>
            <SectionHeader title="Growth Impact Model" subtitle="Projected revenue trajectory with CGO-led organic growth initiatives vs. baseline organic growth." />
            <div style={{ background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, padding: 28 }}>
              <GrowthProjection firms={FIRMS} />
            </div>
            <div style={{ marginTop: 24, background: "rgba(217,170,75,0.04)", border: "1px solid rgba(217,170,75,0.12)", borderRadius: 12, padding: 24 }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "#D9AA4B", letterSpacing: 1.5, marginBottom: 8 }}>MODEL ASSUMPTIONS</div>
              <div className="grid-3" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20 }}>
                {[
                  { label: "Baseline growth rate", value: "6% annually (organic, no CGO)" },
                  { label: "CGO impact", value: "11-14% growth via advisory mix shift + cross-sell" },
                  { label: "Advisory margin premium", value: "55-72% vs 38-42% for compliance" },
                ].map((a, i) => (
                  <div key={i}>
                    <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "rgba(255,255,255,0.45)", marginBottom: 2 }}>{a.label}</div>
                    <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 500, color: "rgba(255,255,255,0.7)" }}>{a.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div style={{ marginTop: 48, paddingTop: 24, borderTop: "1px solid rgba(255,255,255,0.05)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <div>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 500, color: "rgba(255,255,255,0.5)" }}>
              Built by <span style={{ color: "#D9AA4B" }}>Binil Chacko</span> as a strategic demonstration
            </div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "rgba(255,255,255,0.25)", marginTop: 4, letterSpacing: 0.5 }}>
              This is how I think about organic growth at scale — strategy, data, and execution unified in one system.
            </div>
          </div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "rgba(255,255,255,0.2)", letterSpacing: 1 }}>
            binil@empowerpotential.co
          </div>
        </div>
      </div>
    </div>
  );
}

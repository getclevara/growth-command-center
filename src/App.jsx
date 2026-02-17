import { useState, useEffect } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, Legend, AreaChart, Area, ComposedChart, Line,
} from "recharts";

// ── Data ──────────────────────────────────────────────────────────────
const DEFAULT_FIRMS = [
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

// ── RPP Constants ─────────────────────────────────────────────────────
const RPP_BENCHMARK = 193;
const RPP_TOP_QUARTILE = 245;
const RPP_PE_TARGET = 275;

// ── Computed Data Functions (recompute when firms change) ─────────────
function computeRPP(firms) {
  return firms.map(f => {
    const currentRPP = Math.round((f.revenue * 1000) / f.employees);
    const advisoryLift = Math.round(currentRPP * (1 + (35 - f.advisory_pct) * 0.008));
    const efficiencyLift = Math.round(advisoryLift * 1.06);
    return { ...f, currentRPP, advisoryLift, fullPotential: efficiencyLift };
  });
}

function computeCAS(firms) {
  return firms.map(f => {
    const base = f.advisory_pct * 1.8 + f.cross_sell_score * 0.4 + f.readiness * 0.3;
    const techScore = Math.min(100, base + (f.growth_rate > 10 ? 15 : 0));
    const teamScore = f.advisory_pct >= 25 ? 75 : f.advisory_pct >= 15 ? 45 : 20;
    const pricingScore = f.advisory_pct >= 20 ? 60 : 30;
    const trainingScore = f.cross_sell_score * 0.9;
    const segScore = f.icp_alignment * 0.7;
    const kpiScore = f.readiness * 0.8;
    const onboardScore = f.retention > 90 ? 70 : 45;
    const aiScore = f.growth_rate > 10 ? 55 : 25;
    const overall = Math.round(
      techScore * 0.15 + teamScore * 0.20 + pricingScore * 0.15 +
      trainingScore * 0.15 + segScore * 0.10 + kpiScore * 0.10 +
      onboardScore * 0.10 + aiScore * 0.05
    );
    return {
      ...f, overall, scores: {
        tech_stack: Math.round(techScore), cas_team: Math.round(teamScore),
        pricing_model: Math.round(pricingScore), advisory_training: Math.round(trainingScore),
        client_segmentation: Math.round(segScore), kpi_dashboards: Math.round(kpiScore),
        onboarding: Math.round(onboardScore), ai_tools: Math.round(aiScore),
      }
    };
  });
}

// ── Smart CSV Parser ──────────────────────────────────────────────────
const COLUMN_ALIASES = {
  name: ["name", "firm", "firm name", "firm_name", "company", "company name", "organization"],
  region: ["region", "location", "area", "geography", "office", "market"],
  employees: ["employees", "staff", "headcount", "head count", "team size", "fte", "ftes", "people", "professionals", "pros"],
  revenue: ["revenue", "rev", "total revenue", "annual revenue", "revenue ($m)", "revenue (millions)", "rev ($m)", "gross revenue"],
  advisory_pct: ["advisory", "advisory %", "advisory_pct", "advisory pct", "advisory percent", "advisory revenue", "advisory mix", "cas %", "cas", "cas_pct"],
  tax_pct: ["tax", "tax %", "tax_pct", "tax pct", "tax percent", "tax revenue", "tax compliance"],
  audit_pct: ["audit", "audit %", "audit_pct", "audit pct", "audit percent", "audit revenue", "assurance", "audit & assurance"],
  growth_rate: ["growth", "growth rate", "growth_rate", "growth %", "yoy growth", "annual growth", "organic growth"],
  cross_sell_score: ["cross sell", "cross-sell", "cross_sell", "cross sell score", "cross_sell_score", "xsell", "x-sell"],
  pipeline_value: ["pipeline", "pipeline value", "pipeline_value", "pipeline ($m)", "deal pipeline"],
  nps: ["nps", "net promoter", "net promoter score", "satisfaction"],
  retention: ["retention", "client retention", "retention rate", "retention %"],
  icp_alignment: ["icp", "icp alignment", "icp_alignment", "ideal client", "client fit", "icp score"],
  readiness: ["readiness", "growth readiness", "readiness score", "maturity"],
};

function matchColumn(header) {
  const h = header.toLowerCase().trim().replace(/[_\-]/g, " ").replace(/[%$()]/g, "").trim();
  for (const [field, aliases] of Object.entries(COLUMN_ALIASES)) {
    if (aliases.some(a => a === h || h.includes(a) || a.includes(h))) return field;
  }
  return null;
}

function smartParse(num, field) {
  if (typeof num === "string") num = num.replace(/[$,%\s]/g, "").trim();
  const val = parseFloat(num);
  if (isNaN(val)) return null;
  // Auto-detect if revenue is in thousands vs millions
  if (field === "revenue" && val > 500) return Math.round(val / 100) / 10; // e.g. 12400 → 12.4
  // Auto-detect if percentages are 0-1 vs 0-100
  if (field.includes("pct") && val > 0 && val <= 1) return Math.round(val * 100);
  if (field === "growth_rate" && val > 0 && val <= 1) return Math.round(val * 1000) / 10;
  return val;
}

function inferMissing(firm, allFirms) {
  // Smart defaults based on what data IS provided
  const avgOf = (key) => {
    const vals = allFirms.filter(f => f[key] != null && f[key] > 0).map(f => f[key]);
    return vals.length ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length) : null;
  };
  const defaults = {
    region: "Unspecified",
    employees: avgOf("employees") || 65,
    revenue: avgOf("revenue") || 9.0,
    advisory_pct: avgOf("advisory_pct") || 20,
    tax_pct: firm.advisory_pct ? Math.max(10, 80 - (firm.advisory_pct || 20) - (firm.audit_pct || 20)) : avgOf("tax_pct") || 58,
    audit_pct: avgOf("audit_pct") || 20,
    growth_rate: avgOf("growth_rate") || 7.0,
    cross_sell_score: firm.advisory_pct ? Math.min(90, Math.round(firm.advisory_pct * 2.2)) : avgOf("cross_sell_score") || 40,
    pipeline_value: firm.revenue ? Math.round(firm.revenue * 0.18 * 10) / 10 : avgOf("pipeline_value") || 2.0,
    nps: avgOf("nps") || 73,
    retention: avgOf("retention") || 90,
    icp_alignment: avgOf("icp_alignment") || 65,
    readiness: null, // computed below
  };
  for (const [key, def] of Object.entries(defaults)) {
    if (firm[key] == null || firm[key] === "" || firm[key] === 0) {
      if (key !== "readiness") firm[key] = def;
    }
  }
  // Compute readiness from available signals
  if (firm.readiness == null || firm.readiness === 0) {
    firm.readiness = Math.round(
      (firm.advisory_pct / 35) * 25 +
      (firm.cross_sell_score / 100) * 25 +
      (firm.growth_rate / 15) * 25 +
      (firm.retention / 100) * 25
    );
  }
  return firm;
}

function parseCSV(text) {
  const lines = text.split(/\r?\n/).filter(l => l.trim());
  if (lines.length < 2) return { firms: null, errors: ["File must have a header row and at least one data row."] };

  // Parse header — handle quoted values
  const parseRow = (line) => {
    const result = [];
    let current = "", inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') { inQuotes = !inQuotes; continue; }
      if (ch === "," && !inQuotes) { result.push(current.trim()); current = ""; continue; }
      if (ch === "\t" && !inQuotes) { result.push(current.trim()); current = ""; continue; }
      current += ch;
    }
    result.push(current.trim());
    return result;
  };

  const headers = parseRow(lines[0]);
  const columnMap = {};
  const unmapped = [];
  headers.forEach((h, i) => {
    const field = matchColumn(h);
    if (field) columnMap[i] = field;
    else if (h.trim()) unmapped.push(h.trim());
  });

  if (!columnMap || Object.values(columnMap).indexOf("name") === -1) {
    return { firms: null, errors: ["Could not find a 'Firm Name' column. Please include a column with firm/company names."] };
  }

  const warnings = [];
  if (unmapped.length) warnings.push(`Skipped unrecognized columns: ${unmapped.join(", ")}`);

  const parsed = [];
  for (let r = 1; r < lines.length; r++) {
    const row = parseRow(lines[r]);
    if (row.every(c => !c.trim())) continue; // skip blank rows
    const firm = { id: r };
    for (const [colIdx, field] of Object.entries(columnMap)) {
      const raw = row[colIdx];
      if (field === "name" || field === "region") {
        firm[field] = raw || "";
      } else {
        const val = smartParse(raw, field);
        if (val !== null) firm[field] = val;
      }
    }
    if (firm.name) parsed.push(firm);
  }

  if (!parsed.length) return { firms: null, errors: ["No valid data rows found. Check that your file has firm data below the header row."] };

  // Infer missing fields
  const complete = parsed.map(f => inferMissing(f, parsed));

  const mapped = Object.values(columnMap);
  const provided = [...new Set(mapped)].filter(f => f !== "name" && f !== "region");
  const optional = Object.keys(COLUMN_ALIASES).filter(f => f !== "name" && !mapped.includes(f));
  if (optional.length > 3) {
    warnings.push(`Auto-estimated ${optional.length} fields from your data. For best results, also include: ${optional.slice(0, 4).join(", ")}`);
  }

  return { firms: complete, errors: [], warnings, provided: provided.length, total: Object.keys(COLUMN_ALIASES).length - 1 };
}

function generateTemplate() {
  const headers = "Firm Name,Region,Employees,Revenue ($M),Advisory %,Tax %,Audit %,Growth Rate %,Cross-Sell Score,Pipeline ($M),NPS,Retention %,ICP Alignment,Growth Readiness";
  const example1 = "Smith & Associates,Northeast,85,12.4,18,62,20,8.2,34,2.1,72,91,67,58";
  const example2 = "Apex Advisory,West,120,18.7,31,48,21,14.5,71,4.8,81,94,82,79";
  const example3 = "Regional CPAs,Midwest,45,6.2,12,71,17,3.1,22,0.8,68,87,54,41";
  return [headers, example1, example2, example3].join("\n");
}

const CAS_MATURITY = [
  { stage: "Stage 1", label: "Compliance-Only", range: "0-25", color: "#ef4444", desc: "No CAS infrastructure. Pure tax/audit shop." },
  { stage: "Stage 2", label: "CAS-Curious", range: "26-45", color: "#f97316", desc: "Some bookkeeping/payroll. No dedicated team or pricing model." },
  { stage: "Stage 3", label: "CAS-Emerging", range: "46-60", color: "#eab308", desc: "Dedicated team forming. Moving to fixed pricing. Early advisory conversations." },
  { stage: "Stage 4", label: "CAS-Established", range: "61-75", color: "#22c55e", desc: "Full CAS practice with subscription model. Advisory driving growth." },
  { stage: "Stage 5", label: "CAS-Leader", range: "76-100", color: "#06b6d4", desc: "AI-powered CAS with client KPI dashboards. Advisory is primary revenue driver." },
];

// ── TCJA Data ─────────────────────────────────────────────────────────
const TCJA_TIMELINE = [
  { quarter: "Q1 '26", planning_demand: 35, compliance_base: 100, planning_revenue: 1.8, label: "Awareness builds" },
  { quarter: "Q2 '26", planning_demand: 58, compliance_base: 98, planning_revenue: 3.2, label: "Proactive outreach" },
  { quarter: "Q3 '26", planning_demand: 82, compliance_base: 95, planning_revenue: 5.1, label: "Peak planning season" },
  { quarter: "Q4 '26", planning_demand: 95, compliance_base: 92, planning_revenue: 6.8, label: "Pre-sunset rush" },
  { quarter: "Q1 '27", planning_demand: 72, compliance_base: 88, planning_revenue: 4.9, label: "New code adjustment" },
  { quarter: "Q2 '27", planning_demand: 55, compliance_base: 85, planning_revenue: 3.6, label: "Ongoing advisory" },
];

const TCJA_PROVISIONS = [
  { provision: "Individual rate reductions", impact: "HIGH", clients_affected: "85%", action: "Tax projection + Roth conversion analysis", revenue_per: "$2,500-$5,000" },
  { provision: "QBI deduction (Sec. 199A)", impact: "HIGH", clients_affected: "62%", action: "Entity structure review + planning", revenue_per: "$3,000-$8,000" },
  { provision: "SALT cap ($10K)", impact: "HIGH", clients_affected: "48%", action: "State tax strategy + entity election", revenue_per: "$1,500-$4,000" },
  { provision: "Estate exemption ($13.6M→~$7M)", impact: "CRITICAL", clients_affected: "18%", action: "Trust restructuring + gifting strategy", revenue_per: "$8,000-$25,000" },
  { provision: "Child tax credit changes", impact: "MEDIUM", clients_affected: "41%", action: "Withholding adjustment + planning", revenue_per: "$500-$1,500" },
  { provision: "AMT exemption reduction", impact: "MEDIUM", clients_affected: "22%", action: "AMT exposure analysis", revenue_per: "$1,000-$3,000" },
];

// ── CAS Readiness Criteria ────────────────────────────────────────────
const CAS_CRITERIA = [
  { id: "tech_stack", label: "Cloud Accounting Stack", description: "QBO/Xero + integrated apps", weight: 15 },
  { id: "cas_team", label: "Dedicated CAS Team", description: "Separate from compliance staff", weight: 20 },
  { id: "pricing_model", label: "Subscription/Fixed Pricing", description: "Moved beyond hourly billing", weight: 15 },
  { id: "advisory_training", label: "Advisory Skills Training", description: "Partners trained in consultative selling", weight: 15 },
  { id: "client_segmentation", label: "Client Segmentation", description: "Tiered service model by client value", weight: 10 },
  { id: "kpi_dashboards", label: "Client KPI Dashboards", description: "Proactive reporting for clients", weight: 10 },
  { id: "onboarding", label: "Structured Onboarding", description: "Repeatable CAS client intake process", weight: 10 },
  { id: "ai_tools", label: "AI/Automation Integration", description: "AI for analysis, insights, forecasting", weight: 5 },
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

// ── Main App ──────────────────────────────────────────────────────────
export default function App() {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedFirm, setSelectedFirm] = useState(null);
  const [firms, setFirms] = useState(DEFAULT_FIRMS);
  const [isCustomData, setIsCustomData] = useState(false);
  const [uploadState, setUploadState] = useState({ status: "idle", message: "", warnings: [], stats: null });
  const [showUploadPanel, setShowUploadPanel] = useState(false);

  // Derived data — recomputes when firms change
  const RPP_PROJECTION = computeRPP(firms);
  const CAS_FIRM_SCORES = computeCAS(firms);

  const totalRev = firms.reduce((s, f) => s + f.revenue, 0);
  const totalPipeline = firms.reduce((s, f) => s + f.pipeline_value, 0);
  const avgReadiness = firms.reduce((s, f) => s + f.readiness, 0) / firms.length;
  const avgCrossSell = firms.reduce((s, f) => s + f.cross_sell_score, 0) / firms.length;

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadState({ status: "processing", message: "Analyzing your data...", warnings: [], stats: null });
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const result = parseCSV(ev.target.result);
        if (result.errors?.length) {
          setUploadState({ status: "error", message: result.errors[0], warnings: [], stats: null });
          return;
        }
        setFirms(result.firms);
        setIsCustomData(true);
        setUploadState({
          status: "success",
          message: `Loaded ${result.firms.length} firms successfully`,
          warnings: result.warnings || [],
          stats: { firms: result.firms.length, provided: result.provided, total: result.total },
        });
        setTimeout(() => setShowUploadPanel(false), 2500);
      } catch (err) {
        setUploadState({ status: "error", message: "Could not parse file. Please check the format and try again.", warnings: [], stats: null });
      }
    };
    reader.readAsText(file);
  };

  const handleTemplateDownload = () => {
    const csv = generateTemplate();
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "growth-command-center-template.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  const handleResetData = () => {
    setFirms(DEFAULT_FIRMS);
    setIsCustomData(false);
    setUploadState({ status: "idle", message: "", warnings: [], stats: null });
  };

  const tabs = [
    { id: "overview", label: "Platform Overview" },
    { id: "firms", label: "Firm Intelligence" },
    { id: "crosssell", label: "Cross-Sell Matrix" },
    { id: "tcja", label: "TCJA Sunset" },
    { id: "cas", label: "CAS Readiness" },
    { id: "rpp", label: "Revenue/Professional" },
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
                Centralized organic growth operations for a PE-backed CPA & advisory platform. Coordinating strategy across {firms.length} member firms.
              </p>
            </div>
            <div className="header-right" style={{ textAlign: "right", animation: "fadeIn 0.6s ease 0.2s both" }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "rgba(255,255,255,0.25)", letterSpacing: 1.5, marginBottom: 4 }}>DESIGNED BY</div>
              <div style={{ fontSize: 15, fontWeight: 600, color: "rgba(255,255,255,0.7)" }}>Binil Chacko</div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "rgba(217,170,75,0.6)", marginTop: 2, letterSpacing: 0.5 }}>CGO Strategic Prototype</div>
              <button
                onClick={() => setShowUploadPanel(!showUploadPanel)}
                style={{
                  marginTop: 10, fontFamily: "'JetBrains Mono', monospace", fontSize: 10,
                  color: isCustomData ? "#22c55e" : "#D9AA4B",
                  background: isCustomData ? "rgba(34,197,94,0.1)" : "rgba(217,170,75,0.08)",
                  border: `1px solid ${isCustomData ? "rgba(34,197,94,0.25)" : "rgba(217,170,75,0.2)"}`,
                  borderRadius: 6, padding: "6px 12px", cursor: "pointer", letterSpacing: 0.5,
                  transition: "all 0.2s ease",
                }}
              >
                {isCustomData ? `✓ YOUR DATA (${firms.length} FIRMS)` : "↑ UPLOAD YOUR FIRM DATA"}
              </button>
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

      {/* ── Upload Panel ── */}
      {showUploadPanel && (
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 32px" }}>
          <div style={{
            background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 14, padding: 28, marginBottom: 4, animation: "fadeIn 0.3s ease",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
              <div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "#D9AA4B", letterSpacing: 1.5, marginBottom: 6 }}>TEST WITH YOUR OWN FIRM DATA</div>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "rgba(255,255,255,0.6)", lineHeight: 1.6, margin: 0, maxWidth: 600 }}>
                  Upload a CSV or TSV with your member firm data. The system will auto-detect your columns, estimate any missing fields, and recompute every score and projection across the entire command center.
                </p>
              </div>
              <button onClick={() => setShowUploadPanel(false)} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.3)", fontSize: 20, cursor: "pointer", padding: "0 4px" }}>×</button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
              {/* Upload Zone */}
              <label style={{
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                border: "2px dashed rgba(217,170,75,0.2)", borderRadius: 12, padding: "28px 20px",
                cursor: "pointer", transition: "all 0.2s ease", minHeight: 120,
                background: uploadState.status === "success" ? "rgba(34,197,94,0.04)" : "rgba(217,170,75,0.02)",
              }}>
                <input type="file" accept=".csv,.tsv,.txt" onChange={handleFileUpload} style={{ display: "none" }} />
                {uploadState.status === "idle" && (
                  <>
                    <div style={{ fontSize: 28, marginBottom: 8, opacity: 0.4 }}>📄</div>
                    <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 500, color: "rgba(255,255,255,0.5)" }}>Drop CSV here or click to browse</div>
                    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "rgba(255,255,255,0.25)", marginTop: 4 }}>.csv, .tsv, or .txt</div>
                  </>
                )}
                {uploadState.status === "processing" && (
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "#D9AA4B" }}>Analyzing your data...</div>
                )}
                {uploadState.status === "success" && (
                  <>
                    <div style={{ fontSize: 28, marginBottom: 8 }}>✅</div>
                    <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 500, color: "#22c55e" }}>{uploadState.message}</div>
                    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "rgba(255,255,255,0.35)", marginTop: 4 }}>
                      {uploadState.stats?.provided} of {uploadState.stats?.total} data fields detected · rest auto-estimated
                    </div>
                  </>
                )}
                {uploadState.status === "error" && (
                  <>
                    <div style={{ fontSize: 28, marginBottom: 8 }}>⚠️</div>
                    <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#ef4444", textAlign: "center", lineHeight: 1.5 }}>{uploadState.message}</div>
                    <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "rgba(255,255,255,0.3)", marginTop: 6 }}>Click to try again</div>
                  </>
                )}
              </label>

              {/* Instructions */}
              <div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "rgba(255,255,255,0.35)", letterSpacing: 1, marginBottom: 10 }}>WHAT TO INCLUDE</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                  {[
                    { field: "Firm Name", req: true, note: "Required" },
                    { field: "Employees / Headcount", req: false, note: "Auto-estimated if missing" },
                    { field: "Revenue ($M)", req: false, note: "Auto-estimated if missing" },
                    { field: "Advisory %", req: false, note: "Key metric — include if possible" },
                    { field: "Tax %", req: false, note: "Auto-balanced from advisory" },
                    { field: "Growth Rate %", req: false, note: "Auto-estimated if missing" },
                    { field: "Region / Location", req: false, note: "Optional grouping" },
                    { field: "Cross-Sell Score", req: false, note: "Auto-estimated from advisory" },
                  ].map((f, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, padding: "4px 0" }}>
                      <div style={{
                        width: 6, height: 6, borderRadius: "50%",
                        background: f.req ? "#D9AA4B" : "rgba(255,255,255,0.15)",
                      }} />
                      <div>
                        <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "rgba(255,255,255,0.6)" }}>{f.field}</span>
                        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: "rgba(255,255,255,0.25)", marginLeft: 6 }}>{f.note}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
                  <button onClick={handleTemplateDownload} style={{
                    fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "#D9AA4B",
                    background: "rgba(217,170,75,0.08)", border: "1px solid rgba(217,170,75,0.2)",
                    borderRadius: 6, padding: "8px 14px", cursor: "pointer", letterSpacing: 0.5,
                  }}>
                    ↓ DOWNLOAD CSV TEMPLATE
                  </button>
                  {isCustomData && (
                    <button onClick={handleResetData} style={{
                      fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "rgba(255,255,255,0.4)",
                      background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: 6, padding: "8px 14px", cursor: "pointer", letterSpacing: 0.5,
                    }}>
                      RESET TO DEMO DATA
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Warnings */}
            {uploadState.warnings?.length > 0 && (
              <div style={{ marginTop: 4 }}>
                {uploadState.warnings.map((w, i) => (
                  <div key={i} style={{
                    fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "rgba(234,179,8,0.7)",
                    background: "rgba(234,179,8,0.05)", border: "1px solid rgba(234,179,8,0.1)",
                    borderRadius: 6, padding: "8px 12px", marginTop: 6,
                  }}>
                    ⚠ {w}
                  </div>
                ))}
              </div>
            )}

            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: "rgba(255,255,255,0.15)", marginTop: 14, lineHeight: 1.5 }}>
              Your data stays in your browser — nothing is uploaded to any server. The smart parser handles messy headers, mixed formats, percentages as decimals or whole numbers, and revenue in thousands or millions. Just give it what you have.
            </div>
          </div>
        </div>
      )}

      {/* Custom Data Banner */}
      {isCustomData && !showUploadPanel && (
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 32px" }}>
          <div style={{
            background: "rgba(34,197,94,0.04)", border: "1px solid rgba(34,197,94,0.12)",
            borderRadius: 8, padding: "8px 16px", display: "flex", justifyContent: "space-between", alignItems: "center",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e" }} />
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "#22c55e", letterSpacing: 0.5 }}>
                SHOWING YOUR DATA · {firms.length} FIRMS LOADED
              </span>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => setShowUploadPanel(true)} style={{
                fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: "rgba(255,255,255,0.4)",
                background: "none", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 4,
                padding: "4px 10px", cursor: "pointer",
              }}>CHANGE</button>
              <button onClick={handleResetData} style={{
                fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: "rgba(255,255,255,0.3)",
                background: "none", border: "none", padding: "4px 8px", cursor: "pointer",
              }}>RESET</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Content ── */}
      <div className="content-pad" style={{ maxWidth: 1200, margin: "0 auto", padding: "28px 32px 48px" }}>

        {activeTab === "overview" && (
          <div>
            <div className="grid-4" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 36 }}>
              <MetricCard label="Platform Revenue" value={`$${totalRev.toFixed(1)}M`} sub={`${firms.length} member firms`} delay={0} accent />
              <MetricCard label="Active Pipeline" value={`$${totalPipeline.toFixed(1)}M`} sub="Across all firms" delay={0.1} />
              <MetricCard label="Avg Growth Readiness" value={`${avgReadiness.toFixed(0)}`} sub={`${getScoreLabel(avgReadiness)} — needs CGO lift`} delay={0.2} />
              <MetricCard label="Cross-Sell Index" value={`${avgCrossSell.toFixed(0)}`} sub="Significant upside available" delay={0.3} />
            </div>

            <SectionHeader title="Strategic Diagnosis" subtitle="The 3 organic growth gaps a CGO must close on Day 1" delay={0.3} />
            <div className="grid-3" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 36 }}>
              {[
                { num: "01", title: "Advisory Mix Imbalance", color: "#ef4444",
                  desc: `Average advisory revenue is just ${(firms.reduce((s, f) => s + f.advisory_pct, 0) / firms.length).toFixed(0)}% across firms. Industry leaders are at 35%+. Every 5pt shift = ~$${(totalRev * 0.05 * 0.15).toFixed(1)}M in higher-margin revenue.`,
                  action: "Build cross-sell playbooks + firm-level advisory activation plans" },
                { num: "02", title: "Fragmented Growth Execution", color: "#eab308",
                  desc: `${firms.filter(f => f.readiness < 50).length} of ${firms.length} firms score below 50 on growth readiness. No centralized lead gen, inconsistent CRM adoption, and zero coordinated go-to-market.`,
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
              {[...firms].sort((a, b) => b.readiness - a.readiness).map((f, i) => (
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
              <GrowthProjection firms={firms} />
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

        {/* RPP TAB */}
        {activeTab === "rpp" && (
          <div>
            <SectionHeader title="Revenue Per Professional" subtitle="The metric PE investors obsess over. Industry average is $193K. Top quartile is $245K. PE-backed platforms target $275K+ through advisory mix shift and operational efficiency." />
            <div className="grid-3" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 28 }}>
              <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, padding: 20, textAlign: "center" }}>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "rgba(255,255,255,0.35)", letterSpacing: 1 }}>PLATFORM AVG RPP</div>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 32, fontWeight: 700, color: getScoreColor(Math.round((totalRev * 1000) / firms.reduce((s, f) => s + f.employees, 0)) > RPP_BENCHMARK ? 70 : 40) }}>
                  ${Math.round((totalRev * 1000) / firms.reduce((s, f) => s + f.employees, 0))}K
                </div>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "rgba(255,255,255,0.4)" }}>vs ${RPP_BENCHMARK}K industry avg</div>
              </div>
              <div style={{ background: "rgba(217,170,75,0.06)", border: "1px solid rgba(217,170,75,0.15)", borderRadius: 12, padding: 20, textAlign: "center" }}>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "rgba(255,255,255,0.35)", letterSpacing: 1 }}>WITH ADVISORY SHIFT</div>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 32, fontWeight: 700, color: "#D9AA4B" }}>
                  ${Math.round(RPP_PROJECTION.reduce((s, f) => s + f.advisoryLift, 0) / firms.length)}K
                </div>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "rgba(255,255,255,0.4)" }}>projected with 35% advisory mix</div>
              </div>
              <div style={{ background: "rgba(34,197,94,0.06)", border: "1px solid rgba(34,197,94,0.15)", borderRadius: 12, padding: 20, textAlign: "center" }}>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "rgba(255,255,255,0.35)", letterSpacing: 1 }}>PE TARGET</div>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 32, fontWeight: 700, color: "#22c55e" }}>${RPP_PE_TARGET}K</div>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "rgba(255,255,255,0.4)" }}>top-quartile PE platform benchmark</div>
              </div>
            </div>

            <div style={{ background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, padding: 28, marginBottom: 24 }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "rgba(255,255,255,0.35)", letterSpacing: 1.5, marginBottom: 16 }}>RPP BY FIRM — CURRENT vs POTENTIAL</div>
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={RPP_PROJECTION.sort((a, b) => b.currentRPP - a.currentRPP)} layout="vertical" margin={{ top: 0, right: 20, left: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" horizontal={false} />
                  <XAxis type="number" tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10, fontFamily: "'JetBrains Mono', monospace" }} axisLine={{ stroke: "rgba(255,255,255,0.06)" }} tickFormatter={v => `$${v}K`} domain={[0, 300]} />
                  <YAxis dataKey="name" type="category" width={120} tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 11, fontFamily: "'DM Sans', sans-serif" }} axisLine={{ stroke: "rgba(255,255,255,0.06)" }} />
                  <Tooltip contentStyle={{ background: "#1a1a1a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontFamily: "'DM Sans', sans-serif", fontSize: 12 }} formatter={v => [`$${v}K`]} />
                  <Bar dataKey="currentRPP" fill="rgba(99,102,241,0.6)" radius={[0, 0, 0, 0]} name="Current RPP" />
                  <Bar dataKey="fullPotential" fill="rgba(34,197,94,0.5)" radius={[0, 4, 4, 0]} name="Potential RPP" />
                  {/* Reference lines rendered as bars would be complex, using tooltip instead */}
                </BarChart>
              </ResponsiveContainer>
              <div style={{ display: "flex", gap: 24, marginTop: 12, flexWrap: "wrap" }}>
                {[
                  { label: "Current RPP", color: "rgba(99,102,241,0.6)" },
                  { label: "Potential RPP (advisory + efficiency)", color: "rgba(34,197,94,0.5)" },
                  { label: `Industry Avg: $${RPP_BENCHMARK}K`, color: "transparent", border: true },
                ].map((l, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <div style={{ width: 14, height: 8, borderRadius: 2, background: l.color, border: l.border ? "1px dashed rgba(255,255,255,0.3)" : "none" }} />
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "rgba(255,255,255,0.4)" }}>{l.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background: "rgba(217,170,75,0.04)", border: "1px solid rgba(217,170,75,0.12)", borderRadius: 12, padding: 24 }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "#D9AA4B", letterSpacing: 1.5, marginBottom: 8 }}>WHY PE INVESTORS TRACK RPP</div>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "rgba(255,255,255,0.65)", lineHeight: 1.7, margin: 0 }}>
                Revenue Per Professional is the single metric that tells PE investors whether a platform is <strong style={{ color: "#fff" }}>growing smart or just growing big</strong>. Hiring more bodies to serve more clients is linear. Shifting advisory mix from 20% to 35% while holding headcount increases RPP by 25-40% — that's leverage. The CGO's job is to drive RPP upward through advisory activation, cross-sell, and operational efficiency — not by adding headcount. That's how you create enterprise value that multiplies at exit.
              </p>
            </div>
          </div>
        )}

        {/* TCJA TAB */}
        {activeTab === "tcja" && (
          <div>
            <SectionHeader title="TCJA Sunset Opportunity Window" subtitle="The Tax Cuts and Jobs Act provisions expire Dec 31, 2025. This creates the largest advisory revenue opportunity in a decade for CPA platforms — if they act now." />
            
            <div className="grid-4" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 28 }}>
              {[
                { label: "Provisions Expiring", value: "23+", sub: "Major tax code changes", color: "#ef4444" },
                { label: "Platform Clients Affected", value: "~85%", sub: "Across all member firms", color: "#D9AA4B" },
                { label: "Planning Revenue Opp.", value: "$6.8M", sub: "Peak quarter projection", color: "#22c55e" },
                { label: "Window Remaining", value: "NOW", sub: "Planning must start immediately", color: "#06b6d4" },
              ].map((m, i) => (
                <div key={i} style={{
                  background: `${m.color}08`, border: `1px solid ${m.color}20`, borderRadius: 12, padding: "18px 20px",
                  animation: `fadeIn 0.4s ease ${i * 0.1}s both`,
                }}>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "rgba(255,255,255,0.35)", letterSpacing: 1 }}>{m.label.toUpperCase()}</div>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 28, fontWeight: 700, color: m.color }}>{m.value}</div>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "rgba(255,255,255,0.4)" }}>{m.sub}</div>
                </div>
              ))}
            </div>

            <div style={{ background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, padding: 28, marginBottom: 24 }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "rgba(255,255,255,0.35)", letterSpacing: 1.5, marginBottom: 16 }}>PLANNING DEMAND vs COMPLIANCE BASE — QUARTERLY PROJECTION</div>
              <ResponsiveContainer width="100%" height={280}>
                <ComposedChart data={TCJA_TIMELINE} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="planGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#D9AA4B" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#D9AA4B" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="quarter" tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10, fontFamily: "'JetBrains Mono', monospace" }} axisLine={{ stroke: "rgba(255,255,255,0.06)" }} />
                  <YAxis yAxisId="left" tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10, fontFamily: "'JetBrains Mono', monospace" }} axisLine={{ stroke: "rgba(255,255,255,0.06)" }} label={{ value: "Index", angle: -90, position: "insideLeft", style: { fill: "rgba(255,255,255,0.2)", fontSize: 10 } }} />
                  <YAxis yAxisId="right" orientation="right" tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10, fontFamily: "'JetBrains Mono', monospace" }} axisLine={{ stroke: "rgba(255,255,255,0.06)" }} tickFormatter={v => `$${v}M`} />
                  <Tooltip contentStyle={{ background: "#1a1a1a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontFamily: "'DM Sans', sans-serif", fontSize: 12 }} />
                  <Area yAxisId="left" type="monotone" dataKey="planning_demand" stroke="#D9AA4B" strokeWidth={2.5} fill="url(#planGrad)" name="Planning Demand Index" />
                  <Line yAxisId="left" type="monotone" dataKey="compliance_base" stroke="#6366f1" strokeWidth={2} strokeDasharray="5 5" name="Compliance Base Index" dot={false} />
                  <Bar yAxisId="right" dataKey="planning_revenue" fill="rgba(34,197,94,0.5)" radius={[4, 4, 0, 0]} name="Planning Revenue ($M)" />
                </ComposedChart>
              </ResponsiveContainer>
            </div>

            <SectionHeader title="Provision-Level Action Plan" subtitle="Each expiring provision is a client conversation and a revenue opportunity. The CGO's job is to ensure every firm is having these conversations NOW." />
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {TCJA_PROVISIONS.map((p, i) => (
                <div key={i} style={{
                  background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10,
                  padding: "16px 24px", display: "grid", gridTemplateColumns: "2fr 80px 80px 2fr 120px", alignItems: "center", gap: 16,
                  animation: `slideIn 0.4s ease ${i * 0.06}s both`,
                }}>
                  <div>
                    <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 500, color: "#fff" }}>{p.provision}</div>
                  </div>
                  <div style={{
                    fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 600, textAlign: "center",
                    color: p.impact === "CRITICAL" ? "#ef4444" : p.impact === "HIGH" ? "#eab308" : "#06b6d4",
                    background: p.impact === "CRITICAL" ? "rgba(239,68,68,0.1)" : p.impact === "HIGH" ? "rgba(234,179,8,0.1)" : "rgba(6,182,212,0.1)",
                    padding: "4px 8px", borderRadius: 4, letterSpacing: 0.5,
                  }}>{p.impact}</div>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: "rgba(255,255,255,0.5)", textAlign: "center" }}>{p.clients_affected}</div>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "rgba(255,255,255,0.5)" }}>{p.action}</div>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 600, color: "#22c55e", textAlign: "right" }}>{p.revenue_per}</div>
                </div>
              ))}
              <div style={{ display: "grid", gridTemplateColumns: "2fr 80px 80px 2fr 120px", padding: "0 24px", gap: 16 }}>
                {["Provision", "Impact", "Clients", "CGO Action", "Rev/Client"].map((h, i) => (
                  <div key={i} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: "rgba(255,255,255,0.2)", letterSpacing: 1, textAlign: i >= 3 ? (i === 4 ? "right" : "left") : (i > 0 ? "center" : "left"), marginTop: -4 }}>{h}</div>
                ))}
              </div>
            </div>

            <div style={{ marginTop: 24, background: "rgba(239,68,68,0.04)", border: "1px solid rgba(239,68,68,0.12)", borderRadius: 12, padding: 24 }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "#ef4444", letterSpacing: 1.5, marginBottom: 8 }}>CGO URGENCY SIGNAL</div>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "rgba(255,255,255,0.65)", lineHeight: 1.7, margin: 0 }}>
                The TCJA sunset is a <strong style={{ color: "#fff" }}>once-in-a-decade forcing function</strong> for converting compliance clients into planning clients. Every firm on the platform has clients who will be affected. The CGO who launches a coordinated "TCJA Readiness Campaign" across all member firms in Q1 2026 — with templated client outreach, planning worksheets, and pricing guides — will generate millions in new advisory revenue while permanently shifting the client relationship from reactive to proactive. <strong style={{ color: "#fff" }}>This cannot wait.</strong>
              </p>
            </div>
          </div>
        )}

        {/* CAS READINESS TAB */}
        {activeTab === "cas" && (
          <div>
            <SectionHeader title="Client Advisory Services Readiness" subtitle="CAS revenue is projected to reach 30% of CPA firm revenue by 2026 (up from 18% in 2020). This scores each firm's readiness to deliver and scale CAS across the platform." />
            
            <div className="grid-3" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 28 }}>
              <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, padding: 20, textAlign: "center" }}>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "rgba(255,255,255,0.35)", letterSpacing: 1 }}>PLATFORM CAS READINESS</div>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 36, fontWeight: 700, color: getScoreColor(Math.round(CAS_FIRM_SCORES.reduce((s, f) => s + f.overall, 0) / firms.length)) }}>
                  {Math.round(CAS_FIRM_SCORES.reduce((s, f) => s + f.overall, 0) / firms.length)}
                </div>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "rgba(255,255,255,0.4)" }}>avg across {firms.length} firms</div>
              </div>
              <div style={{ background: "rgba(34,197,94,0.06)", border: "1px solid rgba(34,197,94,0.15)", borderRadius: 12, padding: 20, textAlign: "center" }}>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "rgba(255,255,255,0.35)", letterSpacing: 1 }}>CAS-READY firms</div>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 36, fontWeight: 700, color: "#22c55e" }}>
                  {CAS_FIRM_SCORES.filter(f => f.overall >= 60).length}
                </div>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "rgba(255,255,255,0.4)" }}>of {firms.length} scoring 60+</div>
              </div>
              <div style={{ background: "rgba(217,170,75,0.06)", border: "1px solid rgba(217,170,75,0.15)", borderRadius: 12, padding: 20, textAlign: "center" }}>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "rgba(255,255,255,0.35)", letterSpacing: 1 }}>CAS REVENUE TARGET</div>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 36, fontWeight: 700, color: "#D9AA4B" }}>30%</div>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "rgba(255,255,255,0.4)" }}>of total revenue by 2027</div>
              </div>
            </div>

            {/* Maturity Model */}
            <div style={{ background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, padding: 28, marginBottom: 24 }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "rgba(255,255,255,0.35)", letterSpacing: 1.5, marginBottom: 16 }}>CAS MATURITY MODEL — WHERE EACH FIRM STANDS</div>
              <div style={{ display: "flex", gap: 4, marginBottom: 20 }}>
                {CAS_MATURITY.map((stage, i) => (
                  <div key={i} style={{ flex: 1, position: "relative" }}>
                    <div style={{ background: `${stage.color}15`, border: `1px solid ${stage.color}30`, borderRadius: 8, padding: "12px 10px", minHeight: 90 }}>
                      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: stage.color, letterSpacing: 1, marginBottom: 4 }}>{stage.stage}</div>
                      <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 600, color: "#fff", marginBottom: 4 }}>{stage.label}</div>
                      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: "rgba(255,255,255,0.3)" }}>{stage.range} pts</div>
                    </div>
                    {/* Firm dots */}
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 8, justifyContent: "center" }}>
                      {CAS_FIRM_SCORES.filter(f => {
                        const [lo, hi] = stage.range.split("-").map(Number);
                        return f.overall >= lo && f.overall <= hi;
                      }).map((f, fi) => (
                        <div key={fi} title={`${f.name}: ${f.overall}`} style={{
                          width: 28, height: 28, borderRadius: "50%", background: `${stage.color}25`, border: `1px solid ${stage.color}50`,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: stage.color, fontWeight: 600,
                        }}>
                          {f.overall}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Firm Detail Grid */}
            <SectionHeader title="Firm-Level CAS Scorecard" subtitle="Breakdown of CAS readiness across 8 capability dimensions for each member firm." />
            <div style={{ overflowX: "auto" }}>
              <div style={{ minWidth: 800 }}>
                {/* Header Row */}
                <div style={{ display: "grid", gridTemplateColumns: "140px repeat(8, 1fr) 70px", gap: 4, marginBottom: 4 }}>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: "rgba(255,255,255,0.3)", padding: "8px 4px" }}>FIRM</div>
                  {CAS_CRITERIA.map((c, i) => (
                    <div key={i} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8, color: "rgba(255,255,255,0.3)", padding: "8px 2px", textAlign: "center", lineHeight: 1.3 }}>{c.label.toUpperCase()}</div>
                  ))}
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: "rgba(255,255,255,0.3)", padding: "8px 4px", textAlign: "center" }}>OVERALL</div>
                </div>
                {/* Data Rows */}
                {CAS_FIRM_SCORES.sort((a, b) => b.overall - a.overall).map((firm, i) => (
                  <div key={i} style={{
                    display: "grid", gridTemplateColumns: "140px repeat(8, 1fr) 70px", gap: 4,
                    animation: `slideIn 0.3s ease ${i * 0.05}s both`,
                    marginBottom: 4,
                  }}>
                    <div style={{
                      fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 500, color: "rgba(255,255,255,0.7)",
                      padding: "10px 8px", background: "rgba(255,255,255,0.02)", borderRadius: "6px 0 0 6px",
                      display: "flex", alignItems: "center",
                    }}>
                      {firm.name.length > 16 ? firm.name.substring(0, 16) + "…" : firm.name}
                    </div>
                    {CAS_CRITERIA.map((c, ci) => {
                      const score = firm.scores[c.id];
                      return (
                        <div key={ci} style={{
                          background: `${getScoreColor(score)}08`,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 500,
                          color: getScoreColor(score), padding: "10px 4px",
                        }}>
                          {score}
                        </div>
                      );
                    })}
                    <div style={{
                      background: getScoreBg(firm.overall), borderRadius: "0 6px 6px 0",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontFamily: "'JetBrains Mono', monospace", fontSize: 13, fontWeight: 700,
                      color: getScoreColor(firm.overall),
                    }}>
                      {firm.overall}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ marginTop: 24, background: "rgba(217,170,75,0.04)", border: "1px solid rgba(217,170,75,0.12)", borderRadius: 12, padding: 24 }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "#D9AA4B", letterSpacing: 1.5, marginBottom: 8 }}>CGO PLAYBOOK: COMPLIANCE → CAS CONVERSION</div>
              <div className="grid-3" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20, marginTop: 12 }}>
                {[
                  { phase: "Quarter 1", title: "Foundation", color: "#06b6d4", items: "Audit tech stack across firms. Identify CAS champion partners. Begin subscription pricing pilots at 2-3 highest-readiness firms." },
                  { phase: "Quarter 2", title: "Activation", color: "#D9AA4B", items: "Launch dedicated CAS teams. Roll out client segmentation model. Deploy standardized onboarding process. Begin TCJA planning as CAS entry point." },
                  { phase: "Quarter 3-4", title: "Scale", color: "#22c55e", items: "Platform-wide CAS playbook rollout. AI-powered client dashboards. Target: every firm at Stage 3+ by year end. Measure CAS as % of total revenue monthly." },
                ].map((p, i) => (
                  <div key={i}>
                    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: p.color, letterSpacing: 1, marginBottom: 4 }}>{p.phase}</div>
                    <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600, color: "#fff", marginBottom: 8 }}>{p.title}</div>
                    <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12.5, color: "rgba(255,255,255,0.55)", lineHeight: 1.6, margin: 0 }}>{p.items}</p>
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

import { EvaluationResult, SavedDealRecord } from "./types";

export const LOCAL_DEALS_KEY = "deal_screener_deals";
export const LOCAL_KEY_STORAGE = "DEAL_SCREENER_GEMINI_KEY";

/**
 * Retrieve saved deals from browser's localStorage
 */
export function getSavedDeals(): SavedDealRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LOCAL_DEALS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return [];
  } catch (err) {
    console.error("Error reading saved deals from localStorage:", err);
    return [];
  }
}

/**
 * Save a new evaluation record into localStorage under deal_screener_deals
 */
export function saveDealToLocalStorage(memoData: EvaluationResult): SavedDealRecord {
  const deals = getSavedDeals();

  const id = typeof crypto !== "undefined" && typeof crypto.randomUUID === "function" 
    ? crypto.randomUUID() 
    : `deal-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

  const newRecord: SavedDealRecord = {
    id,
    createdAt: new Date().toISOString(),
    companyName: memoData.companyProfile?.name?.trim() || "Untitled Startup",
    score: memoData.overallAssessment?.score ?? 0,
    thesisMatchPercent: memoData.thesisFit?.matchScore ?? 0,
    verdict: memoData.overallAssessment?.recommendation || "Pass",
    sector: memoData.companyProfile?.primarySector || "Technology",
    memoData,
  };

  // Check if a deal for this exact company already exists; update it or prepend
  const existingIdx = deals.findIndex(
    (d) => d.companyName.toLowerCase() === newRecord.companyName.toLowerCase()
  );

  let updated: SavedDealRecord[];
  if (existingIdx >= 0) {
    // Replace with latest evaluation while keeping original id or updating
    updated = [...deals];
    updated[existingIdx] = {
      ...newRecord,
      id: deals[existingIdx].id || id,
    };
  } else {
    updated = [newRecord, ...deals];
  }

  try {
    localStorage.setItem(LOCAL_DEALS_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error("Error saving deal to localStorage:", err);
  }

  return newRecord;
}

/**
 * Remove an individual deal from localStorage by ID
 */
export function deleteSavedDealFromLocalStorage(id: string): SavedDealRecord[] {
  const deals = getSavedDeals();
  const filtered = deals.filter((d) => d.id !== id);
  try {
    localStorage.setItem(LOCAL_DEALS_KEY, JSON.stringify(filtered));
  } catch (err) {
    console.error("Error deleting deal from localStorage:", err);
  }
  return filtered;
}

/**
 * Completely wipe local storage: both deals and API key
 */
export function clearAllLocalStorage(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(LOCAL_DEALS_KEY);
    localStorage.removeItem(LOCAL_KEY_STORAGE);
  } catch (err) {
    console.error("Error clearing localStorage:", err);
  }
}

/**
 * Export saved deals as a formatted JSON file download
 */
export function exportDealsAsJSON(deals: SavedDealRecord[]): void {
  if (typeof window === "undefined" || deals.length === 0) return;
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(deals, null, 2));
  const downloadAnchor = document.createElement("a");
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", `deal_screener_deals_${new Date().toISOString().slice(0, 10)}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

/**
 * Export saved deals as a formatted CSV file download
 */
export function exportDealsAsCSV(deals: SavedDealRecord[]): void {
  if (typeof window === "undefined" || deals.length === 0) return;
  
  const headers = [
    "Company Name",
    "Evaluated Date",
    "Overall Score",
    "Thesis Match %",
    "Verdict",
    "Sector",
    "Stage",
    "HQ Location",
    "One-Liner",
  ];

  const escapeCSV = (val: unknown): string => {
    if (val === null || val === undefined) return "";
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const rows = deals.map((d) => [
    escapeCSV(d.companyName),
    escapeCSV(new Date(d.createdAt).toLocaleDateString()),
    escapeCSV(d.score),
    escapeCSV(`${d.thesisMatchPercent}%`),
    escapeCSV(d.verdict),
    escapeCSV(d.sector),
    escapeCSV(d.memoData?.companyProfile?.stage || ""),
    escapeCSV(d.memoData?.companyProfile?.hqLocation || ""),
    escapeCSV(d.memoData?.companyProfile?.oneLiner || ""),
  ]);

  const csvContent = [
    headers.join(","),
    ...rows.map((r) => r.join(",")),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const downloadAnchor = document.createElement("a");
  downloadAnchor.setAttribute("href", url);
  downloadAnchor.setAttribute("download", `deal_screener_deals_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
  URL.revokeObjectURL(url);
}

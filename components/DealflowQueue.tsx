"use client";

import React, { useState } from "react";
import { 
  ArrowRight, 
  Plus, 
  Search,
  Download,
  Trash2,
  FileText,
  Inbox,
  Sparkles,
  FileSpreadsheet,
  FileCode
} from "lucide-react";
import { SavedDealRecord, EvaluationResult } from "@/lib/types";
import { exportDealsAsCSV, exportDealsAsJSON } from "@/lib/dealStorage";

interface DealflowQueueProps {
  deals: SavedDealRecord[];
  onSelectDeal: (dealData: EvaluationResult) => void;
  onDeleteDeal: (id: string) => void;
  onNewScreen: () => void;
  onLoadSampleDeal?: () => void;
}

export const DealflowQueue: React.FC<DealflowQueueProps> = ({
  deals,
  onSelectDeal,
  onDeleteDeal,
  onNewScreen,
  onLoadSampleDeal,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showExportMenu, setShowExportMenu] = useState(false);

  const filteredDeals = deals.filter((deal) => {
    const matchesSearch =
      deal.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (deal.sector && deal.sector.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (deal.verdict && deal.verdict.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (deal.memoData?.companyProfile?.oneLiner && deal.memoData.companyProfile.oneLiner.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesSearch;
  });

  const getVerdictStyle = (verdict: string) => {
    switch (verdict) {
      case "Proceed to Intro Call":
      case "Proceed to Diligence":
        return "bg-emerald-50 text-emerald-800 border-emerald-200";
      case "Keep on Radar":
      case "Conditional Pilot Only":
        return "bg-amber-50 text-amber-900 border-amber-200";
      case "Pass":
      default:
        return "bg-rose-50 text-rose-800 border-rose-200";
    }
  };

  const formatDate = (isoString?: string) => {
    if (!isoString) return "Recent";
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return "Recent";
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono uppercase tracking-widest text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-0.5 rounded-full font-bold">
              Local Storage Pipeline • Dealflow
            </span>
            <span className="text-xs font-mono text-slate-500 font-semibold">
              {deals.length} {deals.length === 1 ? "deal" : "deals"} stored locally
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-950 uppercase font-sans mt-1">
            Evaluated Dealflow Pipeline
          </h1>
          <p className="text-xs text-slate-600 font-sans mt-0.5">
            Locally persisted in your browser under <code className="font-mono bg-slate-100 px-1 py-0.5 rounded text-slate-800">deal_screener_deals</code>. Zero credentials or deal data stored externally.
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          {/* Export All Button */}
          {deals.length > 0 && (
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowExportMenu(!showExportMenu)}
                className="inline-flex items-center space-x-1.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 px-3.5 py-2.5 text-xs font-mono font-bold uppercase tracking-wider shadow-2xs transition-all cursor-pointer"
              >
                <Download className="h-3.5 w-3.5 text-slate-600" />
                <span>Export All (CSV/JSON)</span>
              </button>

              {showExportMenu && (
                <div className="absolute right-0 mt-1.5 w-44 rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg z-30 space-y-1">
                  <button
                    type="button"
                    onClick={() => {
                      exportDealsAsCSV(deals);
                      setShowExportMenu(false);
                    }}
                    className="w-full flex items-center space-x-2 rounded-lg px-3 py-2 text-xs font-mono text-slate-700 hover:bg-emerald-50 hover:text-emerald-950 transition-colors text-left cursor-pointer"
                  >
                    <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-600" />
                    <span>Export as CSV</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      exportDealsAsJSON(deals);
                      setShowExportMenu(false);
                    }}
                    className="w-full flex items-center space-x-2 rounded-lg px-3 py-2 text-xs font-mono text-slate-700 hover:bg-emerald-50 hover:text-emerald-950 transition-colors text-left cursor-pointer"
                  >
                    <FileCode className="h-3.5 w-3.5 text-emerald-600" />
                    <span>Export as JSON</span>
                  </button>
                </div>
              )}
            </div>
          )}

          <button
            type="button"
            onClick={onNewScreen}
            className="inline-flex items-center space-x-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 text-xs font-mono font-bold uppercase tracking-wider shadow-sm transition-all cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Screen New Deal</span>
          </button>
        </div>
      </div>

      {/* Search & Counter (only when deals exist) */}
      {deals.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search companies, sectors, or verdicts..."
              className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-2 font-mono text-xs text-slate-900 placeholder-slate-400 focus:border-emerald-600 focus:outline-none shadow-2xs"
            />
          </div>

          <div className="text-xs font-mono text-slate-500">
            Showing {filteredDeals.length} of {deals.length} deals
          </div>
        </div>
      )}

      {/* EMPTY STATE (Required Item 2) */}
      {deals.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-slate-300 bg-white p-12 text-center space-y-4">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700">
            <Inbox className="h-7 w-7" />
          </div>
          <div className="space-y-1.5 max-w-md mx-auto">
            <h3 className="font-sans text-base font-bold text-slate-950">
              No deals evaluated yet. Run a screen to populate your local pipeline.
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed font-sans">
              Evaluated pitch decks, notes, and URLs will automatically be stored in your browser&apos;s localStorage for fast review without re-calling the API.
            </p>
          </div>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={onNewScreen}
              className="inline-flex items-center space-x-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-white px-5 py-2.5 text-xs font-mono font-bold uppercase tracking-wider shadow-sm transition-all cursor-pointer"
            >
              <span>Screen a Deal Now</span>
              <ArrowRight className="h-4 w-4 text-emerald-400" />
            </button>
            {onLoadSampleDeal && (
              <button
                type="button"
                onClick={onLoadSampleDeal}
                className="inline-flex items-center space-x-1.5 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs font-mono font-bold uppercase tracking-wider text-slate-800 hover:border-emerald-600 hover:bg-emerald-50/40 transition-all shadow-2xs cursor-pointer"
              >
                <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
                <span>Load Sample Deal</span>
              </button>
            )}
          </div>
        </div>
      ) : (
        /* TABLE OF SAVED DEALS (Required Item 2) */
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-200 bg-slate-50/80 font-mono text-[11px] uppercase tracking-wider text-slate-600">
                <tr>
                  <th className="py-3.5 px-4 font-bold">Company Name</th>
                  <th className="py-3.5 px-3 font-bold">Evaluated Date</th>
                  <th className="py-3.5 px-3 font-bold text-center">Score</th>
                  <th className="py-3.5 px-3 font-bold text-center">Thesis Match</th>
                  <th className="py-3.5 px-3 font-bold">Verdict</th>
                  <th className="py-3.5 px-4 text-right font-bold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredDeals.map((deal) => (
                  <tr 
                    key={deal.id}
                    className="hover:bg-slate-50/70 transition-colors group cursor-pointer"
                    onClick={() => onSelectDeal(deal.memoData)}
                  >
                    {/* Company Name & Details */}
                    <td className="py-4 px-4">
                      <div className="space-y-0.5">
                        <div className="flex items-center space-x-2">
                          <span className="font-sans font-bold text-slate-950 text-sm group-hover:text-emerald-700 transition-colors">
                            {deal.companyName}
                          </span>
                          {deal.memoData?.companyProfile?.stage && (
                            <span className="rounded bg-slate-100 px-1.5 py-0.2 font-mono text-[10px] text-slate-600 border border-slate-200">
                              {deal.memoData.companyProfile.stage}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center space-x-2 text-slate-500 font-sans text-xs">
                          <span className="font-medium text-slate-700">{deal.sector}</span>
                          {deal.memoData?.companyProfile?.hqLocation && (
                            <>
                              <span>•</span>
                              <span>{deal.memoData.companyProfile.hqLocation}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Evaluated Date */}
                    <td className="py-4 px-3 font-mono text-slate-600 whitespace-nowrap">
                      {formatDate(deal.createdAt)}
                    </td>

                    {/* Overall Score */}
                    <td className="py-4 px-3 text-center">
                      <div className="inline-flex flex-col items-center">
                        <span className="font-mono text-base font-black text-slate-950">
                          {deal.score}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">/ 100</span>
                      </div>
                    </td>

                    {/* Thesis Match */}
                    <td className="py-4 px-3 text-center">
                      <span className="inline-block rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 font-mono text-xs font-bold text-slate-800">
                        {deal.thesisMatchPercent}%
                      </span>
                    </td>

                    {/* Verdict Badge */}
                    <td className="py-4 px-3">
                      <span className={`inline-block rounded-md border px-2.5 py-1 font-mono text-[10.5px] font-bold ${getVerdictStyle(deal.verdict)}`}>
                        {deal.verdict}
                      </span>
                    </td>

                    {/* Actions: View Memo & Delete */}
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end space-x-2" onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          onClick={() => onSelectDeal(deal.memoData)}
                          className="inline-flex items-center space-x-1 rounded-lg border border-slate-300 bg-white px-3 py-1.5 font-mono text-xs font-bold text-slate-800 hover:border-emerald-600 hover:text-emerald-900 transition-colors shadow-2xs cursor-pointer"
                        >
                          <FileText className="h-3 w-3 text-emerald-600" />
                          <span>View Memo</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => onDeleteDeal(deal.id)}
                          title="Delete from local storage"
                          className="rounded-lg p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};

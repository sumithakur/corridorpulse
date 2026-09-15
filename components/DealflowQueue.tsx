"use client";

import React, { useState } from "react";
import { 
  ArrowRight, 
  Plus, 
  Search,
  Filter
} from "lucide-react";
import { DealQueueItem, EvaluationResult } from "@/lib/types";

interface DealflowQueueProps {
  deals: DealQueueItem[];
  onSelectDeal: (dealData: EvaluationResult) => void;
  onNewScreen: () => void;
}

export const DealflowQueue: React.FC<DealflowQueueProps> = ({
  deals,
  onSelectDeal,
  onNewScreen,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMandateFilter, setSelectedMandateFilter] = useState("all");

  const filteredDeals = deals.filter((deal) => {
    const matchesSearch =
      deal.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      deal.oneLiner.toLowerCase().includes(searchTerm.toLowerCase()) ||
      deal.sector.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMandate =
      selectedMandateFilter === "all" || deal.mandateName === selectedMandateFilter;
    return matchesSearch && matchesMandate;
  });

  const getVerdictStyle = (verdict: string) => {
    switch (verdict) {
      case "Proceed to Intro Call":
        return "bg-emerald-50 text-emerald-800 border-emerald-200";
      case "Keep on Radar":
        return "bg-amber-50 text-amber-900 border-amber-200";
      case "Pass":
      default:
        return "bg-rose-50 text-rose-800 border-rose-200";
    }
  };

  const getRiskStyle = (risk: "Low" | "Medium" | "High") => {
    switch (risk) {
      case "Low":
        return "bg-emerald-50 text-emerald-800 border-emerald-200";
      case "Medium":
        return "bg-amber-50 text-amber-800 border-amber-200";
      case "High":
      default:
        return "bg-rose-50 text-rose-800 border-rose-200";
    }
  };

  const uniqueMandates = Array.from(new Set(deals.map((d) => d.mandateName)));

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono uppercase tracking-widest text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-0.5 rounded-full font-bold">
              Fund Operating Layer • Dealflow Queue
            </span>
            <span className="text-xs font-mono text-slate-500">
              {deals.length} deals screened
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-950 uppercase font-sans mt-1">
            Evaluated Deal Pipeline
          </h1>
          <p className="text-xs text-slate-600 font-sans mt-0.5">
            Audit Point 27: Compare screened deals side-by-side against active mandates and review investment committee status
          </p>
        </div>

        <button
          type="button"
          onClick={onNewScreen}
          className="inline-flex items-center space-x-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 text-xs font-mono font-bold uppercase tracking-wider shadow-sm transition-all cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Screen New Deal</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search deals, sectors, or claims..."
            className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-2 font-mono text-xs text-slate-900 placeholder-slate-400 focus:border-emerald-600 focus:outline-none shadow-2xs"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
          <Filter className="h-3.5 w-3.5 text-slate-400" />
          <span className="text-xs font-mono text-slate-500 uppercase">Mandate:</span>
          <select
            value={selectedMandateFilter}
            onChange={(e) => setSelectedMandateFilter(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 font-mono text-xs text-slate-900 focus:border-emerald-600 focus:outline-none shadow-2xs cursor-pointer"
          >
            <option value="all">All Mandates ({deals.length})</option>
            {uniqueMandates.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Dealflow Table */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 bg-slate-50/80 font-mono text-[11px] uppercase tracking-wider text-slate-600">
              <tr>
                <th className="py-3.5 px-4 font-bold">Company / One-Liner</th>
                <th className="py-3.5 px-3 font-bold text-center">Score</th>
                <th className="py-3.5 px-3 font-bold">Sector / Stage</th>
                <th className="py-3.5 px-3 font-bold">Evaluated Mandate</th>
                <th className="py-3.5 px-3 font-bold">Risk Level</th>
                <th className="py-3.5 px-3 font-bold">System Verdict</th>
                <th className="py-3.5 px-3 font-bold">Investor Action</th>
                <th className="py-3.5 px-4 text-right font-bold">Diligence Memo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredDeals.map((deal) => (
                <tr 
                  key={deal.id}
                  className="hover:bg-slate-50/70 transition-colors group cursor-pointer"
                  onClick={() => onSelectDeal(deal.memoData)}
                >
                  {/* Company Profile */}
                  <td className="py-4 px-4">
                    <div className="space-y-0.5">
                      <div className="flex items-center space-x-2">
                        <span className="font-sans font-bold text-slate-950 text-sm group-hover:text-emerald-700 transition-colors">
                          {deal.companyName}
                        </span>
                        <span className="rounded bg-slate-100 px-1.5 py-0.2 font-mono text-[10px] text-slate-600 border border-slate-200">
                          {deal.region}
                        </span>
                      </div>
                      <p className="text-slate-500 line-clamp-1 max-w-sm font-sans text-xs">
                        {deal.oneLiner}
                      </p>
                    </div>
                  </td>

                  {/* Score */}
                  <td className="py-4 px-3 text-center">
                    <div className="inline-flex flex-col items-center">
                      <span className="font-mono text-base font-black text-slate-950">
                        {deal.score}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">/ 100</span>
                    </div>
                  </td>

                  {/* Sector & Stage */}
                  <td className="py-4 px-3">
                    <div className="space-y-0.5">
                      <span className="font-semibold text-slate-800 block">
                        {deal.sector}
                      </span>
                      <span className="font-mono text-[11px] text-slate-500">
                        {deal.stage}
                      </span>
                    </div>
                  </td>

                  {/* Mandate */}
                  <td className="py-4 px-3">
                    <span className="rounded-md bg-slate-100 border border-slate-200 px-2 py-1 font-mono text-[11px] text-slate-700 block max-w-xs truncate">
                      {deal.mandateName}
                    </span>
                  </td>

                  {/* Risk Profile */}
                  <td className="py-4 px-3">
                    <span className={`inline-block rounded-md border px-2 py-0.5 font-mono text-[10.5px] font-bold ${getRiskStyle(deal.riskLevel)}`}>
                      {deal.riskLevel} Risk
                    </span>
                  </td>

                  {/* System Verdict */}
                  <td className="py-4 px-3">
                    <span className={`inline-block rounded-md border px-2 py-0.5 font-mono text-[10px] font-bold ${getVerdictStyle(deal.systemRecommendation)}`}>
                      {deal.systemRecommendation}
                    </span>
                  </td>

                  {/* Investor Decision */}
                  <td className="py-4 px-3">
                    <span className="inline-block rounded-full bg-slate-950 text-white px-2.5 py-0.5 font-mono text-[10.5px] font-bold">
                      {deal.investorDecision}
                    </span>
                  </td>

                  {/* Action Link */}
                  <td className="py-4 px-4 text-right">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectDeal(deal.memoData);
                      }}
                      className="inline-flex items-center space-x-1 font-mono text-xs font-bold text-emerald-700 hover:text-emerald-900 group-hover:underline cursor-pointer"
                    >
                      <span>View Memo</span>
                      <ArrowRight className="h-3 w-3" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

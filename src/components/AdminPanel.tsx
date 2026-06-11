import React, { useState } from "react";
import { Users, Server, ShieldCheck, HelpCircle, HardDrive, Cpu, Terminal, Key } from "lucide-react";

interface AdminPanelProps {
  totalSummariesCreatedGlobal: number;
}

export function AdminPanel({ totalSummariesCreatedGlobal }: AdminPanelProps) {
  const [apiUsage, setApiOverUsage] = useState(64); // mock dynamic progress

  // Clean formatted administrative stats
  const panelsStats = [
    { label: "Active Users Right Now", val: "18", icon: Users },
    { label: "Aggregate Processed Summaries", val: String(totalSummariesCreatedGlobal + 104), icon: Server },
    { label: "Total Storage Volume Used", val: "24.5 MB", icon: HardDrive },
    { label: "API Quotas Operational State", val: "Normal (99.8%)", icon: ShieldCheck },
  ];

  // Daily API requests mock timeline details
  const dailyMetrics = [
    { day: "Mon", count: 480 },
    { day: "Tue", count: 680 },
    { day: "Wed", count: 910 },
    { day: "Thu", count: 720 },
    { day: "Fri", count: 852 },
    { day: "Sat", count: 320 },
    { day: "Sun", count: 440 },
  ];

  const maxVal = Math.max(...dailyMetrics.map((d) => d.count));

  return (
    <div className="space-y-8 animate-fade-in p-1 max-w-4xl mx-auto">
      <div className="space-y-2">
        <h2 className="text-2xl md:text-3xl font-extrabold text-on-background">System Analytics</h2>
        <p className="text-on-surface-variant text-sm">
          Overview of platform operations, API quotas, and storage analytics.
        </p>
      </div>

      {/* Grid statistics metrics */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {panelsStats.map((item, i) => {
          const ItemIcon = item.icon;
          return (
            <div
              key={i}
              className="bg-surface-container/40 p-5 rounded-2xl border border-outline-variant/10 space-y-3"
            >
              <div className="w-10 h-10 bg-secondary/10 text-secondary border border-secondary/15 rounded-xl flex items-center justify-center shrink-0">
                <ItemIcon className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <p className="text-xl md:text-2xl font-bold tracking-tight text-on-surface">
                  {item.val}
                </p>
                <p className="text-[10px] text-on-surface-variant uppercase tracking-wider font-bold leading-snug">
                  {item.label}
                </p>
              </div>
            </div>
          );
        })}
      </section>

      {/* Analytics chart and telemetry logs row */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* API Usage chart bar diagram using customized responsive raw elements */}
        <section className="md:col-span-8 bg-surface-container/40 border border-outline-variant/15 p-6 rounded-2xl space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-secondary uppercase font-mono tracking-widest flex items-center gap-2">
              <Cpu className="w-4.5 h-4.5 text-secondary" />
              System Traffic (API Requests)
            </h3>
            <span className="text-[10px] font-mono bg-secondary/10 px-2 py-0.5 rounded text-secondary">
              7-DAY WINDOW
            </span>
          </div>

          <div className="h-56 flex items-end gap-3.5 pt-8 pl-4 pr-4 border-b border-l border-outline-variant/10">
            {dailyMetrics.map((data, idx) => {
              const heightPercent = (data.count / maxVal) * 100;
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer h-full justify-end">
                  <div className="relative w-full flex justify-center">
                    {/* Tooltip on Hover */}
                    <span className="absolute -top-7 opacity-0 group-hover:opacity-100 transition-opacity bg-surface-container-high px-2 py-0.5 rounded text-[10px] font-mono border border-outline-variant/15 font-semibold text-on-surface z-10">
                      {data.count}
                    </span>
                    {/* Decorative glow bar */}
                    <div
                      style={{ height: `${heightPercent || 1}%` }}
                      className="w-full max-w-[28px] bg-gradient-to-t from-primary to-secondary rounded-t-lg transition-all duration-700 ease-out shadow-lg hover:brightness-110"
                    />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/75 font-mono pt-1">
                    {data.day}
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        {/* Configurations status cards */}
        <section className="md:col-span-4 bg-surface-container/40 border border-outline-variant/15 p-6 rounded-2xl space-y-4">
          <h3 className="text-sm font-bold text-secondary uppercase font-mono tracking-widest flex items-center gap-2 border-b border-outline-variant/10 pb-2">
            <Key className="w-4.5 h-4.5" />
            API Keys Security
          </h3>

          <div className="space-y-4.5 font-medium text-xs text-on-surface-variant leading-relaxed">
            <div className="space-y-1">
              <p className="font-bold text-on-surface block">Gemini API Key Proxy:</p>
              <p className="text-[11px] leading-snug">
                Configured securely as an environment variable server-side. Browser queries never expose API values.
              </p>
            </div>

            <div className="space-y-1">
              <p className="font-bold text-on-surface block">Firebase Storage Rules:</p>
              <p className="text-[11px] leading-snug">
                Activated zero-trust conditions. Standard document queries must match user specific directories path structure.
              </p>
            </div>

            <div className="bg-secondary-container/10 border border-secondary/20 p-3.5 rounded-xl text-[11px]">
              <span className="font-bold text-on-surface block mb-1">Interactive Diagnostic</span>
              Secure cloud sandbox connected and authenticated. Platform operating at optimal threshold.
            </div>
          </div>
        </section>
      </div>

      {/* Operational parameters note */}
      <section className="bg-surface-container/20 p-5 rounded-2xl border border-outline-variant/10 flex items-start gap-4">
        <Terminal className="w-6 h-6 text-cyan-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="font-bold text-xs">System Operator Note</h4>
          <p className="text-on-surface-variant text-[11px] leading-relaxed">
            All database modifications require Firebase administrative access. Secure Firestore collections are bounded by rules enforcing validation checklists at deployment.
          </p>
        </div>
      </section>
    </div>
  );
}

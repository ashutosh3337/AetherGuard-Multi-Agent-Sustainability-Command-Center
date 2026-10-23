"use client";

import React, { useState } from "react";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { ImpactBadge } from "@/components/ui/ImpactBadge";
import { Button } from "@/components/ui/Button";
import { MOCK_LEDGER_ENTRIES } from "@/lib/mock-data";
import { Award, CheckCircle2, Download, ShieldCheck, FileSpreadsheet } from "lucide-react";

export default function ImpactPage() {
  const [downloaded, setDownloaded] = useState(false);

  const handleDownloadLedger = () => {
    const headers = "Action ID,Facility,Verified Date,Category,Realized Impacts,Audit Status\n";
    const rows = MOCK_LEDGER_ENTRIES.map((e) =>
      `"${e.id}","${e.facility}","${e.verifiedOn}","${e.category}","${e.impacts.map((i) => `${i.value} ${i.kind}`).join("; ")}","VERIFIED"`
    ).join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `aetherguard-esg-audit-ledger-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2500);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--text-1)", letterSpacing: "-0.02em" }}>
            Verified Impact Ledger
          </h1>
          <p style={{ fontSize: "0.8125rem", color: "var(--text-3)", marginTop: "0.2rem" }}>
            Cryptographically audited sustainability ledger · Synced with BigQuery & Cloud Audit Logs
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          icon={downloaded ? <CheckCircle2 size={14} color="#060911" /> : <Download size={14} />}
          onClick={handleDownloadLedger}
        >
          {downloaded ? "Audit Ledger Downloaded" : "Download Audit Ledger"}
        </Button>
      </div>

      {/* Ledger Table */}
      <GlassPanel style={{ padding: "0", overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              textAlign: "left",
              fontSize: "0.8125rem",
            }}
          >
            <thead>
              <tr
                style={{
                  borderBottom: "1px solid var(--border-subtle)",
                  backgroundColor: "var(--bg-glass)",
                  color: "var(--text-3)",
                  textTransform: "uppercase",
                  fontSize: "0.6875rem",
                  letterSpacing: "0.05em",
                }}
              >
                <th style={{ padding: "0.85rem 1.25rem" }}>Action ID & Description</th>
                <th style={{ padding: "0.85rem 1rem" }}>Target Facility</th>
                <th style={{ padding: "0.85rem 1rem" }}>Verification Date</th>
                <th style={{ padding: "0.85rem 1rem" }}>Realized Impacts</th>
                <th style={{ padding: "0.85rem 1.25rem", textAlign: "right" }}>Audit Status</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_LEDGER_ENTRIES.map((entry) => (
                <tr
                  key={entry.id}
                  style={{
                    borderBottom: "1px solid var(--border-subtle)",
                    transition: "background-color 0.15s ease",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--bg-glass)")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                >
                  <td style={{ padding: "1rem 1.25rem" }}>
                    <span className="font-mono" style={{ fontSize: "0.6875rem", color: "var(--teal)", display: "block" }}>
                      {entry.id}
                    </span>
                    <span style={{ fontWeight: 600, color: "var(--text-1)", marginTop: "2px", display: "block" }}>
                      {entry.action}
                    </span>
                  </td>
                  <td style={{ padding: "1rem 1rem", color: "var(--text-2)" }}>{entry.facility}</td>
                  <td style={{ padding: "1rem 1rem", color: "var(--text-3)" }}>
                    <span className="font-mono tabular-nums">{entry.verifiedOn}</span>
                  </td>
                  <td style={{ padding: "1rem 1rem" }}>
                    <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap" }}>
                      {entry.impacts.map((imp, idx) => (
                        <ImpactBadge key={idx} kind={imp.kind} value={imp.value} size="sm" signed={false} />
                      ))}
                    </div>
                  </td>
                  <td style={{ padding: "1rem 1.25rem", textAlign: "right" }}>
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "4px",
                        color: "var(--emerald)",
                        fontSize: "0.75rem",
                        fontWeight: 600,
                      }}
                    >
                      <CheckCircle2 size={14} /> VERIFIED
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassPanel>
    </div>
  );
}

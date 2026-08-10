"use client";

import React, { useEffect, useState } from "react";

interface GuideModalProps {
  open: boolean;
  onClose: () => void;
}

const STEPS = [
  {
    title: "Overview",
    desc: "Welcome to the dashboard. This tour highlights the main areas: stats, recent orders, and subscription details.",
  },
  {
    title: "Recent Orders",
    desc: "Use the Recent Orders table to view, refund, and inspect recent transactions quickly.",
  },
  {
    title: "Packages",
    desc: "Purchase or upgrade packages from the package section to unlock features and increase limits.",
  },
  {
    title: "Theme",
    desc: "Toggle the dashboard-only dark/light theme using the theme button in the header.",
  },
];

export default function GuideModal({ open, onClose }: GuideModalProps) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!open) setStep(0);
  }, [open]);

  if (!open) return null;

  const next = () => setStep((s) => Math.min(s + 1, STEPS.length - 1));
  const prev = () => setStep((s) => Math.max(s - 1, 0));
  const finish = () => {
    setStep(0);
    onClose();
  };

  const cur = STEPS[step];

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="modal" style={{ maxWidth: 720 }}>
        <div className="modal-header">
          <h3>{cur.title}</h3>
          <div
            style={{ fontSize: 12, color: "var(--text-muted)" }}
          >{`Step ${step + 1} of ${STEPS.length}`}</div>
        </div>
        <div className="modal-body">
          <p>{cur.desc}</p>
        </div>
        <div
          className="modal-actions"
          style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}
        >
          <button className="btn btn-ghost" onClick={onClose}>
            Close
          </button>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              className="btn btn-ghost"
              onClick={prev}
              disabled={step === 0}
            >
              Back
            </button>
            {step < STEPS.length - 1 ? (
              <button className="btn btn-primary" onClick={next}>
                Next
              </button>
            ) : (
              <button className="btn btn-primary" onClick={finish}>
                Finish
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

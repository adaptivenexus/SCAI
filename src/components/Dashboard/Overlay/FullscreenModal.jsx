"use client";
import React, { useEffect } from "react";
import { createPortal } from "react-dom";

/**
 * FullscreenModal: Portal-based fullscreen modal that escapes layout clipping.
 */
export default function FullscreenModal({
  open,
  onClose,
  children,
  zIndex = 10000,
  centered = true,
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose && onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0" style={{ zIndex }}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      {centered ? (
        <div className="absolute inset-0 flex items-center justify-center p-4 pointer-events-none">
          {children}
        </div>
      ) : (
        <div className="absolute inset-0 flex">
          <div className="m-0 w-screen h-screen bg-white/95 backdrop-blur-sm border border-accent-primary/30 shadow-2xl overflow-y-auto">
            {children}
          </div>
        </div>
      )}
    </div>,
    document.body
  );
}
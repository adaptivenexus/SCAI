"use client";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

/**
 * FloatingMenu: Portal-based anchored dropdown.
 * Positions itself relative to an anchor element and stays in place on scroll/resize.
 */
export default function FloatingMenu({
  open,
  anchorEl,
  anchorRef,
  placement = "bottom-end",
  offset = 8,
  onClose,
  zIndex = 10000,
  className = "",
  children,
}) {
  const menuRef = useRef(null);
  const [coords, setCoords] = useState({ top: 0, left: 0 });

  const getAnchor = () => {
    if (anchorEl) return anchorEl;
    if (anchorRef && anchorRef.current) return anchorRef.current;
    return null;
  };

  const clamp = (val, min, max) => Math.min(Math.max(val, min), max);

  const updatePosition = () => {
    const anchor = getAnchor();
    if (!anchor || !menuRef.current) return;

    const rect = anchor.getBoundingClientRect();
    const menuRect = menuRef.current.getBoundingClientRect();

    let top = rect.bottom + offset;
    let left = rect.left;

    switch (placement) {
      case "bottom-start":
        top = rect.bottom + offset;
        left = rect.left;
        break;
      case "bottom-end":
        top = rect.bottom + offset;
        left = rect.right - menuRect.width;
        break;
      case "top-start":
        top = rect.top - menuRect.height - offset;
        left = rect.left;
        break;
      case "top-end":
        top = rect.top - menuRect.height - offset;
        left = rect.right - menuRect.width;
        break;
      default:
        top = rect.bottom + offset;
        left = rect.left;
    }

    // Keep within viewport with 8px padding
    const PAD = 8;
    top = clamp(top, PAD, window.innerHeight - menuRect.height - PAD);
    left = clamp(left, PAD, window.innerWidth - menuRect.width - PAD);

    setCoords({ top, left });
  };

  useLayoutEffect(() => {
    if (!open) return;
    // initial position after mount
    updatePosition();
  }, [open, anchorEl, anchorRef, placement]);

  useEffect(() => {
    if (!open) return;
    const handle = () => updatePosition();
    window.addEventListener("resize", handle);
    window.addEventListener("scroll", handle, true);
    return () => {
      window.removeEventListener("resize", handle);
      window.removeEventListener("scroll", handle, true);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onDocClick = (e) => {
      const anchor = getAnchor();
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        !(anchor && anchor.contains(e.target))
      ) {
        onClose && onClose();
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div
      ref={menuRef}
      style={{ position: "fixed", top: coords.top, left: coords.left, zIndex }}
      className={`bg-white/95 backdrop-blur-sm border border-accent-primary/30 rounded-2xl shadow-xl overflow-hidden ${className}`}
    >
      {children}
    </div>,
    document.body
  );
}
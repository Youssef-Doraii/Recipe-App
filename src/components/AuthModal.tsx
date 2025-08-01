import React, { useEffect, useRef } from "react";
import "./AuthModal.css";
import Auth from "../Auth";

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ open, onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Focus trap and ESC close
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      // Focus trap
      if (e.key === "Tab" && modalRef.current) {
        const focusableEls = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstEl = focusableEls[0];
        const lastEl = focusableEls[focusableEls.length - 1];
        if (!e.shiftKey && document.activeElement === lastEl) {
          e.preventDefault();
          firstEl.focus();
        } else if (e.shiftKey && document.activeElement === firstEl) {
          e.preventDefault();
          lastEl.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    // Focus the modal on open
    setTimeout(() => {
      modalRef.current?.focus();
    }, 0);

    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="auth-modal-backdrop" tabIndex={-1} onClick={onClose}>
      <div
        className="auth-modal"
        tabIndex={0}
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="auth-modal-close"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>
        <Auth onAuthSuccess={onClose} />
      </div>
    </div>
  );
};

export default AuthModal;

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface CustomDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

export function CustomDialog({
  open,
  onOpenChange,
  children,
}: CustomDialogProps) {
  React.useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onOpenChange(false);
    }
    if (open) {
      document.addEventListener("keydown", onKeyDown);
    } else {
      document.removeEventListener("keydown", onKeyDown);
    }
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onOpenChange]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm animate-fade-in"
        onClick={() => onOpenChange(false)}
      />
      <div className="relative z-10 w-full max-w-lg bg-slate-900 border border-slate-800 rounded-xl shadow-xl p-6 animate-zoom-in">
        {children}
      </div>
    </div>
  );
}

export function CustomDialogHeader({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col space-y-1.5 text-center sm:text-left">
      {children}
    </div>
  );
}

export function CustomDialogTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-lg font-semibold leading-none tracking-tight text-slate-100">
      {children}
    </h2>
  );
}

export function CustomDialogDescription({
  children,
}: {
  children: React.ReactNode;
}) {
  return <p className="text-sm text-slate-400">{children}</p>;
}

export function CustomDialogFooter({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 mt-4">
      {children}
    </div>
  );
}

export function CustomDialogCloseButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
      onClick={onClick}
      aria-label="Close"
      type="button"
    >
      <X className="h-4 w-4 text-slate-400" />
    </button>
  );
}

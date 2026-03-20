import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../utils/cn";

export function Surface({
  children,
  className,
  variant = "matte",
  as,
}: {
  children: React.ReactNode;
  className?: string;
  variant?: "matte" | "glass";
  as?: React.ElementType;
}) {
  const base = variant === "glass" ? "surface-glass backdrop-blur-md shadow-sm border border-white/10 hover:shadow-lg transition-all" : "bg-[var(--sa-card,var(--card))] shadow-[0_6px_20px_rgba(0,0,0,0.05)] transition-all duration-300";
  const As: React.ElementType = as ?? "div";
  return React.createElement(As, { 
    className: cn("rounded-[12px] border", base, className),
    style: { borderColor: "var(--sa-border, var(--border-color))", color: "var(--sa-text-primary, var(--card-text))" }
  }, children);
}

export function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return <Surface className={cn("p-6 hover:shadow-lg hover:-translate-y-1", className)}>{children}</Surface>;
}

export function SubtleGridBackground({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 opacity-40",
        className
      )}
      style={{
        backgroundImage:
          "linear-gradient(to right, rgba(0,0,0,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.03) 1px, transparent 1px)",
        backgroundSize: "60px 60px",
        maskImage:
          "radial-gradient(1000px 500px at 50% 10%, black 20%, transparent 80%)",
      }}
    />
  );
}

export function Divider({ className }: { className?: string }) {
  return <div className={cn("h-px w-full", className)} style={{ backgroundColor: "var(--sa-border, var(--border-color))" }} />;
}

export function Label({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("text-[14px] font-semibold tracking-wide", className)} style={{ color: "var(--sa-text-secondary, var(--text-secondary))" }}>{children}</div>;
}

export function Title({ children, className }: { children: React.ReactNode; className?: string }) {
  return <h1 className={cn("text-[24px] md:text-[32px] font-semibold tracking-tight", className)} style={{ color: "var(--sa-text-primary, var(--text-primary))" }}>{children}</h1>;
}

export function Subtitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return <p className={cn("text-[14px]", className)} style={{ color: "var(--sa-text-secondary, var(--text-secondary))" }}>{children}</p>;
}

type SafeButtonProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  | "onDrag"
  | "onDragStart"
  | "onDragEnd"
  | "onAnimationStart"
  | "onAnimationEnd"
  | "onAnimationIteration"
>;

export function Button({
  children,
  className,
  variant = "primary",
  size = "md",
  ...props
}: SafeButtonProps & {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "outline";
  size?: "sm" | "md";
}) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-[10px] font-bold transition-all will-change-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]/50";

  const sizes: Record<string, string> = {
    sm: "px-3 min-h-[44px] text-[14px]",
    md: "px-[18px] min-h-[44px] text-[14px]",
  };

  const variants: Record<string, string> = {
    primary:
      "bg-[var(--sa-primary,var(--primary))] text-white shadow-sm hover:shadow-md hover:-translate-y-[2px]",
    secondary:
      "bg-[var(--sa-secondary,var(--secondary))]/10 text-[var(--sa-secondary,var(--secondary))] border border-[var(--sa-secondary,var(--secondary))]/20 shadow-sm",
    ghost: "bg-transparent text-[var(--sa-text-secondary,var(--text-secondary))] hover:bg-[var(--sa-hover,var(--hover-bg))] hover:text-[var(--sa-text-primary,var(--text-primary))]",
    outline: "bg-transparent border border-[var(--sa-border,var(--border-color))] text-[var(--sa-text-primary,var(--text-primary))] hover:bg-[var(--sa-hover,var(--hover-bg))] shadow-sm",
    danger:
      "bg-[var(--sa-error,var(--error))] text-white shadow-sm hover:-translate-y-[2px]",
  };

  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      className={cn(base, sizes[size], variants[variant], className)}
      {...props}
    >
      {children}
    </motion.button>
  );
}

export function IconButton({
  className,
  style,
  ...props
}: SafeButtonProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      className={cn(
        "inline-flex h-[44px] w-[44px] items-center justify-center rounded-[10px] border transition-all shadow-sm",
        className
      )}
      style={{
        borderColor: "var(--sa-border, #E5E7EB)",
        backgroundColor: "var(--sa-card, #FFFFFF)",
        color: "var(--sa-text-secondary, #6B7280)",
        ...style
      }}
      {...props}
    />
  );
}

export function Input({
  className,
  style,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "min-h-[44px] w-full rounded-[10px] px-3.5 text-[14px] shadow-sm",
        "focus:outline-none focus:ring-1 focus:ring-[var(--primary)] transition-colors",
        className
      )}
      style={{ 
        borderColor: "var(--sa-border, var(--border-color))", 
        borderWidth: 1,
        backgroundColor: "var(--sa-card, var(--card))",
        color: "var(--sa-text-primary, var(--text-primary))",
        ...style
      }}
      {...props}
    />
  );
}

export function Textarea({
  className,
  style,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "min-h-[120px] w-full resize-none rounded-[10px] border px-3.5 py-3 text-[14px] shadow-sm",
        "focus:outline-none focus:ring-1 focus:ring-[var(--primary)] transition-colors",
        className
      )}
      style={{ 
        borderColor: "var(--sa-border, var(--border-color))", 
        backgroundColor: "var(--sa-card, var(--card))",
        color: "var(--sa-text-primary, var(--card-text))",
        ...style
      }}
      {...props}
    />
  );
}

export function Select({
  className,
  style,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "min-h-[44px] w-full appearance-none rounded-[10px] border px-3.5 text-[14px] shadow-sm",
        "focus:outline-none focus:ring-1 focus:ring-[var(--primary)] transition-colors",
        className
      )}
      style={{ 
        borderColor: "var(--sa-border, var(--border-color))", 
        backgroundColor: "var(--sa-card, var(--card))",
        color: "var(--sa-text-primary, var(--text-primary))",
        ...style
      }}
      {...props}
    />
  );
}

export function Badge({
  children,
  className,
  tone = "neutral",
}: {
  children: React.ReactNode;
  className?: string;
  tone?: "neutral" | "good" | "warn" | "bad" | "info";
}) {
  const tones: Record<string, string> = {
    neutral: "bg-[var(--sa-hover,var(--hover-bg))] text-[var(--sa-text-secondary,var(--text-secondary))] border-[var(--sa-border,var(--border-color))]",
    good: "bg-[var(--sa-success,var(--success))]/10 text-[var(--sa-success,var(--success))] border-[var(--sa-success,var(--success))]/20",
    warn: "bg-[var(--sa-warning,var(--warning))]/10 text-[var(--sa-warning,var(--warning))] border-[var(--sa-warning,var(--warning))]/20",
    bad: "bg-[var(--sa-error,var(--error))]/10 text-[var(--sa-error,var(--error))] border-[var(--sa-error,var(--error))]/20",
    info: "bg-[var(--sa-info,var(--info))]/10 text-[var(--sa-info,var(--info))] border-[var(--sa-info,var(--info))]/20",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold",
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}

export function Avatar({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");

  return (
    <div
      className={cn(
        "grid h-[44px] w-[44px] place-items-center rounded-full border border-white text-[14px] font-bold shadow-sm",
        className
      )}
      style={{ 
        backgroundColor: "var(--sa-hover, var(--hover-bg))", 
        color: "var(--sa-text-primary, var(--text-primary))" 
      }}
      title={name}
    >
      {initials || "U"}
    </div>
  );
}

export function Modal({
  open,
  title,
  description,
  children,
  onClose,
  footer,
}: {
  open: boolean;
  title: string;
  description?: string;
  children: React.ReactNode;
  onClose: () => void;
  footer?: React.ReactNode;
}) {
  if (!open) return null;
  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50">
        <motion.div
           className="absolute inset-0 backdrop-blur-sm"
           style={{ backgroundColor: "rgba(31, 41, 55, 0.4)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />
        <div className="absolute inset-0 grid place-items-center p-4">
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="w-full max-w-xl relative z-10"
          >
             <Surface className="p-6">
               <div className="flex items-start justify-between gap-3 border-b pb-4 mb-4" style={{ borderColor: "var(--sa-border, var(--border-color))" }}>
                 <div className="space-y-1">
                   <div className="text-[18px] font-bold" style={{ color: "var(--sa-text-primary, var(--text-primary))" }}>{title}</div>
                   {description ? (
                     <div className="text-[14px]" style={{ color: "var(--sa-text-secondary, var(--text-secondary))" }}>{description}</div>
                   ) : null}
                 </div>
                 <IconButton onClick={onClose} aria-label="Close" className="h-8 w-8 rounded-full border-none shadow-none" style={{ backgroundColor: "transparent" }}>
                   <span className="text-xl leading-none" style={{ color: "var(--sa-text-secondary, var(--text-secondary))" }}>×</span>
                 </IconButton>
               </div>
               <div>{children}</div>
               {footer ? <div className="mt-6 flex justify-end gap-3 pt-4 border-t" style={{ borderColor: "var(--sa-border, var(--border-color))" }}>{footer}</div> : null}
             </Surface>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
}

export const pageMotion = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 10 },
  transition: { duration: 0.28, ease: "easeOut" },
};

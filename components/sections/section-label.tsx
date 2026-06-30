import { cn } from "@/lib/utils";

interface SectionLabelProps {
  children: React.ReactNode;
  /** Editorial section number, e.g. "01". Renders before the label. */
  index?: string;
  className?: string;
}

/**
 * Editorial section marker (Joby-style): a section number, a short rule line,
 * a pulsing accent dot, and the uppercase label. Replaces the old pill for a
 * more magazine-like, modular feel while staying on the dark/green brand.
 */
export function SectionLabel({ children, index, className }: SectionLabelProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 text-xs font-black uppercase tracking-[0.22em] text-primary",
        className
      )}
    >
      {index ? (
        <span className="text-sm tabular-nums text-primary">{index}</span>
      ) : null}
      <span aria-hidden className="h-px w-10 bg-primary/40" />
      <span className="flex items-center gap-2">
        <span
          aria-hidden
          className="pulse-dot h-1.5 w-1.5 rounded-full bg-primary"
        />
        {children}
      </span>
    </div>
  );
}

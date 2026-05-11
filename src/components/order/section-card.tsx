import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionCardProps {
  step?: number;
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
  children: ReactNode;
}

export function SectionCard({
  step,
  icon,
  title,
  description,
  action,
  className,
  children,
}: SectionCardProps) {
  return (
    <section
      className={cn(
        "rounded-2xl border border-border/70 bg-card card-soft",
        className,
      )}
    >
      <header className="flex items-start justify-between gap-3 px-4 pt-4 pb-3">
        <div className="flex items-start gap-3 min-w-0">
          {step !== undefined ? (
            <div className="inline-flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-[13px] font-semibold">
              {step}
            </div>
          ) : null}
          <div className="min-w-0">
            <h2 className="flex items-center gap-1.5 text-sm font-semibold leading-tight text-foreground">
              {icon ? <span className="text-primary/80">{icon}</span> : null}
              <span className="truncate">{title}</span>
            </h2>
            {description ? (
              <p className="mt-0.5 text-[11.5px] leading-snug text-muted-foreground">
                {description}
              </p>
            ) : null}
          </div>
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </header>

      <div className="px-4 pb-4 space-y-3">{children}</div>
    </section>
  );
}

import { Check, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

interface Step {
  label: string;
  state: "done" | "current" | "pending";
  note?: string;
}

export function StatusTimeline({ steps }: { steps: Step[] }) {
  return (
    <ol className="space-y-0">
      {steps.map((step, i) => (
        <li key={step.label} className="relative flex gap-3 pb-6 last:pb-0">
          {i < steps.length - 1 && (
            <span
              className={cn(
                "absolute left-[13px] top-7 h-full w-0.5",
                step.state === "done" ? "bg-success" : "bg-border",
              )}
              aria-hidden
            />
          )}
          <span
            className={cn(
              "z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border",
              step.state === "done" && "border-success bg-success text-success-foreground",
              step.state === "current" && "border-primary bg-card",
              step.state === "pending" && "border-border bg-card",
            )}
          >
            {step.state === "done" ? (
              <Check className="h-4 w-4" aria-hidden />
            ) : (
              <Circle
                className={cn(
                  "h-2.5 w-2.5",
                  step.state === "current" ? "fill-primary text-primary" : "text-border",
                )}
                aria-hidden
              />
            )}
          </span>
          <div className="pt-0.5">
            <p
              className={cn(
                "text-sm font-medium",
                step.state === "pending" ? "text-muted-foreground" : "text-foreground",
              )}
            >
              {step.label}
            </p>
            {step.note && <p className="mt-0.5 text-xs text-muted-foreground">{step.note}</p>}
          </div>
        </li>
      ))}
    </ol>
  );
}

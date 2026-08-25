import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const STYLES: Record<string, string> = {
  Submitted: "bg-secondary text-secondary-foreground border-border",
  "Under Verification": "bg-accent text-accent-foreground border-accent",
  "Department Review": "bg-accent text-accent-foreground border-accent",
  Approved: "bg-success/10 text-success border-success/30",
  Rejected: "bg-destructive/10 text-destructive border-destructive/30",
  "Assigned to Department": "bg-accent text-accent-foreground border-accent",
  "Under Review": "bg-accent text-accent-foreground border-accent",
  Resolved: "bg-success/10 text-success border-success/30",
  "High Priority": "bg-destructive/10 text-destructive border-destructive/30",
  Normal: "bg-secondary text-secondary-foreground border-border",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <Badge variant="outline" className={cn("font-medium", STYLES[status] ?? STYLES["Normal"])}>
      {status}
    </Badge>
  );
}

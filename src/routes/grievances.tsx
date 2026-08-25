import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { PlusCircle, Paperclip } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StatusBadge } from "@/components/status-badge";
import { StatusTimeline } from "@/components/status-timeline";
import { Skeleton } from "@/components/ui/skeleton";
import { SERVICES, DEMO_PROFILE } from "@/lib/data";
import { submitGrievance, getCitizenRecords } from "@/lib/records.functions";
import { getCitizenKey } from "@/lib/citizen";
import { toast } from "sonner";

export const Route = createFileRoute("/grievances")({
  head: () => ({
    meta: [
      { title: "Grievances & Support — SevaSetu" },
      {
        name: "description",
        content: "Raise and track grievances related to public service applications and benefits.",
      },
      { property: "og:title", content: "Grievances & Support — SevaSetu" },
      { property: "og:description", content: "Raise and track service grievances." },
      { property: "og:type", content: "website" },
    ],
  }),
  component: GrievancesPage,
});

const GRIEVANCE_CATEGORIES = [
  "Application Delay",
  "Payment/Benefit Issue",
  "Document Issue",
  "Service Access",
  "Technical Problem",
  "Other",
];

const GRIEVANCE_STAGES = ["Submitted", "Assigned", "Under Review", "Resolution"];

function grievanceStageIndex(status: string): number {
  switch (status) {
    case "Submitted":
      return 0;
    case "Assigned to Department":
      return 1;
    case "Under Review":
      return 2;
    case "Resolved":
      return 3;
    default:
      return 0;
  }
}

function GrievancesPage() {
  const [showForm, setShowForm] = useState(false);
  const [service, setService] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [justSubmitted, setJustSubmitted] = useState<{
    ref: string;
    status: string;
  } | null>(null);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["citizen-records"],
    queryFn: () => getCitizenRecords({ data: getCitizenKey() }),
  });
  const grievances = data?.grievances;

  async function submit() {
    if (!service || !category || !description.trim()) {
      toast.error("Please fill in the service, category and description.");
      return;
    }
    setSubmitting(true);
    try {
      const created = await submitGrievance({
        data: {
          citizenKey: getCitizenKey(),
          citizenName: DEMO_PROFILE.name,
          service,
          category,
          description: description.trim(),
        },
      });
      setJustSubmitted(created);
      setShowForm(false);
      setService("");
      setCategory("");
      setDescription("");
      toast.success(`Grievance ${created.ref} registered`);
      void refetch();
    } catch {
      toast.error("Could not submit the grievance. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold">Grievances &amp; Support</h1>
          <p className="mt-2 text-muted-foreground">
            Raise an issue with a service and follow it through to resolution.
          </p>
        </div>
        <Button onClick={() => setShowForm((s) => !s)}>
          <PlusCircle className="mr-2 h-4 w-4" aria-hidden /> Raise a Grievance
        </Button>
      </div>

      {justSubmitted && (
        <Card className="mt-6 border-success/40 shadow-none">
          <CardHeader>
            <CardTitle className="text-lg text-success">Grievance Registered</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <p className="text-xl font-bold tracking-wide text-primary">{justSubmitted.ref}</p>
              <StatusBadge status={justSubmitted.status} />
              <span className="text-xs text-muted-foreground">Demo ID</span>
            </div>
            <StatusTimeline
              steps={GRIEVANCE_STAGES.map((label, i) => ({
                label,
                state:
                  i < grievanceStageIndex(justSubmitted.status)
                    ? "done"
                    : i === grievanceStageIndex(justSubmitted.status)
                      ? "current"
                      : "pending",
              }))}
            />
          </CardContent>
        </Card>
      )}

      {showForm && (
        <Card className="mt-6 shadow-none">
          <CardHeader>
            <CardTitle className="text-lg">New Grievance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Service</Label>
                <Select value={service} onValueChange={setService}>
                  <SelectTrigger aria-label="Related service">
                    <SelectValue placeholder="Select service" />
                  </SelectTrigger>
                  <SelectContent>
                    {SERVICES.map((s) => (
                      <SelectItem key={s.id} value={s.name}>
                        {s.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Issue category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger aria-label="Issue category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {GRIEVANCE_CATEGORIES.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="grv-desc">Description</Label>
              <Textarea
                id="grv-desc"
                rows={4}
                placeholder="Describe the issue in simple words…"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => toast.success("Supporting document attached (demo)")}
            >
              <Paperclip className="mr-2 h-4 w-4" aria-hidden /> Attach supporting document (optional)
            </Button>
            <div className="flex justify-end">
              <Button onClick={submit} disabled={submitting}>
                {submitting ? "Submitting…" : "Submit Grievance"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <h2 className="mt-10 text-xl font-bold">Your Grievances</h2>
      {isLoading ? (
        <div className="mt-4 space-y-3">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      ) : !grievances || grievances.length === 0 ? (
        <div className="mt-4 rounded-lg border border-dashed bg-card p-8 text-center">
          <p className="font-medium">No grievances yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            When you raise a grievance it will appear here with its status.
          </p>
        </div>
      ) : (
        <div className="mt-4 space-y-3">
          {grievances.map((g) => (
            <Card key={g.id} className="shadow-none">
              <CardContent className="flex flex-wrap items-center justify-between gap-3 p-5">
                <div>
                  <p className="font-semibold">{g.ref}</p>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    {g.service} · {g.category}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {new Date(g.created_at).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <StatusBadge status={g.status} />
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

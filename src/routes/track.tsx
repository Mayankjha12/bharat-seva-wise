import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Search, Clock, ArrowRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/status-badge";
import { StatusTimeline } from "@/components/status-timeline";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import type { Application } from "@/lib/types";

export const Route = createFileRoute("/track")({
  validateSearch: (search: Record<string, unknown>): { ref?: string | undefined } => ({
    ref: typeof search["ref"] === "string" ? (search["ref"] as string) : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Track Your Application — SevaSetu" },
      {
        name: "description",
        content:
          "Track the status of your public service application from submission to decision.",
      },
      { property: "og:title", content: "Track Your Application — SevaSetu" },
      { property: "og:description", content: "Follow your application from submission to decision." },
      { property: "og:type", content: "website" },
    ],
  }),
  component: TrackPage,
});

const STAGES = [
  "Application Submitted",
  "Documents Received",
  "Verification in Progress",
  "Department Review",
  "Final Decision",
];

function stageIndex(status: string): number {
  switch (status) {
    case "Submitted":
      return 1;
    case "Under Verification":
      return 2;
    case "Department Review":
      return 3;
    case "Approved":
    case "Rejected":
      return 4;
    default:
      return 0;
  }
}

function TrackPage() {
  const { ref } = Route.useSearch();
  const [input, setInput] = useState(ref ?? "");
  const [searchRef, setSearchRef] = useState(ref ?? "");

  const { data, isLoading, isFetched } = useQuery({
    queryKey: ["application", searchRef],
    enabled: searchRef.length > 0,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("applications")
        .select("*")
        .eq("ref", searchRef.trim().toUpperCase())
        .maybeSingle();
      if (error) throw error;
      return data as Application | null;
    },
  });

  const current = data ? stageIndex(data.status) : 0;

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-3xl font-bold">Track Your Application</h1>
      <p className="mt-2 text-muted-foreground">
        Enter your application ID to see the latest status. Demo ID:{" "}
        <button
          className="font-medium text-primary underline underline-offset-2"
          onClick={() => {
            setInput("SV-2026-10482");
            setSearchRef("SV-2026-10482");
          }}
        >
          SV-2026-10482
        </button>
      </p>

      <div className="mt-6 flex gap-2">
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <Input
            className="h-11 pl-9"
            placeholder="Enter application ID (e.g. SV-2026-10482)"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && setSearchRef(input)}
            aria-label="Application ID"
          />
        </div>
        <Button className="h-11" onClick={() => setSearchRef(input)}>
          Track
        </Button>
      </div>

      {isLoading && searchRef && (
        <div className="mt-8 space-y-3">
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="h-40 w-full" />
        </div>
      )}

      {isFetched && !isLoading && !data && searchRef && (
        <div className="mt-8 rounded-lg border border-dashed bg-card p-8 text-center">
          <p className="font-medium">No application found for &ldquo;{searchRef}&rdquo;</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Check the ID and try again. New applications appear here right after submission.
          </p>
        </div>
      )}

      {data && (
        <Card className="mt-8 shadow-none">
          <CardHeader className="border-b">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <CardTitle className="text-lg">{data.service_name}</CardTitle>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  {data.ref} · {data.district}, {data.state}
                </p>
              </div>
              <StatusBadge status={data.status} />
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <StatusTimeline
              steps={STAGES.map((label, i) => ({
                label,
                state: i < current ? "done" : i === current ? "current" : "pending",
              }))}
            />
            <div className="mt-6 grid gap-3 rounded-md border bg-muted p-4 text-sm sm:grid-cols-2">
              <p className="flex items-center gap-2 text-muted-foreground">
                <Clock className="h-4 w-4" aria-hidden />
                Last updated:{" "}
                <span className="font-medium text-foreground">
                  {new Date(data.updated_at).toLocaleString("en-IN", {
                    day: "numeric",
                    month: "short",
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </span>
              </p>
              <p className="text-muted-foreground">
                Expected next step:{" "}
                <span className="font-medium text-foreground">
                  {data.status === "Approved" || data.status === "Rejected"
                    ? "Completed"
                    : (STAGES[Math.min(current + 1, STAGES.length - 1)] ?? "").replace(
                        "Verification in Progress",
                        "Document verification",
                      )}
                </span>
              </p>
            </div>
            <Button asChild variant="outline" className="mt-5">
              <Link to="/services/$serviceId" params={{ serviceId: data.service_id }}>
                View Application Details <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

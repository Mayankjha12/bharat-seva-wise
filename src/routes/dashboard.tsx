import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { MapPin, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/status-badge";
import { ServiceCard } from "@/components/service-card";
import { DEMO_PROFILE, SERVICES } from "@/lib/data";
import { supabase } from "@/integrations/supabase/client";
import type { Application, Grievance } from "@/lib/types";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "My Dashboard — SevaSetu" },
      {
        name: "description",
        content: "Your recommended schemes, active applications and open grievances.",
      },
      { property: "og:title", content: "My Dashboard — SevaSetu" },
      { property: "og:description", content: "Citizen dashboard for services and applications." },
      { property: "og:type", content: "website" },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const { data: applications, isLoading: loadingApps } = useQuery({
    queryKey: ["my-applications", DEMO_PROFILE.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("applications")
        .select("*")
        .eq("citizen_id", DEMO_PROFILE.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Application[];
    },
  });

  const { data: grievances, isLoading: loadingGrv } = useQuery({
    queryKey: ["grievances", DEMO_PROFILE.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("grievances")
        .select("*")
        .eq("citizen_id", DEMO_PROFILE.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Grievance[];
    },
  });

  const recommended = SERVICES.filter((s) =>
    ["Education", "Employment", "Women & Child Welfare"].includes(s.category),
  ).slice(0, 3);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Good morning, {DEMO_PROFILE.firstName}</h1>
          <p className="mt-1 flex items-center gap-1.5 text-muted-foreground">
            <MapPin className="h-4 w-4" aria-hidden /> {DEMO_PROFILE.location}
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link to="/services">
            Find more services <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
          </Link>
        </Button>
      </div>

      <Card className="mt-6 shadow-none">
        <CardContent className="p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm font-medium">Profile completion</p>
            <p className="text-sm font-semibold text-primary">{DEMO_PROFILE.completion}%</p>
          </div>
          <Progress value={DEMO_PROFILE.completion} className="mt-2" />
          <dl className="mt-4 grid gap-x-6 gap-y-2 text-sm sm:grid-cols-3">
            <div>
              <dt className="text-muted-foreground">Age group</dt>
              <dd className="font-medium">{DEMO_PROFILE.ageGroup}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">State / District</dt>
              <dd className="font-medium">
                {DEMO_PROFILE.state} / {DEMO_PROFILE.district}
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Occupation</dt>
              <dd className="font-medium">{DEMO_PROFILE.occupation}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Family status</dt>
              <dd className="font-medium">{DEMO_PROFILE.familyStatus}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Accessibility preference</dt>
              <dd className="font-medium">{DEMO_PROFILE.accessibilityPreference}</dd>
            </div>
          </dl>
          <p className="mt-3 text-xs text-muted-foreground">Demo profile — no real personal data.</p>
        </CardContent>
      </Card>

      <section className="mt-10">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">Recommended for You</h2>
            <p className="text-sm text-muted-foreground">Based on the information in your profile.</p>
          </div>
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {recommended.map((s) => (
            <ServiceCard key={s.id} service={s} />
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-bold">Active Applications</h2>
        {loadingApps ? (
          <div className="mt-4 space-y-3">
            <Skeleton className="h-20 w-full" />
          </div>
        ) : !applications || applications.length === 0 ? (
          <div className="mt-4 rounded-lg border border-dashed bg-card p-8 text-center text-sm text-muted-foreground">
            No applications yet. Start one from any service page.
          </div>
        ) : (
          <div className="mt-4 space-y-3">
            {applications.map((a) => (
              <Card key={a.id} className="shadow-none">
                <CardContent className="flex flex-wrap items-center justify-between gap-3 p-5">
                  <div>
                    <p className="font-semibold">{a.service_name}</p>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      {a.ref} · {a.district}, {a.state}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge status={a.status} />
                    <Button variant="outline" size="sm" asChild>
                      <Link to="/track" search={{ ref: a.ref }}>
                        Track
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <section>
          <h2 className="text-xl font-bold">Recent Services</h2>
          <Card className="mt-4 shadow-none">
            <CardContent className="divide-y p-0">
              {SERVICES.slice(0, 3).map((s) => (
                <Link
                  key={s.id}
                  to="/services/$serviceId"
                  params={{ serviceId: s.id }}
                  className="flex items-center justify-between px-5 py-4 hover:bg-secondary"
                >
                  <div>
                    <p className="text-sm font-medium">{s.name}</p>
                    <p className="text-xs text-muted-foreground">{s.category}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" aria-hidden />
                </Link>
              ))}
            </CardContent>
          </Card>
        </section>

        <section>
          <h2 className="text-xl font-bold">Open Grievances</h2>
          {loadingGrv ? (
            <Skeleton className="mt-4 h-20 w-full" />
          ) : !grievances || grievances.length === 0 ? (
            <div className="mt-4 rounded-lg border border-dashed bg-card p-8 text-center text-sm text-muted-foreground">
              No open grievances.
            </div>
          ) : (
            <Card className="mt-4 shadow-none">
              <CardContent className="divide-y p-0">
                {grievances.map((g) => (
                  <div key={g.id} className="flex items-center justify-between px-5 py-4">
                    <div>
                      <p className="text-sm font-medium">{g.ref}</p>
                      <p className="text-xs text-muted-foreground">{g.category}</p>
                    </div>
                    <StatusBadge status={g.status} />
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
          <Button variant="outline" size="sm" className="mt-3" asChild>
            <Link to="/grievances">Manage grievances</Link>
          </Button>
        </section>
      </div>
    </div>
  );
}

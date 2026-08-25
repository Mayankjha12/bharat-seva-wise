import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Building2, LogIn, LogOut } from "lucide-react";
import {
  Bar,
  BarChart,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/status-badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getDepartmentData } from "@/lib/records.functions";
import { toast } from "sonner";

export const Route = createFileRoute("/department")({
  head: () => ({
    meta: [
      { title: "Service Delivery Dashboard — SevaSetu" },
      {
        name: "description",
        content:
          "Department view of applications, verification queues, grievances and service demand.",
      },
      { property: "og:title", content: "Service Delivery Dashboard — SevaSetu" },
      { property: "og:description", content: "Department dashboard for service delivery." },
      { property: "og:type", content: "website" },
    ],
  }),
  component: DepartmentPage,
});

const VOLUME = [
  { day: "Mon", applications: 940 },
  { day: "Tue", applications: 1120 },
  { day: "Wed", applications: 1010 },
  { day: "Thu", applications: 1265 },
  { day: "Fri", applications: 1284 },
  { day: "Sat", applications: 720 },
  { day: "Sun", applications: 480 },
];

const CHART_COLORS = [
  "oklch(0.33 0.08 258)",
  "oklch(0.52 0.11 158)",
  "oklch(0.62 0.1 220)",
  "oklch(0.68 0.13 75)",
  "oklch(0.55 0.06 300)",
];

function DepartmentPage() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [email, setEmail] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["dept-overview"],
    enabled: loggedIn,
    queryFn: () => getDepartmentData(),
  });
  const applications = data?.applications;
  const grievances = data?.grievances;
  const loadingApps = isLoading;
  const loadingGrv = isLoading;

  if (!loggedIn) {
    return (
      <div className="mx-auto flex max-w-md flex-col px-4 py-16">
        <Card className="shadow-none">
          <CardHeader className="items-center text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Building2 className="h-6 w-6" aria-hidden />
            </span>
            <CardTitle className="text-xl">Department Login</CardTitle>
            <p className="text-sm text-muted-foreground">
              For government department officials. Demo access — any email works.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="dept-email">Official email</Label>
              <Input
                id="dept-email"
                type="email"
                placeholder="officer@example.gov.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <Button
              className="w-full"
              onClick={() => {
                setLoggedIn(true);
                toast.success("Signed in to department dashboard (demo)");
              }}
            >
              <LogIn className="mr-2 h-4 w-4" aria-hidden /> Sign In
            </Button>
            <p className="text-center text-xs text-muted-foreground">
              Prototype demo login — no real credentials are verified.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const pending = applications?.filter((a) => a.status !== "Approved" && a.status !== "Rejected") ?? [];
  const openGrievances = grievances?.filter((g) => g.status !== "Resolved") ?? [];

  const demandByCategory = Object.entries(
    (applications ?? []).reduce<Record<string, number>>((acc, a) => {
      acc[a.category] = (acc[a.category] ?? 0) + 1;
      return acc;
    }, {}),
  ).map(([name, value]) => ({ name, value }));

  const grievanceStatusData = [
    { name: "High Priority", value: grievances?.filter((g) => g.priority === "High Priority" && g.status !== "Resolved").length ?? 0 },
    { name: "Normal", value: grievances?.filter((g) => g.priority === "Normal" && g.status !== "Resolved").length ?? 0 },
    { name: "Resolved", value: grievances?.filter((g) => g.status === "Resolved").length ?? 0 },
  ];

  const metrics = [
    { label: "Applications Today", value: "1,284" },
    { label: "Pending Verification", value: String(327 + pending.length) },
    { label: "Grievances Open", value: String(86 + openGrievances.length) },
    { label: "Average Resolution Time", value: "2.4 days" },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold">Service Delivery Dashboard</h1>
          <p className="mt-1 text-muted-foreground">
            Department of Women &amp; Child Development · Uttar Pradesh (demo)
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => {
            setLoggedIn(false);
            toast.success("Signed out");
          }}
        >
          <LogOut className="mr-2 h-4 w-4" aria-hidden /> Sign Out
        </Button>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((m) => (
          <Card key={m.label} className="shadow-none">
            <CardContent className="p-5">
              <p className="text-sm text-muted-foreground">{m.label}</p>
              <p className="mt-1 text-3xl font-bold text-primary">{m.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <Card className="shadow-none">
          <CardHeader>
            <CardTitle className="text-base">Application Volume</CardTitle>
          </CardHeader>
          <CardContent className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={VOLUME}>
                <XAxis dataKey="day" fontSize={12} />
                <YAxis fontSize={12} width={40} />
                <Tooltip />
                <Line type="monotone" dataKey="applications" stroke={CHART_COLORS[0]} strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="shadow-none">
          <CardHeader>
            <CardTitle className="text-base">Service Demand by Category</CardTitle>
          </CardHeader>
          <CardContent className="h-56">
            {demandByCategory.length === 0 ? (
              <Skeleton className="h-full w-full" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={demandByCategory}>
                  <XAxis dataKey="name" fontSize={11} />
                  <YAxis fontSize={12} width={30} allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {demandByCategory.map((_, i) => (
                      <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
        <Card className="shadow-none">
          <CardHeader>
            <CardTitle className="text-base">Grievance Status</CardTitle>
          </CardHeader>
          <CardContent className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={grievanceStatusData} dataKey="value" nameKey="name" innerRadius={45} outerRadius={75} label>
                  {grievanceStatusData.map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6 shadow-none">
        <CardHeader>
          <CardTitle className="text-base">Recent Applications</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loadingApps ? (
            <div className="p-6">
              <Skeleton className="h-32 w-full" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Application ID</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>District</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Updated</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(applications ?? []).map((a) => (
                  <TableRow key={a.id}>
                    <TableCell className="font-medium">{a.ref}</TableCell>
                    <TableCell>{a.service_name}</TableCell>
                    <TableCell>{a.district}</TableCell>
                    <TableCell>
                      <StatusBadge status={a.status} />
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(a.updated_at).toLocaleString("en-IN", {
                        day: "numeric",
                        month: "short",
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Card className="mt-6 shadow-none">
        <CardHeader>
          <CardTitle className="text-base">Grievance Panel</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loadingGrv ? (
            <div className="p-6">
              <Skeleton className="h-24 w-full" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Grievance ID</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(grievances ?? []).map((g) => (
                  <TableRow key={g.id}>
                    <TableCell className="font-medium">{g.ref}</TableCell>
                    <TableCell>{g.service}</TableCell>
                    <TableCell>{g.category}</TableCell>
                    <TableCell>
                      <StatusBadge status={g.priority} />
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={g.status} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ServiceCard } from "@/components/service-card";
import { CATEGORIES, SERVICES, STATES } from "@/lib/data";

export const Route = createFileRoute("/services/")({
  validateSearch: (search: Record<string, unknown>): { q?: string | undefined } => ({
    q: typeof search["q"] === "string" ? (search["q"] as string) : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Find Government Services — SevaSetu" },
      {
        name: "description",
        content:
          "Search and filter government schemes and public services by category, state and eligibility.",
      },
      { property: "og:title", content: "Find Government Services — SevaSetu" },
      {
        property: "og:description",
        content: "Discover public services and schemes you may be eligible for.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: ServicesPage,
});

function ServicesPage() {
  const { q } = Route.useSearch();
  const [query, setQuery] = useState(q ?? "");
  const [category, setCategory] = useState("all");
  const [state, setState] = useState("all");
  const [serviceType, setServiceType] = useState("all");

  const results = useMemo(() => {
    return SERVICES.filter((s) => {
      const qLower = query.trim().toLowerCase();
      const matchesQ =
        !qLower ||
        s.name.toLowerCase().includes(qLower) ||
        s.description.toLowerCase().includes(qLower) ||
        s.category.toLowerCase().includes(qLower);
      const matchesCat = category === "all" || s.category === category;
      return matchesQ && matchesCat;
    });
  }, [query, category]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-bold">Find Government Services</h1>
      <p className="mt-2 text-muted-foreground">
        Search and filter schemes and services. Demo catalogue — representative schemes for this
        prototype.
      </p>

      <div className="mt-6 grid gap-3 rounded-lg border bg-card p-4 md:grid-cols-4">
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <Input
            className="pl-9"
            placeholder="Search services…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search services"
          />
        </div>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger aria-label="Filter by category">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {CATEGORIES.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={state} onValueChange={setState}>
          <SelectTrigger aria-label="Filter by state">
            <SelectValue placeholder="State" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All states</SelectItem>
            {STATES.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={serviceType} onValueChange={setServiceType}>
          <SelectTrigger aria-label="Filter by service type">
            <SelectValue placeholder="Service type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All types</SelectItem>
            <SelectItem value="benefit">Financial benefit</SelectItem>
            <SelectItem value="certificate">Certificate / document</SelectItem>
            <SelectItem value="training">Training / support</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <p className="mt-6 text-sm text-muted-foreground" role="status">
        {results.length} service{results.length === 1 ? "" : "s"} found
      </p>

      {results.length === 0 ? (
        <div className="mt-6 rounded-lg border border-dashed bg-card p-10 text-center">
          <p className="font-medium">No services match your search</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Try a different keyword, or clear the category filter.
          </p>
        </div>
      ) : (
        <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {results.map((s) => (
            <ServiceCard key={s.id} service={s} />
          ))}
        </div>
      )}
    </div>
  );
}

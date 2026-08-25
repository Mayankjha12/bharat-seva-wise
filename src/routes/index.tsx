import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  Search,
  Compass,
  BookOpen,
  MousePointerClick,
  Radar,
  MessageCircleQuestion,
  Network,
  Tractor,
  GraduationCap,
  HeartPulse,
  Home as HomeIcon,
  Briefcase,
  FileText,
  Landmark,
  Baby,
  Users,
  Ear,
  Hand,
  Accessibility,
  Languages,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SevaSetu — Government services, made simpler" },
      {
        name: "description",
        content:
          "SevaSetu helps citizens of Bharat discover schemes and public services, understand eligibility, apply with guidance, and track applications — all in one place.",
      },
      { property: "og:title", content: "SevaSetu — Government services, made simpler" },
      {
        property: "og:description",
        content:
          "Discover, understand, access and track public services in one citizen-first platform.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: HomePage,
});

const POPULAR = [
  { label: "Pension", icon: Landmark },
  { label: "Scholarships", icon: GraduationCap },
  { label: "Healthcare", icon: HeartPulse },
  { label: "Housing", icon: HomeIcon },
  { label: "Employment", icon: Briefcase },
  { label: "Documents", icon: FileText },
  { label: "Agriculture", icon: Tractor },
  { label: "Women & Child Welfare", icon: Baby },
];

const HOW_IT_HELPS = [
  { title: "DISCOVER", desc: "Find schemes and services based on your needs.", icon: Compass },
  { title: "UNDERSTAND", desc: "Get simple explanations of eligibility, documents and procedures.", icon: BookOpen },
  { title: "ACCESS", desc: "Get guided support for applications and documentation.", icon: MousePointerClick },
  { title: "TRACK", desc: "Follow your application from submission to decision.", icon: Radar },
  { title: "ASSIST", desc: "Get help with questions, navigation and grievances.", icon: MessageCircleQuestion },
  { title: "CONNECT", desc: "Reach the appropriate government department or service.", icon: Network },
];

const FOR_EVERYONE = [
  { title: "Rural Citizens", desc: "Access services without visiting multiple offices.", icon: Tractor },
  { title: "Senior Citizens", desc: "Simple navigation and assisted service discovery.", icon: Users },
  { title: "People with Disabilities", desc: "Accessible controls and voice-assisted navigation.", icon: Accessibility },
  { title: "Low Digital Literacy", desc: "Step-by-step guidance in simple language.", icon: Hand },
  { title: "Multiple Languages", desc: "Access information in familiar languages.", icon: Languages },
  { title: "Assisted Access", desc: "Clear audio-visual guidance for every step.", icon: Ear },
];

function HomePage() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  function search() {
    navigate({ to: "/services", search: query ? { q: query } : {} });
  }

  return (
    <div>
      {/* Hero */}
      <section className="border-b bg-card">
        <div className="mx-auto max-w-6xl px-4 py-16 md:py-24">
          <p className="text-sm font-semibold uppercase tracking-wide text-success">
            One platform · Multiple public services · Simpler citizen experience
          </p>
          <h1 className="mt-3 max-w-2xl text-4xl font-bold leading-tight text-foreground md:text-5xl">
            Government services, made simpler.
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            Discover schemes and public services you may be eligible for, understand what you
            need, and track your applications — all in one place.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Button size="lg" onClick={() => navigate({ to: "/services" })}>
              Find Services
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate({ to: "/track" })}>
              Track Application
            </Button>
          </div>

          <div className="mt-10 max-w-2xl">
            <label htmlFor="hero-search" className="text-sm font-medium">
              What government service are you looking for?
            </label>
            <div className="mt-2 flex gap-2">
              <div className="relative flex-1">
                <Search
                  className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                  aria-hidden
                />
                <Input
                  id="hero-search"
                  className="h-12 pl-9 text-base"
                  placeholder="Search for pension, scholarship, ration card, health scheme..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && search()}
                />
              </div>
              <Button className="h-12 px-6" onClick={search}>
                Search
              </Button>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {POPULAR.map((p) => (
                <Link key={p.label} to="/services">
                  <span className="inline-flex items-center gap-1.5 rounded-full border bg-background px-3 py-1.5 text-sm text-foreground hover:border-primary hover:text-primary">
                    <p.icon className="h-3.5 w-3.5" aria-hidden />
                    {p.label}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How SevaSetu Helps */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-2xl font-bold md:text-3xl">How SevaSetu Helps</h2>
        <p className="mt-2 max-w-xl text-muted-foreground">
          From discovery to delivery — one guided journey for every citizen.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {HOW_IT_HELPS.map((item) => (
            <Card key={item.title} className="shadow-none">
              <CardContent className="p-5">
                <span className="flex h-10 w-10 items-center justify-center rounded-md bg-secondary text-primary">
                  <item.icon className="h-5 w-5" aria-hidden />
                </span>
                <h3 className="mt-4 text-sm font-bold tracking-wide">{item.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{item.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Designed for Everyone */}
      <section className="border-t bg-muted/60">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="text-2xl font-bold md:text-3xl">Designed for Everyone</h2>
          <p className="mt-2 max-w-xl text-muted-foreground">
            Built for Bharat — accessible to every citizen, regardless of location, age, ability
            or digital literacy.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FOR_EVERYONE.map((item) => (
              <Card key={item.title} className="shadow-none">
                <CardContent className="flex items-start gap-3 p-5">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-accent text-accent-foreground">
                    <item.icon className="h-5 w-5" aria-hidden />
                  </span>
                  <div>
                    <h3 className="text-sm font-semibold">{item.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <p className="mt-6 text-sm text-muted-foreground">
            Accessibility controls — text size, high contrast, voice assistance and language
            selection — are available in the header on every page.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t bg-primary">
        <div className="mx-auto max-w-6xl px-4 py-14 text-center">
          <h2 className="text-2xl font-bold text-primary-foreground md:text-3xl">
            Start with the services meant for you
          </h2>
          <p className="mx-auto mt-2 max-w-lg text-primary-foreground/80">
            Answer four simple questions and see which schemes you may be eligible for.
          </p>
          <Button
            size="lg"
            variant="secondary"
            className="mt-6"
            onClick={() => navigate({ to: "/eligibility" })}
          >
            Check Your Eligibility
          </Button>
        </div>
      </section>
    </div>
  );
}

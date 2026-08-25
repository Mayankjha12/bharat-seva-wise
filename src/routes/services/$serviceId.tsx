import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { BookmarkPlus, Clock, FileText, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { StatusTimeline } from "@/components/status-timeline";
import { getService } from "@/lib/data";
import { toast } from "sonner";

export const Route = createFileRoute("/services/$serviceId")({
  loader: ({ params }) => {
    const service = getService(params.serviceId);
    if (!service) throw notFound();
    return service;
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.name ?? "Service"} — SevaSetu` },
      { name: "description", content: loaderData?.description ?? "" },
      { property: "og:title", content: `${loaderData?.name ?? "Service"} — SevaSetu` },
      { property: "og:description", content: loaderData?.description ?? "" },
      { property: "og:type", content: "website" },
    ],
  }),
  component: ServiceDetailPage,
});

function ServiceDetailPage() {
  const service = Route.useLoaderData();
  const navigate = useNavigate();

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <Badge variant="secondary">{service.category}</Badge>
      <h1 className="mt-3 text-3xl font-bold">{service.name}</h1>
      <p className="mt-3 max-w-2xl text-lg text-muted-foreground">{service.description}</p>

      <div className="mt-6 flex flex-wrap gap-3">
        <Button onClick={() => navigate({ to: "/apply/$serviceId", params: { serviceId: service.id } })}>
          Start Application
        </Button>
        <Button
          variant="outline"
          onClick={() => toast.success("Saved to your list (demo). Sign in to keep it synced.")}
        >
          <BookmarkPlus className="mr-2 h-4 w-4" aria-hidden /> Save for Later
        </Button>
        <Button variant="ghost" asChild>
          <Link to="/eligibility">Check Eligibility</Link>
        </Button>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <Card className="shadow-none">
          <CardHeader>
            <CardTitle className="text-base">Who can apply</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p className="text-muted-foreground">{service.eligibility}</p>
            <ul className="space-y-1.5">
              {service.eligibilityCriteria.map((c) => (
                <li key={c} className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" aria-hidden />
                  {c}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="shadow-none">
          <CardHeader>
            <CardTitle className="text-base">Required documents</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              {service.documents.map((d) => (
                <li key={d} className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" aria-hidden />
                  {d}
                </li>
              ))}
            </ul>
            <p className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" aria-hidden /> Estimated processing:{" "}
              <span className="font-medium text-foreground">{service.processingTime}</span>
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6 shadow-none">
        <CardHeader>
          <CardTitle className="text-base">Benefits</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">{service.benefits}</CardContent>
      </Card>

      <Card className="mt-6 shadow-none">
        <CardHeader>
          <CardTitle className="text-base">Application process &amp; timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-5 text-sm text-muted-foreground">
            Application method: {service.applicationMethod}
          </p>
          <StatusTimeline
            steps={service.steps.map((label, i) => ({
              label,
              state: i === 0 ? "current" : "pending",
            }))}
          />
        </CardContent>
      </Card>

      <div className="mt-6">
        <h2 className="text-xl font-bold">Frequently asked questions</h2>
        <Accordion type="single" collapsible className="mt-3">
          {service.faqs.map((f, i) => (
            <AccordionItem key={i} value={`faq-${i}`}>
              <AccordionTrigger className="text-left text-sm font-medium">{f.q}</AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      <p className="mt-8 rounded-md border bg-muted px-4 py-3 text-xs text-muted-foreground">
        Prototype demo data. This page describes a representative scheme and is not connected to
        any live government system.
      </p>
    </div>
  );
}

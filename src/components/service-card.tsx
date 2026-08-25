import { Link } from "@tanstack/react-router";
import { Clock, FileText, ChevronRight } from "lucide-react";
import type { Service } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export function ServiceCard({ service }: { service: Service }) {
  return (
    <Card className="flex h-full flex-col shadow-none">
      <CardHeader className="pb-3">
        <Badge variant="secondary" className="w-fit">{service.category}</Badge>
        <CardTitle className="text-lg leading-snug">{service.name}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 space-y-3 text-sm">
        <p className="text-muted-foreground">{service.description}</p>
        <p className="text-foreground">
          <span className="font-medium">Eligibility: </span>
          {service.eligibility}
        </p>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <FileText className="h-3.5 w-3.5" aria-hidden />
            {service.documents.length} documents
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" aria-hidden />
            {service.processingTime}
          </span>
        </div>
      </CardContent>
      <CardFooter className="gap-2">
        <Button asChild size="sm">
          <Link to="/services/$serviceId" params={{ serviceId: service.id }}>
            Check Eligibility
          </Link>
        </Button>
        <Button asChild variant="ghost" size="sm">
          <Link to="/services/$serviceId" params={{ serviceId: service.id }}>
            Details <ChevronRight className="ml-1 h-4 w-4" aria-hidden />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

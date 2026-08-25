import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Landmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { signInDemo } from "@/lib/citizen";
import { toast } from "sonner";

export const Route = createFileRoute("/sign-in")({
  head: () => ({
    meta: [
      { title: "Sign In — SevaSetu" },
      { name: "description", content: "Sign in to your SevaSetu citizen account (demo)." },
      { property: "og:title", content: "Sign In — SevaSetu" },
      { property: "og:description", content: "Citizen sign-in for the SevaSetu prototype." },
      { property: "og:type", content: "website" },
    ],
  }),
  component: SignInPage,
});

function SignInPage() {
  const navigate = useNavigate();

  return (
    <div className="mx-auto flex max-w-md flex-col px-4 py-16">
      <Card className="shadow-none">
        <CardHeader className="items-center text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Landmark className="h-6 w-6" aria-hidden />
          </span>
          <CardTitle className="text-xl">Sign in to SevaSetu</CardTitle>
          <p className="text-sm text-muted-foreground">
            Continue with the demo citizen profile to explore the full experience.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            className="w-full"
            onClick={() => {
              signInDemo();
              toast.success("Signed in as Priya Sharma (demo)");
              navigate({ to: "/dashboard" });
            }}
          >
            Continue as Priya Sharma (Demo Citizen)
          </Button>
          <p className="text-center text-xs text-muted-foreground">
            Prototype sign-in — no passwords, Aadhaar or personal data are collected. Your
            information is used only to demonstrate the service experience in this prototype.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

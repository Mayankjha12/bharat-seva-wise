import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { CheckCircle2, AlertCircle, FileText, ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { STATES } from "@/lib/data";

export const Route = createFileRoute("/eligibility")({
  head: () => ({
    meta: [
      { title: "Check Your Eligibility — SevaSetu" },
      {
        name: "description",
        content:
          "Answer four simple questions to get an indicative eligibility assessment for government schemes.",
      },
      { property: "og:title", content: "Check Your Eligibility — SevaSetu" },
      {
        property: "og:description",
        content: "Indicative eligibility assessment for public services and schemes.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: EligibilityPage,
});

const STEPS = [
  {
    key: "age",
    question: "What is your age group?",
    options: ["Under 18", "18–30", "31–59", "60+"],
  },
  { key: "state", question: "Which state do you live in?", options: null },
  {
    key: "employment",
    question: "Employment status?",
    options: ["Student", "Employed", "Self-employed", "Unemployed", "Other"],
  },
  {
    key: "income",
    question: "Household income range?",
    options: ["Below ₹1 lakh", "₹1–3 lakh", "₹3–5 lakh", "Above ₹5 lakh"],
  },
] as const;

function EligibilityPage() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<{ age?: string; state?: string; employment?: string; income?: string }>({});
  const [done, setDone] = useState(false);
  const navigate = useNavigate();

  const current = STEPS[step]!;
  const value = answers[current.key] ?? "";
  const canNext = value !== "";

  if (done) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12">
        <Card className="shadow-none">
          <CardHeader className="border-b bg-accent/60">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-8 w-8 text-success" aria-hidden />
              <div>
                <CardTitle>Eligibility Assessment</CardTitle>
                <p className="mt-1 text-sm font-medium text-success">Likely Eligible</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 p-6">
            <p className="text-sm text-muted-foreground">
              You appear to meet the basic eligibility criteria based on the information provided.
            </p>

            <div>
              <h3 className="text-sm font-semibold">Criteria you meet</h3>
              <ul className="mt-2 space-y-1.5 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 text-success" aria-hidden />
                  Age group {answers["age"]} fits supported schemes
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 text-success" aria-hidden />
                  Resident of {answers["state"]}
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 text-success" aria-hidden />
                  Household income ({answers["income"]}) within common scheme limits
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold">Information still needed</h3>
              <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <AlertCircle className="mt-0.5 h-4 w-4 text-warning" aria-hidden />
                  District and block details for scheme mapping
                </li>
                <li className="flex items-start gap-2">
                  <AlertCircle className="mt-0.5 h-4 w-4 text-warning" aria-hidden />
                  Document verification during application
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold">Documents to keep ready</h3>
              <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">
                {["Identity proof", "Address proof", "Income certificate", "Education documents"].map(
                  (d) => (
                    <li key={d} className="flex items-center gap-2">
                      <FileText className="h-4 w-4" aria-hidden />
                      {d}
                    </li>
                  ),
                )}
              </ul>
            </div>

            <div className="rounded-md border bg-muted p-4 text-sm">
              <p className="font-medium">Next steps</p>
              <ol className="mt-1 list-decimal space-y-1 pl-5 text-muted-foreground">
                <li>Review recommended schemes for your profile</li>
                <li>Start a guided application with the Application Assistant</li>
                <li>Track your application after submission</li>
              </ol>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button onClick={() => navigate({ to: "/apply/$serviceId", params: { serviceId: "edu-scholarship" } })}>
                Start Application <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
              </Button>
              <Button variant="outline" onClick={() => navigate({ to: "/dashboard" })}>
                View Recommendations
              </Button>
            </div>

            <p className="rounded-md border border-warning/40 bg-warning/10 px-4 py-3 text-xs text-foreground">
              This is an indicative demo assessment and not an official government eligibility
              decision.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-3xl font-bold">Check Your Eligibility</h1>
      <p className="mt-2 text-muted-foreground">
        Four simple questions. No documents needed at this stage.
      </p>

      <div className="mt-6">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium">
            Step {step + 1} of {STEPS.length}
          </span>
          <span className="text-muted-foreground">{Math.round(((step + 1) / STEPS.length) * 100)}%</span>
        </div>
        <Progress value={((step + 1) / STEPS.length) * 100} className="mt-2" />
      </div>

      <Card className="mt-6 shadow-none">
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold">{current.question}</h2>

          {current.options ? (
            <RadioGroup
              className="mt-4 space-y-2"
              value={value}
              onValueChange={(v) => setAnswers((a) => ({ ...a, [current.key]: v }))}
            >
              {current.options.map((opt) => (
                <Label
                  key={opt}
                  className="flex cursor-pointer items-center gap-3 rounded-md border px-4 py-3 text-sm font-normal hover:bg-secondary has-checked:border-primary has-checked:bg-secondary"
                >
                  <RadioGroupItem value={opt} />
                  {opt}
                </Label>
              ))}
            </RadioGroup>
          ) : (
            <Select
              value={value}
              onValueChange={(v) => setAnswers((a) => ({ ...a, [current.key]: v }))}
            >
              <SelectTrigger className="mt-4" aria-label="Select your state">
                <SelectValue placeholder="Select your state" />
              </SelectTrigger>
              <SelectContent>
                {STATES.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          <div className="mt-6 flex justify-between">
            <Button
              variant="outline"
              disabled={step === 0}
              onClick={() => setStep((s) => s - 1)}
            >
              <ArrowLeft className="mr-2 h-4 w-4" aria-hidden /> Back
            </Button>
            {step < STEPS.length - 1 ? (
              <Button disabled={!canNext} onClick={() => setStep((s) => s + 1)}>
                Next <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
              </Button>
            ) : (
              <Button disabled={!canNext} onClick={() => setDone(true)}>
                See Result <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

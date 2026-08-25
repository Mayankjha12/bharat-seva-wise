"use client";

import { useEffect, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { MessageSquare, X, Send, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getCitizen } from "@/lib/citizen";
import { SARVAM_INTEGRATION_ENABLED } from "@/lib/sarvam";
import { cn } from "@/lib/utils";

/**
 * SevaSetu AI Citizen Assistant — scripted prototype responses.
 * No external LLM API is called. Multilingual & voice input are Sarvam AI
 * integration points (see src/lib/sarvam.ts) and fall back gracefully.
 */

interface Msg {
  from: "user" | "bot";
  text: string;
  actions?: { label: string; to: string }[];
}

const QUICK_ACTIONS = [
  { label: "Find a Scheme", to: "/services" },
  { label: "Check Eligibility", to: "/eligibility" },
  { label: "Track Application", to: "/track" },
  { label: "Raise Grievance", to: "/grievances" },
];

function scriptedReply(input: string): Msg {
  const q = input.toLowerCase();
  if (q.includes("educat") || q.includes("scholar") || q.includes("study") || q.includes("student")) {
    return {
      from: "bot",
      text: "I can help with that. Based on your profile, I found 3 education-related services. Would you like to check scholarship eligibility first?",
      actions: [
        { label: "Check Scholarship", to: "/eligibility" },
        { label: "View All Services", to: "/services" },
      ],
    };
  }
  if (q.includes("track") || q.includes("status") || q.includes("application")) {
    return {
      from: "bot",
      text: "You can track any application with its reference ID (for example, the demo ID SV-2026-10482). Your most recent application, Education Scholarship Support, is currently Under Verification.",
      actions: [{ label: "Track Application", to: "/track" }],
    };
  }
  if (q.includes("grievance") || q.includes("complaint") || q.includes("delay") || q.includes("problem")) {
    return {
      from: "bot",
      text: "I'm sorry you're facing an issue. You can raise a grievance under categories like Application Delay or Document Issue. It will be assigned to the concerned department.",
      actions: [{ label: "Raise Grievance", to: "/grievances" }],
    };
  }
  if (q.includes("pension") || q.includes("senior")) {
    return {
      from: "bot",
      text: "Senior Citizen Support provides a monthly pension for citizens aged 60+ meeting income criteria. Processing takes about 30–45 working days.",
      actions: [{ label: "View Service", to: "/services/senior-support" }],
    };
  }
  if (q.includes("health") || q.includes("hospital") || q.includes("medical")) {
    return {
      from: "bot",
      text: "Health Coverage Assistance offers cashless hospitalisation for eligible households at empaneled hospitals, usually processed in 7–15 working days.",
      actions: [{ label: "View Service", to: "/services/health-coverage" }],
    };
  }
  if (q.includes("hello") || q.includes("namaste") || q.includes("hi")) {
    return {
      from: "bot",
      text: "Namaste! How can I help you today — finding a scheme, checking eligibility, tracking an application, or raising a grievance?",
      actions: QUICK_ACTIONS,
    };
  }
  return {
    from: "bot",
    text: "I can help you discover schemes, understand eligibility, track applications and raise grievances. Could you tell me a little more about what you need?",
    actions: QUICK_ACTIONS,
  };
}

export function AssistantWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Msg[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([
        {
          from: "bot",
          text: `Namaste ${getCitizen().firstName}! I can help you find government services, understand eligibility, track applications or raise a grievance.`,
          actions: QUICK_ACTIONS,
        },
      ]);
    }
  }, [open, messages.length]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  function send(text?: string) {
    const content = (text ?? input).trim();
    if (!content) return;
    setInput("");
    setMessages((m) => [...m, { from: "user", text: content }]);
    window.setTimeout(() => {
      setMessages((m) => [...m, scriptedReply(content)]);
    }, 600);
  }

  return (
    <>
      <Button
        className="fixed bottom-5 right-5 z-50 h-12 rounded-full px-5 shadow-md"
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close SevaSetu Assistant" : "Open SevaSetu Assistant"}
      >
        {open ? <X className="mr-2 h-4 w-4" /> : <MessageSquare className="mr-2 h-4 w-4" />}
        SevaSetu Assistant
      </Button>

      {open && (
        <div
          role="dialog"
          aria-label="SevaSetu Assistant chat"
          className="fixed bottom-20 right-5 z-50 flex h-[480px] w-[min(92vw,380px)] flex-col overflow-hidden rounded-lg border bg-card shadow-lg"
        >
          <div className="border-b bg-primary px-4 py-3">
            <p className="text-sm font-semibold text-primary-foreground">SevaSetu Assistant</p>
            <p className="text-xs text-primary-foreground/75">
              Prototype assistant · scripted responses
            </p>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto p-4">
            {messages.map((m, i) => (
              <div key={i} className={cn("flex", m.from === "user" ? "justify-end" : "justify-start")}>
                <div
                  className={cn(
                    "max-w-[85%] rounded-lg px-3 py-2 text-sm",
                    m.from === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground",
                  )}
                >
                  <p>{m.text}</p>
                  {m.actions && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {m.actions.map((a) => (
                        <Button
                          key={a.label}
                          size="sm"
                          variant="outline"
                          className="h-7 bg-card text-xs"
                          onClick={() => {
                            setOpen(false);
                            navigate({ to: a.to });
                          }}
                        >
                          {a.label}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          <div className="flex items-center gap-2 border-t p-3">
            <Button
              variant="outline"
              size="icon"
              aria-label="Voice input (Sarvam AI integration planned)"
              onClick={() =>
                setMessages((m) => [
                  ...m,
                  {
                    from: "bot",
                    text: SARVAM_INTEGRATION_ENABLED
                      ? "Listening…"
                      : "Voice input will be enabled with Sarvam AI speech services in a future update. Please type your question for now.",
                  },
                ])
              }
            >
              <Mic className="h-4 w-4" />
            </Button>
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Type your question…"
              aria-label="Message the assistant"
            />
            <Button size="icon" onClick={() => send()} aria-label="Send message">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </>
  );
}

"use client";

import { Link, useNavigate } from "@tanstack/react-router";
import {
  Landmark,
  Menu,
  Accessibility,
  Languages,
  Type,
  Contrast,
  Volume2,
  LogOut,
  LayoutDashboard,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useCitizenSession, signOutDemo } from "@/lib/citizen";
import { SUPPORTED_LANGUAGES, SARVAM_INTEGRATION_ENABLED } from "@/lib/sarvam";
import { toast } from "sonner";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/services", label: "Find Services" },
  { to: "/track", label: "Track Application" },
  { to: "/grievances", label: "Grievances" },
] as const;

function toggleClass(cls: string, label: string) {
  const el = document.documentElement;
  el.classList.toggle(cls);
  const on = el.classList.contains(cls);
  toast.success(`${label} ${on ? "enabled" : "disabled"}`);
}

export function SiteHeader() {
  const { signedIn } = useCitizenSession();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b bg-card">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4">
        <Link to="/" className="flex items-center gap-2" aria-label="SevaSetu home">
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Landmark className="h-5 w-5" aria-hidden />
          </span>
          <span className="text-lg font-bold tracking-tight text-primary">SEVASETU</span>
        </Link>

        <nav className="ml-6 hidden items-center gap-1 md:flex" aria-label="Primary">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="rounded-md px-3 py-2 text-sm font-medium text-foreground hover:bg-secondary"
              activeProps={{ className: "bg-secondary text-primary" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          {/* Language selection — Sarvam AI placeholder powers real translation later */}
          <Select
            defaultValue="en"
            onValueChange={(v) => {
              if (v !== "en" && !SARVAM_INTEGRATION_ENABLED) {
                toast.info(
                  "Full translation will be powered by Sarvam AI. Integration is planned — this prototype shows English content.",
                );
              }
            }}
          >
            <SelectTrigger className="h-9 w-[130px]" aria-label="Select language">
              <Languages className="mr-1 h-4 w-4" aria-hidden />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SUPPORTED_LANGUAGES.map((l) => (
                <SelectItem key={l.code} value={l.code}>
                  {l.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" aria-label="Accessibility options">
                <Accessibility className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              <DropdownMenuLabel>Accessibility</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => toggleClass("a11y-large-text", "Larger text")}>
                <Type className="mr-2 h-4 w-4" /> Larger text
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => toggleClass("a11y-contrast", "High contrast")}>
                <Contrast className="mr-2 h-4 w-4" /> High contrast
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  toast.info(
                    "Voice assistance will be powered by Sarvam AI speech services. Integration is planned for this prototype.",
                  )
                }
              >
                <Volume2 className="mr-2 h-4 w-4" /> Voice assistance
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {signedIn ? (
            <>
              <Button variant="outline" size="sm" onClick={() => navigate({ to: "/dashboard" })}>
                <LayoutDashboard className="mr-1 h-4 w-4" /> Dashboard
              </Button>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Sign out"
                onClick={() => {
                  signOutDemo();
                  toast.success("Signed out");
                  navigate({ to: "/" });
                }}
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <Button size="sm" onClick={() => navigate({ to: "/sign-in" })}>
              Sign In
            </Button>
          )}

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden" aria-label="Open menu">
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <nav className="mt-8 flex flex-col gap-1" aria-label="Mobile">
                {NAV.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setOpen(false)}
                    className="rounded-md px-3 py-2.5 text-base font-medium hover:bg-secondary"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

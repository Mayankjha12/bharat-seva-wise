import { Link } from "@tanstack/react-router";
import { Landmark, ShieldCheck } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="border-t bg-card">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <Landmark className="h-4 w-4" aria-hidden />
              </span>
              <span className="font-bold text-primary">SEVASETU</span>
            </div>
            <p className="mt-3 max-w-xs text-sm text-muted-foreground">
              One place to discover, access and track public services. Built for the
              &ldquo;Inclusive Innovation for Bharat&rdquo; GovTech challenge.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold">Platform</h3>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li><Link to="/services" className="hover:text-primary">Find Services</Link></li>
              <li><Link to="/eligibility" className="hover:text-primary">Check Eligibility</Link></li>
              <li><Link to="/track" className="hover:text-primary">Track Application</Link></li>
              <li><Link to="/grievances" className="hover:text-primary">Grievances &amp; Support</Link></li>
              <li><Link to="/department" className="hover:text-primary">Department Login</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold">Privacy</h3>
            <p className="mt-3 flex items-start gap-2 text-sm text-muted-foreground">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-success" aria-hidden />
              Your information is used only to demonstrate the service experience in this
              prototype. No real personal data is collected.
            </p>
          </div>
        </div>
        <div className="mt-8 border-t pt-6 text-xs text-muted-foreground">
          SevaSetu is a hackathon prototype. All schemes, identifiers and statuses shown are demo
          data and are not connected to live government systems.
        </div>
      </div>
    </footer>
  );
}

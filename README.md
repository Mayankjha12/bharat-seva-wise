# SevaSetu

**One place to discover, access and track public services.**

SevaSetu is an AI-powered, citizen-centric public service delivery platform built for the
**"Inclusive Innovation for Bharat"** challenge (GovTech & Public Service Delivery track).

> **Prototype notice:** SevaSetu is a hackathon prototype. All schemes, application IDs and
> statuses are demo data. It is not connected to any live government system.

---

## Problem Statement

Despite rapid digitalisation, citizens still face:

- Limited access to essential public services
- Complex, fragmented service delivery across departments
- Lack of awareness about government schemes
- Digital literacy and accessibility barriers
- Long processing and verification cycles
- Difficulty reaching the correct government department
- Limited transparency in application and grievance processes

Digital services exist — but **accessibility, discoverability, simplicity and last-mile
delivery** remain the real gap.

## Solution

A unified citizen-centric digital ecosystem built around six pillars:

| Pillar | What it does |
| --- | --- |
| **DISCOVER** | Identify relevant schemes and services based on citizen needs |
| **UNDERSTAND** | Explain eligibility, requirements and procedures in simple language |
| **ACCESS** | Guide citizens through applications and documentation |
| **TRACK** | Transparent application status from submission to decision |
| **ASSIST** | AI-powered help for queries, navigation and grievances |
| **CONNECT** | Route citizens to the right department or service |

**One platform → Multiple public services → Simpler citizen experience**

## Features

- **Service discovery** — searchable, filterable catalogue of schemes across 8 categories
- **Personalized recommendations** — based on the citizen's demo profile
- **Eligibility checker** — 4-step guided flow with an indicative assessment
- **Application Assistant** — 5-step guided application with document checklist
- **Application tracking** — live status timeline by application ID (persisted in backend)
- **Grievances** — raise and track grievances with category and priority (persisted in backend)
- **SevaSetu Assistant** — floating AI-style chat with scripted prototype responses (no external LLM)
- **Department dashboard** — service delivery metrics, charts, recent applications, grievance panel
- **Accessibility** — larger text, high contrast, language selector, voice-assistance entry point
- **Sarvam AI integration point** — clearly marked placeholder module (`src/lib/sarvam.ts`) for
  multilingual translation and voice (speech-to-text / text-to-speech). **Not yet integrated**;
  no API key is configured.

## Technology Stack

- **Framework:** TanStack Start (React 19 + TypeScript, file-based routing, SSR) — the
  Next.js-equivalent full-stack framework supported by this project's platform
- **Styling:** Tailwind CSS v4 with a semantic design-token system (`src/styles.css`)
- **Components:** shadcn/ui + Radix primitives
- **Icons:** Lucide React
- **Charts:** Recharts
- **Backend / database:** Lovable Cloud (Postgres + row-level security) — applications and
  grievances are persisted; the scheme catalogue is static demo data (`src/lib/data.ts`)

## Project Structure

```
src/
  routes/            # File-based routes (/, /services, /services/$id, /eligibility,
                     # /apply/$id, /track, /grievances, /dashboard, /department, /sign-in)
  components/        # Header, footer, service card, status badge/timeline, assistant widget
  lib/
    data.ts          # Static demo catalogue of schemes (mock government data)
    types.ts         # Shared TypeScript types
    citizen.ts       # Demo citizen session (localStorage, prototype only)
    sarvam.ts        # Sarvam AI integration point — PLACEHOLDER, not connected
  styles.css         # Design system tokens (navy primary, green accents)
```

## Demo Flow

1. **Home** → Find Services
2. Select **Education Scholarship Support**
3. **Check Eligibility** → indicative result ("Likely Eligible")
4. **Start Application** → guided steps → **Submit**
5. Application ID generated (e.g. `SV-2026-10482`)
6. **Track Application** → live status timeline
7. **Raise Grievance** → grievance ID (e.g. `GRV-2026-00842`)
8. **Department Dashboard** → new application + grievance visible with metrics and charts

## Setup

```bash
bun install        # or npm install
bun run dev        # starts the dev server
```

Production build:

```bash
bun run build
bun run preview
```

## Environment Variables

The Lovable Cloud backend connection is provisioned automatically by the platform
(`VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY` in the generated `.env`). No additional
secrets are required.

When integrating Sarvam AI later, add a **server-side** secret `SARVAM_API_KEY` and implement
the stubs in `src/lib/sarvam.ts` — never expose the key to the browser.

## Demo Access

- **Citizen:** click "Sign In" → "Continue as Priya Sharma (Demo Citizen)"
- **Department:** "Department Login" → any email (demo access)

## Prototype Limitations

- Scheme catalogue is static demo data, not live government APIs
- Citizen sign-in is a demo profile; no real authentication, Aadhaar or personal data
- Document uploads are simulated; no files are stored
- The AI assistant uses scripted responses (no external LLM call)
- Sarvam AI multilingual/voice layer is a marked placeholder, not yet integrated
- Database policies are intentionally permissive for demo purposes — not production-grade

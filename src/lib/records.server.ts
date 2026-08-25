import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { getService } from "./data";

/**
 * Server-only data access for citizen records (applications & grievances).
 *
 * The database tables are default-deny for anon/authenticated roles: every
 * read and write goes through these validated helpers running with the
 * service role inside server functions.
 *
 * Ownership model (prototype): each browser session gets an unguessable
 * random UUID ("citizen key") stored in localStorage. Records are only
 * returned when the caller supplies the matching key — it acts as a
 * capability token. Public surfaces (tracking, department dashboard) only
 * ever receive non-PII projections.
 */

/** Well-known id of the seeded demo fixture rows (safe to show anyone). */
export const DEMO_CITIZEN_ID = "demo-priya";

const citizenKeySchema = z
  .string()
  .trim()
  .min(8)
  .max(64)
  .regex(/^[A-Za-z0-9-]+$/, "Invalid citizen key");

export const applicationInputSchema = z.object({
  citizenKey: citizenKeySchema,
  citizenName: z.string().trim().min(2).max(100),
  serviceId: z.string().trim().min(1).max(60),
  district: z.string().trim().min(1).max(100),
  state: z.string().trim().min(1).max(100),
  ageGroup: z.string().trim().max(30),
  employment: z.string().trim().max(50),
  income: z.string().trim().max(50),
  documentsConfirmed: z.array(z.string().max(120)).max(20),
});

export const grievanceInputSchema = z.object({
  citizenKey: citizenKeySchema,
  citizenName: z.string().trim().min(2).max(100),
  service: z.string().trim().min(1).max(160),
  category: z.string().trim().min(1).max(80),
  description: z.string().trim().min(10).max(2000),
});

export const refSchema = z
  .string()
  .trim()
  .toUpperCase()
  .regex(/^(SV|GRV)-2026-[A-Z0-9]{5}$/, "Invalid reference ID");

/** Unguessable reference IDs (5 random Crockford-ish chars, ~28 bits). */
export function makeRef(prefix: "SV" | "GRV"): string {
  const chars = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
  const buf = new Uint32Array(5);
  crypto.getRandomValues(buf);
  let suffix = "";
  for (const v of buf) suffix += chars[v % chars.length];
  return `${prefix}-2026-${suffix}`;
}

export type ApplicationInput = z.infer<typeof applicationInputSchema>;
export type GrievanceInput = z.infer<typeof grievanceInputSchema>;

export async function insertApplication(input: ApplicationInput) {
  const service = getService(input.serviceId);
  if (!service) throw new Error("Unknown service");
  const ref = makeRef("SV");
  const { error } = await supabaseAdmin.from("applications").insert({
    ref,
    citizen_id: input.citizenKey,
    citizen_name: input.citizenName,
    service_id: service.id,
    service_name: service.name,
    category: service.category,
    district: input.district,
    state: input.state,
    status: "Submitted",
    details: {
      age_group: input.ageGroup,
      employment: input.employment,
      income: input.income,
      documents_confirmed: input.documentsConfirmed,
    },
  });
  if (error) {
    console.error("insertApplication failed:", error.message);
    throw new Error("Could not submit the application");
  }
  return { ref };
}

export async function insertGrievance(input: GrievanceInput) {
  const ref = makeRef("GRV");
  const { data, error } = await supabaseAdmin
    .from("grievances")
    .insert({
      ref,
      citizen_id: input.citizenKey,
      citizen_name: input.citizenName,
      service: input.service,
      category: input.category,
      description: input.description,
      status: "Assigned to Department",
      priority: "Normal",
    })
    .select("id, ref, service, category, status, priority, created_at")
    .single();
  if (error) {
    console.error("insertGrievance failed:", error.message);
    throw new Error("Could not submit the grievance");
  }
  return data;
}

/** Public tracking lookup — non-PII projection only (no name, no details). */
export async function findApplicationByRef(ref: string) {
  const { data, error } = await supabaseAdmin
    .from("applications")
    .select("id, ref, service_id, service_name, district, state, status, updated_at")
    .eq("ref", ref)
    .maybeSingle();
  if (error) {
    console.error("findApplicationByRef failed:", error.message);
    throw new Error("Lookup failed");
  }
  return data;
}

/** Citizen-scoped lists — requires the caller's unguessable citizen key. */
export async function listCitizenRecords(citizenKey: string) {
  const ids =
    citizenKey === DEMO_CITIZEN_ID ? [DEMO_CITIZEN_ID] : [citizenKey, DEMO_CITIZEN_ID];
  const [apps, grvs] = await Promise.all([
    supabaseAdmin
      .from("applications")
      .select("id, ref, service_id, service_name, district, state, status, created_at, updated_at")
      .in("citizen_id", ids)
      .order("created_at", { ascending: false }),
    supabaseAdmin
      .from("grievances")
      .select("id, ref, service, category, status, priority, created_at")
      .in("citizen_id", ids)
      .order("created_at", { ascending: false }),
  ]);
  if (apps.error || grvs.error) {
    console.error("listCitizenRecords failed:", apps.error?.message, grvs.error?.message);
    throw new Error("Could not load records");
  }
  return { applications: apps.data ?? [], grievances: grvs.data ?? [] };
}

/** Department dashboard — operational, non-PII projection (no names/descriptions). */
export async function getDepartmentOverview() {
  const [apps, grvs] = await Promise.all([
    supabaseAdmin
      .from("applications")
      .select("id, ref, service_name, category, district, status, updated_at")
      .order("created_at", { ascending: false })
      .limit(50),
    supabaseAdmin
      .from("grievances")
      .select("id, ref, service, category, priority, status")
      .order("created_at", { ascending: false })
      .limit(50),
  ]);
  if (apps.error || grvs.error) {
    console.error("getDepartmentOverview failed:", apps.error?.message, grvs.error?.message);
    throw new Error("Could not load department data");
  }
  return { applications: apps.data ?? [], grievances: grvs.data ?? [] };
}

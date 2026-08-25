import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import {
  applicationInputSchema,
  grievanceInputSchema,
  refSchema,
  insertApplication,
  insertGrievance,
  findApplicationByRef,
  listCitizenRecords,
  getDepartmentOverview,
} from "./records.server";

export const submitApplication = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => applicationInputSchema.parse(input))
  .handler(async ({ data }) => insertApplication(data));

export const submitGrievance = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => grievanceInputSchema.parse(input))
  .handler(async ({ data }) => insertGrievance(data));

export const trackApplication = createServerFn({ method: "GET" })
  .inputValidator((input: unknown) => refSchema.parse(input))
  .handler(async ({ data }) => findApplicationByRef(data));

export const getCitizenRecords = createServerFn({ method: "GET" })
  .inputValidator((input: unknown) =>
    z
      .string()
      .trim()
      .min(8)
      .max(64)
      .regex(/^[A-Za-z0-9-]+$/, "Invalid citizen key")
      .parse(input),
  )
  .handler(async ({ data }) => listCitizenRecords(data));

export const getDepartmentData = createServerFn({ method: "GET" }).handler(async () =>
  getDepartmentOverview(),
);

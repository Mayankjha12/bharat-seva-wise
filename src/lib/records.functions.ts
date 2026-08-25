import { createServerFn } from "@tanstack/react-start";
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

const citizenKeySchema = grievanceInputSchema.shape.citizenKey;

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
  .inputValidator((input: unknown) => citizenKeySchema.parse(input))
  .handler(async ({ data }) => listCitizenRecords(data));

export const getDepartmentData = createServerFn({ method: "GET" }).handler(async () =>
  getDepartmentOverview(),
);

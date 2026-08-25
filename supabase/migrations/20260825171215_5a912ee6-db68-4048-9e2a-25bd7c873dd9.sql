-- SevaSetu prototype: applications & grievances persistence (demo data, permissive anon policies for hackathon prototype)

CREATE TABLE public.applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ref text NOT NULL UNIQUE,
  citizen_id text NOT NULL DEFAULT 'demo-priya',
  citizen_name text NOT NULL,
  service_id text NOT NULL,
  service_name text NOT NULL,
  category text NOT NULL,
  district text NOT NULL,
  state text NOT NULL,
  status text NOT NULL DEFAULT 'Submitted',
  details jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT ON public.applications TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.applications TO authenticated;
GRANT ALL ON public.applications TO service_role;

ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Prototype: anyone can read applications"
  ON public.applications FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Prototype: anyone can submit applications"
  ON public.applications FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE TABLE public.grievances (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ref text NOT NULL UNIQUE,
  citizen_id text NOT NULL DEFAULT 'demo-priya',
  citizen_name text NOT NULL,
  service text NOT NULL,
  category text NOT NULL,
  description text NOT NULL,
  status text NOT NULL DEFAULT 'Assigned to Department',
  priority text NOT NULL DEFAULT 'Normal',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT ON public.grievances TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.grievances TO authenticated;
GRANT ALL ON public.grievances TO service_role;

ALTER TABLE public.grievances ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Prototype: anyone can read grievances"
  ON public.grievances FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Prototype: anyone can raise grievances"
  ON public.grievances FOR INSERT TO anon, authenticated WITH CHECK (true);

-- Demo seed rows (clearly demo data for the hackathon walkthrough)
INSERT INTO public.applications (ref, citizen_id, citizen_name, service_id, service_name, category, district, state, status, details, created_at, updated_at) VALUES
  ('SV-2026-10482', 'demo-priya', 'Priya Sharma', 'edu-scholarship', 'Education Scholarship Support', 'Education', 'Lucknow', 'Uttar Pradesh', 'Under Verification', '{"age_group":"18-30","employment":"Student","income":"Below ₹1 lakh"}'::jsonb, now() - interval '2 days', now() - interval '4 hours'),
  ('SV-2026-10391', 'demo-citizen-2', 'Ramesh Verma', 'health-coverage', 'Health Coverage Assistance', 'Healthcare', 'Kanpur', 'Uttar Pradesh', 'Approved', '{}'::jsonb, now() - interval '6 days', now() - interval '1 day'),
  ('SV-2026-10310', 'demo-citizen-3', 'Sunita Devi', 'senior-support', 'Senior Citizen Support', 'Social Welfare', 'Varanasi', 'Uttar Pradesh', 'Submitted', '{}'::jsonb, now() - interval '1 day', now() - interval '1 day');

INSERT INTO public.grievances (ref, citizen_id, citizen_name, service, category, description, status, priority, created_at, updated_at) VALUES
  ('GRV-2026-00842', 'demo-priya', 'Priya Sharma', 'Education Scholarship Support', 'Application Delay', 'My scholarship application has been under verification for longer than the stated processing time. Requesting an update.', 'Under Review', 'Normal', now() - interval '1 day', now() - interval '3 hours'),
  ('GRV-2026-00817', 'demo-citizen-2', 'Ramesh Verma', 'Health Coverage Assistance', 'Payment/Benefit Issue', 'Benefit amount not yet credited to the registered bank account after approval.', 'Assigned to Department', 'High Priority', now() - interval '2 days', now() - interval '1 day');
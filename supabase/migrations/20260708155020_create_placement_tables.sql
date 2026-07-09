/*
# Placement Tracker Database Schema

1. New Tables
- `companies` - Company information with packages, stipends, roles, offer types
- `branch_stats` - Branch-wise placement statistics
- `placement_trends` - Year-wise placement trends
- `package_distribution` - Package range distribution data

2. Security
- Enable RLS on all tables
- Allow public read access (single-tenant, no auth required)

3. Notes
- Single-tenant app with no authentication
- All data is intentionally public/shared
- Uses anon + authenticated policies for anon-key client access
*/

-- Companies table
CREATE TABLE IF NOT EXISTS companies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  package double precision,
  stipend double precision,
  role text,
  offer_type text,
  branches text[] DEFAULT '{}',
  num_offers integer DEFAULT 0,
  year integer,
  created_at timestamptz DEFAULT now()
);

-- Branch statistics table
CREATE TABLE IF NOT EXISTS branch_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  branch text NOT NULL,
  avg_package double precision,
  highest_package double precision,
  students_placed integer DEFAULT 0,
  total_students integer DEFAULT 0,
  companies_visited integer DEFAULT 0,
  total_offers integer DEFAULT 0,
  year integer,
  created_at timestamptz DEFAULT now()
);

-- Placement trends table
CREATE TABLE IF NOT EXISTS placement_trends (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  year integer NOT NULL,
  total_offers integer DEFAULT 0,
  total_companies integer DEFAULT 0,
  highest_package double precision,
  avg_package double precision,
  median_package double precision,
  highest_stipend double precision,
  avg_stipend double precision,
  placement_rate double precision,
  created_at timestamptz DEFAULT now()
);

-- Package distribution table
CREATE TABLE IF NOT EXISTS package_distribution (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  range_start double precision NOT NULL,
  range_end double precision NOT NULL,
  count integer DEFAULT 0,
  label text,
  year integer,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE branch_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE placement_trends ENABLE ROW LEVEL SECURITY;
ALTER TABLE package_distribution ENABLE ROW LEVEL SECURITY;

-- Companies policies
DROP POLICY IF EXISTS "anon_select_companies" ON companies;
CREATE POLICY "anon_select_companies" ON companies FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_companies" ON companies;
CREATE POLICY "anon_insert_companies" ON companies FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_companies" ON companies;
CREATE POLICY "anon_update_companies" ON companies FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_companies" ON companies;
CREATE POLICY "anon_delete_companies" ON companies FOR DELETE
  TO anon, authenticated USING (true);

-- Branch stats policies
DROP POLICY IF EXISTS "anon_select_branch_stats" ON branch_stats;
CREATE POLICY "anon_select_branch_stats" ON branch_stats FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_branch_stats" ON branch_stats;
CREATE POLICY "anon_insert_branch_stats" ON branch_stats FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_branch_stats" ON branch_stats;
CREATE POLICY "anon_update_branch_stats" ON branch_stats FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_branch_stats" ON branch_stats;
CREATE POLICY "anon_delete_branch_stats" ON branch_stats FOR DELETE
  TO anon, authenticated USING (true);

-- Placement trends policies
DROP POLICY IF EXISTS "anon_select_placement_trends" ON placement_trends;
CREATE POLICY "anon_select_placement_trends" ON placement_trends FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_placement_trends" ON placement_trends;
CREATE POLICY "anon_insert_placement_trends" ON placement_trends FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_placement_trends" ON placement_trends;
CREATE POLICY "anon_update_placement_trends" ON placement_trends FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_placement_trends" ON placement_trends;
CREATE POLICY "anon_delete_placement_trends" ON placement_trends FOR DELETE
  TO anon, authenticated USING (true);

-- Package distribution policies
DROP POLICY IF EXISTS "anon_select_package_distribution" ON package_distribution;
CREATE POLICY "anon_select_package_distribution" ON package_distribution FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_package_distribution" ON package_distribution;
CREATE POLICY "anon_insert_package_distribution" ON package_distribution FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_package_distribution" ON package_distribution;
CREATE POLICY "anon_update_package_distribution" ON package_distribution FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_package_distribution" ON package_distribution;
CREATE POLICY "anon_delete_package_distribution" ON package_distribution FOR DELETE
  TO anon, authenticated USING (true);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_companies_name ON companies(name);
CREATE INDEX IF NOT EXISTS idx_companies_package ON companies(package DESC);
CREATE INDEX IF NOT EXISTS idx_companies_year ON companies(year);
CREATE INDEX IF NOT EXISTS idx_branch_stats_branch ON branch_stats(branch);
CREATE INDEX IF NOT EXISTS idx_placement_trends_year ON placement_trends(year);
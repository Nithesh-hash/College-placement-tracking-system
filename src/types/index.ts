export type Company = {
  id: string;
  name: string;
  package: number | null;
  stipend: number | null;
  role: string;
  offer_type: string;
  branches: string[];
  num_offers: number;
  year: number;
};

export type BranchStat = {
  id: string;
  branch: string;
  avg_package: number;
  highest_package: number;
  students_placed: number;
  total_students: number;
  companies_visited: number;
  total_offers: number;
  year: number;
};

export type PlacementTrend = {
  year: number;
  total_offers: number;
  total_companies: number;
  highest_package: number;
  avg_package: number;
  median_package: number;
  highest_stipend: number;
  avg_stipend: number;
  placement_rate: number;
};

export type PackageDist = {
  id: string;
  range_start: number;
  range_end: number;
  count: number;
  label: string;
  year: number;
};

export type User = {
  id: string;
  email: string;
  created_at: string;
};

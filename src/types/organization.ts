export interface Organization {
  name: string;
  krs_number: string;
  nip: string | null;
  org_type: string | null;
  report_year: number;
  slug: string;

  voivodeship: string;
  county: string;
  municipality: string;
  city: string;
  postal_code: string | null;
  scope: string;

  ai_summary: string;
  primary_category: string;
  related_categories: string[];
  beneficiary_tags: string[];
  website: string | null;
  email: string | null;

  revenue_total: number | null;
  revenue_15pct: number | null;
  costs_total: number | null;
  rach_result_net_curr: number | null;
  costs_15pct_total: number | null;
  revenue_public_total: number | null;
  revenue_private_total: number | null;
  revenue_other: number | null;
  rach_costs_statutory_curr: number | null;
  rach_costs_admin_curr: number | null;

  beneficiaries_physical: number | null;
  beneficiaries_legal: number | null;
  staff_employed: number | null;
  staff_civil_contract: number | null;
  members_count: number | null;

  has_website: boolean;
  has_email: boolean;
  form_variant: string;
  opp_status_date: string | null;
  opp_years: number | null;

  size: string | null;
}

export interface CategoryAverage {
  median_revenue: number | null;
  count: number;
  avg_costs_statutory_pct: number | null;
  avg_costs_admin_pct: number | null;
}

export interface DataFile {
  meta: {
    generated: string;
    record_count: number;
    report_year: number;
    category_averages: Record<string, CategoryAverage>;
  };
  organizations: Organization[];
}

import { createClient } from "@/lib/supabase/client";

export interface SearchPartnersParams {
  searchTerm: string;
  selectedSpecs: string[];
  selectedModes: string[];
  selectedAges: string[];
  targetCity: string | null;
  page: number;
  pageSize: number;
}

export async function fetchSearchPartners({
  searchTerm,
  selectedSpecs,
  selectedModes,
  selectedAges,
  targetCity,
  page,
  pageSize,
}: SearchPartnersParams) {
  const supabase = createClient();
  const from = page * pageSize;
  const to = from + pageSize - 1;

  // Use the search_partners_v2 RPC (Location Aware)
  const { data, error, count } = await supabase.rpc("search_partners_v2", {
    search_term: searchTerm || null,
    selected_specs: selectedSpecs.length > 0 ? selectedSpecs : null,
    selected_modes: selectedModes.length > 0 ? selectedModes : null,
    selected_ages: selectedAges.length > 0 ? selectedAges : null,
    target_city: targetCity === "All" ? null : targetCity,
  }, { count: 'exact' });

  if (error) {
    console.error("Error fetching partners:", error);
    throw error;
  }

  const { data: paginatedData, error: rangeError } = await supabase.rpc("search_partners_v2", {
    search_term: searchTerm || null,
    selected_specs: selectedSpecs.length > 0 ? selectedSpecs : null,
    selected_modes: selectedModes.length > 0 ? selectedModes : null,
    selected_ages: selectedAges.length > 0 ? selectedAges : null,
    target_city: targetCity === "All" ? null : (targetCity || null),
  })
  .range(from, to);

  if (rangeError) {
    console.error("Error paginating partners:", rangeError);
    throw rangeError;
  }

  return {
    partners: paginatedData || [],
    nextPage: paginatedData && paginatedData.length === pageSize ? page + 1 : undefined,
    totalCount: count || 0,
  };
}

import { useEffect, useMemo, useState, useCallback } from "react";
import debounce from "lodash.debounce";
import { foodApi } from "../../services/api";
import type { UnifiedSearchResult } from "@/services/types";

/* 
    FatSecret -> unified shape
*/

const mapFatSecretFoods = (foods: any[]): UnifiedSearchResult[] =>
  foods.map((item) => ({
    id: item.id,
    name: item.name,
    type: "ingredient",
    source: "fatsecret",
  }));

/*    Spoonacular -> unified shape
 */
const mapSpoonacularIngredients = (items: any[]): UnifiedSearchResult[] =>
  items.map((item) => ({
    id: item.id,
    name: item.name,
    type: "ingredient",
    source: "spoonacular",
  }));

/* 
    Food search hook
*/

export function useFoodSearch(query: string) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<UnifiedSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedFood, setSelectedFood] = useState<UnifiedSearchResult | null>(
    null,
  );

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    if (!query) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
  }, []);

  /* 
        Debounced progressive search
    */

  const debouncedSearch = useMemo(
    () =>
      debounce(async (query: string) => {
        if (query.length < 3) {
          setSearchResults([]);
          setIsSearching(false);
          return;
        }
        try {
          setIsSearching(true);

          // Primary (fast) - FatSecret
          const fatSecretFoods = await foodApi.getFatSecretFoods({
            query,
            maxResults: 5,
            pageNumber: 0,
          });

          setSearchResults(mapFatSecretFoods(fatSecretFoods));

          // Background enrichment - Spoonacular
          foodApi
            .searchIngredients({
              query,
              limit: 3,
              sort: "calories",
              sortDirection: "desc",
            })
            .then((ingredients) => {
              const enriched = mapSpoonacularIngredients(ingredients);

              setSearchResults((prev) => {
                const ids = new Set(prev.map((r) => `${r.source}-${r.id}`));

                return [
                  ...prev,
                  ...enriched.filter((r) => !ids.has(`${r.source}-${r.id}`)),
                ];
              });
            })
            .catch(console.error);
        } catch (error) {
          console.error("Search error:", error);
          setSearchResults([]);
        } finally {
          setIsSearching(false);
        }
      }, 500),
    [],
  );

  /* 
  cleanup debounce on unmount
*/

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  /* 
    Public search handler
  */

  return {
    searchQuery,
    searchResults,
    isSearching,
    handleSearch,
    setSearchQuery,
  };
}

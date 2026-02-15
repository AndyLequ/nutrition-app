import { useEffect, useMemo, useState, useCallback, useRef } from "react";
import debounce from "lodash.debounce";
import { foodApi } from "../../services/api";
import type {
  UnifiedSearchResult,
  FatSecretFood,
  Ingredient,
} from "@/services/types";

/* 
    FatSecret -> unified shape
*/

const mapFatSecretFoods = (foods: FatSecretFood[]): UnifiedSearchResult[] =>
  foods.map((item) => ({
    id: item.id,
    name: item.name,
    type: "ingredient",
    source: "fatsecret",
  }));

/*    Spoonacular -> unified shape
 */
const mapSpoonacularIngredients = (
  items: Ingredient[],
): UnifiedSearchResult[] =>
  items.map((item) => ({
    id: item.id,
    name: item.name,
    type: "ingredient",
    source: "spoonacular",
  }));

/* 
    Food search hook
*/

export function useFoodSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<UnifiedSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const clearResults = useCallback(() => {
    setSearchResults([]);
    setIsSearching(false);
  }, []);

  /* 
        Debounced progressive search
    */

  const latestQueryRef = useRef("");

  const debouncedSearch = useMemo(
    () =>
      debounce(async (query: string) => {
        latestQueryRef.current = query;

        setIsSearching(true);

        try {
          // Primary (fast) - FatSecret
          const fatSecretFoods = await foodApi.getFatSecretFoods({
            query,
            maxResults: 5,
            pageNumber: 0,
          });

          if (latestQueryRef.current !== query) return; // discard if query has changed

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
              if (latestQueryRef.current !== query) return; // discard if query has changed

              const enriched = mapSpoonacularIngredients(ingredients);

              setSearchResults((prev) => {
                const ids = new Set(prev.map((r) => `${r.source}-${r.id}`));
                return [
                  ...prev,
                  ...enriched.filter((r) => !ids.has(`${r.source}-${r.id}`)),
                ];
              });
            })
            .catch(console.error)
            .finally(() => setIsSearching(false));
        } catch (error) {
          console.error("Search error:", error);
          setSearchResults([]);
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
  const handleSearch = useCallback(
    (query: string) => {
      setSearchQuery(query);

      if (!query || query.length < 3) {
        clearResults();
        return;
      }

      debouncedSearch(query);
    },
    [debouncedSearch, clearResults],
  );

  return {
    searchQuery,
    searchResults,
    isSearching,
    handleSearch,
    clearResults,
  };
}

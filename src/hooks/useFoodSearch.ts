import { useEffect, useMemo, useState } from "react";
import debounce from "lodash.debounce";
import { foodApi } from "../services/api";

/* 
    Shared search result shape
*/
export interface UnifiedSearchResult {
  id: number;
  name: string;
  type: "ingredient" | "recipe";
  source?: "spoonacular" | "fatsecret";
}

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

    /* 
        Debounced progressive search
    */

    const debouncedSearch = useMemo(
        () =>
            debounce(async (query: string) => {
                if( query.length < 3){
                    setSearchResults([])
                    setIsSearching(false);
                    return;
                }
                try{
                    setIsSearching(true);
                    
                }
            
            )
    )
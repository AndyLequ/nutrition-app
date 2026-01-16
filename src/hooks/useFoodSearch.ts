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

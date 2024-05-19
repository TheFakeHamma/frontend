export interface RecipeListItem {
  id: number;
  recipe_list_id: number;
  recipe_url: string;
  recipe_name: string;
  recipe_image: string;
  custom_recipe_id: string;
  recipe_uri: string;
}


export interface RecipeList {
  id: number;
  name: string;
  items: RecipeListItem[];
  created_at: string;
  updated_at: string;
}

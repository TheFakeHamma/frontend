export interface Recipe {
  uri: string;
  label: string;
  image: string;
  images: Images[];
  source: string;
  url: string;
  shareAs: string;
  yield: number;
  dietLabels: string[];
  healthLabels: string[];
  cautions: string[];
  ingredientLines: string[];
  ingredients: Ingredient[];
  calories: number;
  cuisineType: string[];
  mealType: string[];
  dishType: string[];
  instructions: string[];
  tags: string[];
  totalWeight: number;
}

export interface Images {
  THUMBNAIL: ImageInfo[];
  SMALL: ImageInfo[];
  REGULAR: ImageInfo[];
  LARGE: ImageInfo[];
}

export interface ImageInfo {
  url: string;
  width: number;
  height: number;
}

export interface Ingredient {
  text: string;
  quantity: number;
  measure: string;
  food: string;
  weight: number;
  foodId: string;
  image?: string;
}

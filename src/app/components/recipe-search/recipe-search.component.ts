import { Component } from '@angular/core';
import { RecipeService } from '../../services/recipe.service';
import { Recipe } from '../../models/recipe.model';

@Component({
  selector: 'app-recipe-search',
  templateUrl: './recipe-search.component.html',
  styleUrls: ['./recipe-search.component.css'],
})
export class RecipeSearchComponent {
  query: string = '';
  recipes: Recipe[] = [];

  constructor(private recipeService: RecipeService) {}

  searchRecipes() {
    if (this.query) {
      this.recipeService.searchRecipes(this.query).subscribe((response) => {
        this.recipes = response.hits.map((hit) => hit.recipe);
      });
    }
  }
}

import { Component, OnInit } from '@angular/core';
import { RecipeService } from '../../services/recipe.service';
import { RecipeListService } from '../../services/recipe-list.service';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-recipe-search',
  templateUrl: './recipe-search.component.html',
  styleUrls: ['./recipe-search.component.css'],
})
export class RecipeSearchComponent implements OnInit {
  query: string = '';
  recipes: any[] = [];
  lists: any[] = [];
  selectedRecipe: any = null;
  selectedListId: number | null = null;

  constructor(
    private recipeService: RecipeService,
    private recipeListService: RecipeListService
  ) {}

  ngOnInit(): void {
    this.getLists();
  }

  searchRecipes() {
    if (this.query) {
      this.recipeService.searchRecipes(this.query).subscribe((response) => {
        this.recipes = response.hits.map((hit) => hit.recipe);
      });
    }
  }

  getLists(): void {
    this.recipeListService.getLists().subscribe((lists) => {
      this.lists = lists;
    });
  }

  openAddToListModal(recipe: any): void {
    this.selectedRecipe = recipe;
    this.selectedListId = null;
    console.log('Selected Recipe:', this.selectedRecipe);
  }

  closeAddToListModal(): void {
    this.selectedRecipe = null;
    this.selectedListId = null;
  }

  addRecipeToList(): void {
    if (this.selectedRecipe && this.selectedListId) {
      const recipeData = {
        recipe_url: this.selectedRecipe.uri,
        recipe_name: this.selectedRecipe.label,
        recipe_image: this.selectedRecipe.image,
        custom_recipe_id: CryptoJS.MD5(this.selectedRecipe.uri).toString(),
        recipe_uri: this.selectedRecipe.url,
      };
      console.log('Adding recipe to list with data:', recipeData);
      this.recipeListService
        .addRecipeToList(this.selectedListId, recipeData)
        .subscribe(
          () => {
            this.closeAddToListModal();
          },
          (error) => {
            console.error('Failed to add recipe to list:', error);
            alert('Failed to add recipe to list.');
          }
        );
    } else {
      alert('Please select a list.');
    }
  }
}

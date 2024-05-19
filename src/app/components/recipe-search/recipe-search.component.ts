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
  searchPerformed: boolean = false;
  randomQuery: string = '';
  confirmationMessage: string = '';

  constructor(
    private recipeService: RecipeService,
    private recipeListService: RecipeListService
  ) {}

  ngOnInit(): void {
    this.getLists();
    this.getRandomRecipes(); // Fetch random recipes on load
  }

  searchRecipes(): void {
    if (this.query) {
      this.recipeService.searchRecipes(this.query).subscribe((response) => {
        this.recipes = response.hits.map((hit) => hit.recipe);
        this.searchPerformed = true;
      });
    }
  }

  getRandomRecipes(): void {
    this.recipeService.getRandomRecipes(8).subscribe((response) => {
      this.recipes = response.hits.map((hit) => hit.recipe);
      this.randomQuery = response.query;
      this.searchPerformed = false;
    });
  }

  getLists(): void {
    this.recipeListService.getLists().subscribe((lists) => {
      this.lists = lists;
    });
  }

  openAddToListModal(recipe: any): void {
    this.selectedRecipe = recipe;
    this.selectedListId = null; // Reset selected list
    console.log('Selected Recipe:', this.selectedRecipe);
  }

  closeAddToListModal(): void {
    this.selectedRecipe = null;
    this.selectedListId = null;
  }

  addRecipeToList(): void {
    if (this.selectedRecipe && this.selectedListId !== null) {
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
            this.confirmationMessage = 'Recipe added to list!';
            setTimeout(() => {
              this.confirmationMessage = '';
            }, 3000);
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

  getListNameById(listId: number): string {
    const list = this.lists.find((list) => list.id === listId);
    return list ? list.name : '';
  }
}

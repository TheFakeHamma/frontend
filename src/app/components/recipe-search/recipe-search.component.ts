import { Component, OnInit } from '@angular/core';
import { RecipeService } from '../../services/recipe.service';
import { RecipeListService } from '../../services/recipe-list.service';
import * as CryptoJS from 'crypto-js';
import { RecipeList } from '../../models/recipe-list.model';

@Component({
  selector: 'app-recipe-search',
  templateUrl: './recipe-search.component.html',
  styleUrls: ['./recipe-search.component.css'],
})
export class RecipeSearchComponent implements OnInit {
  query: string = '';
  recipes: any[] = [];
  lists: RecipeList[] = [];
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
      const customRecipeId = CryptoJS.MD5(this.selectedRecipe.uri).toString();

      // Check if the recipe already exists in the selected list
      this.recipeListService.getList(this.selectedListId).subscribe((list) => {
        const recipeExists = list.items.some(
          (recipe: any) => recipe.custom_recipe_id === customRecipeId
        );

        if (recipeExists) {
          alert('This recipe is already in the selected list.');
        } else {
          const recipeData = {
            recipe_url: this.selectedRecipe.uri,
            recipe_name: this.selectedRecipe.label,
            recipe_image: this.selectedRecipe.image,
            custom_recipe_id: customRecipeId,
            recipe_uri: this.selectedRecipe.url,
          };
          console.log('Adding recipe to list with data:', recipeData);
          this.recipeListService
            .addRecipeToList(this.selectedListId as number, recipeData)
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
        }
      });
    } else {
      alert('Please select a list.');
    }
  }

  getListNameById(listId: number): string {
    const list = this.lists.find((list) => list.id === listId);
    return list ? list.name : '';
  }
}

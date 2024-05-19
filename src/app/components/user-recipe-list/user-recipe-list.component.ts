import { Component, OnInit } from '@angular/core';
import { RecipeListService } from '../../services/recipe-list.service';
import { RecipeListItem } from '../../models/recipe-list.model';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-user-recipe-list',
  templateUrl: './user-recipe-list.component.html',
  styleUrls: ['./user-recipe-list.component.css'],
})
export class UserRecipeListComponent implements OnInit {
  lists: any[] = [];
  newListName: string = '';
  selectedRecipe: any;
  selectedListId: number = 0;
  editListId: number | null = null;
  editListName: string = '';

  constructor(private recipeListService: RecipeListService) {}

  ngOnInit(): void {
    this.getLists();
  }

  getLists(): void {
    this.recipeListService.getLists().subscribe((lists) => {
      this.lists = lists;
    });
  }

  createList(): void {
    if (this.newListName) {
      this.recipeListService
        .createList({ name: this.newListName })
        .subscribe((list) => {
          this.lists.push(list);
          this.newListName = '';
        });
    }
  }

  deleteList(id: number): void {
    this.recipeListService.deleteList(id).subscribe(() => {
      this.lists = this.lists.filter((list) => list.id !== id);
    });
  }

  openAddToListModal(recipe: any): void {
    this.selectedRecipe = recipe;
  }

  closeAddToListModal(): void {
    this.selectedRecipe = null;
    this.selectedListId = 0;
  }

  addRecipeToList(): void {
    if (this.selectedRecipe && this.selectedListId) {
      const recipeData: Partial<RecipeListItem> = {
        recipe_list_id: this.selectedListId,
        recipe_url: this.selectedRecipe.uri,
        recipe_name: this.selectedRecipe.label,
        recipe_image: this.selectedRecipe.image,
        custom_recipe_id: CryptoJS.MD5(this.selectedRecipe.uri).toString(),
        recipe_uri: this.selectedRecipe.url,
      };
      console.log('Adding recipe to list with data:', recipeData);
      this.recipeListService
        .addRecipeToList(this.selectedListId, recipeData)
        .subscribe({
          next: () => {
            this.closeAddToListModal();
            // Update the list locally to show the added recipe without refreshing
            const list = this.lists.find(
              (list) => list.id === this.selectedListId
            );
            if (list) {
              list.items.push(recipeData);
            }
          },
          error: (error) => {
            console.error('Failed to add recipe to list:', error);
            alert('Failed to add recipe to list.');
          },
        });
    } else {
      alert('Please select a list.');
    }
  }

  openEditListModal(list: any): void {
    this.editListId = list.id;
    this.editListName = list.name;
  }

  closeEditListModal(): void {
    this.editListId = null;
    this.editListName = '';
  }

  updateList(): void {
    if (this.editListId !== null && this.editListName) {
      this.recipeListService
        .updateList(this.editListId, { name: this.editListName })
        .subscribe((updatedList) => {
          // Update the list name locally
          const list = this.lists.find((list) => list.id === this.editListId);
          if (list) {
            list.name = updatedList.name;
          }
          this.closeEditListModal();
        });
    }
  }

  removeRecipeFromList(listId: number, recipeId: string): void {
    this.recipeListService.removeRecipeFromList(listId, recipeId).subscribe({
      next: () => {
        // Remove the recipe from the list locally
        const list = this.lists.find((list) => list.id === listId);
        if (list) {
          list.items = list.items.filter(
            (item: RecipeListItem) => item.custom_recipe_id !== recipeId
          );
        }
      },
      error: (error) => {
        console.error('Failed to remove recipe from list:', error);
        alert('Failed to remove recipe from list.');
      },
    });
  }
}

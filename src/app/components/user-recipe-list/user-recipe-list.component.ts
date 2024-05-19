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
  selectedListId: number | null = null;
  editListId: number | null = null;
  editListName: string = '';
  selectedList: any;

  constructor(private recipeListService: RecipeListService) {}

  ngOnInit(): void {
    this.getLists();
  }

  getLists(): void {
    this.recipeListService.getLists().subscribe((lists) => {
      this.lists = lists;
      if (lists.length > 0) {
        this.selectedListId = lists[0].id;
        this.selectedList = lists[0];
      }
    });
  }

  createList(): void {
    if (this.newListName) {
      this.recipeListService
        .createList({ name: this.newListName })
        .subscribe((list) => {
          this.lists.push(list);
          this.newListName = '';
          this.selectedListId = list.id;
          this.selectedList = list;
        });
    }
  }

  deleteList(id: number): void {
    this.recipeListService.deleteList(id).subscribe(() => {
      this.lists = this.lists.filter((list) => list.id !== id);
      if (this.lists.length > 0) {
        this.selectedListId = this.lists[0].id;
        this.selectedList = this.lists[0];
      } else {
        this.selectedListId = null;
        this.selectedList = null;
      }
    });
  }

  openAddToListModal(recipe: any): void {
    this.selectedRecipe = recipe;
    this.selectedListId = null; // Reset selected list
  }

  closeAddToListModal(): void {
    this.selectedRecipe = null;
    this.selectedListId = null;
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

  onListChange(): void {
    this.selectedList = this.lists.find(
      (list) => list.id === this.selectedListId
    );
    this.updateRecipesView();
  }

  getListNameById(listId: number): string {
    const list = this.lists.find((list) => list.id === listId);
    return list ? list.name : '';
  }

  getItemsByListId(listId: number): RecipeListItem[] {
    const list = this.lists.find((list) => list.id === listId);
    return list ? list.items : [];
  }

  updateRecipesView(): void {
    if (this.selectedListId !== null) {
      const list = this.getListById(this.selectedListId);
      if (list && list.items) {
        // Trigger change detection to update the view
        this.lists = [...this.lists];
      }
    }
  }

  getListById(listId: number): any {
    return this.lists.find((list) => list.id === listId);
  }

  deleteListWithConfirmation(id: number): void {
    const confirmed = window.confirm(
      'Are you sure you want to delete this list?'
    );
    if (confirmed) {
      this.deleteList(id);
    }
  }
}

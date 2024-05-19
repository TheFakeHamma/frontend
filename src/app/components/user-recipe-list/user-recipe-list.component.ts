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

  constructor(private recipeListService: RecipeListService) {}

  ngOnInit(): void {
    this.getLists();
  }

  getLists(): void {
    this.recipeListService.getLists().subscribe((lists) => {
      this.lists = lists;
      if (this.lists.length > 0) {
        this.selectedListId = this.lists[0].id;
      }
    });
  }

  createList(): void {
    if (this.newListName) {
      this.recipeListService
        .createList({ name: this.newListName })
        .subscribe((list) => {
          list.items = [];
          this.lists.push(list);
          this.newListName = '';
          this.selectedListId = list.id; // Select the new list
          this.updateRecipesView();
        });
    }
  }

  deleteListWithConfirmation(id: number): void {
    const confirmed = window.confirm(
      'Are you sure you want to delete this list?'
    );
    if (confirmed) {
      this.deleteList(id);
    }
  }

  deleteList(id: number): void {
    this.recipeListService.deleteList(id).subscribe(() => {
      this.lists = this.lists.filter((list) => list.id !== id);
      if (this.lists.length > 0) {
        this.selectedListId = this.lists[0].id;
      } else {
        this.selectedListId = null;
      }
      this.updateRecipesView();
    });
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
          const list = this.lists.find((list) => list.id === this.editListId);
          if (list) {
            list.name = updatedList.name;
          }
          this.closeEditListModal();
        });
    }
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
            const list = this.lists.find(
              (list) => list.id === this.selectedListId
            );
            if (list) {
              list.items.push(recipeData);
            }
            this.closeAddToListModal();
            this.updateRecipesView();
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

  removeRecipeFromList(listId: number, recipeId: string): void {
    this.recipeListService.removeRecipeFromList(listId, recipeId).subscribe({
      next: () => {
        const list = this.lists.find((list) => list.id === listId);
        if (list) {
          list.items = list.items.filter(
            (item: RecipeListItem) => item.custom_recipe_id !== recipeId
          );
        }
        this.updateRecipesView();
      },
      error: (error) => {
        console.error('Failed to remove recipe from list:', error);
        alert('Failed to remove recipe from list.');
      },
    });
  }

  closeAddToListModal(): void {
    this.selectedRecipe = null;
    this.selectedListId = this.lists.length > 0 ? this.lists[0].id : null;
  }

  onListChange(): void {
    this.updateRecipesView();
  }

  updateRecipesView(): void {
    if (this.selectedListId !== null) {
      const list = this.getListById(this.selectedListId);
      if (list && list.items) {
        this.lists = [...this.lists];
      }
    }
  }

  getListById(id: number): any {
    return this.lists.find((list) => list.id === id);
  }

  getListNameById(id: number): string {
    const list = this.getListById(id);
    return list ? list.name : 'Unknown List';
  }

  getItemsByListId(id: number): RecipeListItem[] {
    const list = this.getListById(id);
    return list ? list.items : [];
  }
}

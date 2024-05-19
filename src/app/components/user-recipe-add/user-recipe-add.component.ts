import { Component, Input } from '@angular/core';
import { RecipeListService } from '../../services/recipe-list.service';

@Component({
  selector: 'app-user-recipe-add',
  templateUrl: './user-recipe-add.component.html',
  styleUrls: ['./user-recipe-add.component.css'],
})
export class UserRecipeAddComponent {
  @Input() recipe: any;
  @Input() lists: any[] = [];

  selectedListId: number | null = null;

  constructor(private recipeListService: RecipeListService) {}

  addRecipeToList(): void {
    if (this.selectedListId) {
      const data = {
        recipe_id: this.recipe.uri,
        recipe_name: this.recipe.label,
        recipe_image: this.recipe.image,
      };
      this.recipeListService
        .addRecipeToList(this.selectedListId, data)
        .subscribe(() => {
          alert('Recipe added to list successfully');
        });
    }
  }
}

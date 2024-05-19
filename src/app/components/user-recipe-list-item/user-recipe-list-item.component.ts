import { Component, Input } from '@angular/core';
import { RecipeListItem } from '../../models/recipe-list.model';

@Component({
  selector: 'app-user-recipe-list-item',
  templateUrl: './user-recipe-list-item.component.html',
  styleUrls: ['./user-recipe-list-item.component.css'],
})
export class UserRecipeListItemComponent {
  @Input() recipe!: RecipeListItem;
}

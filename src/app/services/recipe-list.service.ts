import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { RecipeList, RecipeListItem } from '../models/recipe-list.model';

@Injectable({
  providedIn: 'root',
})
export class RecipeListService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getLists(): Observable<RecipeList[]> {
    return this.http.get<RecipeList[]>(`${this.apiUrl}/recipe-lists`);
  }

  createList(data: { name: string }): Observable<RecipeList> {
    return this.http.post<RecipeList>(`${this.apiUrl}/recipe-lists`, data);
  }

  deleteList(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/recipe-lists/${id}`);
  }

  addRecipeToList(
    listId: number,
    recipeData: Partial<RecipeListItem>
  ): Observable<RecipeListItem> {
    return this.http.post<RecipeListItem>(
      `${this.apiUrl}/recipe-lists/${listId}/recipes`,
      recipeData
    );
  }

  removeRecipeFromList(listId: number, recipeId: string): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/recipe-lists/${listId}/recipes/${recipeId}`
    );
  }

  updateList(id: number, data: { name: string }): Observable<RecipeList> {
    return this.http.put<RecipeList>(`${this.apiUrl}/recipe-lists/${id}`, data);
  }
}

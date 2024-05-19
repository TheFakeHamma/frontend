import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Recipe } from '../models/recipe.model';

@Injectable({
  providedIn: 'root',
})
export class RecipeService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  searchRecipes(query: string): Observable<{ hits: { recipe: Recipe }[] }> {
    const params = new HttpParams().set('q', query);
    return this.http.get<{ hits: { recipe: Recipe }[] }>(
      `${this.apiUrl}/recipes`,
      { params }
    );
  }

  getRandomRecipes(
    limit: number
  ): Observable<{ query: string; hits: { recipe: Recipe }[] }> {
    const params = new HttpParams().set('limit', limit.toString());
    return this.http.get<{ query: string; hits: { recipe: Recipe }[] }>(
      `${this.apiUrl}/recipes`,
      { params }
    );
  }
}

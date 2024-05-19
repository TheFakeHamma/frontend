import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RecipeSearchComponent } from './components/recipe-search/recipe-search.component';
import { UserRecipeListComponent } from './components/user-recipe-list/user-recipe-list.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';

const routes: Routes = [
  { path: '', component: RecipeSearchComponent },
  { path: 'user-lists', component: UserRecipeListComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

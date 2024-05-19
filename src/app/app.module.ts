import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { RecipeSearchComponent } from './components/recipe-search/recipe-search.component';
import { RecipeListComponent } from './components/recipe-list/recipe-list.component';
import { FormsModule } from '@angular/forms';
import { UserRecipeListComponent } from './components/user-recipe-list/user-recipe-list.component';
import { UserRecipeListItemComponent } from './components/user-recipe-list-item/user-recipe-list-item.component';
import { UserRecipeAddComponent } from './components/user-recipe-add/user-recipe-add.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    RecipeSearchComponent,
    RecipeListComponent,
    UserRecipeListComponent,
    UserRecipeListItemComponent,
    UserRecipeAddComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule, FormsModule],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

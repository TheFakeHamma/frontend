import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomepageComponent } from './components/homepage/homepage.component';
import { RecipeSearchComponent } from './components/recipe-search/recipe-search.component';

const routes: Routes = [
  { path: '', component: HomepageComponent },
  { path: 'search', component: RecipeSearchComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

import { Routes } from '@angular/router';
import { MainPageComponent } from './pages/main/main.component';
import { MovieComponent } from './pages/movie/movie.component';

export const routes: Routes = [
  { path: 'main', component: MainPageComponent },
  { path: 'movie/:id', component: MovieComponent },
  { path: '', redirectTo: '/main', pathMatch: 'full' },
];

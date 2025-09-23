import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'main',
    loadComponent: () =>
      import('./pages/main/main.component').then(m => m.MainPageComponent),
  },
  {
    path: 'movie/:id',
    loadComponent: () =>
      import('./pages/movie/movie.component').then(m => m.MovieComponent),
  },
  {
    path: 'tv/:id',
    loadComponent: () =>
      import('./pages/tv/tv.component').then(m => m.TvComponent),
  },
  {
    path: 'persons/:id',
    loadComponent: () =>
      import('./pages/persons/persons.component').then(m => m.PersonsComponent),
  },
  {
    path: 'cast/:id',
    loadComponent: () =>
      import('./pages/movie/all-actors/all-actors.component').then(
        m => m.AllActorsComponent
      ),
  },
  {
    path: 'tv-cast/:id',
    loadComponent: () =>
      import('./pages/tv/all-tv-actors/all-tv-actors.component').then(
        m => m.AllTvActorsComponent
      ),
  },
  { path: '', redirectTo: '/main', pathMatch: 'full' },
];

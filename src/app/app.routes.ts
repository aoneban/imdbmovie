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
  {
    path: 'search',
    loadComponent: () =>
      import('./pages/search/search.component').then(m => m.SearchComponent),
  },
  {
    path: 'movies',
    loadComponent: () =>
      import('./pages/movies/movies.component').then(m => m.MoviesComponent),
  },
  {
    path: 'top-rated',
    loadComponent: () =>
      import('./pages/top-rated/top-rated.component').then(
        m => m.TopRatedComponent
      ),
  },
  {
    path: 'tv-top-rated',
    loadComponent: () =>
      import('./pages/tv-top-rated/tv-top-rated.component').then(
        m => m.TvTopRatedComponent
      ),
  },
  {
    path: 'upcoming',
    loadComponent: () =>
      import('./pages/upcoming/upcoming.component').then(
        m => m.UpcomingComponent
      ),
  },
  {
    path: 'now-playing',
    loadComponent: () =>
      import('./pages/now-playing/now-playing.component').then(
        m => m.NowPlayingComponent
      ),
  },
    {
    path: 'page-persons',
    loadComponent: () =>
      import('./pages/page-persons/page-persons.component').then(
        m => m.PagePersonsComponent
      ),
  },
  {
    path: 'airing-today',
    loadComponent: () =>
      import('./pages/airing-today/airing-today.component').then(
        m => m.AiringTodayComponent
      ),
  },
  {
    path: 'tv-popular',
    loadComponent: () =>
      import('./pages/tv-popular/tv-popular.component').then(
        m => m.TvPopularComponent
      ),
  },
    {
    path: 'on-the-air',
    loadComponent: () =>
      import('./pages/on-the-air/on-the-air.component').then(
        m => m.OnTheAirComponent
      ),
  },
  { path: '', redirectTo: '/main', pathMatch: 'full' },
];

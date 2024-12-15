import { Routes } from '@angular/router';
import { MainPageComponent } from './pages/main-page/main-page.component';

export const routes: Routes = [
  { path: 'main-page', component: MainPageComponent },
  { path: '', redirectTo: '/main-page', pathMatch: 'full' },
];

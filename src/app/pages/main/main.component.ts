import { Component } from '@angular/core';
import { HeaderComponent } from '../../shared/header/header.component';
import { WelcomeComponent } from '../../shared/welcome/welcome.component';
import { TrendsComponent } from '../../shared/trends/trends.component';
import { TrailersComponent } from '../../shared/trailers/trailers.component';

@Component({
  selector: 'main',
  imports: [
    HeaderComponent,
    WelcomeComponent,
    TrendsComponent,
    TrailersComponent,
  ],
  template: `
    <app-header></app-header>
    <app-welcome></app-welcome>
    <app-trends></app-trends>
    <app-trailers></app-trailers>
  `,
  styles: ``,
})
export class MainPageComponent {}

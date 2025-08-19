import { Component } from '@angular/core';
import { HeaderComponent } from '../../shared/header/header.component';
import { WelcomeComponent } from '../../shared/welcome/welcome.component';
import { TrendsComponent } from '../../shared/trends/trends.component';
import { TrailersComponent } from '../../shared/trailers/trailers.component';
import { PopularComponent } from '../../shared/popular/popular.component';
import { FreeComponent } from '../../shared/free/free.component';
import { PopularPersonsComponent } from '../../shared/popularpersons/popularpersons.component';

@Component({
  selector: 'main',
  imports: [
    HeaderComponent,
    WelcomeComponent,
    TrendsComponent,
    TrailersComponent,
    PopularComponent,
    FreeComponent,
    PopularPersonsComponent,
  ],

  template: `
    <app-header></app-header>
    <app-welcome></app-welcome>
    <app-trends></app-trends>
    <app-trailers></app-trailers>
    <app-popular></app-popular>
    <app-free></app-free>
    <app-popularpersons></app-popularpersons>
  `,
  styles: ``,
})
export class MainPageComponent {}

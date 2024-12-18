import { Component } from '@angular/core';
import { HeaderComponent } from '../../shared/header/header.component';
import { WelcomeComponent } from '../../shared/welcome/welcome.component';
import { TrendsComponent } from '../../shared/trends/trends.component';

@Component({
  selector: 'main',
  imports: [HeaderComponent, WelcomeComponent, TrendsComponent],
  template: `
    <app-header></app-header>
    <app-welcome></app-welcome>
    <app-trends></app-trends>
  `,
  styles: ``,
})
export class MainPageComponent {}

import { Component } from '@angular/core';
import { HeaderComponent } from '../../shared/header/header.component';
import { WelcomeComponent } from '../../shared/welcome/welcome.component';

@Component({
  selector: 'main-page',
  imports: [HeaderComponent, WelcomeComponent],
  template: `
    <app-header></app-header>
    <app-welcome></app-welcome>
    <div class="max-w-screen-xl mx-auto">
      <p>main-page works!</p>
    </div>
  `,
  styles: ``,
})
export class MainPageComponent {}

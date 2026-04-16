import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './pages/main/shared/header/header.component';
import { FooterComponent } from './pages/main/shared/footer/footer.component';

@Component({
  selector: 'app-root',
  imports: [RouterModule, HeaderComponent, FooterComponent],
  host: {
    class: 'min-h-screen flex flex-col',
  },
  template: `
    <app-header></app-header>

    <div class="flex-1 min-h-0">
      <router-outlet></router-outlet>
    </div>

    <app-footer></app-footer>
  `,
  styles: [],
})
export class AppComponent {}

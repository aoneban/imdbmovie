import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer',
  imports: [RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <footer class="w-full bg-blue-950 mt-5 px-4 pt-8 pb-[30px] sm:pt-[60px]">
      <div class="max-w-screen-xl mx-auto">
        <div class="footer-navigation">
          <a
            class="footer-brand"
            [routerLink]="['/main']"
            aria-label="Cinema home">
            <img class="logo" decoding="async" src="/logo.png" alt="Cinema" />
          </a>
          <nav aria-label="Footer">
            <ul class="footer-links">
              <li><button type="button">Help</button></li>
              <li><button type="button">CinemaPro</button></li>
              <li><button type="button">Privacy Policy</button></li>
              <li><button type="button">Conditions of Use</button></li>
            </ul>
          </nav>
        </div>
        <p class="mt-5 italic text-gray-400 text-xs text-center">
          Design by TMDB, Developed by A.Bahiran
        </p>
      </div>
    </footer>
  `,
})
export class FooterComponent {}

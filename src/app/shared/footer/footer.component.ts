import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer',
  imports: [RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <footer class="w-full bg-blue-950 mt-[20px] pt-[60px] pb-[30px]">
      <div class="content">
        <div
          class="content__wrapper flex justify-center max-w-screen-xl mx-auto">
          <div class="content__wrapper-navbar">
            <ul class="flex justify-between gap-x-5">
              <li>
                <a href="" [routerLink]="['/main']">
                  <img
                    class="logo"
                    decoding="async"
                    src="/logo.png"
                    alt="logo" />
                </a>
              </li>
              <li>
                <div class="dropdown">
                  <button class="dropbtn font-medium">Help</button>
                </div>
              </li>
              <li>
                <div class="dropdown">
                  <button class="dropbtn font-medium">CinemaPro</button>
                </div>
              </li>
              <li>
                <div class="dropdown">
                  <button class="dropbtn font-medium">Privacy Policy</button>
                </div>
              </li>
              <li>
                <div class="dropdown">
                  <button class="dropbtn font-medium">Conditions of Use</button>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <div>
          <p class="italic text-gray-600 text-xs text-center">Design by TMDB, Developed by A.Bahiran</p>
        </div>
      </div>
    </footer>
  `,
  styleUrls: ['../../../styles.scss'],
})
export class FooterComponent {}
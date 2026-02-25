import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="w-full bg-blue-950 pt-[22px] pb-[5px]">
      <div class="content">
        <div
          class="content__wrapper flex justify-between max-w-screen-xl mx-auto">
          <div class="content__wrapper-navbar_left">
            <ul class="flex gap-x-5">
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
                  <button class="dropbtn">Movies</button>
                  <div class="dropdown-content">
                    <a [routerLink]="['/movies']">Popular</a>
                    <a [routerLink]="['/top-rated']">Top rated</a>
                    <a [routerLink]="['/upcoming']">Upcoming</a>
                    <a [routerLink]="['/now-playing']">Now playing</a>
                  </div>
                </div>
              </li>
              <li>
                <div class="dropdown">
                  <button class="dropbtn">TV Shows</button>
                  <div class="dropdown-content">
                    <a [routerLink]="['/tv-popular']">Popular TV</a>
                    <a [routerLink]="['/airing-today']">Airing today</a>
                    <a [routerLink]="['/on-the-air']">On TV</a>
                    <a [routerLink]="['/tv-top-rated']">Top rated</a>
                  </div>
                </div>
              </li>
              <li>
                <div class="dropdown">
                  <button class="dropbtn">People</button>
                  <div class="dropdown-content">
                    <a [routerLink]="['/page-persons']">Popular</a>
                  </div>
                </div>
              </li>
              <li>
                <div class="dropdown">
                  <button class="dropbtn">More</button>
                  <div class="dropdown-content">
                    <a href="#">Discussions</a>
                    <a href="#">Leaderboard</a>
                    <a href="#">Support</a>
                  </div>
                </div>
              </li>
            </ul>
          </div>
          <div class="content__wrapper-navbar_right flex">
            <ul class="flex gap-x-8">
              <li
                class="
              hover:border-blue-400 hover:text-blue-300 transition-colors duration-200">
                <a href="#">
                  <p>Log in</p>
                </a>
              </li>
              <li
                class="border-2 relative bottom-2 border-white rounded-md pl-3 pt-2 pr-3
              hover:border-blue-400 hover:bg-white/10 hover:text-blue-300 transition-colors duration-200">
                <a href="#">
                  <p>Sign up</p>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </header>
  `,
})
export class HeaderComponent {}

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
                    <a href="#">Popular</a>
                    <a href="#">Now playing</a>
                    <a href="#">Upcoming</a>
                    <a href="#">Top rated</a>
                  </div>
                </div>
              </li>
              <li>
                <div class="dropdown">
                  <button class="dropbtn">TV Shows</button>
                  <div class="dropdown-content">
                    <a href="#">Popular</a>
                    <a href="#">Airing today</a>
                    <a href="#">On TV</a>
                    <a href="#">Top rated</a>
                  </div>
                </div>
              </li>
              <li>
                <div class="dropdown">
                  <button class="dropbtn">People</button>
                  <div class="dropdown-content">
                    <a href="#">Popular</a>
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
              <li><p>header</p></li>
              <li><p>header</p></li>
              <li><p>header</p></li>
              <li><p>header</p></li>
            </ul>
          </div>
        </div>
      </div>
    </header>
  `,
  styleUrls: ['../../../styles.scss'],
})
export class HeaderComponent {}

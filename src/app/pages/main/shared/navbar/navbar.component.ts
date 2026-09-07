import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="w-full bg-white-950 py-3 border-b border-gray-200">
      <div class="content">
        <div
          class="content__wrapper flex justify-center max-w-screen-xl mx-auto">
          <div class="content__wrapper-navbar_left">
            <ul
              class="flex flex-wrap justify-center gap-x-3 gap-y-2 px-4 sm:gap-x-5">
              <li>
                <div class="dropdown-navbar">
                  <button class="dropbtn">Overview &#9662;</button>
                  <div class="dropdown-navbar_content">
                    <a href="#">Popular</a>
                    <a href="#">Now playing</a>
                    <a href="#">Upcoming</a>
                    <a href="#">Top rated</a>
                  </div>
                </div>
              </li>
              <li>
                <div class="dropdown-navbar">
                  <button class="dropbtn">Media &#9662;</button>
                  <div class="dropdown-navbar_content">
                    <a href="#">Link 4</a>
                    <a href="#">Link 5</a>
                    <a href="#">Link 6</a>
                  </div>
                </div>
              </li>
              <li>
                <div class="dropdown-navbar">
                  <button class="dropbtn">Fandom &#9662;</button>
                  <div class="dropdown-navbar_content">
                    <a href="#">Link 7</a>
                    <a href="#">Link 8</a>
                    <a href="#">Link 9</a>
                  </div>
                </div>
              </li>
              <li>
                <div class="dropdown-navbar">
                  <button class="dropbtn">Share &#9662;</button>
                  <div class="dropdown-navbar_content">
                    <a href="#">Link 10</a>
                    <a href="#">Link 11</a>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </header>
  `,
  styles: `
    .dropbtn {
      width: auto;
      white-space: nowrap;
    }

    .dropdown-navbar {
      position: relative;
      overflow: visible;
    }

    li:nth-last-child(-n + 2) .dropdown-navbar_content {
      right: 0;
    }
  `,
})
export class NavbarComponent {}

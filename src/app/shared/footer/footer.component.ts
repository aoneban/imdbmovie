import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer',
  imports: [RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <footer class="w-full bg-blue-950 mt-[20px] pt-[60px] pb-[50px]">
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
                  <button class="dropbtn">footer</button>
                  <div class="dropdown-content">
                    <a href="#">Link 1</a>
                    <a href="#">Link 2</a>
                    <a href="#">Link 3</a>
                  </div>
                </div>
              </li>
              <li>
                <div class="dropdown">
                  <button class="dropbtn">footer</button>
                  <div class="dropdown-content">
                    <a href="#">Link 4</a>
                    <a href="#">Link 5</a>
                    <a href="#">Link 6</a>
                  </div>
                </div>
              </li>
              <li>
                <div class="dropdown">
                  <button class="dropbtn">footer</button>
                  <div class="dropdown-content">
                    <a href="#">Link 7</a>
                    <a href="#">Link 8</a>
                    <a href="#">Link 9</a>
                  </div>
                </div>
              </li>
              <li>
                <div class="dropdown">
                  <button class="dropbtn">footer</button>
                  <div class="dropdown-content">
                    <a href="#">Link 10</a>
                    <a href="#">Link 11</a>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  `,
  styleUrls: ['../../../styles.scss'],
})
export class FooterComponent {}
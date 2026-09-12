import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(document:click)': 'closeMenu()',
    '(keydown.escape)': 'closeMenu($event)',
  },
  template: `
    <header class="w-full bg-blue-950 py-3">
      <div class="header-layout max-w-screen-xl mx-auto px-4 sm:px-6">
        <a class="brand" [routerLink]="['/main']" aria-label="Cinema home">
          <img class="logo" decoding="async" src="/logo.png" alt="Cinema" />
        </a>
        <nav class="primary-navigation" aria-label="Main navigation">
          <ul class="navigation-list">
            <li>
              <div
                class="dropdown"
                [class.is-open]="activeMenu() === 'movies'"
                (focusout)="closeMenuOnFocusOut($event)">
                <button
                  type="button"
                  class="dropbtn"
                  [attr.aria-expanded]="activeMenu() === 'movies'"
                  aria-controls="header-movies"
                  (click)="toggleMenu('movies', $event)">
                  Movies
                </button>
                <div id="header-movies" class="dropdown-content">
                  <a [routerLink]="['/movies']">Popular</a>
                  <a [routerLink]="['/top-rated']">Top rated</a>
                  <a [routerLink]="['/upcoming']">Upcoming</a>
                  <a [routerLink]="['/now-playing']">Now playing</a>
                </div>
              </div>
            </li>
            <li>
              <div
                class="dropdown"
                [class.is-open]="activeMenu() === 'tv'"
                (focusout)="closeMenuOnFocusOut($event)">
                <button
                  type="button"
                  class="dropbtn"
                  [attr.aria-expanded]="activeMenu() === 'tv'"
                  aria-controls="header-tv"
                  (click)="toggleMenu('tv', $event)">
                  TV Shows
                </button>
                <div id="header-tv" class="dropdown-content">
                  <a [routerLink]="['/tv-popular']">Popular TV</a>
                  <a [routerLink]="['/airing-today']">Airing today</a>
                  <a [routerLink]="['/on-the-air']">On TV</a>
                  <a [routerLink]="['/tv-top-rated']">Top rated</a>
                </div>
              </div>
            </li>
            <li>
              <div
                class="dropdown"
                [class.is-open]="activeMenu() === 'people'"
                (focusout)="closeMenuOnFocusOut($event)">
                <button
                  type="button"
                  class="dropbtn"
                  [attr.aria-expanded]="activeMenu() === 'people'"
                  aria-controls="header-people"
                  (click)="toggleMenu('people', $event)">
                  People
                </button>
                <div id="header-people" class="dropdown-content">
                  <a [routerLink]="['/page-persons']">Popular</a>
                </div>
              </div>
            </li>
            <li>
              <div
                class="dropdown"
                [class.is-open]="activeMenu() === 'more'"
                (focusout)="closeMenuOnFocusOut($event)">
                <button
                  type="button"
                  class="dropbtn"
                  [attr.aria-expanded]="activeMenu() === 'more'"
                  aria-controls="header-more"
                  (click)="toggleMenu('more', $event)">
                  More
                </button>
                <div id="header-more" class="dropdown-content">
                  <a href="#">Discussions</a>
                  <a href="#">Leaderboard</a>
                  <a href="#">Support</a>
                </div>
              </div>
            </li>
          </ul>
        </nav>
        <nav class="account-navigation" aria-label="Account">
          <a href="#" class="account-link hover:text-blue-300">Log in</a>
          <a
            href="#"
            class="account-link border-2 border-white rounded-md hover:border-blue-400 hover:bg-white/10 hover:text-blue-300"
            >Sign up</a
          >
        </nav>
      </div>
    </header>
  `,
})
export class HeaderComponent {
  readonly activeMenu = signal<string | null>(null);

  toggleMenu(menu: string, event: Event): void {
    event.stopPropagation();
    this.activeMenu.update(activeMenu => (activeMenu === menu ? null : menu));
  }

  closeMenuOnFocusOut(event: FocusEvent): void {
    const dropdown = event.currentTarget as HTMLElement;
    if (!dropdown.contains(event.relatedTarget as Node | null)) {
      this.closeMenu();
    }
  }

  closeMenu(event?: Event): void {
    if (event) {
      const target = event.target as HTMLElement;
      target.closest('.dropdown')?.querySelector('button')?.focus();
    }
    this.activeMenu.set(null);
  }
}

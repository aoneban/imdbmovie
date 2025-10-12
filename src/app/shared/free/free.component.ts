import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { trigger, style, transition, animate } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { TrendingService } from '../../services/trending.service';
import { Movie } from '../../interfaces/interface';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-free',
  imports: [CommonModule, RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="switcher-wrapper flex max-w-screen-xl mx-auto mt-4">
      <h3 class="trending">Free To Watch</h3>
      <div class="switch">
        <button
          (click)="switchTo('movies')"
          [class.active]="activeButton === 'movies'">
          Movies
        </button>
        <div
          class="back"
          [ngClass]="{
            movies: activeButton === 'movies',
            tv: activeButton === 'tv',
          }"></div>
        <button (click)="switchTo('tv')" [class.active]="activeButton === 'tv'">
          TV
        </button>
      </div>
    </div>
    <section class="movies__main bg-none">
      <div class="movies__wrapper">
        <div class="movies__wrapper-block" [@listAnimation]="newData.length">
          <div
            class="movies__wrapper-cart"
            *ngFor="let movie of newData"
            [@fadeAnimation]>
            <img
              decoding="async"
              [routerLink]="['/tv', movie.id]"
              class="image"
              src="{{ startUrl + movie.poster_path }}"
              alt="{{ movie.title }}" />
            <a [routerLink]="['/tv', movie.id]">
              <p>{{ getMovieTitle(movie) }}</p>
            </a>
            <p>{{ getReleaseDate(movie) }}</p>
          </div>
        </div>
      </div>
    </section>
  `,
  styleUrls: ['../../../styles.scss'],
  animations: [
    trigger('fadeAnimation', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('1000ms 1000ms ease-out', style({ opacity: 1 })),
      ]),
      transition(':leave', [animate('300ms', style({ opacity: 0 }))]),
    ]),
    trigger('listAnimation', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('1000ms 1000ms ease-out', style({ opacity: 1 })),
      ]),
      transition(':leave', [animate('300ms', style({ opacity: 0 }))]),
    ]),
  ],
})
export class FreeComponent implements OnInit {
  newData: Movie[] = [];
  startUrl = 'https://image.tmdb.org/t/p/w500/';
  imgUrl = '';
  apiUrlmovies = 'https://api.themoviedb.org/3/tv/airing_today';
  apiUrlWeek = 'https://api.themoviedb.org/3/tv/on_the_air';
  activeButton = 'movies';

  constructor(
    private trendingService: TrendingService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.switchTo(this.activeButton);
  }

  switchTo(button: string): void {
    this.activeButton = button;
    const apiUrl = button === 'movies' ? this.apiUrlmovies : this.apiUrlWeek;

    this.trendingService.getTrendingDataMovies(apiUrl).subscribe(data => {
      this.newData = data.results;
      this.cdr.markForCheck();
    });
  }

  fetchData(apiUrl: string): void {
    this.trendingService.getTrendingDataMovies(apiUrl).subscribe(
      data => {
        this.newData = data.results;
      },
      error => {
        console.error('Error fetching data: ', error);
      }
    );
  }

  getMovieTitle(movie: Movie): string {
    return movie.title || movie.name || 'Untitled';
  }

  getReleaseDate(date: Movie): string {
    return date.release_date || date.first_air_date || 'Soon...';
  }
}

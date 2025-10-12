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
  selector: 'app-popular',
  imports: [CommonModule, RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="switcher-wrapper flex max-w-screen-xl mx-auto mt-4">
      <h3 class="trending">What's Popular</h3>
      <div class="switch">
        <button
          (click)="switchTo('popular')"
          [class.active]="activeButton === 'popular'">
          Popular
        </button>
        <div
          class="back"
          [ngClass]="{
            popular: activeButton === 'popular',
            tv: activeButton === 'tv',
            top: activeButton === 'top',
            upcoming: activeButton === 'upcoming',
          }"></div>
        <button (click)="switchTo('tv')" [class.active]="activeButton === 'tv'">
          Now Playing
        </button>
        <button
          (click)="switchTo('top')"
          [class.active]="activeButton === 'top'">
          Top Rated
        </button>
        <button
          (click)="switchTo('upcoming')"
          [class.active]="activeButton === 'upcoming'">
          Upcoming
        </button>
      </div>
    </div>
    <section class="movies__main bg-none">
      <div class="movies__wrapper">
        <div class="movies__wrapper-block" [@listAnimation]="newData.length">
          <div
            class="movies__wrapper-cart"
            *ngFor="let movie of newData; trackBy: trackByMovie"
            [@fadeAnimation]>
            <img
              decoding="async"
              [routerLink]="['/movie', movie.id]"
              (load)="onImageLoad($event)"
              class="image fade-in"
              src="{{ startUrl + movie.poster_path }}"
              alt="{{ movie.title }}" />
            <a [routerLink]="['/movie', movie.id]">
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
      transition(':leave', [animate('400ms', style({ opacity: 0 }))]),
    ]),
    trigger('listAnimation', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('1000ms 1000ms ease-out', style({ opacity: 1 })),
      ]),
      transition(':leave', [animate('400ms', style({ opacity: 0 }))]),
    ]),
  ],
})
export class PopularComponent implements OnInit {
  newData: Movie[] = [];
  startUrl = 'https://image.tmdb.org/t/p/w500/';
  imgUrl = '';
  apiUrlPopular =
    'https://api.themoviedb.org/3/movie/popular?language=en-US&page=1';
  apiUrlTv = 'https://api.themoviedb.org/3/movie/now_playing';
  apiUrlTop = 'https://api.themoviedb.org/3/movie/top_rated';
  apiUrlUpcoming =
    'https://api.themoviedb.org/3/movie/upcoming?language=en-US&page=1';
  activeButton = 'popular';

  constructor(
    private trendingService: TrendingService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.switchTo(this.activeButton);
  }

  trackByMovie(index: number, movie: Movie): number {
    return movie.id;
  }

  onImageLoad(event: Event) {
    (event.target as HTMLImageElement).classList.add('loaded');
  }

  switchTo(button: string): void {
    this.activeButton = button;
    let apiUrl = '';
    switch (button) {
      case 'popular':
        apiUrl = this.apiUrlPopular;
        break;

      case 'tv':
        apiUrl = this.apiUrlTv;
        break;

      case 'top':
        apiUrl = this.apiUrlTop;
        break;

      case 'upcoming':
        apiUrl = this.apiUrlUpcoming;
        break;

      default:
        apiUrl = this.apiUrlPopular;
        break;
    }

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

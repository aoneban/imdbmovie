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
            class="movies__wrapper-cart relative overflow-hidden"
            *ngFor="let movie of newData"
            [@fadeAnimation]>
            <div
              *ngIf="!loadedImages.has(movie.id)"
              class="absolute inset-0 bg-gray-300 animate-pulse mb-12 rounded-lg z-10">
              <img
                *ngIf="!loadedImages.has(movie.id)"
                class="absolute inset-0 w-full h-full p-5 object-cover bg-gray-300"
                src="/placeholder.svg"
                alt="placeholder" />
            </div>
            <img
              decoding="async"
              [routerLink]="['/tv', movie.id]"
              (load)="onImageLoad(movie.id)"
              class="image transition-opacity duration-700 relative z-0"
              [class.opacity-0]="!loadedImages.has(movie.id)"
              class="image"
              src="{{ startUrl + movie.poster_path }}"
              alt="{{ movie.title }}" />
            <a [routerLink]="['/tv', movie.id]">
              <p class="font-bold text-[15px] pl-[6px] pt-[14px] pb-[2px] break-words">{{ getMovieTitle(movie) }}</p>
            </a>
            <p class="italic text-[14px] pl-[6px] text-gray-400">{{ getReleaseDate(movie) }}</p>
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
  loadedImages = new Set<number>();

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

  onImageLoad(id: number) {
    setTimeout(() => {
      this.loadedImages.add(id);
      this.cdr.markForCheck();
    }, 2000);
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

  getReleaseDate(movie: Movie): string {
    const dateMovie = movie.release_date || movie.first_air_date || 'Soon...';
    const year = dateMovie.slice(0, 4);
    const monthNumber = Number(dateMovie.slice(5, 7));
    const monthName = new Date(2020, monthNumber - 1).toLocaleString('en', { month: 'long' });
    const day = dateMovie.slice(-2);
    return `${monthName.slice(0, 3)} ${day}, ${year}`;
  }
}

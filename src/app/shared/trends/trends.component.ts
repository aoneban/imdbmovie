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
import { getReleaseDate } from '../../helpers/getReleaseDate';

@Component({
  selector: 'app-trends',
  imports: [CommonModule, RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="switcher-wrapper flex max-w-screen-xl mx-auto mt-4">
      <h3 class="trending">Trending</h3>
      <div class="switch">
        <button
          (click)="switchTo('today')"
          [class.active]="activeButton === 'today'">
          Top today
        </button>
        <div
          class="back"
          [ngClass]="{
            today: activeButton === 'today',
            'this-week': activeButton === 'this-week',
          }"></div>
        <button
          (click)="switchTo('this-week')"
          [class.active]="activeButton === 'this-week'">
          This week
        </button>
      </div>
    </div>
    <section class="movies__main">
      <div class="movies__wrapper">
        <div class="movies__wrapper-block" [@listAnimation]="newData.length">
          <div
            class="movies__wrapper-cart relative overflow-hidden"
            *ngFor="let movie of newData"
            [@fadeAnimation]>
            <div
              *ngIf="!loadedImages.has(movie.id)"
              class="absolute inset-0 bg-gray-700 animate-pulse rounded-lg"></div>
            <div
              class="rating"
              [ngClass]="{
                'border-2 border-green-500': movie.vote_average >= 7,
                'border-2 border-yellow-500':
                  movie.vote_average >= 5 && movie.vote_average < 7,
                'border-2 border-red-500': movie.vote_average < 5,
              }">
              <span class="imdb">imdb</span>
              <span class="mark">{{ movie.vote_average.toFixed(1) }}</span>
            </div>
            <img
              *ngIf="!loadedImages.has(movie.id)"
              class="absolute inset-0 w-full h-full p-5 object-cover bg-gray-300"
              src="/placeholder.svg"
              alt="placeholder" />
            <img
              decoding="async"
              [routerLink]="[movie.media_type === 'movie' ? '/movie' : '/tv', movie.id]"
              (load)="onImageLoad(movie.id)"
              class="image transition-opacity duration-700 min-h-[220px]"
              [class.opacity-0]="!loadedImages.has(movie.id)"
              src="{{ startUrl + movie.poster_path }}"
              alt="{{ movie.title }}" />
            <a [routerLink]="[movie.media_type === 'movie' ? '/movie' : '/tv', movie.id]">
              <p
                class="font-bold text-[15px] pl-[6px] pt-[15px] pb-[2px] break-words">
                {{ getMovieTitle(movie) }}
              </p>
            </a>
            <p class="italic text-[14px] pl-[6px] text-gray-400">
              {{ getDate(movie) }}
            </p>
          </div>
        </div>
      </div>
    </section>
  `,
   animations: [
    trigger('fadeAnimation', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('1000ms', style({ opacity: 1 })),
      ]),
      transition(':leave', [animate('300ms', style({ opacity: 0 }))]),
    ]),
    trigger('listAnimation', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('1000ms', style({ opacity: 1 })),
      ]),
      transition(':leave', [animate('300ms', style({ opacity: 0 }))]),
    ]),
  ],
})
export class TrendsComponent implements OnInit {
  newData: Movie[] = [];
  startUrl = 'https://image.tmdb.org/t/p/w500/';
  apiUrlToday =
    'https://api.themoviedb.org/3/trending/all/day?language=en-US';
  apiUrlWeek =
    'https://api.themoviedb.org/3/trending/all/week?language=en-US';
  activeButton = 'today';
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
    const apiUrl = button === 'today' ? this.apiUrlToday : this.apiUrlWeek;

    this.trendingService.getTrendingDataMovies(apiUrl).subscribe(data => {
      this.newData = data.results;
      this.cdr.markForCheck();
      console.log(this.newData);
    });
  }

  onImageLoad(id: number) {
    this.loadedImages.add(id);
  }

  getMovieTitle(movie: Movie): string {
    return movie.title || movie.name || 'Untitled';
  }

  getDate(movie: Movie): string {
    const newDate = getReleaseDate(movie);
    return newDate;
  }
}

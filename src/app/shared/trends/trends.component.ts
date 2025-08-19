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
            class="movies__wrapper-cart"
            *ngFor="let movie of newData"
            [@fadeAnimation]>
            <img
              decoding="async"
              [routerLink]="['/movie', movie.id]"
              class="image"
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
  imgUrl = '';
  apiUrlToday =
    'https://api.themoviedb.org/3/trending/movie/day?language=en-US';
  apiUrlWeek =
    'https://api.themoviedb.org/3/trending/movie/week?language=en-US';
  activeButton = 'today';

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
    });
  }

  getMovieTitle(movie: Movie): string {
    return movie.title || movie.name || 'Untitled';
  }

  getReleaseDate(date: Movie): string {
    return date.release_date || date.first_air_date || 'Soon...';
  }
}

import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Input,
  signal,
} from '@angular/core';
import { trigger, style, transition, animate } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { TrendingService } from '../../../../services/trending.service';
import { Movie, PopularConfig } from '../../../../interfaces/interface';
import { RouterModule } from '@angular/router';
import { getReleaseDate } from '../../../../helpers/getReleaseDate';
import { MediaTypeService } from '../../../../services/media-type.service';
import { RatingComponent } from '../../../movie/block-hero/rating/rating.component';
import { TMDB } from '../../../../config/tmdb.config';

@Component({
  selector: 'app-popular',
  imports: [CommonModule, RouterModule, RatingComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="popular-section">
      <div class="popular-header">
        <h3 class="popular-heading">{{ config.title }}</h3>
        <div
          class="popular-tabs switch"
          role="group"
          [attr.aria-label]="config.title + ' categories'"
          [attr.data-active-tab]="activeButton"
          [style.--mobile-tab-rows]="config.type.length > 2 ? 2 : 1"
          [style.--tab-count]="config.type.length">
          <button
            type="button"
            (click)="switchTo('popular')"
            [attr.aria-pressed]="activeButton === 'popular'"
            [class.active]="activeButton === 'popular'">
            {{ config.type[0] }}
          </button>
          <button
            type="button"
            (click)="switchTo('tv')"
            [attr.aria-pressed]="activeButton === 'tv'"
            [class.active]="activeButton === 'tv'">
            {{ config.type[1] }}
          </button>
          <button
            *ngIf="config.type[2]"
            type="button"
            (click)="switchTo('top')"
            [attr.aria-pressed]="activeButton === 'top'"
            [class.active]="activeButton === 'top'">
            {{ config.type[2] }}
          </button>
          <button
            *ngIf="config.type[3]"
            type="button"
            (click)="switchTo('upcoming')"
            [attr.aria-pressed]="activeButton === 'upcoming'"
            [class.active]="activeButton === 'upcoming'">
            {{ config.type[3] }}
          </button>
        </div>
      </div>
      <div
        class="popular-content movies__wrapper"
        [class.popular-content--trending]="config.bgData">
        <div class="popular-carousel" [@listAnimation]="newData().length">
          <article
            class="popular-card"
            *ngFor="let movie of newData(); trackBy: trackByMovie"
            [@fadeAnimation]>
            <div class="popular-poster">
              <a
                class="popular-poster-link"
                [routerLink]="[
                  (movie.media_type || type) === 'movie' ? '/movie' : '/tv',
                  movie.id,
                ]"
                (click)="setType(movie.media_type ? movie.media_type : type)">
                <div
                  *ngIf="!loadedImages.has(movie.id)"
                  class="popular-placeholder"
                  aria-hidden="true">
                  <img src="/placeholder.svg" alt="" />
                </div>
                <img
                  decoding="async"
                  (load)="onImageLoad(movie.id)"
                  class="popular-image"
                  [class.popular-image--loading]="!loadedImages.has(movie.id)"
                  [src]="startUrl + movie.poster_path"
                  [alt]="getMovieTitle(movie)" />
              </a>
              <app-rating [rat]="movie" class="popular-rating"></app-rating>
            </div>
            <a
              class="popular-title"
              [routerLink]="[
                (movie.media_type || type) === 'movie' ? '/movie' : '/tv',
                movie.id,
              ]"
              (click)="setType(movie.media_type ? movie.media_type : type)">
              {{ getMovieTitle(movie) }}
            </a>
            <p class="popular-date">
              {{ getDate(movie) }}
            </p>
          </article>
        </div>
      </div>
    </section>
  `,
  animations: [
    trigger('fadeAnimation', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('1000ms 200ms ease-out', style({ opacity: 1 })),
      ]),
      transition(':leave', [animate('400ms', style({ opacity: 0 }))]),
    ]),
    trigger('listAnimation', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('1000ms 200ms ease-out', style({ opacity: 1 })),
      ]),
      transition(':leave', [animate('400ms', style({ opacity: 0 }))]),
    ]),
  ],
})
export class PopularComponent implements OnInit {
  @Input() config!: PopularConfig;
  newData = signal<Movie[]>([]);
  startUrl = TMDB.imageBaseUrl;
  imgUrl = '';
  type!: string;
  media = '';

  activeButton = 'popular';
  loadedImages = new Set<number>();

  constructor(
    private trendingService: TrendingService,
    private cdr: ChangeDetectorRef,
    private mediaTypeService: MediaTypeService
  ) {}

  ngOnInit(): void {
    this.switchTo(this.activeButton);
    this.type = this.config.mediaType as string;
  }

  trackByMovie(index: number, movie: Movie): number {
    return movie.id;
  }

  onImageLoad(id: number) {
    setTimeout(() => {
      this.loadedImages.add(id);
      this.cdr.markForCheck();
    }, 2000);
  }

  setType(type: string) {
    this.mediaTypeService.setMediaType(type);
  }

  switchTo(button: string): void {
    this.activeButton = button;
    let apiUrl = '';
    switch (button) {
      case 'popular':
        apiUrl = this.config.link[0];
        break;

      case 'tv':
        apiUrl = this.config.link[1];
        break;

      case 'top':
        if (this.config.link[2]) apiUrl = this.config.link[2];
        break;

      case 'upcoming':
        if (this.config.link[3]) apiUrl = this.config.link[3];
        break;

      default:
        apiUrl = this.config.link[0];
        break;
    }

    this.trendingService.getTrendingDataMovies(apiUrl).subscribe(data => {
      this.newData.set(data.results);
      this.cdr.markForCheck();
    });
  }

  fetchData(apiUrl: string): void {
    this.trendingService.getTrendingDataMovies(apiUrl).subscribe(
      data => {
        this.newData.set(data.results);
      },
      error => {
        console.error('Error fetching data: ', error);
      }
    );
  }

  getMovieTitle(movie: Movie): string {
    return movie.title || movie.name || 'Untitled';
  }

  getDate(movie: Movie): string {
    const newDate = getReleaseDate(movie);
    return newDate;
  }
}

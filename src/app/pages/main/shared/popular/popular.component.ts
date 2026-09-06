import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Input,
  signal,
  computed,
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
    <div class="switcher-wrapper flex max-w-screen-xl mx-auto mt-4">
      <h3 class="trending">{{ config.title }}</h3>
      <div class="switch">
        <button
          (click)="switchTo('popular')"
          [class.active]="activeButton === 'popular'">
          {{ config.type[0] }}
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
          {{ config.type[1] }}
        </button>
        <button
          *ngIf="config.type[2]"
          (click)="switchTo('top')"
          [class.active]="activeButton === 'top'">
          {{ config.type[2] }}
        </button>
        <button
          *ngIf="config.type[3]"
          (click)="switchTo('upcoming')"
          [class.active]="activeButton === 'upcoming'">
          {{ config.type[3] }}
        </button>
      </div>
    </div>
    <section class="movies__main" [class.bg-none]="!config.bgData">
      <div class="movies__wrapper">
        <div class="movies__wrapper-block" [@listAnimation]="newData().length">
          <div
            class="movies__wrapper-cart relative overflow-hidden"
            *ngFor="let movie of newData(); trackBy: trackByMovie"
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
            <!--Rating component start-->
            <app-rating
              [rat]="movie"
              class="absolute bottom-[1.4rem] left-2 !z-[11]"></app-rating>
            <!--Rating component end-->
            <img
              decoding="async"
              [routerLink]="[
                (movie.media_type || type) === 'movie' ? '/movie' : '/tv',
                movie.id,
              ]"
              (load)="onImageLoad(movie.id)"
              (click)="setType(movie.media_type ? movie.media_type : type)"
              class="image transition-opacity duration-700 relative z-0 min-h-[220px]"
              [class.opacity-0]="!loadedImages.has(movie.id)"
              [src]="startUrl + movie.poster_path"
              alt="{{ movie.title }}" />
            <a
              [routerLink]="[
                (movie.media_type || type) === 'movie' ? '/movie' : '/tv',
                movie.id,
              ]"
              (click)="setType(movie.media_type ? movie.media_type : type)">
              <p
                class="font-bold text-[15px] pl-[6px] pt-[14px] pb-[2px] break-words">
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

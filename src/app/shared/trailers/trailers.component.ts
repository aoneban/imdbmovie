import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrendingService } from '../../services/trending.service';
import { trigger, style, transition, animate } from '@angular/animations';
import { Movie, VideoResult, VideoResponse } from '../../interfaces/interface';
import { TrailerMovieService } from '../../services/trailermovie.service';
import { YouTubePlayerModule } from '@angular/youtube-player';

@Component({
  selector: 'app-trailers',
  imports: [CommonModule, YouTubePlayerModule],
  template: `
    <section
      [ngStyle]="{ 'background-image': 'url(' + startUrl + imgUrl + ')' }"
      class="background-trailers">
      <div class="trailers switcher-wrapper flex max-w-screen-xl mx-auto mt-4">
        <h3 class="trending">Latest Trailers</h3>
        <div class="switch-trailers">
          <button
            (click)="switchTo('today')"
            [class.active]="activeButton === 'today'">
            Popular
          </button>
          <div
            class="back-trailers"
            [ngClass]="{
              today: activeButton === 'today',
              'this-week': activeButton === 'this-week',
              'on-tv': activeButton === 'on-tv',
              'in-theatres': activeButton === 'in-theatres',
            }"></div>
          <button
            (click)="switchTo('this-week')"
            [class.active]="activeButton === 'this-week'">
            Streaming
          </button>
          <button
            (click)="switchTo('on-tv')"
            [class.active]="activeButton === 'on-tv'">
            On TV
          </button>
          <button
            (click)="switchTo('in-theatres')"
            [class.active]="activeButton === 'in-theatres'">
            In Theatres
          </button>
        </div>
      </div>
      <section class="movies__trailers">
        <div class="movies__trailers-cart">
          <div class="movies__trailers-block" [@listAnimation]="newData.length">
            <div
              class="movies__wrapper-cart cart"
              *ngFor="let movie of newData"
              [@fadeAnimation]>
              <div
                class="img-wrapper relative w-full h-full"
                role="button"
                tabindex="0"
                (click)="
                  onImageClick(
                    movie.media_type === 'movie' ? apiUrlMovie : apiUrlSeries,
                    apiUrlEnd,
                    movie.id
                  )
                "
                (keydown.enter)="
                  onImageClick(
                    movie.media_type === 'movie' ? apiUrlMovie : apiUrlSeries,
                    apiUrlEnd,
                    movie.id
                  )
                "
                (keydown.space)="
                  onImageClick(
                    movie.media_type === 'movie' ? apiUrlMovie : apiUrlSeries,
                    apiUrlEnd,
                    movie.id
                  )
                ">
                <div class="play-triangle"></div>
                <img
                  class="image relative z-10"
                  [src]="startUrl + movie.backdrop_path"
                  alt="{{ movie.title }}" />
              </div>
              <p class="font-bold text-[16px] pl-[6px] pb-[2px]">
                {{ getMovieTitle(movie) }}
              </p>
            </div>
          </div>
        </div>
        <div
          class="modal-overlay"
          *ngIf="selectedVideoId"
          (click)="closeModal()"
          (keyup.enter)="closeModal()"
          (keyup.space)="closeModal()">
          <div class="modal-content" (click)="$event.stopPropagation()">
            <youtube-player [videoId]="selectedVideoId"></youtube-player>
          </div>
        </div>
      </section>
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
export class TrailersComponent implements OnInit {
  apiUrlMovie = 'https://api.themoviedb.org/3/movie/';
  apiUrlSeries = 'https://api.themoviedb.org/3/tv/';
  apiUrlEnd = '/videos?language=en-US';
  newData: Movie[] = [];
  trailersData: VideoResult[] = [];
  selectedVideoId: string | null = null;
  startUrl = 'https://image.tmdb.org/t/p/w1280/';
  imgUrl = '';
  apiUrl1 = 'https://api.themoviedb.org/3/trending/all/day?language=en-US';
  apiUrl2 = 'https://api.themoviedb.org/3/trending/movie/day?language=en-US';
  apiUrl3 = 'https://api.themoviedb.org/3/trending/tv/day?language=en-US';
  apiUrl4 = 'https://api.themoviedb.org/3/tv/airing_today?language=en-US&page=1';
  activeButton = 'today';

  constructor(
    private trendingService: TrendingService,
    private trailerMovie: TrailerMovieService
  ) {}

  ngOnInit(): void {
    this.trendingService.getTrendingDataMovies(this.apiUrl1).subscribe(
      data => {
        this.newData = data.results;
        this.imgUrl = this.newData[0].backdrop_path;
      },
      error => {
        console.error('Error fetching data:', error);
      }
    );
  }
  switchTo(button: string): void {
    this.activeButton = button;
    let apiUrl = '';
    if (button === 'today') {
      apiUrl = this.apiUrl1;
    } else if (button === 'this-week') {
      apiUrl = this.apiUrl2;
    } else if (button === 'on-tv') {
      apiUrl = this.apiUrl3;
    } else if (button === 'in-theatres') {
      apiUrl = this.apiUrl4;
    }
    this.fetchData(apiUrl);
  }

  fetchData(apiUrl: string): void {
    this.trendingService.getTrendingDataMovies(apiUrl).subscribe(
      data => {
        this.newData = data.results;
        this.imgUrl = this.newData[0].backdrop_path;
      },
      error => {
        console.error('Error fetching data: ', error);
      }
    );
  }
  getMovieTitle(movie: Movie): string {
    return movie.title || movie.name || 'Untitled';
  }

  onImageClick(one: string, two: string, id: number): void {
    this.trailerMovie.getTrailersVideo(one, two, id).subscribe(
      (data: VideoResponse) => {
        const video = data.results.find(v => v.site === 'YouTube');
        if (video) {
          this.selectedVideoId = video.key;
          this.stopScrolling();
        }
      },
      error => console.error(error)
    );
  }

  stopScrolling(): void {
    document.body.style.overflow = 'hidden';
    this.indexes('-1');
  }

  closeModal(): void {
    this.selectedVideoId = null;
    document.body.style.overflow = '';
    this.indexes('1');
  }

  indexes(ind: string) {
    const switches = document.querySelectorAll('.switch');
    const movies = document.querySelectorAll('.movies__wrapper');
    switches.forEach(el => ((el as HTMLElement).style.zIndex = ind));
    movies.forEach(el => ((el as HTMLElement).style.zIndex = ind));
  }
}

import { Component, OnInit } from '@angular/core';
// import { trigger, style, transition, animate } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { TrendingService } from '../../services/trending.service';
import { Movie } from '../../interfaces/interface';

@Component({
  selector: 'app-trailers',
  imports: [CommonModule],
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
              <img
                class="image"
                src="{{ startUrl + movie.backdrop_path }}"
                alt="{{ movie.title }}" />
              <p>{{ getMovieTitle(movie) }}</p>
            </div>
          </div>
        </div>
      </section>
    </section>
  `,
  styleUrls: ['../../../styles.scss'],
})
export class TrailersComponent implements OnInit {
  newData: Movie[] = [];
  startUrl = 'https://image.tmdb.org/t/p/w1280/';
  imgUrl = '';
  apiUrl1 =
    'https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=1';
  apiUrl2 = 'https://api.themoviedb.org/3/trending/all/day?language=en-US';
  apiUrl3 = 'https://api.themoviedb.org/3/tv/on_the_air?language=en-US&page=1';
  apiUrl4 = 'https://api.themoviedb.org/3/movie/upcoming?language=en-US&page=1';
  activeButton = 'today';

  constructor(private trendingService: TrendingService) {}

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
}

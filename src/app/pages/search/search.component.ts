import { Component, effect, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  ApiResponsePerson,
  MovieSearchResponse,
} from '../../interfaces/interface';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SearchService } from '../../services/search.service';
import { MediaTypeService } from '../../services/media-type.service';
import { MoviesComponent } from './movies/movies.component';
import { TvComponent } from './tv/tv.component';
import { PersonsComponent } from './persons/persons.component';

@Component({
  selector: 'app-search',
  imports: [
    CommonModule,
    RouterModule,
    MoviesComponent,
    TvComponent,
    PersonsComponent,
  ],
  host: {
    class: 'block min-w-0',
  },
  template: `
    <section
      class="mx-auto min-h-screen w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <h1
        class="mb-6 text-2xl font-bold text-gray-900 [overflow-wrap:anywhere] sm:text-3xl lg:text-4xl">
        {{ fromInput }}
      </h1>
      <div
        class="grid min-w-0 gap-6 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-8">
        <aside
          aria-labelledby="search-categories-heading"
          class="min-w-0 self-start">
          <h2
            id="search-categories-heading"
            class="flex items-center justify-center rounded-t-lg bg-sky-500 p-6 text-xl font-bold text-white">
            Search results
          </h2>
          <ul>
            @for (item of sortedArray(); track item) {
              <li
                class="min-w-0"
                [ngClass]="{
                  'bg-gray-300': selectedItem() === item[0],
                }">
                <button
                  type="button"
                  (click)="handleClick(item[0])"
                  [attr.aria-pressed]="selectedItem() === item[0]"
                  class="flex w-full min-w-0 items-center justify-between gap-4 p-4 text-left text-base focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-sky-600">
                  <span
                    class="min-w-0 break-words"
                    [ngClass]="{
                      'font-bold': selectedItem() === item[0],
                    }">
                    {{ item[0] }}
                  </span>
                  <span class="shrink-0 text-right font-normal tabular-nums">
                    {{ item[1] }}
                  </span>
                </button>
              </li>
            }
          </ul>
        </aside>
        <div class="min-w-0">
          @switch (currentContent) {
            @case ('Movies') {
              <app-movies
                [movieResponse]="movieResponse()"
                [loadedImages]="loadedImages()"
                (loadMoreClick)="onImageLoad($event)"
                (loadSetType)="setType()"></app-movies>
            }
            @case ('TV Shows') {
              <app-tv
                [tvResponse]="tvResponse()"
                [loadedImages]="loadedImages()"
                (loadMoreClick)="onImageLoad($event)"
                (loadSetType)="setType($event)"></app-tv>
            }
            @case ('Persons') {
              <app-persons
                [personResponse]="personResponse()"
                [loadedImages]="loadedImages()"
                (loadMoreClick)="onImageLoad($event)"
                (loadSetType)="setType($event)"></app-persons>
            }
            @default {
              <app-movies
                [movieResponse]="movieResponse()"
                [loadedImages]="loadedImages()"
                (loadMoreClick)="onImageLoad($event)"
                (loadSetType)="setType()"></app-movies>
            }
          }
        </div>
      </div>
      <div>
        <!-- <button
          [disabled]="numberPage === 1"
          (click)="previousPage()"
          class="px-1 py-1 rounded bg-blue-600 text-white font-medium hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed">
          Previous
        </button>
        <span class="ml-6 mr-6">{{ numberPage }}</span>
        <button
          [disabled]="numberPage === totalPages"
          (click)="nextPage()"
          class="px-1 py-1 rounded bg-blue-600 text-white font-medium hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed">
          Next
        </button> -->
      </div>
    </section>
  `,
  styles: ``,
})
export class SearchComponent {
  apiUrl3 = 'https://api.themoviedb.org/3/search/person?query=';
  apiUrl0 = 'https://api.themoviedb.org/3/search/tv?query=';
  apiUrl1 = 'https://api.themoviedb.org/3/search/movie?query=';
  apiUrl2 = '&include_adult=false&language=en-US&page=';
  startUrl = 'https://image.tmdb.org/t/p/w200';
  fromInput: string | undefined;
  numberPage = 1;
  totalPages = 0;
  currentContent = '';
  totalDataArray: [string, number, number][] = [];
  movieResponse = signal<MovieSearchResponse | undefined>(undefined);
  tvResponse = signal<MovieSearchResponse | undefined>(undefined);
  personResponse = signal<ApiResponsePerson | undefined>(undefined);
  loadedImages = signal<Set<number>>(new Set());
  selectedItem = signal<string | null>(null);

  constructor(
    private route: ActivatedRoute,
    private searchService: SearchService,
    private mediaTypeService: MediaTypeService
  ) {
    effect(() => {
      this.route.queryParams.subscribe(params => {
        this.fromInput = params['query'];
      });
      this.searchService
        .getDataSearch<MovieSearchResponse>(
          this.apiUrl1,
          this.apiUrl2,
          this.fromInput as string,
          this.numberPage
        )
        .subscribe(
          data => {
            this.movieResponse.set(data);
            this.selectedItem.set('Movies');
            this.totalDataArray.push(['Movies', data.total_results, 0]);
          },
          error => {
            console.error('Error fetching data: ', error);
          }
        );
      this.searchService
        .getDataSearch<MovieSearchResponse>(
          this.apiUrl0,
          this.apiUrl2,
          this.fromInput as string,
          this.numberPage
        )
        .subscribe(
          data => {
            this.tvResponse.set(data);
            this.totalDataArray.push(['TV Shows', data.total_results, 1]);
          },
          error => {
            console.error('Error fetching data: ', error);
          }
        );
      this.searchService
        .getDataSearch<ApiResponsePerson>(
          this.apiUrl3,
          this.apiUrl2,
          this.fromInput as string,
          this.numberPage
        )
        .subscribe(
          data => {
            this.personResponse.set(data);
            this.totalDataArray.push(['Persons', data.total_results, 2]);
          },
          error => {
            console.error('Error fetching data: ', error);
          }
        );
    });
  }

  onImageLoad(id: number): void {
    setTimeout(() => {
      this.loadedImages.update(set => new Set([...set, id]));
    }, 2000);
  }

  setType(type: string = 'movie'): void {
    this.mediaTypeService.setMediaType(type);
  }

  goTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  sortedArray() {
    return this.totalDataArray.sort((a, b) => a[2] - b[2]);
  }

  // nextPage(): void {
  //   this.numberPage += 1;
  //   if (this.totalPages !== undefined || this.totalPages !== null) {
  //     if (this.numberPage > this.totalPages) this.numberPage = this.totalPages;
  //   }
  //   if (this.fromInput !== undefined)
  //     this.fetchData(this.apiUrl1, this.apiUrl2, this.fromInput);
  //   this.goTop();
  // }

  // previousPage(): void {
  //   this.numberPage -= 1;
  //   if (this.numberPage === 0) this.numberPage = 1;
  //   if (this.fromInput !== undefined)
  //     this.fetchData(this.apiUrl1, this.apiUrl2, this.fromInput);
  //   this.goTop();
  // }
  handleClick(item: string): void {
    this.currentContent = item;
    this.selectedItem.set(item);
  }
}

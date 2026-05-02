import { Component, computed, effect, signal } from '@angular/core';
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
  template: `
    <section class="w-[80%] min-h-screen mx-auto">
      <div class="flex">
        <div class="basis-[20%] mt-[7.5%]">
          <div class="h-[auto]">
            <h3
              class="bg-sky-500/100 text-white font-bold text-xl p-6 flex items-center justify-center rounded-t-lg">
              Search results
            </h3>
            <ul>
              @for (item of sortedArray(); track item) {
                <li
                  class="flex justify-between"
                  [ngClass]="{
                    'bg-gray-300': selectedItem() === item[0],
                  }">
                  <button
                    (click)="handleClick($event, item[0])"
                    [ngClass]="{
                      'font-bold': selectedItem() === item[0],
                    }"
                    class="text-left p-4 w-[100%]">
                    {{ item[0] }}
                  </button>
                  <p class="p-4">{{ item[1] }}</p>
                </li>
              }
            </ul>
          </div>
        </div>
        <div class="basis-[80%]">
          <h1 class="text-4xl pt-4 pb-4 font-bold text-white-900 mb-4">
            {{ fromInput }}
          </h1>
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
  numberPage: number = 1;
  totalPages: number = 0;
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
            console.log('response movie', this.movieResponse());
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
            console.log('response tv', this.tvResponse());
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
            console.log('response persons', this.personResponse());
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
  handleClick(event: MouseEvent, item: string): void {
    const target = event.currentTarget as HTMLElement;
    this.currentContent = target.innerText;
    this.selectedItem.set(item);
  }
}

import { ChangeDetectorRef, Component, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MovieSearchResponse } from '../../interfaces/interface';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TruncateWordsPipe } from '../../../pipes/truncate-words.pipe';
import { SearchService } from '../../services/search.service';
import { MediaTypeService } from '../../services/media-type.service';

@Component({
  selector: 'app-search',
  imports: [CommonModule, RouterModule, TruncateWordsPipe],
  template: `
    <section class="w-[80%] min-h-screen mx-auto">
      <h1 class="text-4xl pt-4 pb-4 font-bold text-white-900 mb-4">
        {{ fromInput }}
      </h1>
      <ul>
        <li
          *ngFor="
            let movie of movieResponse()?.results;
            index as i;
            first as isFirst
          ">
          <div
            class="full relative min-h-[150px] flex gap-[15px] m-[20px] border border-gray-300 rounded-[10px] overflow-hidden">
            <div class="basis-[8%]">
              <div
                *ngIf="!loadedImages.has(movie.id)"
                class="absolute w-[8%] top-[20px] pb-12 animate-pulse z-10">
                <img src="/placeholder.svg" alt="placeholder" />
              </div>
              <img
                decoding="async"
                class="w-[100%] h-[100%]"
                (load)="onImageLoad(movie.id)"
                [class.opacity-0]="!loadedImages.has(movie.id)"
                [src]="startUrl + (movie.poster_path || '')"
                [alt]="movie?.title || ''" />
            </div>

            <div class="basis-[92%] pt-2 pb-2">
              <a [routerLink]="['/movie', movie.id]" (click)="setType()">
                <h3 class="text-xl font-bold tracking-tight text-gray-800">
                  {{ movie.title }}
                </h3>
              </a>
              <p class="italic text-[13px] text-gray-400">
                {{ movie.release_date }}
              </p>
              <p>{{ movie.overview | truncateWords: 70 }}</p>
            </div>
          </div>
        </li>
      </ul>
      <div>
        <button
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
        </button>
      </div>
    </section>
  `,
  styles: ``,
})
export class SearchComponent {
  apiUrl1 = 'https://api.themoviedb.org/3/search/movie?query=';
  apiUrl2 = '&include_adult=false&language=en-US&page=';
  startUrl = 'https://image.tmdb.org/t/p/w200';
  fromInput: string | undefined;
  numberPage: number = 1;
  totalPages: number = 0;
  movieResponse = signal<MovieSearchResponse | undefined>(undefined);
  loadedImages = new Set<number>();

  constructor(
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private searchService: SearchService,
    private mediaTypeService: MediaTypeService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const query = params['query'];
      this.fromInput = query;
      this.fetchData(this.apiUrl1, this.apiUrl2, query);
    });
  }

  fetchData(one: string, two: string, text: string): void {
    this.searchService.getDataMovie(one, two, text, this.numberPage).subscribe(
      data => {
        this.movieResponse.set(data);
        this.totalPages = data.total_pages;
        console.log('Movie data: ', this.movieResponse());
      },
      error => {
        console.error('Error fetching data: ', error);
      }
    );
  }

  onImageLoad(id: number): void {
    setTimeout(() => {
      this.loadedImages.add(id);
      this.cdr.markForCheck();
    }, 2000);
  }

  setType(type: string = 'movie'): void {
    this.mediaTypeService.setMediaType(type);
  }

  goTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  nextPage(): void {
    this.numberPage += 1;
    if (this.totalPages !== undefined || this.totalPages !== null) {
      if (this.numberPage > this.totalPages) this.numberPage = this.totalPages;
    }
    if (this.fromInput !== undefined)
      this.fetchData(this.apiUrl1, this.apiUrl2, this.fromInput);
    this.goTop();
  }

  previousPage(): void {
    this.numberPage -= 1;
    if (this.numberPage === 0) this.numberPage = 1;
    if (this.fromInput !== undefined)
      this.fetchData(this.apiUrl1, this.apiUrl2, this.fromInput);
    this.goTop();
  }
}

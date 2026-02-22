import { Component, signal } from '@angular/core';
import { MoviesService } from '../../services/movies.service';
import { Movie } from '../../interfaces/interface';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { getReleaseDate } from '../../helpers/getReleaseDate';
import { MediaTypeService } from '../../services/media-type.service';

@Component({
  selector: 'app-movies',
  imports: [CommonModule, RouterModule],
  template: `
    <section>
      <h1 class="w-[78%] mx-auto mt-6 text-4xl font-bold text-white-900">
        {{ namePage }}
      </h1>
      <div class="flex w-[80%] mx-auto flex-wrap justify-center">
        @for (movie of movieData(); track $index) {
          <div class="relative w-[20%] mt-5">
            <div
              class="rating h-[40px] w-[40px] left-8 top-[30px] !z-[1]"
              [ngClass]="{
                'border-2 border-green-500': movie.vote_average >= 7,
                'border-2 border-yellow-500':
                  movie.vote_average >= 5 && movie.vote_average < 7,
                'border-2 border-red-500': movie.vote_average < 5,
              }">
              <span class="imdb">imdb</span>
              <span class="mark">{{ movie.vote_average.toFixed(1) }}</span>
            </div>
            <div
              class="m-5 h-[100%] rounded-xl border border-gray-200 overflow-hidden">
              <img
                *ngIf="!loadedImages.has(movie.id)"
                class="absolute inset-0 w-[80%] h-[80%] p-5 m-5 object-cover bg-gray-300"
                src="/placeholder.svg"
                alt="placeholder" />
              <img
                decoding="auto"
                class="w-[auto] transition-opacity duration-700 rounded-none"
                [src]="
                  movie?.poster_path
                    ? startUrl + movie.poster_path
                    : '/placeholder.svg'
                "
                (load)="onImageLoad(movie.id)"
                [class.opacity-0]="!loadedImages.has(movie.id)"
                alt="{{ movie.name }}" />
              <h3
                class="cursor-pointer font-bold relative top-4 left-3"
                (click)="setType(mediaType)"
                [routerLink]="[
                  mediaType === 'movie' ? '/movie' : '/tv',
                  movie.id,
                ]">
                {{ movie.title || movie.name }}
              </h3>
              <p class="relative top-4 left-3 italic text-[14px] text-gray-400">
                {{ getDate(movie) }}
              </p>
            </div>
          </div>
        }
        <div class="mt-10">
          <button
            [disabled]="page === 1"
            (click)="previousPage()"
            class="px-1 py-1 rounded bg-blue-600 text-white font-medium hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed">
            Previous
          </button>
          <span class="ml-6 mr-6">{{ page }} from {{ totalPages }}</span>
          <button
            [disabled]="page === totalPages"
            (click)="nextPage()"
            class="px-1 py-1 rounded bg-blue-600 text-white font-medium hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed">
            Next
          </button>
        </div>
      </div>
    </section>
  `,
  styles: ``,
})
export class MoviesComponent {
  url!: string;
  namePage!: string;
  mediaType!: string;
  startUrl = 'https://image.tmdb.org/t/p/w500';
  page = 1;
  totalPages: number = 0;

  movieData = signal<Movie[] | undefined>(undefined);
  loadedImages = new Set<number>();

  constructor(
    private route: ActivatedRoute,
    private moviesService: MoviesService,
    private mediaTypeService: MediaTypeService
  ) {}

  ngOnInit(): void {
    this.url = this.route.snapshot.data['url'];
    this.namePage = this.route.snapshot.data['name'];
    this.mediaType = this.route.snapshot.data['type'];
    this.fetchData(this.page);
  }

  fetchData(page: number): void {
    this.moviesService.getDataMovies(this.url, page).subscribe(
      data => {
        this.movieData.set(data.results);
        if (data.total_pages) {
          this.totalPages = data.total_pages;
        }
      },
      error => {
        console.error('Error fetching data: ', error);
      }
    );
  }

  onImageLoad(id: number): void {
    this.loadedImages.add(id);
  }

  getDate(movie: Movie): string {
    const newDate = getReleaseDate(movie);
    return newDate;
  }

  setType(type: string): void {
    this.mediaTypeService.setMediaType(type);
  }

  goTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  previousPage(): void {
    this.page -= 1;
    if (this.page === 0) this.page = 1;
    this.fetchData(this.page);
    this.goTop();
  }

  nextPage(): void {
    this.page += 1;
    if (this.totalPages !== undefined || this.totalPages !== null) {
      if (this.page > this.totalPages) this.page = this.totalPages;
    }
    this.fetchData(this.page);
    this.goTop();
  }
}

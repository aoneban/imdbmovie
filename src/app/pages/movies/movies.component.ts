import { Component, computed, effect, signal } from '@angular/core';
import { MoviesService } from '../../services/movies.service';
import { Movie } from '../../interfaces/interface';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { getReleaseDate } from '../../helpers/getReleaseDate';
import { MediaTypeService } from '../../services/media-type.service';
import { RatingComponent } from '../movie/rating/rating.component';
import { TMDB } from '../../config/tmdb.config';

@Component({
  selector: 'app-movies',
  imports: [CommonModule, RouterModule, RatingComponent],
  template: `
    <section>
      @if (isLoading()) {
        <div class="preloader">
          <div class="loader"></div>
        </div>
      } @else {
        <div>
          <h1 class="w-[78%] mx-auto mt-6 text-4xl font-bold text-white-900">
            {{ namePage() }}
          </h1>
          <div class="flex w-[80%] mx-auto flex-wrap justify-center">
            @for (movie of movieData(); track $index) {
              <div class="relative w-[20%] mt-5">
                <div
                  class="m-5 h-[100%] rounded-xl border border-gray-200 overflow-hidden">
                  <img
                    *ngIf="!loadedImages().has(movie.id)"
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
                    [class.opacity-0]="!loadedImages().has(movie.id)"
                    alt="{{ movie.name }}" />

                  <!--Rating component start-->
                  <app-rating
                    [rat]="movie"
                    class="absolute top-[6%] left-[10%]"></app-rating>
                  <!--Rating component end -->

                  <h3
                    class="cursor-pointer font-bold relative top-4 left-3"
                    (click)="setType(mediaType())"
                    [routerLink]="[
                      mediaType() === 'movie' ? '/movie' : '/tv',
                      movie.id,
                    ]">
                    {{ movie.title || movie.name }}
                  </h3>

                  <p
                    class="relative top-4 left-3 italic text-[14px] text-gray-400">
                    {{ getDate(movie) }}
                  </p>
                </div>
              </div>
            }
            <div class="mt-20 mb-10">
              <button
                (click)="loadMore()"
                class="w-[15vw] px-1 py-1 rounded bg-blue-600 text-white font-medium hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed">
                Load more...
              </button>
            </div>
          </div>
        </div>
      }
    </section>
  `,
  styles: ``,
})
export class MoviesComponent {
  url = signal<string>('');
  namePage = signal<string>('');
  mediaType = signal<string>('');
  startUrl = TMDB.imageBaseUrl;
  page = signal<number>(1);
  totalPages: number | undefined = 0;

  isLoading = computed(() => this.movieData().length === 0);
  movieData = signal<Movie[]>([]);
  loadedImages = signal<Set<number>>(new Set());

  constructor(
    private route: ActivatedRoute,
    private moviesService: MoviesService,
    private mediaTypeService: MediaTypeService
  ) {
    effect(() => {
      const data = this.route.snapshot.data;
      this.url.set(data['url']);
      this.namePage.set(data['name']);
      this.mediaType.set(data['type']);

      const page = this.page();
      this.moviesService.getDataMovies(this.url(), page).subscribe(data => {
        if (page === 1) {
          this.movieData.set(data.results);
        } else {
          this.movieData.update(prev => [...prev, ...data.results]);
        }
        this.totalPages = data.total_pages;
      });
    });
  }

  loadMore() {
    this.page.update(p => p + 1);
  }

  onImageLoad(id: number): void {
    this.loadedImages.update(set => new Set([...set, id]));
  }

  getDate(movie: Movie): string {
    const newDate = getReleaseDate(movie);
    return newDate;
  }

  setType(type: string): void {
    this.mediaTypeService.setMediaType(type);
  }
}

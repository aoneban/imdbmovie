import { Component, computed, effect, signal } from '@angular/core';
import { MoviesService } from '../../services/movies.service';
import { Movie } from '../../interfaces/interface';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MovieCardComponent } from './movie-card/movie-card.component';

@Component({
  selector: 'app-movies',
  imports: [CommonModule, RouterModule, MovieCardComponent],
  template: `
    <section>
      @if (isLoading()) {
        <div class="preloader">
          <div class="loader"></div>
        </div>
      } @else {
        <div
          class="mx-auto w-full max-w-screen-2xl px-4 py-6 sm:w-[90%] sm:px-6 lg:w-[80%] lg:px-8">
          <h1
            class="mb-6 break-words text-2xl font-bold sm:text-3xl lg:text-4xl">
            {{ namePage() }}
          </h1>
          <app-movie-card
            [movieData]="movieData()"
            [type]="mediaType()"
            (loadMoreClick)="loadMore()"></app-movie-card>
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
  page = signal<number>(1);
  totalPages: number | undefined = 0;

  isLoading = computed(() => this.movieData().length === 0);
  movieData = signal<Movie[]>([]);

  constructor(
    private route: ActivatedRoute,
    private moviesService: MoviesService
  ) {
    effect(() => {
      const data = this.route.snapshot.data;
      this.url.set(data['url']);
      this.namePage.set(data['name']);
      this.mediaType.set(data['type']);

      const page = this.page();
      this.moviesService.getDataMovies(this.url(), page).subscribe(data => {
        page === 1
          ? this.movieData.set(data.results)
          : this.movieData.update(prev => [...prev, ...data.results]);
        this.totalPages = data.total_pages;
      });
    });
  }

  loadMore() {
    this.page.update(p => p + 1);
  }
}

import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavbarComponent } from '../main/shared/navbar/navbar.component';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TitleMovieComponent } from '../movie/block-hero/title-movie/title-movie.component';
import { TMDB } from '../../config/tmdb.config';
import { MovieService } from '../../services/movie.service';
import { MovieCast, SingleMovie } from '../../interfaces/interface';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  catchError,
  combineLatest,
  forkJoin,
  of,
  startWith,
  switchMap,
} from 'rxjs';

@Component({
  selector: 'app-all-actors',
  imports: [RouterModule, NavbarComponent, CommonModule, TitleMovieComponent],
  host: {
    class: 'block min-w-0',
  },
  template: `
    <app-navbar></app-navbar>
    <section>
      <div *ngIf="!isLoading()" class="preloader">
        <div class="loader"></div>
      </div>
      <app-title-movie [property]="movieData()"></app-title-movie>
    </section>
    <section>
      <div
        *ngIf="isLoading()"
        class="mx-auto grid w-full grid-cols-1 gap-8 px-4 py-6 sm:px-6 md:grid-cols-2 lg:w-[80%] lg:gap-12 lg:px-0">
        <div class="min-w-0">
          <h3
            class="mb-4 text-xl font-normal text-gray-800 md:text-2xl lg:text-3xl">
            Cast ({{ movieAllTeam()?.cast?.length }})
          </h3>
          <div class="flex flex-col gap-5 justify-center">
            @for (item of movieAllTeam()?.cast; track item.credit_id) {
              <div class="flex min-w-0 items-center gap-3 sm:gap-5">
                <img
                  decoding="async"
                  [routerLink]="['/persons', item.id]"
                  class="h-24 w-16 shrink-0 cursor-pointer rounded-md"
                  [ngClass]="
                    item.profile_path ? 'object-cover' : 'object-contain'
                  "
                  [src]="
                    item?.profile_path
                      ? startUrl + item.profile_path
                      : '/icon-bg.svg'
                  "
                  [alt]="item?.original_name || ''" />
                <div class="min-w-0 flex-1 [overflow-wrap:anywhere]">
                  <a [routerLink]="['/persons', item.id]">
                    <p>
                      <b>{{ item?.name }}</b>
                    </p>
                  </a>
                  <p>{{ item?.character }}</p>
                </div>
              </div>
            }
          </div>
        </div>
        <div class="min-w-0">
          <h3
            class="mb-4 text-xl font-normal text-gray-800 md:text-2xl lg:text-3xl">
            Crew ({{ movieAllTeam()?.crew?.length }})
          </h3>
          <div class="flex flex-col gap-5 justify-center">
            @for (item of movieAllTeam()?.crew; track item.credit_id) {
              <div class="flex min-w-0 items-center gap-3 sm:gap-5">
                <img
                  decoding="async"
                  [routerLink]="['/persons', item.id]"
                  class="h-24 w-16 shrink-0 cursor-pointer rounded-md"
                  [ngClass]="
                    item.profile_path ? 'object-cover' : 'object-contain'
                  "
                  [src]="
                    item?.profile_path
                      ? startUrl + item.profile_path
                      : '/icon-bg.svg'
                  "
                  [alt]="item?.original_name || ''" />
                <div class="min-w-0 flex-1 [overflow-wrap:anywhere]">
                  <a [routerLink]="['/persons', item.id]">
                    <p>
                      <b>{{ item?.name }}</b>
                    </p>
                  </a>
                  <p>{{ item?.job }}</p>
                </div>
              </div>
            }
          </div>
        </div>
      </div>
    </section>
  `,
  styles: ``,
})
export class AllActorsComponent {
  startUrl = TMDB.imageSmallUrl;

  route = inject(ActivatedRoute);
  private movieService = inject(MovieService);
  private data = toSignal(
    combineLatest([this.route.paramMap, this.route.queryParamMap]).pipe(
      switchMap(([params, query]) => {
        const api =
          query.get('type') === 'tv' ? TMDB.apiBaseTV : TMDB.apiBaseMovie;
        const id = Number(params.get('id'));
        return forkJoin({
          movie: this.movieService.getDataMovie<SingleMovie>(
            api,
            TMDB.apiLanguage,
            id
          ),
          credits: this.movieService.getDataMovie<MovieCast>(
            api,
            TMDB.apiCredits,
            id
          ),
        }).pipe(
          catchError(error => {
            console.error('Error fetching data: ', error);
            return of(undefined);
          }),
          startWith(undefined)
        );
      })
    )
  );
  movieData = computed(() => this.data()?.movie);
  movieAllTeam = computed(() => this.data()?.credits);
  isLoading = computed(() => this.movieData());
}

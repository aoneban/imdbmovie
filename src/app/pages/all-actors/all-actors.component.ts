import { Component, computed, effect, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MovieService } from '../../services/movie.service';
import { CastMember, MovieCast, SingleMovie } from '../../interfaces/interface';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MediaTypeService } from '../../services/media-type.service';
import { TitleMovieComponent } from '../movie/block-hero/title-movie/title-movie.component';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { TMDB } from '../../config/tmdb.config';
// import { CastService } from '../../services/cast.service';

@Component({
  selector: 'app-all-actors',
  imports: [RouterModule, NavbarComponent, CommonModule, TitleMovieComponent],
  template: `
    <app-navbar></app-navbar>
    <section>
      <div *ngIf="!isLoading()" class="preloader">
        <div class="loader"></div>
      </div>
      <app-title-movie [property]="movieData()"></app-title-movie>
    </section>
    <section>
      <div *ngIf="isLoading()" class="w-[80%] flex mx-auto py-6">
        <div class="w-1/2">
          <h3
            class="mb-4 text-xl font-normal text-gray-800 md:text-2xl lg:text-3xl">
            Cast ({{ movieAllTeam()?.cast?.length }})
          </h3>
          <div class="flex flex-col gap-5 justify-center">
            @for (item of movieAllTeam()?.cast; track item.id) {
              <div class="flex gap-5 items-center">
                <img
                  decoding="async"
                  [routerLink]="['/persons', item.id]"
                  class="rounded-md w-16 h-auto cursor-pointer"
                  [src]="
                    item?.profile_path
                      ? startUrl + item.profile_path
                      : '/icon-bg.svg'
                  "
                  [alt]="item?.original_name || ''" />
                <div>
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
        <div class="w-1/2">
          <h3
            class="mb-4 text-xl font-normal text-gray-800 md:text-2xl lg:text-3xl">
            Crew ({{ movieAllTeam()?.crew?.length }})
          </h3>
          <div class="flex flex-col gap-5 justify-center">
            @for (item of movieAllTeam()?.crew; track item.id) {
              <div class="flex gap-5 items-center">
                <img
                  decoding="async"
                  [routerLink]="['/persons', item.id]"
                  class="rounded-md w-16 h-auto cursor-pointer"
                  [src]="
                    item?.profile_path
                      ? startUrl + item.profile_path
                      : '/icon-bg.svg'
                  "
                  [alt]="item?.original_name || ''" />
                <div>
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
  route = inject(ActivatedRoute);
  startUrl = TMDB.imageSmallUrl;
  movieData = signal<SingleMovie | undefined>(undefined);
  movieAllTeam = signal<MovieCast | undefined>(undefined);
  movieId = toSignal(
    this.route.paramMap.pipe(map(params => Number(params.get('id'))))
  );
  isLoading = computed(() => this.movieData());

  constructor(
    private movieService: MovieService,
    private mediaTypeService: MediaTypeService
  ) {
    effect(() => {
      const type = this.mediaTypeService.getMediaType();
      const apiOne = type === 'movie' ? TMDB.apiBaseMovie : TMDB.apiBaseTV;
      this.movieService
        .getDataMovie<SingleMovie>(apiOne, TMDB.apiLanguage, this.movieId()!)
        .subscribe(
          data => {
            this.movieData.set(data);
          },
          error => {
            console.error('Error fetching data: ', error);
          }
        );

      this.movieService
        .getDataMovie<MovieCast>(apiOne, TMDB.apiCredits, this.movieId()!)
        .subscribe(
          data => {
            this.movieAllTeam.set(data);
          },
          error => {
            console.error('Error fetching data: ', error);
          }
        );
    });
  }
}

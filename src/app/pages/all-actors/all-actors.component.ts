import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavbarComponent } from '../main/shared/navbar/navbar.component';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TitleMovieComponent } from '../movie/block-hero/title-movie/title-movie.component';
import { TMDB } from '../../config/tmdb.config';
import { MovieStoreService } from '../../services/movie-store.service';

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
  movieStoreService = inject(MovieStoreService);
  startUrl = TMDB.imageSmallUrl;
  isLoading = computed(() => this.movieData());
  movieData = this.movieStoreService.movieData;
  movieAllTeam = this.movieStoreService.movieAllTeam;
}

import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MovieService } from '../../../services/movie.service';
import { CastService } from '../../../services/cast.service';
import {
  CastMember,
  MovieCast,
  SingleMovie,
} from '../../../interfaces/interface';
import { NavbarComponent } from '../../../shared/navbar/navbar.component';
import { RouterModule } from '@angular/router';
import { Location } from '@angular/common';
import { CommonModule } from '@angular/common';
import { MediaTypeService } from '../../../services/media-type.service';
import { TitleMovieComponent } from '../block-hero/title-movie/title-movie.component';

@Component({
  selector: 'app-all-actors',
  imports: [RouterModule, NavbarComponent, CommonModule, TitleMovieComponent],
  template: `
    <app-navbar></app-navbar>
    <section>
      <div *ngIf="isLoading" class="preloader">
        <div class="loader"></div>
      </div>

      <app-title-movie [property]="movieData()"></app-title-movie>
    </section>
    <section>
      <div class="w-[80%] flex mx-auto py-6">
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
export class AllActorsComponent implements OnInit {
  apiMovie = 'https://api.themoviedb.org/3/movie/';
  apiTv = 'https://api.themoviedb.org/3/tv/';
  apiUrlEnd = '?language=en-US';
  apiCastEnd = '/credits?language=en-US';
  startUrl = 'https://image.tmdb.org/t/p/w200';
  startUrl2 = 'https://image.tmdb.org/t/p/w1920';
  movieId: number | undefined;
  movieData = signal<SingleMovie | undefined>(undefined);
  movieCast = signal<CastMember[] | undefined>(undefined);
  movieAllTeam = signal<MovieCast | undefined>(undefined);
  isLoading = false;
  color = 'grey';

  constructor(
    private route: ActivatedRoute,
    private movieService: MovieService,
    private castService: CastService,
    private location: Location,
    private mediaTypeService: MediaTypeService
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    const type = this.mediaTypeService.getMediaType();
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      this.movieId = id ? Number(id) : undefined;
      if (this.movieId !== undefined) {
        this.fetchCast(
          type === 'movie' ? this.apiMovie : this.apiTv,
          this.apiCastEnd,
          this.movieId
        );
        this.fetchData(
          type === 'movie' ? this.apiMovie : this.apiTv,
          this.apiUrlEnd,
          this.movieId
        );
      }
    });
  }

  fetchData(apiOne: string, apiTwo: string, id: number): void {
    this.movieService.getDataMovie<SingleMovie>(apiOne, apiTwo, id).subscribe(
      data => {
        this.movieData.set(data);
        this.isLoading = false;
      },
      error => {
        console.error('Error fetching data: ', error);
      }
    );
  }

  fetchCast(linkOne: string, linkTwo: string, id: number): void {
    this.castService.getDataCast(linkOne, linkTwo, id).subscribe(
      data => {
        this.movieCast.set(data.cast.filter((_, i) => i < 15));
        this.movieAllTeam.set(data);
        this.isLoading = false;
      },
      error => {
        console.error('Error fetching data: ', error);
      }
    );
  }
}

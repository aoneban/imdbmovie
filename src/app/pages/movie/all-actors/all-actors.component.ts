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

@Component({
  selector: 'app-all-actors',
  imports: [RouterModule, NavbarComponent, CommonModule],
  template: `
    <app-navbar></app-navbar>
    <section>
      <div *ngIf="isLoading" class="preloader">
        <div class="loader"></div>
      </div>
      <div [ngStyle]="{ 'background-color': color }" class="mx-auto p-6">
        <div class="w-5/6 flex gap-5 mx-auto">
          <img
            decoding="async"
            class="rounded-xl w-28 h-auto"
            [src]="startUrl + (movieData()?.poster_path || '')"
            [alt]="movieData()?.title || ''" />
          <div class="flex flex-col justify-center">
            <h2 class="text-4xl font-bold text-white !important mb-4">
              {{ movieData()?.title }} ({{
                movieData()?.release_date?.slice(0, 4)
              }})
            </h2>
            <button
              (click)="goBack()"
              class="w-fit whitespace-nowrap text-gray-200 hover:text-gray-300 font-bold px-4 py-2 rounded transition-colors duration-300 ease-in-out">
              &#8592; Back to main
            </button>
          </div>
        </div>
      </div>
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
  isLoading = false;
  startUrl = 'https://image.tmdb.org/t/p/w200';
  startUrl2 = 'https://image.tmdb.org/t/p/w1920';
  movieId: number | undefined;
  movieData = signal<SingleMovie | undefined>(undefined);
  movieCast = signal<CastMember[] | undefined>(undefined);
  movieAllTeam = signal<MovieCast | undefined>(undefined);
  color = 'grey';

  constructor(
    private route: ActivatedRoute,
    private movieService: MovieService,
    private castService: CastService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      this.movieId = id ? Number(id) : undefined;
      if (this.movieId !== undefined) {
        this.fetchCast(this.movieId);
        this.fetchData(this.movieId);
      }
    });
  }

  fetchData(id: number): void {
    this.movieService.getDataMovie(id).subscribe(
      data => {
        this.movieData.set(data);
        console.log('Movie data: ', this.movieData());
        this.isLoading = false;
      },
      error => {
        console.error('Error fetching data: ', error);
      }
    );
  }

  fetchCast(id: number): void {
    this.castService.getDataCast(id).subscribe(
      data => {
        this.movieCast.set(data.cast.filter((_, i) => i < 15));
        this.movieAllTeam.set(data);
        console.log('Data Cast: ', this.movieAllTeam());
        this.isLoading = false;
      },
      error => {
        console.error('Error fetching data: ', error);
      }
    );
  }

  goBack(): void {
    this.location.back();
  }
}

import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TvService } from '../../../services/tv.service';
import { CastService } from '../../../services/cast.service';
import {
  CastMember,
  SingleMovie,
  MovieCast,
} from '../../../interfaces/interface';
import { NavbarComponent } from '../../../shared/navbar/navbar.component';
import { RouterModule } from '@angular/router';
import { Location } from '@angular/common';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-all-tv-actors',
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
            [src]="startUrl + (tvData()?.poster_path || '')"
            [alt]="tvData()?.name || ''" />
          <div class="flex flex-col justify-center">
            <h2 class="text-4xl font-bold text-white !important mb-4">
              {{ tvData()?.name }} ({{ tvData()?.first_air_date?.slice(0, 4) }})
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
            Cast ({{ tvAllTeam()?.cast?.length }})
          </h3>
          <div class="flex flex-col gap-5 justify-center">
            @for (item of tvAllTeam()?.cast; track item.id) {
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
                  [alt]="item?.name || ''" />
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
            Crew ({{ tvAllTeam()?.crew?.length }})
          </h3>
          <div class="flex flex-col gap-5 justify-center">
            @for (item of tvAllTeam()?.crew; track item.id) {
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
export class AllTvActorsComponent implements OnInit {
  startUrl = 'https://image.tmdb.org/t/p/w200';
  startUrl2 = 'https://image.tmdb.org/t/p/w1920';
  tvId: number | undefined;
  tvData = signal<SingleMovie | undefined>(undefined);
  tvCast = signal<CastMember[] | undefined>(undefined);
  tvAllTeam = signal<MovieCast | undefined>(undefined);
  color = 'grey';
  isLoading = false;

  constructor(
    private route: ActivatedRoute,
    private tvService: TvService,
    private castService: CastService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      this.tvId = id ? Number(id) : undefined;
      if (this.tvId !== undefined) {
        this.fetchCast(this.tvId);
        this.fetchData(this.tvId);
      }
    });
  }

  fetchData(id: number): void {
    this.tvService.getDataTv(id).subscribe(
      data => {
        this.tvData.set(data);
        console.log('Tv data: ', this.tvData());
        this.isLoading = false;
      },
      error => {
        console.error('Error fetching data: ', error);
      }
    );
  }

  fetchCast(id: number): void {
    this.castService.getDataTvCast(id).subscribe(
      data => {
        this.tvCast.set(data.cast.filter((_, i) => i < 15));
        this.tvAllTeam.set(data);
        console.log('Data Cast: ', this.tvAllTeam());
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

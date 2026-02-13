import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  signal,
  computed,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { TvService } from '../../services/tv.service';
import { CastService } from '../../services/cast.service';
import {
  CastMember,
  MovieCast,
  SingleMovie,
  ImagesResponse,
} from '../../interfaces/interface';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { RouterModule } from '@angular/router';
import { TvActorsComponent } from './tv-actors/tv-actors.component';
import { TvAsideComponent } from './tv-aside/tv-aside.component';

@Component({
  selector: 'app-tv',
  imports: [
    CommonModule,
    NavbarComponent,
    RouterModule,
    TvActorsComponent,
    TvAsideComponent,
  ],

  changeDetection: ChangeDetectionStrategy.OnPush,

  template: `
    <app-navbar></app-navbar>
    <div *ngIf="isLoading" class="preloader">
      <div class="loader"></div>
    </div>
    <section *ngIf="!isLoading" class="inner__content new__index">
      <div
        [ngStyle]="{ 'background-image': backgroundImage() }"
        class="background-movie">
        <div class="background-shadow"></div>
        <div class="content-movie">
          <img
            decoding="async"
            class="main-poster"
            [src]="startUrl + (tvData()?.poster_path || '')"
            [alt]="tvData()?.name || ''" />
          <div class="text-content">
            <h1 class="text-4xl font-bold text-white-900 mb-4">
              {{ tvData()?.name }} ({{ tvData()?.first_air_date?.slice(0, 4) }})
            </h1>
            <h3 class="italic text-gray-300">{{ tvData()?.tagline }}</h3>
            <h4 class="text-xl text-white-900 mb-2 mt-2">Overview</h4>
            <p class="w-[80%]">
              {{ tvData()?.overview }}
            </p>
          </div>
        </div>
      </div>
    </section>
    <section class="w-[80%] mx-auto flex">
      <div class="w-4/5 mx-auto flex flex-col">
        <app-tv-actors [cast]="tvCast()" [id]="tvId" class="md:flex-row">
        </app-tv-actors>
        <div
          class="w-[100%] flex gap-5 mx-auto mb-6 pb-8 border-b border-gray-300">
          <button
            [routerLink]="['/tv-cast', tvAllTeam()?.id]"
            class="w-fit whitespace-nowrap">
            Full Cast & Crew
          </button>
        </div>
        <div>
          <h3 class="text-2xl font-semibold text-gray-900 mb-4">Social</h3>
        </div>
      </div>
      <app-tv-aside
        [props]="tvData()"
        class="w-1/5 md:flex-row flex items-center"></app-tv-aside>
    </section>
  `,
    styles: `
    .preloader {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100vh;
      padding-bottom: 150px;
    }

    .loader {
      width: 150px;
      aspect-ratio: 1;
      display: grid;
      border: 4px solid #0000;
      border-radius: 150%;
      border-right-color: #8225b0;
      animation: l15 2s infinite linear;
    }
    .loader::before {
      content: '';
      grid-area: 1/1;
      margin: 2px;
      border: inherit;
      border-radius: 100%;
      border-right-color: rgb(231, 102, 177);
      animation: l15 2s infinite;
    }
    .loader::after {
      content: '';
      grid-area: 1/1;
      margin: 2px;
      border: inherit;
      border-radius: 100%;
      border-right-color: rgb(174, 25, 191);
      animation: l15 2s infinite;
    }
    .loader::after {
      margin: 8px;
      animation-duration: 3s;
    }
    @keyframes l15 {
      100% {
        transform: rotate(1turn);
      }
    }

    header,
    main,
    footer {
      display: none;
    }
  `,
})
export class TvComponent implements OnInit {
  startUrl = 'https://image.tmdb.org/t/p/w500';
  startUrl2 = 'https://image.tmdb.org/t/p/w1920';
  tvId: number | undefined;
  tvData = signal<SingleMovie | undefined>(undefined);
  tvDataImg = signal<ImagesResponse | undefined>(undefined);
  tvCast = signal<CastMember[] | undefined>(undefined);
  tvAllTeam = signal<MovieCast | undefined>(undefined);
  isLoading = false;

  constructor(
    private route: ActivatedRoute,
    private tvService: TvService,
    private castService: CastService
  ) {}

  backgroundImage = computed(() => {
    const imgData = this.tvDataImg();
    if (imgData && imgData.backdrops && imgData.backdrops.length > 1) {
      return `url(${this.startUrl2}${imgData.backdrops[2].file_path})`;
    }
    return 'none';
  });

  ngOnInit(): void {
    this.isLoading = true;
    setTimeout(() => {
      this.route.paramMap.subscribe(params => {
        const id = params.get('id');
        this.tvId = id ? Number(id) : undefined;
        if (this.tvId !== undefined) {
          this.fetchCast(this.tvId);
          this.fetchData(this.tvId);
          this.fetchDataImages(this.tvId);
        }
      });
    }, 500)
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
        this.isLoading = false;
      }
    );
  }

  fetchDataImages(id: number): void {
    this.tvService.getDataImage(id).subscribe(
      data => {
        this.tvDataImg.set(data);
        console.log('Tv images: ', this.tvDataImg());
        this.isLoading = false;
      },
      error => {
        console.error('Error fetching data: ', error);
        this.isLoading = false;
      }
    );
  }
  fetchCast(id: number): void {
    this.castService.getDataTvCast(id).subscribe(
      data => {
        this.tvCast.set(data.cast.filter((_, i) => i < 15));
        this.tvAllTeam.set(data);
        console.log('Tv Cast: ', this.tvAllTeam());
        this.isLoading = false;
      },
      error => {
        console.error('Error fetching data: ', error);
        this.isLoading = false;
      }
    );
  }
}

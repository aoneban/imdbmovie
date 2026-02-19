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
  Genre
} from '../../interfaces/interface';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { RouterModule } from '@angular/router';
import { TvActorsComponent } from './tv-actors/tv-actors.component';
import { TvAsideComponent } from './tv-aside/tv-aside.component';
import { RatingComponent } from './rating/rating.component';

@Component({
  selector: 'app-tv',
  imports: [
    CommonModule,
    NavbarComponent,
    RouterModule,
    TvActorsComponent,
    RatingComponent,
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
            decoding="auto"
            *ngIf="!loadedImages.has(tvData()!.id)"
            class="!w-[20%] !h-[200%] m-5 bg-gray-800"
            src="/placeholder.svg"
            alt="placeholder" />
          <img
            decoding="async"
            class="main-poster transition-opacity duration-700"
            (load)="onImageLoad(tvData()!.id)"
            [class.hidden]="!loadedImages.has(tvData()!.id)"
            [src]="startUrl + (tvData()?.poster_path || '')"
            [alt]="tvData()?.name || ''" />
          <div class="text-content">
            <h1 class="text-4xl font-bold text-white-900 mb-4">
              {{ tvData()?.name }} ({{
                tvData()?.first_air_date?.slice(0, 4)
                  ? tvData()?.first_air_date?.slice(0, 4)
                  : '----'
              }})
            </h1>
            <p class="text-gray-300 mb-3">
              {{ formatDate(tvData()?.release_date) }} ●
              {{ getGenres(tvData()?.genres) }} ●
              {{ minutesToTime(tvData()?.runtime) }}
            </p>
            <app-rating [rat]="tvData()"></app-rating>
 
            <h3 class="italic text-gray-300">{{ tvData()?.tagline }}</h3>
            <h4 class="text-xl text-white-900 mb-2 mt-2">Overview</h4>
            <p class="w-[80%]">
              {{
                tvData()?.overview
                  ? tvData()?.overview
                  : 'Description will be added soon...'
              }}
            </p>
                        <div class="management flex mt-6 gap-20">
              <div class="dir1">
                <a
                  [routerLink]="['/persons', tvAllTeam()!.crew[0].id]"
                  class="font-bold text-md underline"
                  >{{ tvAllTeam()!.crew[0].name }}</a
                >
                <p>{{ tvAllTeam()!.crew[0].job }}</p>
              </div>
              <div class="dir2">
                <a
                  class="font-bold text-md underline"
                  [routerLink]="['/persons', tvAllTeam()!.crew[1].id]"
                  >{{ tvAllTeam()!.crew[1].name }}</a
                >
                <p>{{ tvAllTeam()!.crew[1].job }}</p>
              </div>
            </div>
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
  styles: ``,
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
  loadedImages = new Set<number>();

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
    }, 500);
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
        console.log('Tv Cast: ', this.tvCast());
        this.isLoading = false;
      },
      error => {
        console.error('Error fetching data: ', error);
        this.isLoading = false;
      }
    );
  }

  onImageLoad(id: number) {
    this.loadedImages.add(id);
  }

    getGenres(item: Genre[] | undefined) {
      if (item) {
        const genres = item.map(el => ' ' + el.name);
        return genres;
      } else {
        return 'Genres Unknown';
      }
    }
  
    minutesToTime(totalMinutes: number | undefined): string {
      if (totalMinutes) {
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        const hh = hours.toString().padStart(2, '0');
        const mm = minutes.toString().padStart(2, '0');
        return `${hh}h ${mm}m`;
      } else {
        return 'Time unknown';
      }
    }
  
    formatDate(dateStr: string | undefined): string {
      if (dateStr) {
        const [year, month, day] = dateStr.split('-');
        return `${day}/${month}/${year}`;
      } else {
        return 'Date unknown'
      }
    }

}

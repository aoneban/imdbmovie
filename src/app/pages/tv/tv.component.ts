import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  signal,
  computed,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { HeaderComponent } from '../../shared/header/header.component';
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
    HeaderComponent,
    CommonModule,
    NavbarComponent,
    RouterModule,
    TvActorsComponent,
    TvAsideComponent,
  ],

  changeDetection: ChangeDetectionStrategy.OnPush,

  template: `
    <app-header></app-header>
    <app-navbar></app-navbar>
    <section class="inner__content new__index">
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
            <h2>
              {{ tvData()?.name }} ({{ tvData()?.first_air_date?.slice(0, 4) }})
            </h2>
            <p>Description</p>
            <h3>Users marks</h3>
            <h4>Overview</h4>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Tenetur
              necessitatibus possimus pariatur culpa! Labore, ea! Ullam velit
              illo ipsam consequatur veniam, placeat, quos quod harum architecto
              commodi quia minima distinctio!
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
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      this.tvId = id ? Number(id) : undefined;
      if (this.tvId !== undefined) {
        this.fetchCast(this.tvId);
        this.fetchData(this.tvId);
        this.fetchDataImages(this.tvId);
      }
    });
  }

  fetchData(id: number): void {
    this.tvService.getDataTv(id).subscribe(
      data => {
        this.tvData.set(data);
        console.log('Tv data: ', this.tvData());
      },
      error => {
        console.error('Error fetching data: ', error);
      }
    );
  }

  fetchDataImages(id: number): void {
    this.tvService.getDataImage(id).subscribe(
      data => {
        this.tvDataImg.set(data);
        console.log('Tv images: ', this.tvDataImg());
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
        console.log('Tv Cast: ', this.tvAllTeam());
      },
      error => {
        console.error('Error fetching data: ', error);
      }
    );
  }
}

import { Component, signal, computed, inject, effect } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  SinglePerson,
  CastCombined,
  CastCredits,
} from '../../interfaces/interface';
import { NavbarComponent } from '../main/shared/navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { BiographyComponent } from './biography/biography.component';
import { RouterModule } from '@angular/router';
import { PreviousComponent } from './previous/previous.component';
import { KnownForComponent } from './knownfor/knownfor.component';
import { PersonalComponent } from './personal/personal.component';
import { NameActorComponent } from './nameactor/nameactor.component';
import { MainImageComponent } from './main-image/main-image.component';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { TMDB } from '../../config/tmdb.config';
import { MovieService } from '../../services/movie.service';

@Component({
  selector: 'persons',
  imports: [
    NavbarComponent,
    CommonModule,
    BiographyComponent,
    RouterModule,
    PreviousComponent,
    KnownForComponent,
    PersonalComponent,
    NameActorComponent,
    MainImageComponent,
  ],
  template: `
    <app-navbar></app-navbar>
    <section>
      <div *ngIf="!isLoading()" class="preloader">
        <div class="loader"></div>
      </div>
      <section
        *ngIf="isLoading()"
        class="mx-auto grid w-full min-w-0 max-w-screen-2xl grid-cols-1 gap-8 px-4 py-6 sm:w-[90%] sm:px-6 lg:w-[80%] lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:grid-rows-[auto_1fr] lg:gap-y-6 lg:px-8 lg:py-10 xl:grid-cols-[minmax(0,1fr)_minmax(0,3fr)] xl:gap-x-10">
        <div class="min-w-0 lg:col-start-2 lg:row-start-1">
          <app-nameactor [personData]="personData()"></app-nameactor>
        </div>
        <aside
          class="grid min-w-0 content-start gap-6 sm:grid-cols-2 lg:col-start-1 lg:row-span-2 lg:row-start-1 lg:block lg:space-y-8">
          <section>
            <app-main-image
              [personData]="personData()"
              [url]="startUrl"></app-main-image>
          </section>
          <section class="min-w-0 lg:sticky lg:top-6">
            <app-personal [personData]="personData()"></app-personal>
          </section>
        </aside>
        <div class="min-w-0 space-y-8 lg:col-start-2 lg:row-start-2">
          <section>
            <app-biography
              [personData]="personData()"
              [show]="showFull"></app-biography>
          </section>
          <section>
            <app-knownfor [cast]="topCast()" [url]="startUrl"></app-knownfor>
          </section>
          <section>
            <app-previous
              [previousReleases]="previousReleases()"></app-previous>
          </section>
        </div>
      </section>
    </section>
  `,
  styles: `
    :host {
      display: block;
      min-width: 0;
    }
  `,
})
export class PersonsComponent {
  route = inject(ActivatedRoute);
  showFull = false;
  startUrl = TMDB.imageBaseUrl;
  personData = signal<SinglePerson | null>(null);
  personCombined = signal<CastCombined | undefined>(undefined);
  personId = toSignal(
    this.route.paramMap.pipe(map(params => Number(params.get('id'))))
  );

  constructor(private movieService: MovieService) {
    effect(() => {
      this.movieService
        .getDataMovie<SinglePerson>(
          TMDB.apiUrlPerson,
          TMDB.apiLanguage,
          this.personId()!
        )
        .subscribe(
          data => {
            this.personData.set(data);
          },
          error => {
            console.error('Error fetching data: ', error);
          }
        );
      this.movieService
        .getDataMovie<CastCombined>(
          TMDB.apiUrlPerson,
          TMDB.apiCombinedCredits,
          this.personId()!
        )
        .subscribe(
          data => {
            this.personCombined.set(data);
          },
          error => {
            console.error('Error fetching data: ', error);
          }
        );
    });
  }

  isLoading = computed(() => this.personData());

  topCast = computed(() => {
    const combined = this.personCombined();
    return combined?.cast.slice(2, 17) ?? [];
  });

  previousReleases = computed(() => {
    const rel: CastCredits[] = [];
    const temp = this.personCombined()?.cast;
    temp?.map(item => {
      if (item.release_date && typeof item.release_date === 'string') {
        item.release_date = Number(item.release_date.slice(0, 4));
        rel?.push(item);
        return;
      } else if (
        item.first_air_date &&
        typeof item.first_air_date === 'string'
      ) {
        item.release_date = Number(item.first_air_date.slice(0, 4));
        rel?.push(item);
        return;
      } else if (
        item.first_credit_air_date &&
        typeof item.first_credit_air_date === 'string'
      ) {
        item.release_date = Number(item.first_credit_air_date.slice(0, 4));
        rel?.push(item);
        return;
      }
    });

    rel.sort((a, b) => {
      if (a.release_date > b.release_date) {
        return -1;
      }
      if (a.release_date < b.release_date) {
        return 1;
      }
      return 0;
    });
    return rel;
  });
}

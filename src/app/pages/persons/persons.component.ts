import { Component, signal, computed, inject, effect } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  SinglePerson,
  CastCombined,
  CastCredits,
} from '../../interfaces/interface';
import { PersonService } from '../../services/person.service';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
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
      <section *ngIf="isLoading()" class="w-[80%] flex m-[auto]">
        <!-- Left content: 20% width -->
        <div class="w-2/6 pr-6 pb-12 pt-12">
          <section>
            <app-main-image
              [data]="personData()"
              [url]="startUrl"></app-main-image>
          </section>
          <section class="sticky top-10">
            <app-personal [data]="personData()"></app-personal>
          </section>
        </div>
        <!-- Right content: 80% width -->
        <div class="w-[70%]">
          <section>
            <app-nameactor [actorName]="personData()"></app-nameactor>
          </section>
          <section>
            <app-biography
              [data]="personData()"
              [show]="showFull"></app-biography>
          </section>
          <section>
            <app-knownfor [cast]="topCast()" [url]="startUrl"></app-knownfor>
          </section>
          <section>
            <app-previous [previousReleases]="previousReleases()"></app-previous>
          </section>
        </div>
      </section>
    </section>
  `,
  styles: ``,
})
export class PersonsComponent {
  route = inject(ActivatedRoute);
  showFull = false;
  startUrl = TMDB.imageBaseUrl;
  personData = signal<SinglePerson | undefined>(undefined);
  personCombined = signal<CastCombined | undefined>(undefined);
  personId = toSignal(
    this.route.paramMap.pipe(map(params => Number(params.get('id'))))
  );

  constructor(private personService: PersonService) {
    effect(() => {
      this.personService
        .getDataPerson<SinglePerson>(
          TMDB.apiUrlPerson,
          this.personId()!,
          TMDB.apiLanguage
        )
        .subscribe(
          data => {
            this.personData.set(data);
          },
          error => {
            console.error('Error fetching data: ', error);
          }
        );
      this.personService
        .getDataPerson<CastCombined>(
          TMDB.apiUrlPerson,
          this.personId()!,
          TMDB.apiCombinedCredits
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

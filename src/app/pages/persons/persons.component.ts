import { Component, OnInit, signal, computed } from '@angular/core';
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
      <div *ngIf="isLoading" class="preloader">
        <div class="loader"></div>
      </div>
      <div *ngIf="!isLoading" class="w-[80%] flex m-[auto]">
        <!-- Left content: 20% width -->
        <div class="w-2/6 pr-12 pb-12 pt-12">
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
        <div class="w-[77%]">
          <div>
            <section>
              <app-nameactor [actorName]="personData()"></app-nameactor>
            </section>
            <section>
              <app-biography
                [data]="personData()"
                [show]="showFull"></app-biography>
            </section>
          </div>
          <section>
            <app-knownfor [cast]="topCast()" [url]="startUrl"></app-knownfor>
          </section>
          <section>
            <app-previous [release]="release"></app-previous>
          </section>
        </div>
      </div>
    </section>
  `,
  styles: ``,
})
export class PersonsComponent implements OnInit {
  isLoading = false;
  showFull = false;
  startUrl = 'https://image.tmdb.org/t/p/w500';
  personId: number | undefined;
  personData = signal<SinglePerson | undefined>(undefined);
  personCombined = signal<CastCombined | undefined>(undefined);
  release: CastCredits[] | undefined = [];

  topCast = computed(() => {
    const combined = this.personCombined();
    return combined?.cast.slice(2, 17) ?? [];
  });

  constructor(
    private route: ActivatedRoute,
    private personService: PersonService
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      this.personId = id ? Number(id) : undefined;
      if (this.personId !== undefined) {
        this.fetchPerson(this.personId);
        this.fetchCastCombined(this.personId);
      }
    });
  }

  fetchPerson(id: number): void {
    this.personService.getDataPerson(id).subscribe(
      data => {
        this.personData.set(data);
        this.isLoading = false;
        console.log('Person data: ', this.personData());
      },
      error => {
        console.error('Error fetching data: ', error);
      }
    );
  }

  fetchCastCombined(id: number): void {
    this.personService.getCombinedCredits(id).subscribe(
      data => {
        this.isLoading = false;
        this.personCombined.set(data);
        console.log('Person combined: ', this.personCombined());
        this.sorted();
      },
      error => {
        console.error('Error fetching data: ', error);
      }
    );
  }

  sorted(): void {
    const temp = this.personCombined()?.cast;
    temp?.map(item => {
      if (item.release_date && typeof item.release_date === 'string') {
        item.release_date = Number(item.release_date.slice(0, 4));
        this.release?.push(item);
        return;
      } else if (
        item.first_air_date &&
        typeof item.first_air_date === 'string'
      ) {
        item.release_date = Number(item.first_air_date.slice(0, 4));
        this.release?.push(item);
        return;
      } else if (
        item.first_credit_air_date &&
        typeof item.first_credit_air_date === 'string'
      ) {
        item.release_date = Number(item.first_credit_air_date.slice(0, 4));
        this.release?.push(item);
        return;
      }
    });

    this.release = temp?.sort((a, b) => {
      if (a.release_date > b.release_date) {
        return -1;
      }
      if (a.release_date < b.release_date) {
        return 1;
      }
      return 0;
    });
  }
}

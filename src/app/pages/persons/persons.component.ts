import { Component, OnInit, signal, computed } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HeaderComponent } from '../../shared/header/header.component';
import { SinglePerson, CastCombined } from '../../interfaces/interface';
import { PersonService } from '../../services/person.service';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { BiographyComponent } from './biography/biography.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'persons',
  imports: [
    HeaderComponent,
    NavbarComponent,
    CommonModule,
    BiographyComponent,
    RouterModule,
  ],
  template: `
    <app-header></app-header>
    <app-navbar></app-navbar>
    <section>
      <div class="w-[80%] flex m-[auto]">
        <!-- Левый блок: 20% ширины -->
        <div class="w-2/6 pr-12 pb-12 pt-12">
          <div>
            <img
              decoding="async"
              class="rounded-xl"
              [src]="startUrl + (personData()?.profile_path || '')"
              [alt]="personData()?.name || ''" />
          </div>
          Левый блок
        </div>

        <!-- Правый блок: 80% ширины -->
        <div class="w-4/5">
          <div>
            <h1 class="text-3xl font-bold text-gray-800 pt-10">
              {{ personData()?.name }}
            </h1>
            <h4 class="text-xl font-semibold text-gray-900 mt-6">Biography</h4>
            <app-biography
              [data]="personData()"
              [show]="showFull"></app-biography>
          </div>
          <h4 class="text-xl font-semibold text-gray-800 mt-6 mb-6">
            Known for
          </h4>
          <div class="movies__wrapper">
            <div class="movies__wrapper-block">
              <div class="movies__wrapper-cart" *ngFor="let movie of topCast()">
                <img
                  [routerLink]="['/movie', movie.id]"
                  class="image"
                  src="{{ startUrl + movie.poster_path }}"
                  alt="{{ movie.title }}" />
                <a [routerLink]="['/movie', movie.id]">
                  <p>{{ movie.title }}</p>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: ``,
})
export class PersonsComponent implements OnInit {
  showFull = false;
  startUrl = 'https://image.tmdb.org/t/p/w500';
  personId: number | undefined;
  personData = signal<SinglePerson | undefined>(undefined);
  personCombined = signal<CastCombined | undefined>(undefined);
  topCast = computed(() => {
    const combined = this.personCombined();
    return combined?.cast.slice(0, 15) ?? [];
  });
  constructor(
    private route: ActivatedRoute,
    private personService: PersonService
  ) {}

  ngOnInit() {
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
        this.personCombined.set(data);
        console.log('Person combined: ', this.personCombined());
      },
      error => {
        console.error('Error fetching data: ', error);
      }
    );
  }
}

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
import { MediaTypeService } from '../../services/media-type.service';

@Component({
  selector: 'persons',
  imports: [NavbarComponent, CommonModule, BiographyComponent, RouterModule],
  template: `
    <app-navbar></app-navbar>
    <section>
      <div *ngIf="isLoading" class="preloader">
        <div class="loader"></div>
      </div>
      <div *ngIf="!isLoading" class="w-[80%] flex m-[auto]">
        <!-- Left content: 20% width -->
        <div class="w-2/6 pr-12 pb-12 pt-12">
          <div *ngIf="personData() as p">
            <img
              *ngIf="!loadedImages.has(p.id)"
              class="w-[80%] h-[80%] bg-gray-300"
              src="/icon-bg.svg"
              alt="placeholder" />
            <img
              decoding="auto"
              class="rounded-xl transition-opacity duration-700"
              (load)="onImageLoad(personData()!.id)"
              [class.opacity-0]="!loadedImages.has(personData()!.id)"
              [src]="startUrl + (personData()?.profile_path || '')"
              [alt]="personData()?.name || ''" />
          </div>
        </div>

        <!-- Right content: 80% width -->
        <div class="w-[77%]">
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
                <div class="h-[220px]">
                  <img
                    [routerLink]="[
                      movie.media_type === 'movie' ? '/movie' : '/tv',
                      movie.id,
                    ]"
                    class="image"
                    (click)="setType(movie.media_type)"
                    [src]="
                      movie.poster_path
                        ? startUrl + movie.poster_path
                        : '/placeholder.svg'
                    "
                    src="{{ startUrl + movie.poster_path }}"
                    alt="{{ movie.title }}" />
                </div>
                <a
                  [routerLink]="[
                    movie.media_type === 'movie' ? '/movie' : '/tv',
                    movie.id,
                  ]"
                  (click)="setType(movie.media_type)">
                  <p class="font-normal pt-3 pl-3 text-sm">
                    {{ movie.title || movie.name }}
                  </p>
                </a>
              </div>
            </div>
          </div>
          <!-- Start acting component -->
          <div>
            <h3>Acting</h3>
            <div class="border-2 border-solid rounded-lg">
              @for (item of release; track $index) {
                <li class="list-none p-4">
                  <a
                    [routerLink]="[
                      item.media_type === 'movie' ? '/movie' : '/tv',
                      item.id,
                    ]">
                    {{
                      item.release_date || 'Unknown'
                    }}
                    | {{ item.title || item.name || item.original_title }} |
                    {{ item.character }}
                  </a>
                </li>
              } @empty {
                <li>There are no items.</li>
              }
            </div>
          </div>
          <!-- End acting component -->
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
  loadedImages = new Set<number>();
  release: CastCredits[] = [];
  topCast = computed(() => {
    const combined = this.personCombined();
    return combined?.cast.slice(0, 15) ?? [];
  });

  carrier = computed(() => {
    const newArr: CastCredits[] = [];
    const lifeWay = this.personCombined()?.cast;
    lifeWay?.map(item => {
      if (item.release_date && typeof item.release_date === 'string') {
        item.release_date = Number(item.release_date.slice(0, 4));
        newArr.push(item);
        return;
      } else if (
        item.first_air_date &&
        typeof item.first_air_date === 'string'
      ) {
        item.release_date = Number(item.first_air_date.slice(0, 4));
        newArr.push(item);
        return;
      } else if (
        item.first_credit_air_date &&
        typeof item.first_credit_air_date === 'string'
      ) {
        item.release_date = Number(item.first_credit_air_date.slice(0, 4));
        newArr.push(item);
        return;
      }
    });
    return newArr;
  });

  constructor(
    private route: ActivatedRoute,
    private personService: PersonService,
    private mediaTypeService: MediaTypeService
  ) {}

  ngOnInit() {
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
        this.personCombined.set(data);
        this.isLoading = false;
        console.log('Person combined: ', this.personCombined());
        this.sorted();
      },
      error => {
        console.error('Error fetching data: ', error);
      }
    );
  }

  setType(type: string) {
    this.mediaTypeService.setMediaType(type);
  }

  onImageLoad(id: number) {
    this.loadedImages.add(id);
  }

  sorted() {
    this.release = Array.from(this.carrier()).sort(function (a, b) {
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

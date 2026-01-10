import { ChangeDetectorRef, Component, signal } from '@angular/core';
import { HeaderComponent } from '../../shared/header/header.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { ActivatedRoute } from '@angular/router';
import { MovieSearchResponse } from '../../interfaces/interface';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TruncateWordsPipe } from '../../../pipes/truncate-words.pipe';

@Component({
  selector: 'app-search',
  imports: [
    HeaderComponent,
    FooterComponent,
    CommonModule,
    RouterModule,
    TruncateWordsPipe,
  ],
  template: `
    <app-header></app-header>
    <section class="search">
      <h1 class="text-4xl pt-4 pb-4 font-bold text-white-900 mb-4">{{ fromInput }}</h1>
      <ul>
        <li
          *ngFor="
            let movie of movieResponse()?.results;
            index as i;
            first as isFirst
          ">
          <div class="content full">
            <div class="basis-[8%]">
              <div
                *ngIf="!loadedImages.has(movie.id)"
                class="absolute w-[8%] top-[20px] pb-12 animate-pulse z-10">
                <img src="/placeholder.svg" alt="placeholder" />
              </div>
              <img
                decoding="async"
                class="poster"
                (load)="onImageLoad(movie.id)"
                [class.opacity-0]="!loadedImages.has(movie.id)"
                [src]="startUrl + (movie.poster_path || '')"
                [alt]="movie?.title || ''" />
            </div>
  
            <div class="basis-[92%] pt-2 pb-2">
              <a [routerLink]="['/movie', movie.id]">
                <h3 class="text-xl font-bold tracking-tight text-gray-800">
                  {{ movie.title }}
                </h3>
              </a>
              <p class="italic text-[13px] text-gray-400">
                {{ movie.release_date }}
              </p>
              <p>{{ movie.overview | truncateWords: 70 }}</p>
            </div>
          </div>
        </li>
      </ul>
      <div>Pagination will be soon...</div>
    </section>
    <app-footer></app-footer>
  `,
  styles: `
    .search {
      width: 80%;
      min-height: 100vh;
      margin: 0 auto;
    }
    .content {
      position: relative;
      min-height: 150px;
      display: flex;
      gap: 15px;
      margin: 20px;
      border: 1px solid lightgray;
      border-radius: 10px;
      overflow: hidden;
    }

    .poster {
      width: 100%;
      height: 100%;
    }
  `,
})
export class SearchComponent {
  startUrl = 'https://image.tmdb.org/t/p/w200';
  fromInput: string | undefined;
  numberPage: number = 1;
  movieResponse = signal<MovieSearchResponse | undefined>(undefined);
  loadedImages = new Set<number>();
  private apiUrl1 = 'https://api.themoviedb.org/3/search/movie?query=';
  private apiUrl2 = '&include_adult=false&language=en-US&page=';

  constructor(
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private http: HttpClient
  ) {}
  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const query = params['query'];
      this.fromInput = query;
      this.fetchData(query);
    });
  }
  getDataMovie(text: string): Observable<MovieSearchResponse> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${environment.apiKey}`,
      Accept: 'application/json',
    });
    return this.http.get<MovieSearchResponse>(
      `${this.apiUrl1}${text}${this.apiUrl2}${this.numberPage}`,
      { headers }
    );
  }

  fetchData(text: string): void {
    this.getDataMovie(text).subscribe(
      data => {
        this.movieResponse.set(data);
        console.log('Movie data: ', this.movieResponse());
      },
      error => {
        console.error('Error fetching data: ', error);
      }
    );
  }
  onImageLoad(id: number) {
    setTimeout(() => {
      this.loadedImages.add(id);
      this.cdr.markForCheck();
    }, 2000);
  }
}

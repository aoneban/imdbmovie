import { Component, signal } from '@angular/core';
import { NavbarComponent } from '../../../../shared/navbar/navbar.component';
import { ActivatedRoute } from '@angular/router';
import { CommonService } from '../../../../services/common.service';
import { ReviewsResponse, SingleMovie } from '../../../../interfaces/interface';
import { MediaTypeService } from '../../../../services/media-type.service';
import { ReviewComponent } from '../review.component';
import { CommonModule } from '@angular/common';
import { MovieService } from '../../../../services/movie.service';
import { TitleMovieComponent } from '../../title-movie/title-movie.component';

@Component({
  selector: 'app-all-reviews',
  imports: [
    NavbarComponent,
    ReviewComponent,
    CommonModule,
    TitleMovieComponent,
  ],
  template: `
    <section>
      <div>
        <div *ngIf="isLoading" class="preloader">
          <div class="loader"></div>
        </div>
        <div *ngIf="!isLoading">
          <app-navbar></app-navbar>
          <app-title-movie [property]="movieData()"></app-title-movie>
          <section>
            <div class="w-[80%] mx-auto">
              <app-review
                *ngFor="let item of allReviews?.results"
                [review]="item"
                [allReviews]="allReviews"></app-review>
            </div>
          </section>
        </div>
      </div>
    </section>
  `,
  styles: ``,
})
export class AllReviewsComponent {
  movieId: number | undefined;
  apiMovie = 'https://api.themoviedb.org/3/movie/';
  apiReviewEnd = '/reviews?language=en-US&page=1';
  apiUrlEnd = '?language=en-US';
  apiTv = 'https://api.themoviedb.org/3/tv/';
  allReviews: ReviewsResponse | undefined;
  movieData = signal<SingleMovie | undefined>(undefined);
  type: string | null;
  isLoading = false

  constructor(
    private route: ActivatedRoute,
    private commonService: CommonService,
    private mediaTypeService: MediaTypeService,
    private movieService: MovieService
  ) {
    this.type = this.mediaTypeService.getMediaType();
  }

  ngOnInit() {
    this.isLoading = true;
    this.movieId = Number(this.route.snapshot.params['id']);
    this.fetchReviews();
    this.fetchData();
    console.log('Id:', this.movieId);
  }

  fetchReviews() {
    this.commonService
      .getCommonData(
        this.type === 'movie' ? this.apiMovie : this.apiTv,
        this.apiReviewEnd,
        Number(this.movieId)
      )
      .subscribe(
        data => {
          this.allReviews = data;
          this.isLoading = false;
        },
        error => {
          console.error('Error fetching data: ', error);
        }
      );
  }

  fetchData() {
    this.movieService
      .getDataMovie(
        this.type === 'movie' ? this.apiMovie : this.apiTv,
        this.apiUrlEnd,
        Number(this.movieId)
      )
      .subscribe(
        data => {
          this.movieData.set(data);
          this.isLoading = false;
          console.log(this.movieData());
        },
        error => {
          console.error('Error fetching data: ', error);
        }
      );
  }
}

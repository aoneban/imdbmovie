import { Component, OnInit, signal } from '@angular/core';
import { ReviewItem, ReviewsResponse, SingleMovie } from '../../../../interfaces/interface';
import { ActivatedRoute } from '@angular/router';
import { CommonService } from '../../../../services/common.service';
import { MediaTypeService } from '../../../../services/media-type.service';
import { MovieService } from '../../../../services/movie.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-single-review',
  imports: [CommonModule, RouterModule],
  template: `
    <div *ngIf="isLoading" class="preloader">
      <div class="loader"></div>
    </div>
    <section *ngIf="!isLoading">
      <div class="flex h-[50px] items-center bg-gray-100">
        <div class="w-[80%] mx-auto">
          <a [routerLink]="['/all-reviews', this.movieData?.id]">&#8592; Back to main</a>
        </div>
      </div>
      <div class="flex w-[80%] mx-auto gap-[20px] mt-10">
        <div>
          <img
            decoding="auto"
            class="main-poster min-w-[13vw] max-w-[13vw] h-[auto] transition-opacity duration-700"
            [src]="startUrl + (movieData?.poster_path || '')"
            [alt]="name" />
        </div>
        <div>
          <p>
            Movie: {{ movieData?.name || movieData?.title }}
            {{ movieData?.release_date || movieData?.first_air_date }}
          </p>
          <p>id: {{ movieId }}</p>
          <p>Author Name: {{ name }}</p>
          <p>Data: {{ currentDate }}</p>
          <p>Rating: {{ rating }}</p>
          <p>Opinion: {{ opinion }}</p>
        </div>
      </div>
    </section>
  `,
})
export class SingleReviewComponent implements OnInit {
  isLoading = false;
  dataReview: ReviewItem[] | undefined;
  movieId: number | string | undefined;
  reviewId: string = '';
  name: string | undefined;
  currentDate: string | undefined;
  rating: number | string | undefined;
  opinion: string = '';
  startUrl = 'https://image.tmdb.org/t/p/w500';
  apiMovie = 'https://api.themoviedb.org/3/movie/';
  apiReviewEnd = '/reviews?language=en-US&page=1';
  apiUrlEnd = '?language=en-US';
  apiTv = 'https://api.themoviedb.org/3/tv/';
  type: string | null;
  movieData: SingleMovie | undefined;

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
    this.getMainData();
    this.fetchReviews();
    this.fetchImg();
  }

  getMainData() {
    this.movieId = Number(this.route.snapshot.params['movieId']);
    this.reviewId = this.route.snapshot.params['reviewId'];
  }

  fetchReviews() {
    this.commonService
      .getCommonData<ReviewsResponse>(
        this.type === 'movie' ? this.apiMovie : this.apiTv,
        this.apiReviewEnd,
        Number(this.movieId)
      )
      .subscribe(
        data => {
          this.dataReview = data.results;
          this.getTargetReview(this.dataReview);
          this.isLoading = false;
        },
        error => {
          console.error('Error fetching data: ', error);
        }
      );
  }

  fetchImg() {
    this.movieService
      .getDataMovie<SingleMovie>(
        this.type === 'movie' ? this.apiMovie : this.apiTv,
        this.apiUrlEnd,
        Number(this.movieId)
      )
      .subscribe(
        data => {
          console.log('this is data', data);
          this.movieData = data;
          this.isLoading = false;
        },
        error => {
          console.error('Error fetching data: ', error);
        }
      );
  }

  getTargetReview(data: ReviewItem[]): void {
    if (data) {
      data.map(el => {
        if (el.id === this.reviewId) {
          this.opinion = el.content;
          this.name = el.author;
          this.currentDate = el.created_at.slice(0, 10);
          this.rating = el.author_details.rating
            ? el.author_details.rating
            : 'N/R';
        }
      });
    }
  }
}

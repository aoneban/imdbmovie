import { Component, OnInit, signal } from '@angular/core';
import { ReviewItem } from '../../../../interfaces/interface';
import { ActivatedRoute } from '@angular/router';
import { CommonService } from '../../../../services/common.service';
import { MediaTypeService } from '../../../../services/media-type.service';
import { MovieService } from '../../../../services/movie.service';
import { ImagesResponse } from '../../../../interfaces/interface';

@Component({
  selector: 'app-single-review',
  template: `
    <p>id: {{ movieId }}</p>
    <p>Author Name: {{ name }}</p>
    <p>Data: {{ currentDate }}</p>
    <p>Rating: {{ rating }}</p>
    <p>Opinion: {{ opinion }}</p>
    <p>Img: {{ img }}</p>
    <img
      decoding="auto"
      class="main-poster transition-opacity duration-700"
      [src]="startUrl + (img || '')"
      [alt]="name" />
  `,
})
export class SingleReviewComponent implements OnInit {
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
  apiTv = 'https://api.themoviedb.org/3/tv/';
  img = '';
  type: string | null;

  constructor(
    private route: ActivatedRoute,
    private commonService: CommonService,
    private mediaTypeService: MediaTypeService,
    private movieService: MovieService
  ) {
    this.type = this.mediaTypeService.getMediaType();
  }

  ngOnInit() {
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
      .getCommonData(
        this.type === 'movie' ? this.apiMovie : this.apiTv,
        this.apiReviewEnd,
        Number(this.movieId)
      )
      .subscribe(
        data => {
          this.dataReview = data.results;
          this.getTargetReview(this.dataReview);
        },
        error => {
          console.error('Error fetching data: ', error);
        }
      );
  }

  fetchImg() {
    this.movieService
      .getDataImage(
        this.type === 'movie' ? this.apiMovie : this.apiTv,
        Number(this.movieId)
      )
      .subscribe(
        data => {
          this.img = data.posters?.[0]?.file_path;
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

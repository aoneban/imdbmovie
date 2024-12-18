import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HeaderComponent } from '../../shared/header/header.component';

@Component({
  selector: 'movie',
  imports: [HeaderComponent],
  template: `
    <app-header></app-header>
    ./movie.component.html-works {{ movieId }}'
  `,
  styles: ``,
})
export class MovieComponent implements OnInit {
  movieId: number | undefined;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      this.movieId = id ? Number(id) : undefined;
    });
  }
}

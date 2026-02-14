import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../interfaces/interface';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MoviesService {

  private url = 'https://api.themoviedb.org/3/movie/popular?language=en-US&page='

  constructor(private http: HttpClient) {}

  getDataMovies(page: number = 1): Observable<ApiResponse> {
      const headers = new HttpHeaders({
        Authorization: `Bearer ${environment.apiKey}`,
        Accept: 'application/json',
      });
      return this.http.get<ApiResponse>(
        `${this.url}${page}`,
        { headers }
      );
    }
}

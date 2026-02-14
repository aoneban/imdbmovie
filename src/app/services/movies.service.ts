import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../interfaces/interface';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MoviesService {

  constructor(private http: HttpClient) {}

  getDataMovies(url: string, page: number = 1): Observable<ApiResponse> {
      const headers = new HttpHeaders({
        Authorization: `Bearer ${environment.apiKey}`,
        Accept: 'application/json',
      });
      return this.http.get<ApiResponse>(
        `${url}${page}`,
        { headers }
      );
    }
}

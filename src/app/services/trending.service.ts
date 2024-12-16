import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../interfaces/interface';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TrendingService {
  private apiUrl =
    'https://api.themoviedb.org/3/trending/movie/day?language=en-US';

  constructor(private http: HttpClient) {}

  getTrendingDataMovies(): Observable<ApiResponse> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${environment.apiKey}`,
      Accept: 'application/json',
    });
    return this.http.get<ApiResponse>(`${this.apiUrl}`, { headers });
  }
}

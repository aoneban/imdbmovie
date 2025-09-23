import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { MovieCast } from '../interfaces/interface';

@Injectable({
  providedIn: 'root',
})
export class CastService {
  private apiUrl1 = 'https://api.themoviedb.org/3/movie/';
  private apiUrl0 = 'https://api.themoviedb.org/3/tv/';
  private apiUrl2 = '/credits?language=en-US';

  constructor(private http: HttpClient) {}

  getDataCast(id: number): Observable<MovieCast> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${environment.apiKey}`,
      Accept: 'application/json',
    });
    return this.http.get<MovieCast>(`${this.apiUrl1}${id}${this.apiUrl2}`, {
      headers,
    });
  }

  getDataTvCast(id: number): Observable<MovieCast> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${environment.apiKey}`,
      Accept: 'application/json',
    });
    return this.http.get<MovieCast>(`${this.apiUrl0}${id}${this.apiUrl2}`, {
      headers,
    });
  }
}

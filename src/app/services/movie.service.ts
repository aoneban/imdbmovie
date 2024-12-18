import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { SingleMovie } from '../interfaces/interface';

@Injectable({
  providedIn: 'root',
})
export class MovieService {
  private apiUrlStart = 'https://api.themoviedb.org/3/movie/';
  private apiUrlEnd = '?language=en-US';

  constructor(private http: HttpClient) {}

  getDataMovie(id: number): Observable<SingleMovie> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${environment.apiKey}`,
      Accept: 'application/json',
    });
    return this.http.get<SingleMovie>(
      `${this.apiUrlStart}${id}${this.apiUrlEnd}`,
      { headers }
    );
  }
}

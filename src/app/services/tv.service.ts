import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { SingleMovie, ImagesResponse } from '../interfaces/interface';

@Injectable({
  providedIn: 'root',
})
export class TvService {
  private apiUrlStart = 'https://api.themoviedb.org/3/tv/';
  private apiUrlEnd = '?language=en-US';
  private apiUrlEnd2 = '/images';

  constructor(private http: HttpClient) {}

  getDataTv(id: number): Observable<SingleMovie> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${environment.apiKey}`,
      Accept: 'application/json',
    });
    return this.http.get<SingleMovie>(
      `${this.apiUrlStart}${id}${this.apiUrlEnd}`,
      { headers }
    );
  }

  getDataImage(id: number): Observable<ImagesResponse> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${environment.apiKey}`,
      Accept: 'application/json',
    });
    return this.http.get<ImagesResponse>(
      `${this.apiUrlStart}${id}${this.apiUrlEnd2}`,
      { headers }
    );
  }
}

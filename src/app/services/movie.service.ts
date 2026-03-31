import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { SingleMovie, ImagesResponse } from '../interfaces/interface';

@Injectable({
  providedIn: 'root',
})
export class MovieService {

  constructor(private http: HttpClient) {}

  getDataMovie<T>(apiStart: string, apiEnd: string, id: number): Observable<T> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${environment.apiKey}`,
      Accept: 'application/json',
    });
    return this.http.get<T>(
      `${apiStart}${id}${apiEnd}`,
      { headers }
    );
  }

  getDataImage(apiStart: string, id: number): Observable<ImagesResponse> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${environment.apiKey}`,
      Accept: 'application/json',
    });
    return this.http.get<ImagesResponse>(
      `${apiStart}${id}/images`,
      { headers }
    );
  }
}

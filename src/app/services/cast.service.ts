import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { MovieCast } from '../interfaces/interface';

@Injectable({
  providedIn: 'root',
})
export class CastService {
  constructor(private http: HttpClient) {}

  getDataCast(apiOne: string, apiTwo: string, id: number): Observable<MovieCast> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${environment.apiKey}`,
      Accept: 'application/json',
    });
    return this.http.get<MovieCast>(`${apiOne}${id}${apiTwo}`, {
      headers,
    });
  }

}

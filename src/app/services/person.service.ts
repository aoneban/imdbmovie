import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { SinglePerson } from '../interfaces/interface';

@Injectable({
  providedIn: 'root',
})
export class PersonService {
  private apiUrl1 = 'https://api.themoviedb.org/3/person/';
  private apiUrl2 = '?language=en-US';

  constructor(private http: HttpClient) {}

  getDataPerson(id: number): Observable<SinglePerson> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${environment.apiKey}`,
      Accept: 'application/json',
    });
    return this.http.get<SinglePerson>(`${this.apiUrl1}${id}${this.apiUrl2}`, {
      headers,
    });
  }
}

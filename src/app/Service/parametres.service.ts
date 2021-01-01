import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ParametreInterface } from '../Interface/Parametre';

@Injectable({
  providedIn: 'root'
})
export class ParametresService {

  private baseURL = 'http://localhost:4000/api/parametre/';

  constructor(private http: HttpClient) { }

  public getParametres(): Observable<any> {
    return this.http.get(this.baseURL);
  }

  public edit(parametres: ParametreInterface): Observable<any> {
    return this.http.put(`${this.baseURL}edit/${parametres._id}`, {parametres});
  }

  public reset(): Observable<any> {
    return this.http.delete(this.baseURL);
  }
}
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Policy } from '../models/policy.model';

@Injectable({
  providedIn: 'root'
})
export class PolicyService {
  private apiUrl = 'http://localhost:8080/api/v1/policies';

  constructor(private http: HttpClient) {}

  createPolicy(policy: Policy): Observable<Policy> {
    return this.http.post<Policy>(this.apiUrl, policy);
  }

  getPolicy(id: string): Observable<Policy> {
    return this.http.get<Policy>(`${this.apiUrl}/${id}`);
  }

  listPolicies(): Observable<Policy[]> {
    return this.http.get<Policy[]>(this.apiUrl);
  }
}

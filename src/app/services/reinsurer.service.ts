import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Reinsurer } from "../models/reinsurer.model";

@Injectable({ providedIn: 'root' })
export class ReinsurerService {
  private base = 'http://localhost:8080/api/v1/reinsurers';
  constructor(private http: HttpClient) {}
  list(): Observable<Reinsurer[]> { return this.http.get<Reinsurer[]>(this.base); }
  
getById(id: string) {
  const url = `${this.base}/${encodeURIComponent(id)}`; // ✅ safe
  console.log('[ReinsurerService] GET', url);
  return this.http.get<Reinsurer>(url);
}


}

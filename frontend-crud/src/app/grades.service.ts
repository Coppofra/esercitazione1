import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Grade {
  id: number;
  student_name: string;
  subject: string;
  grade: number;
  date: string;
}

@Injectable({
  providedIn: 'root'
})
export class GradesService {
  private apiUrl = 'http://localhost:5000/grades';

  constructor(private http: HttpClient) { }

  getGrades(): Observable<Grade[]> {
    return this.http.get<Grade[]>(this.apiUrl);
  }

  addGrade(grade: any): Observable<Grade> {
    return this.http.post<Grade>(this.apiUrl, grade);
  }

  updateGrade(id: number, grade: any): Observable<Grade> {
    return this.http.put<Grade>(`${this.apiUrl}/${id}`, grade);
  }

  deleteGrade(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}

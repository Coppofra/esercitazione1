import { Component, signal, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { GradesService, Grade } from './grades.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, HttpClientModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
  standalone: true
})
export class App implements OnInit {
  protected readonly title = signal('frontend-view');
  grades: Grade[] = [];
  filteredGrades: Grade[] = [];
  searchName: string = '';
  editingId: number | null = null;
  showForm: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';
  
  // Form data
  studentName: string = '';
  subject: string = '';
  grade: string = '';
  date: string = '';

  constructor(private gradesService: GradesService) { }

  ngOnInit() {
    this.loadGrades();
  }

  loadGrades() {
    this.gradesService.getGrades().subscribe(
      (data: Grade[]) => {
        this.grades = data;
        this.filterGrades();
      },
      (error) => {
        this.showError('Errore nel caricamento dei voti');
        console.error(error);
      }
    );
  }

  filterGrades() {
    if (this.searchName.trim() === '') {
      this.filteredGrades = this.grades;
    } else {
      this.filteredGrades = this.grades.filter(grade =>
        grade.student_name.toLowerCase().includes(this.searchName.toLowerCase())
      );
    }
  }

  openForm(grade?: Grade) {
    if (grade) {
      this.editingId = grade.id;
      this.studentName = grade.student_name;
      this.subject = grade.subject;
      this.grade = grade.grade.toString();
      this.date = grade.date;
    } else {
      this.resetForm();
    }
    this.showForm = true;
    this.errorMessage = '';
    this.successMessage = '';
  }

  closeForm() {
    this.showForm = false;
    this.resetForm();
  }

  resetForm() {
    this.studentName = '';
    this.subject = '';
    this.grade = '';
    this.date = '';
    this.editingId = null;
  }

  submitForm() {
    this.errorMessage = '';
    this.successMessage = '';

    const gradeData = {
      student_name: this.studentName,
      subject: this.subject,
      grade: this.grade,
      date: this.date
    };

    if (this.editingId) {
      this.gradesService.updateGrade(this.editingId, gradeData).subscribe(
        () => {
          this.showSuccess('Voto modificato con successo');
          this.loadGrades();
          this.closeForm();
        },
        (error) => {
          this.showError(error.error.error || 'Errore nella modifica del voto');
        }
      );
    }
  }

  deleteGrade(id: number) {
    if (confirm('Sei sicuro di voler eliminare questo voto?')) {
      this.gradesService.deleteGrade(id).subscribe(
        () => {
          this.showSuccess('Voto eliminato con successo');
          this.loadGrades();
        },
        (error) => {
          this.showError('Errore nell\'eliminazione del voto');
        }
      );
    }
  }

  getGradeColor(grade: number): string {
    return grade < 6 ? 'red' : 'green';
  }

  showError(message: string) {
    this.errorMessage = message;
    setTimeout(() => this.errorMessage = '', 5000);
  }

  showSuccess(message: string) {
    this.successMessage = message;
    setTimeout(() => this.successMessage = '', 3000);
  }
}

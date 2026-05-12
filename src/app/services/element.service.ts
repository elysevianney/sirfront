import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environments';

export interface ElementItem {
  id: number;
  media: 'BOOK' | 'MAG';
  title: string;
  borrowings: unknown[];
  wishedBy: unknown[];
  author?: string;
  datePublication?: number[];
}

export interface CreateBookDto {
  title: string;
  author: string;
  media: 'BOOK';
}

export interface CreateMagazineDto {
  title: string;
  media: 'MAG';
  datePublication: string;
}

@Injectable({
  providedIn: 'root',
})
export class ElementService {
  private readonly http = inject(HttpClient);

  getElements(): Observable<ElementItem[]> {
    return this.http.get<ElementItem[]>(`${environment.apiUrl}/element`);
  }

  createBook(book: CreateBookDto): Observable<ElementItem> {
    return this.http.post<ElementItem>(`${environment.apiUrl}/element/book`, book);
  }

  createMagazine(magazine: CreateMagazineDto): Observable<ElementItem> {
    return this.http.post<ElementItem>(`${environment.apiUrl}/element/magazine`, magazine);
  }
}

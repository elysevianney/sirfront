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

export interface BorrowItem {
  id: number;
  user?: {
    id: number;
    nom?: string;
    prenom?: string;
    email?: string;
  };
  item: ElementItem;
  borrowDate?: string | number[];
  dueDate?: string | number[];
  returnDate?: string | number[];
  status?: string;
}

export type BorrowStatus = 'IN_PROGRESS' | 'BORROWED' | 'RETURNED' | 'LATE';

export interface CreateBookDto {
  title: string;
  author: string;
  media: 'BOOK';
}

export interface CreateMagazineDto {
  id?: number;
  title: string;
  media: 'MAG';
  datePublication: string;
}

export interface CreateBorrowDto {
  userId: number;
  itemId: number;
}

export interface UpdateBorrowDto {
  borrowDate: string;
  dueDate: string;
  status: BorrowStatus;
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

  updateBook(id: number, book: CreateBookDto): Observable<unknown> {
    return this.http.put<unknown>(`${environment.apiUrl}/element/book/${id}`, book);
  }

  updateMagazine(id: number, magazine: CreateMagazineDto): Observable<unknown> {
    return this.http.put<unknown>(`${environment.apiUrl}/element/magazine/${id}`, magazine);
  }

  deleteElement(id: number): Observable<unknown> {
    return this.http.delete<unknown>(`${environment.apiUrl}/element/${id}`);
  }

  createBorrow(borrow: CreateBorrowDto): Observable<unknown> {
    return this.http.post<unknown>(`${environment.apiUrl}/borrow`, borrow);
  }

  getAllBorrows(): Observable<BorrowItem[]> {
    return this.http.get<BorrowItem[]>(`${environment.apiUrl}/borrow`);
  }

  getBorrowsByUser(userId: number): Observable<BorrowItem[]> {
    return this.http.get<BorrowItem[]>(`${environment.apiUrl}/borrow/user/${userId}`);
  }

  updateBorrow(id: number, borrow: UpdateBorrowDto): Observable<unknown> {
    return this.http.put<unknown>(`${environment.apiUrl}/borrow/${id}`, borrow);
  }
}

import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, map } from 'rxjs';

export interface Bolo {
  id: number;
  sectionId: number;
  title: string;
  description: string;
  price: number;
  image: string;
  destaque: boolean;
}

export interface Section {
  id: number;
  title: string;
  image: string;
}

export interface SectionWithBolos extends Section {
  items: Bolo[];
}

@Injectable({ providedIn: 'root' })
export class CardapioService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:3000';

  getSections(): Observable<Section[]> {
    return this.http.get<Section[]>(`${this.apiUrl}/sections`);
  }

  getSectionsWithBolos(): Observable<SectionWithBolos[]> {
    return forkJoin({
      sections: this.http.get<Section[]>(`${this.apiUrl}/sections`),
      bolos: this.http.get<Bolo[]>(`${this.apiUrl}/bolos`)
    }).pipe(
      map(({ sections, bolos }) =>
        sections.map(section => ({
          ...section,
          items: bolos.filter(bolo => Number(bolo.sectionId) === Number(section.id))
        }))
      )
    );
  }

  getDestaques(): Observable<Bolo[]> {
    return this.http.get<Bolo[]>(`${this.apiUrl}/bolos?destaque=true`);
  }
}

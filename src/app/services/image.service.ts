import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';

export interface Imagem {
  id?: number;
  nome: string;
  base64: string;
}

@Injectable({ providedIn: 'root' })
export class ImageService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:3000';

  // Map de nome → base64, reativo
  private readonly _imagemMap = signal<Map<string, string>>(new Map());

  // Lista de nomes disponíveis para os dropdowns
  readonly imagensDisponiveis = signal<Imagem[]>([]);

  /** Chame uma vez no bootstrap (AppComponent ou onde preferir). */
  carregar() {
    return this.http.get<Imagem[]>(`${this.apiUrl}/imagens`).pipe(
      tap(imagens => {
        this.imagensDisponiveis.set(imagens);
        const map = new Map<string, string>();
        for (const img of imagens) {
          map.set(img.nome, img.base64);
        }
        this._imagemMap.set(map);
      })
    );
  }

  /**
   * Resolve o src para um <img>.
   * - Se o valor for um caminho estático (/assets/... ou /images/...)
   *   devolve como está.
   * - Se for apenas um nome de arquivo (ex: "meu-bolo.jpg"),
   *   busca o base64 no map.
   */
  getSrc(value: string): string {
    if (!value) return '';
    if (value.startsWith('/') || value.startsWith('http')) return value;
    return this._imagemMap().get(value) ?? value;
  }

  /** Faz POST /imagens e atualiza o map/lista em memória. */
  salvar(imagem: Imagem) {
    return this.http.post<Imagem>(`${this.apiUrl}/imagens`, imagem).pipe(
      tap(saved => {
        // atualiza lista
        this.imagensDisponiveis.update(list => [...list, saved]);
        // atualiza map
        this._imagemMap.update(map => {
          const next = new Map(map);
          next.set(saved.nome, saved.base64);
          return next;
        });
      })
    );
  }
}

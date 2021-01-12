import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { Filme } from 'src/app/shared/models/filme';

const URL = 'http://localhost:3000/filmes/';

@Injectable({
  providedIn: 'root'
})
export class FilmesService {

  constructor(private http: HttpClient) { }

  salvar(filme: Filme): Observable<Filme> {
    return this.http.post<Filme>(URL, filme);
  }

  listar(pagina: number, qtdPagina: number): Observable<Filme[]> {
    let httpParams = new HttpParams();
    httpParams = httpParams.set('_page', pagina.toString())
    httpParams = httpParams.set('_limit', qtdPagina.toString());
    return this.http.get<Filme[]>(URL, {params: httpParams});
  }
}

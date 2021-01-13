import { ConfigParamsService } from './config-params.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { ConfigParams } from './../shared/models/config-params';
import { Filme } from 'src/app/shared/models/filme';

const URL = 'http://localhost:3000/filmes/';

@Injectable({
  providedIn: 'root'
})
export class FilmesService {

  constructor(private http: HttpClient, private configService: ConfigParamsService) { }

  salvar(filme: Filme): Observable<Filme> {
    return this.http.post<Filme>(URL, filme);
  }

  listar(config: ConfigParams): Observable<Filme[]> {
    const configParams = this.configService.configurarParametros(config)
    return this.http.get<Filme[]>(URL, {params: configParams});
  }
}

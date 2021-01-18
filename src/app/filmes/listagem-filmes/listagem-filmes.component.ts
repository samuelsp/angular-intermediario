import { ConfigParams } from './../../shared/models/config-params';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { debounceTime } from 'rxjs/operators/'

import { FilmesService } from 'src/app/core/filmes.service';
import { Filme } from 'src/app/shared/models/filme';

@Component({
  selector: 'dio-listagem-filmes',
  templateUrl: './listagem-filmes.component.html',
  styleUrls: ['./listagem-filmes.component.scss']
})

export class ListagemFilmesComponent implements OnInit {
  readonly semFoto = './assets/images/no-image.png';
  config: ConfigParams = {
    pagina: 0,
    limite: 4
  }

  filmes: Filme[] = [];
  filtrosListagem: FormGroup;
  generos: Array<string>;
  
  constructor(
              private filmesService: FilmesService,
              private fb: FormBuilder,
              private router: Router) { }

  ngOnInit(): void {
    this.filtrosListagem = this.fb.group({
      texto: [''],
      genero: ['']
    });
    
    this.filtrosListagem.get('texto').valueChanges
      .pipe(debounceTime(400))
      .subscribe((value: string) => {
        this.config.pesquisa = value;
        this.resetarConsulta();
      });
    
    this.filtrosListagem.get('genero').valueChanges.subscribe((value: string) => {
      this.config.campo = {tipo: 'genero', valor: value};
      this.resetarConsulta();

    });

    this.generos = [
      'Ação',
      'Aventura',
      'Comédia',
      'Drama',
      'Ficção Cientifica',
      'Romance',
      'Terror'
    ];

    this.listarFilmes();

  };
  
  onScroll(): void {
    this.listarFilmes();
  }

  abrir(id: number): void {
    this.router.navigateByUrl('/filmes/' + id);
  }
  
  private listarFilmes(): void {
    this.config.pagina++;
    this.filmesService.listar(this.config).subscribe(
      (filmes: Filme[]) => this.filmes.push(...filmes));
  }

  private resetarConsulta(): void {
    this.config.pagina = 0;
    this.filmes = [];
    this.listarFilmes();
  }

}

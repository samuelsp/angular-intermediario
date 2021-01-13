import { FormGroup, FormBuilder } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

import { FilmesService } from 'src/app/core/filmes.service';
import { Filme } from 'src/app/shared/models/filme';

@Component({
  selector: 'dio-listagem-filmes',
  templateUrl: './listagem-filmes.component.html',
  styleUrls: ['./listagem-filmes.component.scss']
})

export class ListagemFilmesComponent implements OnInit {
  readonly qtdPagina = 4;
  pagina = 0;
  filmes: Filme[] = [];
  filtrosListagem: FormGroup;
  generos: Array<string>;
  texto: string;
  genero: string;  
  
  constructor(
              private filmesService: FilmesService,
              private fb: FormBuilder) { }

  ngOnInit(): void {
    this.filtrosListagem = this.fb.group({
      texto: [''],
      genero: ['']
    });
    
    this.filtrosListagem.get('texto').valueChanges.subscribe((value: string) => {
      this.texto = value;
      this.resetarConsulta();

    });
    
    this.filtrosListagem.get('genero').valueChanges.subscribe((value: string) => {
      this.genero = value;
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
  
  private listarFilmes(): void {
    this.pagina++;
    this.filmesService.listar(this.pagina, this.qtdPagina, this.texto, this.genero).subscribe(
      (filmes: Filme[]) => this.filmes.push(...filmes));
  }

  private resetarConsulta(): void {
    this.pagina = 0;
    this.filmes = [];
    this.listarFilmes();
  }

}

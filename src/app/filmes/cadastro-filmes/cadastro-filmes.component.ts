import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { ValidarCamposService } from 'src/app/shared/components/campos/validar-campos.service';
import { Filme } from 'src/app/shared/models/filme';
import { FilmesService } from 'src/app/core/filmes.service';
import { AlertaComponent } from 'src/app/shared/components/alerta/alerta.component';
import { Alerta } from 'src/app/shared/models/alerta';

@Component({
  selector: 'dio-cadastro-filmes',
  templateUrl: './cadastro-filmes.component.html',
  styleUrls: ['./cadastro-filmes.component.scss']
})

export class CadastroFilmesComponent implements OnInit {

  cadastro: FormGroup;
  generos: Array<string>;

  constructor(public validacao: ValidarCamposService, 
    public dialog: MatDialog,
    private fb: FormBuilder,
    private filmesService: FilmesService) {}

  get f() {
    return this.cadastro.controls;
  }

  ngOnInit() {
    this.cadastro = this.fb.group({
      titulo: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(256)]],
      urlFoto: ['', [Validators.minLength(10)]],
      dtLancamento: ['', Validators.required],
      descricao: [''],
      nota: [0, [Validators.required, Validators.min(0), Validators.max(10)]],
      urlIMDb: ['', [Validators.minLength(10)]],
      genero: ['', Validators.required]
    });

    this.generos = [
      'Ação',
      'Aventura',
      'Comédia',
      'Drama',
      'Ficção Cientifica',
      'Romance',
      'Terror'
    ]

  }

  submit(): void {
    this.cadastro.markAllAsTouched();
    if(this.cadastro.invalid) {
      return;      
    }
    // alert("SUCESSO!\n\n" + JSON.stringify(this.cadastro.value, null, 4));
    const filme = this.cadastro.getRawValue() as Filme;
    this.salvar(filme);

  } 

  reiniciarForm(): void {
    this.cadastro.reset();
  }

  private salvar(filme: Filme): void {
    this.filmesService.salvar(filme).subscribe(
      next => { 
        const config = {
          data: {
            btnSucesso: 'Ir para a Listagem',
            btnCancelar: 'Cadastrar Novo Filme',
            corBtnSucesso: 'primary',            
            possuirBtnFechar: true
          } as Alerta
        };
        const dialogRef = this.dialog.open(AlertaComponent, config);      
      }, error => console.log('Erro ao Salvar')
    );
  }
 
}
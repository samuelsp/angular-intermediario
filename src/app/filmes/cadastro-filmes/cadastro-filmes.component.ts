import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';

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

  id: number;
  cadastro: FormGroup;
  generos: Array<string>;

  constructor(public validacao: ValidarCamposService, 
    public dialog: MatDialog,
    private fb: FormBuilder,
    private filmesService: FilmesService,
    private router: Router,
    private activatedRoute: ActivatedRoute) {}

  get f() {
    return this.cadastro.controls;
  }

  ngOnInit() {
    this.id = this.activatedRoute.snapshot.params["id"];
    if(this.id) {
      this.filmesService.visualizar(this.id)
      .subscribe((filme: Filme) => this.criarFormulario(filme));
    }
    else {
      this.criarFormulario(this.criarFilmeEmBranco());

    }
    
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
    if(this.id) {
      filme.id = this.id;
      this.editar(filme);    
    }
    else {
      this.salvar(filme);
    }
  } 
  
  reiniciarForm(): void {
    this.cadastro.reset();
  }
  
  private criarFormulario(filme: Filme): void {
    this.cadastro = this.fb.group({
      titulo: [filme.titulo, [Validators.required, Validators.minLength(2), Validators.maxLength(256)]],
      urlFoto: [filme.urlFoto, [Validators.minLength(10)]],
      dtLancamento: [filme.dtLancamento, Validators.required],
      descricao: [filme.descricao],
      nota: [filme.nota, [Validators.required, Validators.min(0), Validators.max(10)]],
      urlIMDb: [filme.urlIMDb, [Validators.minLength(10)]],
      genero: [filme.genero, Validators.required]
    });
  }

  private criarFilmeEmBranco(): Filme {
    return {
      id: null,
      titulo: null,
      dtLancamento: null,
      urlFoto: null,
      descricao: null,
      nota: null,
      urlIMDb: null,
      genero: null
    } as Filme;
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
        dialogRef.afterClosed().subscribe((opcao: boolean) => {
          if(opcao) {
            this.router.navigateByUrl('filmes');
          }
          else {
            this.reiniciarForm();
          }
        })     
      }, error =>  {
        const config = {
          data: {
            titulo: 'Erro ao salvar o registro!',
            descricao: 'Não conseguimos salvar seu registro, favor tentar novamente mais tarde.',
            btnSucesso: 'Fechar',
            corBtnSucesso: 'warn'
          } as Alerta    
        };
        this.dialog.open(AlertaComponent, config);  
      });
  
    }
  private editar(filme: Filme): void {
    this.filmesService.editar(filme).subscribe(
      next => { 
        const config = {
          data: {
            descricao: 'Seu registro foi atualizado com sucesso',
            btnSucesso: 'Ir para a Listagem',
            corBtnSucesso: 'warn'
          } as Alerta
        };
        const dialogRef = this.dialog.open(AlertaComponent, config); 
        dialogRef.afterClosed().subscribe(() => 
            this.router.navigateByUrl('filmes'));             
      }, error =>  {
        const config = {
          data: {
            titulo: 'Erro ao editar o registro!',
            descricao: 'Não conseguimos editar seu registro, favor tentar novamente mais tarde.',
            btnSucesso: 'Fechar',
            corBtnSucesso: 'warn'
          } as Alerta    
        };
        this.dialog.open(AlertaComponent, config);  
      });
  }
 
}
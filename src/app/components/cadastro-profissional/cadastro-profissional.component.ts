import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { ProfissionalService } from '../../services/profissional.service';
import {
  CategoriaProfissional,
  CategoriaLabel,
} from '../../models/profissional.model';

@Component({
  selector: 'app-cadastro-profissional',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './cadastro-profissional.component.html',
  styleUrls: ['./cadastro-profissional.component.css'],
})
export class CadastroProfissionalComponent {
  profissionalForm: FormGroup;
  categorias = Object.values(CategoriaProfissional);
  categoriaLabel = CategoriaLabel;
  mensagemSucesso = '';
  mensagemErro = '';
  loading = false;

  constructor(
    private fb: FormBuilder,
    private profissionalService: ProfissionalService,
    public route: ActivatedRoute,
    private router: Router,
  ) {
    this.profissionalForm = this.fb.group({
      nome: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
        ],
      ],
      registro: ['', Validators.required],
      categoria: ['', Validators.required],
      cargaHorariaSemanal: [
        40,
        [Validators.required, Validators.min(10), Validators.max(40)],
      ],
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const id = params['id'];
      if (id) {
        this.carregarProfissionalParaEdicao(id);
      }
    });
  }

  carregarProfissionalParaEdicao(id: number): void {
    this.loading = true;
    this.profissionalService.buscarPorId(id).subscribe({
      next: (profissional) => {
        this.profissionalForm.patchValue({
          nome: profissional.nome,
          registro: profissional.registro,
          categoria: profissional.categoria,
          cargaHorariaSemanal: profissional.cargaHorariaSemanal,
        });
        this.loading = false;
      },
      error: (err) => {
        console.error('Erro ao carregar profissional:', err);
        this.mensagemErro = 'Erro ao carregar dados do profissional';
        this.loading = false;
      },
    });
  }

  voltarParaLista(): void {
    this.router.navigate(['/profissionais/lista']);
  }

  onSubmit(): void {
    if (this.profissionalForm.valid) {
      this.loading = true;
      this.mensagemSucesso = '';
      this.mensagemErro = '';

      const id = this.route.snapshot.queryParams['id'];

      if (id) {
        // Modo edição
        this.profissionalService
          .atualizar(id, this.profissionalForm.value)
          .subscribe({
            next: () => {
              this.mensagemSucesso = 'Profissional atualizado com sucesso!';
              this.loading = false;
              setTimeout(() => {
                this.router.navigate(['/profissionais/lista']);
              }, 2000);
            },
            error: (err) => {
              this.mensagemErro =
                err.error?.error || 'Erro ao atualizar profissional';
              this.loading = false;
              setTimeout(() => (this.mensagemErro = ''), 5000);
            },
          });
      } else {
        // Modo cadastro
        this.profissionalService
          .cadastrar(this.profissionalForm.value)
          .subscribe({
            next: () => {
              this.mensagemSucesso = 'Profissional cadastrado com sucesso!';
              this.loading = false;
              setTimeout(() => {
                this.router.navigate(['/profissionais/lista']);
              }, 2000);
            },
            error: (err) => {
              this.mensagemErro =
                err.error?.error || 'Erro ao cadastrar profissional';
              this.loading = false;
              setTimeout(() => (this.mensagemErro = ''), 5000);
            },
          });
      }
    }
  }
}

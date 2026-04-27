import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { EscalaService } from '../../services/escala.service';
import { ProfissionalService } from '../../services/profissional.service';
import { Profissional, CategoriaLabel } from '../../models/profissional.model';
import { Turno, TurnoHorario } from '../../models/plantao.model';

@Component({
  selector: 'app-cadastro-plantao',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './cadastro-plantao.component.html',
  styleUrls: ['./cadastro-plantao.component.css'],
})
export class CadastroPlantaoComponent {
  plantaoForm: FormGroup;
  profissionais: Profissional[] = [];
  turnos = Object.values(Turno);
  turnoHorario = TurnoHorario;
  categoriaLabel = CategoriaLabel;
  loading = false;
  mensagemSucesso = '';
  mensagemErro = '';

  constructor(
    private fb: FormBuilder,
    private escalaService: EscalaService,
    private profissionalService: ProfissionalService,
    private router: Router,
  ) {
    this.plantaoForm = this.fb.group({
      profissionalId: ['', Validators.required],
      data: ['', Validators.required],
      turno: ['', Validators.required],
    });
    this.carregarProfissionais();
  }

  carregarProfissionais(): void {
    this.profissionalService.listar().subscribe({
      next: (data) => (this.profissionais = data),
      error: (err) => console.error('Erro ao carregar profissionais:', err),
    });
  }

  onSubmit(): void {
    if (this.plantaoForm.valid) {
      this.loading = true;
      this.mensagemSucesso = '';
      this.mensagemErro = '';

      const plantao = {
        ...this.plantaoForm.value,
        data: new Date(this.plantaoForm.value.data),
      };

      this.escalaService.cadastrarPlantao(plantao).subscribe({
        next: () => {
          this.mensagemSucesso = 'Plantão cadastrado com sucesso!';
          this.loading = false;
          setTimeout(() => {
            this.router.navigate(['/escala']);
          }, 1500);
        },
        error: (err) => {
          this.mensagemErro = err.error?.error || 'Erro ao cadastrar plantão';
          this.loading = false;
        },
      });
    }
  }

  cancelar(): void {
    this.router.navigate(['/escala']);
  }
}

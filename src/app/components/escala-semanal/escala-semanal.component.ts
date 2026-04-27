import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { EscalaService } from '../../services/escala.service';
import { ProfissionalService } from '../../services/profissional.service';
import { Profissional, CategoriaLabel } from '../../models/profissional.model';
import {
  Turno,
  TurnoHorario,
  EscalaSemanal,
  PlantaoInfo,
} from '../../models/plantao.model';

@Component({
  selector: 'app-escala-semanal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './escala-semanal.component.html',
  styleUrls: ['./escala-semanal.component.css'],
})
export class EscalaSemanalComponent implements OnInit {
  escalaForm: FormGroup;
  profissionais: Profissional[] = [];
  turnos = Object.values(Turno);
  turnoHorario = TurnoHorario;
  categoriaLabel = CategoriaLabel;
  escalaSemanal: EscalaSemanal | null = null;
  diasSemana: Date[] = [];
  profissionaisComLimite: Map<number, boolean> = new Map();
  loading = false;
  mensagemSucesso = '';
  mensagemErro = '';
  dataReferencia: Date = new Date();

  constructor(
    private fb: FormBuilder,
    private escalaService: EscalaService,
    private profissionalService: ProfissionalService,
  ) {
    this.escalaForm = this.fb.group({
      profissionalId: ['', Validators.required],
      data: ['', Validators.required],
      turno: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.carregarProfissionais();
    this.irParaSemanaAtual();
  }

  carregarProfissionais(): void {
    this.profissionalService.listar().subscribe({
      next: (data) => (this.profissionais = data),
      error: (err) => console.error('Erro ao carregar profissionais:', err),
    });
  }

  // Retorna a Segunda-feira de qualquer data
  obterSegundaFeira(data: Date): Date {
    const dia = data.getDay();
    const diff = dia === 0 ? -6 : 1 - dia;
    const segunda = new Date(data);
    segunda.setDate(data.getDate() + diff);
    segunda.setHours(0, 0, 0, 0);
    return segunda;
  }

  irParaSemanaAtual(): void {
    const hoje = new Date();
    const segunda = this.obterSegundaFeira(hoje);
    this.dataReferencia = segunda;
    this.carregarEscalaSemanal(segunda);
  }

  semanaAnterior(): void {
    const novaData = new Date(this.dataReferencia);
    novaData.setDate(this.dataReferencia.getDate() - 7);
    this.dataReferencia = novaData;
    this.carregarEscalaSemanal(novaData);
  }

  proximaSemana(): void {
    const novaData = new Date(this.dataReferencia);
    novaData.setDate(this.dataReferencia.getDate() + 7);
    this.dataReferencia = novaData;
    this.carregarEscalaSemanal(novaData);
  }

  carregarEscalaSemanal(data: Date): void {
    this.loading = true;
    // Envia a Segunda-feira para o backend
    const segunda = this.obterSegundaFeira(data);

    this.escalaService.obterEscalaSemanal(segunda).subscribe({
      next: (escala) => {
        this.escalaSemanal = escala;
        this.gerarDiasSemana(segunda);
        this.profissionaisComLimite = new Map(
          Object.entries(escala.limiteAtingido || {}).map(([k, v]) => [
            Number(k),
            v,
          ]),
        );
        this.loading = false;
      },
      error: (err) => {
        console.error('Erro ao carregar escala:', err);
        this.mensagemErro = 'Erro ao carregar escala semanal';
        this.loading = false;
        setTimeout(() => (this.mensagemErro = ''), 3000);
      },
    });
  }

  gerarDiasSemana(segunda: Date): void {
    this.diasSemana = [];
    for (let i = 0; i < 7; i++) {
      const dia = new Date(segunda);
      dia.setDate(segunda.getDate() + i);
      this.diasSemana.push(dia);
    }
  }

  /*obterTurnoNaCelula(profissionalId: number, data: Date): string {
    if (!this.escalaSemanal?.escala) return '';
    const escalaProfissional = this.escalaSemanal.escala[profissionalId];
    if (!escalaProfissional) return '';
    const dataStr = data.toISOString().split('T')[0];
    return escalaProfissional[dataStr] || '';
  }*/

  profissionalAtingiuLimite(profissionalId: number): boolean {
    return this.profissionaisComLimite.get(profissionalId) || false;
  }

  cadastrarPlantao(): void {
    if (this.escalaForm.valid) {
      this.loading = true;
      this.mensagemSucesso = '';
      this.mensagemErro = '';

      const plantao = {
        ...this.escalaForm.value,
        data: new Date(this.escalaForm.value.data),
      };

      this.escalaService.cadastrarPlantao(plantao).subscribe({
        next: () => {
          this.mensagemSucesso = 'Plantão cadastrado com sucesso!';
          this.escalaForm.reset();
          this.carregarEscalaSemanal(this.dataReferencia);
          this.loading = false;
          setTimeout(() => (this.mensagemSucesso = ''), 5000);
        },
        error: (err) => {
          this.mensagemErro = err.error?.error || 'Erro ao cadastrar plantão';
          this.loading = false;
          setTimeout(() => (this.mensagemErro = ''), 5000);
        },
      });
    }
  }

  obterNomeDiaSemana(data: Date): string {
    const dias = {
      Mon: 'Seg',
      Tue: 'Ter',
      Wed: 'Qua',
      Thu: 'Qui',
      Fri: 'Sex',
      Sat: 'Sáb',
      Sun: 'Dom',
    };
    const diaIngles = data.toLocaleDateString('en-US', { weekday: 'short' });
    return dias[diaIngles as keyof typeof dias] || diaIngles;
  }

  semanaAtual(): void {
    const hoje = new Date();
    const segunda = this.obterSegundaFeira(hoje);
    this.dataReferencia = segunda;
    this.carregarEscalaSemanal(segunda);
  }

  obterPlantoesNaCelula(profissionalId: number, data: Date): PlantaoInfo[] {
    if (!this.escalaSemanal?.escala) return [];
    const escalaProfissional = this.escalaSemanal.escala[profissionalId];
    if (!escalaProfissional) return [];
    const dataStr = data.toISOString().split('T')[0];
    return escalaProfissional[dataStr] || [];
  }

  excluirPlantao(
    plantaoId: number,
    profissionalNome: string,
    turnoLabel: string,
    data: Date,
  ): void {
    if (
      confirm(
        `Deseja excluir o plantão de ${turnoLabel} do profissional ${profissionalNome} na data ${data.toLocaleDateString()}?`,
      )
    ) {
      this.escalaService.excluirPlantao(plantaoId).subscribe({
        next: () => {
          this.mensagemSucesso = 'Plantão excluído com sucesso!';
          this.carregarEscalaSemanal(this.dataReferencia);
          setTimeout(() => (this.mensagemSucesso = ''), 3000);
        },
        error: (err) => {
          this.mensagemErro = err.error?.error || 'Erro ao excluir plantão';
          setTimeout(() => (this.mensagemErro = ''), 3000);
        },
      });
    }
  }
}

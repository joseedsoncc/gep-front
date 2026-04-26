import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProfissionalService } from '../../services/profissional.service';
import {
  Profissional,
  CategoriaProfissional,
  CategoriaLabel,
} from '../../models/profissional.model';

interface ProfissionalParaExcluir {
  id: number;
  nome: string;
  registro: string;
  categoria: string;
  cargaHorariaSemanal: number;
}

@Component({
  selector: 'app-lista-profissionais',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './lista-profissionais.component.html',
  styleUrls: ['./lista-profissionais.component.css'],
})
export class ListaProfissionaisComponent implements OnInit {
  profissionais: Profissional[] = [];
  profissionaisFiltrados: Profissional[] = [];
  categorias = Object.values(CategoriaProfissional);
  categoriaLabel = CategoriaLabel;
  filtroCategoria: string = '';
  loading = false;
  profissionalParaExcluir: ProfissionalParaExcluir | null = null;
  exibirLista: boolean = false;

  constructor(
    private profissionalService: ProfissionalService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    //this.carregarProfissionais();
    this.limparFiltro();
  }

  pesquisar(): void {
    this.loading = true;
    this.profissionalService
      .listar(this.filtroCategoria || undefined)
      .subscribe({
        next: (data) => {
          this.profissionais = data;
          this.profissionaisFiltrados = data;
          this.exibirLista = true;
          this.loading = false;
        },
        error: (err) => {
          console.error('Erro ao carregar profissionais:', err);
          this.loading = false;
          alert('Erro ao pesquisar profissionais');
        },
      });
  }

  carregarProfissionais(): void {
    this.loading = true;
    this.profissionalService.listar().subscribe({
      next: (data) => {
        this.profissionais = data;
        this.filtrarProfissionais();
        this.loading = false;
      },
      error: (err) => {
        console.error('Erro ao carregar profissionais:', err);
        this.loading = false;
      },
    });
  }

  filtrarProfissionais(): void {
    console.log('filtroCategoria:', this.filtroCategoria);
    if (!this.filtroCategoria) {
      this.profissionaisFiltrados = this.profissionais;
    } else {
      this.profissionaisFiltrados = this.profissionais.filter(
        (p) => p.categoria === this.filtroCategoria,
      );
    }
  }

  limparFiltro(): void {
    this.filtroCategoria = '';
    this.profissionais = [];
    this.profissionaisFiltrados = [];
    this.exibirLista = false;
  }

  //----
  irParaCadastro(): void {
    this.router.navigate(['/profissionais/cadastro']);
  }

  //editar
  editarProfissional(id: number): void {
    this.router.navigate(['/profissionais/cadastro'], {
      queryParams: { id: id },
    });
  }

  confirmarExclusao(profissional: Profissional): void {
    this.profissionalParaExcluir = {
      id: profissional.id!,
      nome: profissional.nome,
      registro: profissional.registro,
      categoria: profissional.categoria,
      cargaHorariaSemanal: profissional.cargaHorariaSemanal,
    };
  }

  //excluir
  excluirProfissional(): void {
    if (this.profissionalParaExcluir) {
      this.loading = true;
      this.profissionalService
        .excluir(this.profissionalParaExcluir.id!)
        .subscribe({
          next: () => {
            alert(
              `Profissional ${this.profissionalParaExcluir!.nome} excluído com sucesso!`,
            );
            this.profissionalParaExcluir = null;
            this.carregarProfissionais();
            this.loading = false;
          },
          error: (err) => {
            console.error('Erro ao excluir profissional:', err);
            alert(
              'Erro ao excluir profissional. Verifique se ele não possui plantões associados.',
            );
            this.profissionalParaExcluir = null;
            this.loading = false;
          },
        });
    }
  }

  cancelarExclusao(): void {
    this.profissionalParaExcluir = null;
  }
  //----
}

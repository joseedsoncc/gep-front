import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProfissionalService } from '../../services/profissional.service';
import {
  Profissional,
  CategoriaProfissional,
  CategoriaLabel,
} from '../../models/profissional.model';

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

  constructor(private profissionalService: ProfissionalService) {}

  ngOnInit(): void {
    console.log('aqui');
    this.carregarProfissionais();
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
    this.filtrarProfissionais();
  }
}

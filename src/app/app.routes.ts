import { Routes } from '@angular/router';

import { CadastroProfissionalComponent } from './components/cadastro-profissional/cadastro-profissional.component';
import { ListaProfissionaisComponent } from './components/lista-profissionais/lista-profissionais.component';
import { EscalaSemanalComponent } from './components/escala-semanal/escala-semanal.component';

export const routes: Routes = [
  //{ path: '', redirectTo: '/escala', pathMatch: 'full' },
  { path: 'profissionais/cadastro', component: CadastroProfissionalComponent },
  { path: 'profissionais/lista', component: ListaProfissionaisComponent },
  { path: 'escala', component: EscalaSemanalComponent },
  //{ path: '**', redirectTo: '/escala' }
];

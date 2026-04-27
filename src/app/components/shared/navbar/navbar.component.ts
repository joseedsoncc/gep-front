import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
  menuItems = [
    { path: '/escala', label: 'Escala Semanal', icon: 'bi-calendar-week' },
    //{ path: '/profissionais/cadastro', label: 'Novo Profissional', icon: 'bi-person-plus' },
    {
      path: '/profissionais/lista',
      label: 'Profissional',
      icon: 'bi-people',
    },
  ];
}

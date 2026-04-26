export enum CategoriaProfissional {
  MEDICO = 'MEDICO',
  ENFERMEIRO = 'ENFERMEIRO',
  TECNICO = 'TECNICO',
}

export interface Profissional {
  id?: number;
  nome: string;
  registro: string;
  categoria: CategoriaProfissional;
  cargaHorariaSemanal: number;
}

export const CategoriaLabel: Record<CategoriaProfissional, string> = {
  [CategoriaProfissional.MEDICO]: 'Médico(a)',
  [CategoriaProfissional.ENFERMEIRO]: 'Enfermeiro(a)',
  [CategoriaProfissional.TECNICO]: 'Técnico(a)',
};

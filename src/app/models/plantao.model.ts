export enum Turno {
  MANHA = 'MANHA',
  TARDE = 'TARDE',
  NOITE = 'NOITE',
}

export interface Plantao {
  id?: number;
  profissionalId: number;
  profissionalNome?: string;
  data: Date | string;
  turno: Turno;
}

export interface PlantaoInfo {
  id: number;
  turno: string;
  turnoLabel: string;
}

export interface EscalaSemanal {
  /*inicioSemana: Date;
  fimSemana: Date;
  escala: { [key: number]: { [key: string]: string } };
  limiteAtingido: { [key: number]: boolean };
*/
  inicioSemana: Date;
  fimSemana: Date;
  escala: { [key: number]: { [key: string]: PlantaoInfo[] } };
  limiteAtingido: { [key: number]: boolean };
}

export const TurnoHorario: Record<
  Turno,
  { label: string; horario: string; horas: number }
> = {
  [Turno.MANHA]: { label: 'MANHÃ', horario: '07:00-13:00', horas: 6 },
  [Turno.TARDE]: { label: 'TARDE', horario: '13:00-19:00', horas: 6 },
  [Turno.NOITE]: { label: 'NOITE', horario: '19:00-07:00', horas: 12 },
};

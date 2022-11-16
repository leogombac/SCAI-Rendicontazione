/* tslint:disable */
/* eslint-disable */
import { EnumTipoModalitaLavoro } from './enum-tipo-modalita-lavoro';
import { EnumTipoStraordinari } from './enum-tipo-straordinari';
export interface InserimentoPresenza {
  codiceCommessa?: null | string;
  data?: null | string;
  fine?: null | string;
  idAttivita?: number;
  idTipoTrasferta?: number;
  inizio?: null | string;
  inserimentoAutomatico?: boolean;
  minuti?: number;
  minutiBancaOre?: number;
  minutiStraordinario?: number;
  modalita?: EnumTipoModalitaLavoro;
  note?: null | string;
  progressivo?: number;
  reperibilita?: boolean;
  tipoStraordinari?: EnumTipoStraordinari;
  turni?: boolean;
}

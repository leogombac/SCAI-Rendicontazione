/* tslint:disable */
/* eslint-disable */
import { EnumTipoModalitaLavoro } from './enum-tipo-modalita-lavoro';
import { EnumTipoStraordinari } from './enum-tipo-straordinari';
export interface PresenzaInserimentoInput {
  codiceCommessa?: null | string;
  data?: string;
  dataPrecedente?: null | string;
  fine?: null | string;
  idAttivita?: number;
  idTipoTrasferta?: null | number;
  inizio?: null | string;
  inserimentoAutomatico?: boolean;
  minuti?: number;
  minutiBancaOre?: null | number;
  minutiStraordinario?: null | number;
  minutiStraordinarioNotturno?: null | number;
  modalita?: EnumTipoModalitaLavoro;
  note?: null | string;
  progressivo?: number;
  reperibilita?: boolean;
  tipoStraordinari?: EnumTipoStraordinari;
  turni?: boolean;
}

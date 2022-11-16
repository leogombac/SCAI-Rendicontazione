/* tslint:disable */
/* eslint-disable */
import { EnumTipoModalitaLavoro } from './enum-tipo-modalita-lavoro';
import { EnumTipoStraordinari } from './enum-tipo-straordinari';
export interface PresenzaInserimentoInput {
  codiceCommessa?: null | string;
  data?: null | string;
  fine?: null | string;
  idAttivita?: number;
  idTipoTrasferta?: null | number;
  inizio?: null | string;
  inserimentoAutomatico?: boolean;
  minuti?: number;
  minutiBancaOre?: null | number;
  minutiStraordinario?: null | number;
  modalita?: null | number;
  note?: null | string;
  progressivo?: number;
  reperibilita?: boolean;
  tipoStraordinari?: EnumTipoStraordinari;
  turni?: boolean;
  stato?:number;
}

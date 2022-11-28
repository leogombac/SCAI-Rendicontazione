export interface StatoUtente {
    idUtente: number;
    nome: string;
    cognome: string;
    aziendaPreferita: true;
    idTipoUtente: number;
    tipoUtente: string;
    idStato: 3;
    stato: string;
    sedeLavoro: string;
    oreMensili: string;
    oreConsuntivate: string;
}

export interface Orario {
    start: string;
    end: string;
}

export interface Item {
    progressivo: number;
    numeroMinuti: number;
    idTipoFatturazione: number;
    turni: boolean;
    reperibilita: boolean;
    note: string;
    orari: Orario[];
}

export interface Attivita {
    idAttivita: number;
    codiceAttivita: string;
    idCommessa: number;
    codiceCommessa: string;
    idSottoCommessa: number;
    codiceSottoCommessa: string;
    items: Item[];
}

export interface PresenzaResponse {
    dataPresenza: string;
    idTipoModalitaLavoro: number;
    tipoModalitaLavoro: string;
    attivita: Attivita[];
}

export interface Presenza {
    codiceAttivita: string;
    codiceCommessa: string;
    codiceSottoCommessa: string;
    dataPresenza: string;
    idAttivita: number;
    idCommessa: number;
    idSottoCommessa: number;
    idTipoModalitaLavoro: number;
    numeroMinuti: number;
    progressivo: number;
    reperibilita: boolean;
    turni: boolean;
}

export interface ChiusuraMeseResponse {
    id: number;
    dataAggiornamento: string;
    idStatoChiusura: number;
    statoChiusura: string;
    oreMensili: string;
    totaleOre: string;
    totaleOreOrdinarie: string;
    totaleOreReperibilita: string;
    totaleOreTurni: string;
    totaleOreAltro: string;
    totaleOreAssenza: string;
    differenza: string;
    straordinarioFeriale: string;
    straordinarioNotturno: string;
    straordinarioFestivo: string;
    oreRecuperi: string;
    modalitaCasa: string;
    modalitaUfficio: string;
    modalitaCliente: string;
    presenze: PresenzaResponse[];
}

export interface ChiusuraMese extends ChiusuraMeseResponse {
    presenzeGroupedByAttivita: { [key: number]: Presenza[] };
}

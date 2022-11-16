export interface DatiOperativiStorico {
    idTerzePartiStraordinari: number;
    idTerzePartiReperibilita: number;
    terzePartiReperibilitaInizio: String;
    terzePartiReperibilitaFine: String;
    terzePartiReperibilitaDescrizione: String;
    idTerzeParti: number;
    terzePartiReperibilitaNote: String;
    terzePartiReperibilitaValore: any;
}

export interface DatiOperativi {
    idUtente: number;
    nome: string;
    cognome: string;
    matricola: number;
    idTipoUtente: number;
    tipoUtente: string;
    idAziendaAssunzione: number;
    aziendaAssunzione: string;
    progetto: any;
    sede: any;
    referenteAziendale: {
        idReferente: number;
        nome: string;
        cognome: string;
    };
    referentePiano: number;
    oreLavorative: {
        ore: number;
        lunedi: number;
        martedi: number;
        mercoledi: number;
        giovedi: number;
        venerdi: number
    };
    storico: DatiOperativiStorico[];
    terzaParte: any;
    visibile: boolean;
    turni: boolean;
    compilazioneConsuntivi: boolean;
    straordinario: boolean;
    abilitatoTrasferteVociSpesa: boolean;
    distacco: boolean;
    idAziendaDistacco: any;
}

export interface Azienda {
    idAziendaGruppoPreferita: number,
    idAzienda: number,
    acronimo: string,
    descrizione: string
}
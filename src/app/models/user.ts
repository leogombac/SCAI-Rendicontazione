export interface DatoOperativoStorico {
    idTerzePartiStraordinari: number;
    idTerzePartiReperibilita: number;
    terzePartiReperibilitaInizio: String;
    terzePartiReperibilitaFine: String;
    terzePartiReperibilitaDescrizione: String;
    idTerzeParti: number;
    terzePartiReperibilitaNote: String;
    terzePartiReperibilitaValore: any;
}

export interface UtenteAzienda {
    nome: string;
    cognome: string;
    idUtente: number
}

export interface Profilo {
    idProfilo: number;
    descrizione: string;
}

export interface DatoOperativo {
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
    profili: Profilo[];
    storico: DatoOperativoStorico[];
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

export class User {

    // From DatoOperativo
    idUtente: number;
    nome: string;
    cognome: string;
    turni: boolean;

    // Application level
    idReferente: number;
    isReferente: boolean;

    constructor(datoOperativo: DatoOperativo) {
        
        this.idUtente = datoOperativo.idUtente;
        this.nome = datoOperativo.nome;
        this.cognome = datoOperativo.cognome;
        this.turni = datoOperativo.turni;

        // If user is referente, then he/she can change idUtente at will
        this.idReferente = this.idUtente;
        this.isReferente = datoOperativo.profili && datoOperativo.profili.length > 1;
    }
}
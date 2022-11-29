import { CalendarEvent } from "angular-calendar";
import { colors } from "../calendar/utils/colors";

export interface SaveConsuntivoBody {
    dataPrecedente?: string;
    codiceAttivita: string;
    codiceCommessa: string;
    data: string;
    fine: string;
    idAttivita: number;
    idCommessa: number;
    idTipoTrasferta?: number;
    inizio: string;
    inserimentoAutomatico: boolean;
    minuti: number;
    modalita: number;
    note?: string;
    progressivo: number;
    reperibilita: boolean;
    turni: boolean;
  }

export interface Commessa {
    codiceAttivita: string;
    codiceCommessa: string;
    descrizioneAttivita: string;
    descrizioneCommessa: string;
    idAzienda: number;
    idAttivita: number;
    idCommessa: number;
}

export interface ModalitaLavoro {
    id: number;
    descrizione: string;
    inserimentoAutomatico: number;
}

export interface Straordinario {
    progressivo: number;
    numeroMinuti: number;
    idTipoStraordinari: number;
    tipoStraordinariDescrizione: string;
}

export interface Trasferta {
    idTrasferta: number;
    dataInizio: string;
    dataFine: string;
    idTipoTrasferta: number;
    tipoTrasferta: string;
}

export interface Presenza {
    inizioMese: string;
    fineMese: string;
    statoChiusura: number;
    dataPresenza: string;
    progressivo: number;
    idAttivita: number;
    codiceAttivita: string;
    idCommessa: number;
    codiceCommessa: string;
    numeroMinuti: number;
    reperibilita: boolean;
    turni: boolean;
    note: string;
    start: string;
    end: string;
    modalitaLavoro: ModalitaLavoro;
    straordinari: Straordinario[];
    trasferta: Trasferta;
}

export interface ConsuntivoEventConfig {
    id?: string | number;
    start?: Date;
    end?: Date;
    presenza?: Presenza;
}

export class ConsuntivoEvent implements CalendarEvent {

    // CalendarEvent
    draggable = true;
    id;
    meta = { tmpEvent: false };
    resizable = { beforeStart: true, afterEnd: true };
    title;
    
    end;
    start;

    // Fields extracted from Presenza
    codiceAttivita;
    codiceCommessa;
    dataPresenza;
    idAttivita;
    idCommessa;
    idModalitaLavoro;
    idTipoTrasferta;
    note;
    numeroMinuti;
    progressivo;
    reperibilita;
    statoChiusura;
    turni;

    // Applicative level fields
    isLocal;
    originalStart; // Needed to delete

    constructor(config: ConsuntivoEventConfig) {
        if (config.presenza)
            this.fromServer(config.presenza);
        else if (config.id && config.start)
            this.fromCalendar(config.id, config.start, config.end);
        else
            throw new Error("Cannot create ConsuntivoEvent: missing data."); 
    }

    private fromServer(presenza: Presenza) {

        this.id = presenza.progressivo;
        this.isLocal = false;

        this.codiceAttivita = presenza.codiceAttivita;
        this.codiceCommessa = presenza.codiceCommessa;
        this.idAttivita = presenza.idAttivita;
        this.idCommessa = presenza.idCommessa;
        this.idModalitaLavoro = presenza.modalitaLavoro?.id;
        this.idTipoTrasferta = presenza.trasferta?.idTipoTrasferta;
        this.note = presenza.note;
        this.progressivo = presenza.progressivo;
        this.statoChiusura = presenza.statoChiusura;

        // Set draggable and resizable according to statoChiusura
        if (this.statoChiusura === 2 || this.statoChiusura === 3) {
            this.draggable = false;
            this.resizable = { beforeStart: false, afterEnd: false };
        }

        // Adjust start and end date to provide retro-compatibility
        if (presenza.start && presenza.end) {
            this.start = new Date(presenza.start);
            this.originalStart = this.start;
            this.end = new Date(presenza.end);
        }
        else {
            this.start = new Date(presenza.dataPresenza);
            this.originalStart = this.start;
            const endMs = new Date(presenza.dataPresenza).getTime() + presenza.numeroMinuti * 60 * 1000;
            this.end = new Date(endMs);
        }

        this.setTitle();
    }

    private fromCalendar(id, start: Date, end: Date) {

        this.id = id;
        this.isLocal = true;

        this.start = start;
        this.end = end;

        this.meta.tmpEvent = true;
        
        this.setTitle();
    }

    get color() {
        if (this.meta.tmpEvent)
            return colors.yellow;
        if (this.statoChiusura === 2)
            return colors.grey;
        if (this.statoChiusura === 3)
            return colors.grey;
        return colors.blue;
    }

    get durataOre() {
        if (!this.end) return 0;
        return (this.end.getTime() - this.start.getTime()) / 1000 / 60 / 60;
    }

    get giorno() {
        if (!this.end)
            return this.start.toLocaleString(window.navigator.language, { weekday: 'long' });
        
        const inizioGiorno = this.start.getDay();
        const fineGiorno = this.end.getDay();
        if (inizioGiorno === fineGiorno)
            return this.start.toLocaleString(window.navigator.language, { weekday: 'long' })
                + ' '
                + this.start.getDate();
        
        else
            return this.start.toLocaleString(window.navigator.language, { weekday: 'short' })
                + ' '
                + this.start.getDate()
                + ' - '
                + this.end.toLocaleString(window.navigator.language, { weekday: 'short' })
                + ' '
                + this.end.getDate();
    }

    setTitle() {
        let html = '';
        if (this.meta.tmpEvent)
            html += 'Consuntivo Temporaneo<br>';
        else
            html += 'Consuntivo Salvato<br>';
        if (this.codiceCommessa)
            html += '<span class="badge badge-primary mr-1">' + this.codiceCommessa + '</span>';
        if (this.statoChiusura)
            html += '<span class="badge badge-primary mr-1">'
                 + ['', 'Aperto', 'Chiuso', 'Vistato'][this.statoChiusura]
                 + '</span>';
        html += '<span class="badge badge-primary">' + this.durataOre + ' ore</span>';
        this.title = html;
    }
}
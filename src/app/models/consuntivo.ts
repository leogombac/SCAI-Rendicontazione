import { CalendarEvent } from "angular-calendar";
import { colors } from "../calendar/utils/colors";

export interface SaveConsuntivoBody {
    codiceAttivita: string;
    codiceCommessa: string;
    data: string;
    dataPrecedente: string;
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
    idAzienda: number;
    idCommessa: number;
    codiceCommessa: string;
    idAttivita: number;
    descrizioneAttivita: string;
}

export interface ModalitaLavoro {
    id: number;
    descrizione: string;
    inserimentoAutomatico: number;
}

export interface Presenza {
    codiceAttivita: string;
    codiceCommessa: string;
    dataPresenza: string;
    end: string;
    idAttivita: number;
    idCommessa: number;
    modalitaLavoro: ModalitaLavoro;
    note: string;
    numeroMinuti: number;
    progressivo: number;
    start: string;
    statoChiusura: number;
}

export interface ConsuntivoEventConfig {
    id?: string | number;
    start?: Date;
    end?: Date;
    presenza?: Presenza;
}

export class ConsuntivoEvent implements CalendarEvent, Presenza {

    // CalendarEvent
    draggable = true;
    id;
    meta = { tmpEvent: false };
    resizable = { beforeStart: true, afterEnd: true };
    title;
    
    end;
    start;

    // Presenza
    codiceAttivita;
    codiceCommessa;
    dataPresenza;
    idAttivita;
    idCommessa;
    modalitaLavoro;
    note;
    numeroMinuti;
    presenzaOrario;
    progressivo;
    statoChiusura = 1;

    // Applicative level fields
    isLocal;

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
        this.modalitaLavoro = presenza.modalitaLavoro;
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
            this.end = new Date(presenza.end);
        }
        else {
            this.start = new Date(presenza.dataPresenza);
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
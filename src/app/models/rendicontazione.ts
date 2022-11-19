import { CalendarEvent } from "angular-calendar";
import { colors } from "../calendar/utils/colors";

export interface Commessa {
    codiceCommessa: string;
    idAttivita: number;
    idAzienda: number;
    idCommessa: number;
}

export interface ModalitaLavoro {
    id: number;
    descrizione: string;
    inserimentoAutomatico: number;
}

export interface PresenzaOrario {
    progressivo: number;
    inizio: string;
    fine: string;
}

export interface Presenza {
    progressivo: number;
    idCommessa: number;
    idAttivita: number;
    codiceCommessa: string;
    numeroMinuti: number;
    note: string;
    modalitaLavoro: ModalitaLavoro;
    presenzeOrario: PresenzaOrario[];
}

export interface ConsuntivoEventConfig {
    id?: string | number;
    start?: Date,
    end?: Date;
    dataPresenza?: Date,
    presenza?: Presenza
}

export class ConsuntivoEvent implements CalendarEvent, Presenza {

    // CalendarEvent
    id;
    title;
    start;
    end;
    resizable = { beforeStart: true, afterEnd: true };
    meta = { tmpEvent: false };

    // Presenza
    progressivo;
    idCommessa;
    idAttivita;
    codiceCommessa;
    numeroMinuti;
    note;
    modalitaLavoro;
    presenzeOrario;

    // Applicative level fields
    isLocal;

    constructor(config: ConsuntivoEventConfig) {
        if (config.dataPresenza && config.presenza)
            this.fromServer(config.dataPresenza, config.presenza);
        else if (config.id && config.start)
            this.fromCalendar(config.id, config.start);
        else
            throw new Error("Cannot create ConsuntivoEvent: missing data."); 
    }

    private fromServer(dataPresenza, presenza: Presenza) {
        this.isLocal = false;
        this.progressivo = this.id;
        this.idCommessa = presenza.idCommessa;
        this.idAttivita = presenza.idAttivita;
        this.codiceCommessa = presenza.codiceCommessa;
        this.note = presenza.note;
        this.modalitaLavoro = presenza.modalitaLavoro;
        this.presenzeOrario = presenza.presenzeOrario;

        // Adjust start and end date to provide retro-compatibility
        if (this.presenzeOrario.length) {
            this.start = new Date(this.presenzeOrario[0].inizio);
            this.end = new Date(this.presenzeOrario[0].fine);
        }
        else {
            this.start = new Date(dataPresenza);
            this.end = new Date(new Date(dataPresenza).getTime() + presenza.numeroMinuti * 60 * 1000);
        }
        this.setTitle();
    }

    private fromCalendar(id, start: Date) {
        this.isLocal = true;
        this.id = id;
        this.start = start;
        this.meta.tmpEvent = true;
        this.setTitle();
    }

    get color() {
        if (this.meta.tmpEvent)
            return colors.yellow;
        else
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
            html += 'Consuntivo Locale<br>';
        else
            html += 'Consuntivo Remoto<br>'
        if (this.codiceCommessa)
            html += '<span class="badge badge-primary mr-1">' + this.codiceCommessa + '</span>'
        html += '<span class="badge badge-primary">' + this.durataOre + ' ore</span>'
        this.title = html;
    }
}
import { CalendarEvent } from "angular-calendar";
import { colors } from "../calendar/utils/colors";

export interface PresenzaOrario {
    progressivo: number;
    inizio: string;
    fine: string;
}

export interface Presenza {
    idCommessa: number;
    codiceCommessa: string;
    numeroMinuti: number;
    presenzeOrario: PresenzaOrario[];
}

export interface ConsuntivoEventConfig {
    start?: Date,
    end?: Date;
    dataPresenza?: Date,
    presenza?: Presenza
}

export class ConsuntivoEvent implements CalendarEvent, Presenza {

    // From CalendarEvent (title via set/get)
    title;
    start;
    end;
    resizable = { beforeStart: true, afterEnd: true };
    meta = { tmpEvent: false };

    // From Presenza
    idCommessa;
    codiceCommessa;
    numeroMinuti;
    presenzeOrario;

    constructor(config: ConsuntivoEventConfig) {
        if (config.dataPresenza && config.presenza)
            this.fromServer(config.dataPresenza, config.presenza);
        else if (config.start)
            this.fromCalendar(config.start);
        else
            throw new Error("Cannot create ConsuntivoEvent: missing data."); 
    }

    private fromServer(dataPresenza, presenza) {
        this.idCommessa = presenza.idCommessa;
        this.codiceCommessa = presenza.codiceCommessa;
        this.presenzeOrario = presenza.presenzeOrario

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

    private fromCalendar(start: Date) {
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
        const inizioGiorno = this.start.getDay();
        const fineGiorno = this.end.getDay();
        if (inizioGiorno === fineGiorno) {
            return this.start.toLocaleString(window.navigator.language, { weekday: 'long' })
                + ' '
                + this.start.getDate();
        }
        else {
            return this.start.toLocaleString(window.navigator.language, { weekday: 'short' })
                + ' '
                + this.start.getDate()
                + ' - '
                + this.end.toLocaleString(window.navigator.language, { weekday: 'short' })
                + ' '
                + this.end.getDate();
        }
    }

    setTitle() {
        let html = '';
        if (this.meta.tmpEvent)
            html += 'Consuntivo Locale<br>';
        else
            html += 'Consuntivo Remoto<br>'
        if (this.codiceCommessa)
            html += '<span class="badge badge-primary">' + this.codiceCommessa + '</span>'
        html += '<span class="badge badge-primary">' + this.durataOre + ' ore</span>'
        this.title = html;
    }
}
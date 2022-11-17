import { CalendarEvent } from "angular-calendar";
import { colors } from "../calendar/utils/colors";

export interface PresenzaOrario {
    progressivo: number;
    inizio: string;
    fine: string;
}

export interface Presenza {
    idCommessa: 266;
    codiceCommessa: "Ferie";
    presenzeOrario: PresenzaOrario[];
}

export class ConsuntivoEvent implements CalendarEvent {

    title;
    start: Date;
    end: Date;
    color;
    draggable;
    resizable;
    meta = { tmpEvent: false };

    constructor(presenza: Presenza) {
        this.title = presenza.codiceCommessa;
        this.start = new Date(presenza.presenzeOrario[0].inizio);
        this.end = new Date(presenza.presenzeOrario[0].fine);
        this.color = colors.blue;
        this.draggable = true;
        this.resizable = {
            beforeStart: true,
            afterEnd: true,
        };
    }

    getDurata() {
        return (this.end.getTime() - this.start.getTime()) / 1000 / 60 / 60;
    }

    getGiorno() {
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
}
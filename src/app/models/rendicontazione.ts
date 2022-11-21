import { CalendarEvent } from "angular-calendar";
import { colors } from "../calendar/utils/colors";

export interface SaveConsuntivoBody {
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
    codiceAttivita: string;
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
    draggable = true;
    meta = { tmpEvent: false };

    // Presenza
    progressivo;
    idCommessa;
    idAttivita;
    codiceCommessa;
    codiceAttivita;
    numeroMinuti;
    note;
    modalitaLavoro;
    presenzeOrario;

    // Applicative level fields
    isLocal;
    originalStart;

    constructor(config: ConsuntivoEventConfig) {
        if (config.dataPresenza && config.presenza)
            this.fromServer(config.dataPresenza, config.presenza);
        else if (config.id && config.start)
            this.fromCalendar(config.id, config.start, config.end);
        else
            throw new Error("Cannot create ConsuntivoEvent: missing data."); 
    }

    private fromServer(dataPresenza, presenza: Presenza) {

        this.id = presenza.progressivo;
        this.isLocal = false;

        this.progressivo = presenza.progressivo;
        this.idCommessa = presenza.idCommessa;
        this.idAttivita = presenza.idAttivita;
        this.codiceCommessa = presenza.codiceCommessa;
        this.codiceAttivita = presenza.codiceAttivita;
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

        // This is required to change date during save operation
        this.originalStart = this.start;

        this.setTitle();
    }

    private fromCalendar(id, start: Date, end: Date) {

        this.isLocal = true;
        this.id = id;
        this.start = start;
        this.end = end;
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
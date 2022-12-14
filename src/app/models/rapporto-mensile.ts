import { Injectable } from '@angular/core';
import { data } from 'jquery';
import { read, utils, writeFile } from 'xlsx-js-style';


export class RapportoMensile {
    title;
    periodo;
    headerRows;
    tableHeadersRow;
    tableRows;
    rows;
    constructor(utente, azienda, data) {
        //data = this.data;
        const title = 'Rapporto mensile';
        let start = new Date(data.inizio);
        let periodo = start.getFullYear() + '/' + (start.getMonth() + 1);

        this.headerRows = this.generateHeaderRows(title, utente, periodo, azienda);

        this.tableHeadersRow = this.generateTableHeadersRow(start);

        this.tableRows = this.generateTableRows(start);

        //fill rows************************************
        //this.setOrdinari(data, this.tableRows);

        //end fill rows************************************
        this.rows = this.headerRows;
        this.rows.push(this.tableHeadersRow);
        this.rows = [...this.rows, ...this.tableRows];
    }

    generate() {
        const worksheet = utils.json_to_sheet([]);
        utils.sheet_add_aoa(worksheet, this.rows);

        const workbook = utils.book_new();
        utils.book_append_sheet(workbook, worksheet, 'Dates');

        writeFile(workbook, 'RapportoPresenze.xlsx', { compression: true });
    }

    private setOrdinari(data: any, tableRows: { v: string; t: string; s: { font: { bold: boolean; color: { rgb: string; }; }; }; }[][]) {
        let sum = 0;
        data.giorni.forEach((giorno, index) => {
            let day = new Date(giorno.dataPresenza).getDate() + 1;
            if (day) {
                if (giorno.straordinari?.length === 0) {
                    tableRows[0][day].v =
                        tableRows[0][day].v === ''
                            ? (tableRows[0][day].v = '0')
                            : tableRows[0][day].v;
                    tableRows[0][day].v =
                        parseFloat(tableRows[0][day].v) + (giorno.numeroMinuti / 60) + '';
                    sum += (giorno.numeroMinuti / 60);
                }
            }
        });

        tableRows[0][tableRows[0].length - 1].v = sum + "";
    }

    private generateTableRows(start: Date) {
        if (!this.data.presenzeGroupedByAttivita) {
            return null;
        }
        let tableRows = [];
        Object.keys(this.data.presenzeGroupedByAttivita).forEach(key => {
            const attivita = this.data.presenzeGroupedByAttivita[key];
            let row = [
                {
                    v: attivita[0].codiceCommessa,
                    t: 's',
                    s: { font: { bold: false, color: { rgb: '000000' } } },
                },
                {
                    v: attivita[0].codiceCommessa,
                    t: 's',
                    s: { font: { bold: false, color: { rgb: '000000' } } },
                },
                {
                    v: attivita[0].codiceSottoCommessa,
                    t: 's',
                    s: { font: { bold: false, color: { rgb: '000000' } } },
                },
                {
                    v: attivita[0].codiceAttivita,
                    t: 's',
                    s: { font: { bold: false, color: { rgb: '000000' } } },
                },
            ];

            /* fill row */
            for (
                let i = 1;
                i <= this.getDaysInMonth(start.getFullYear(), start.getMonth() + 1);
                i++
            ) {
                row.push({
                    v: attivita.filter(x => {
                        return parseInt(x.dataPresenza?.split('-')[2]) === i
                    })?.reduce((acc, x) => {
                        return acc + (x.numeroMinuti / 60)
                    }, 0) + "",
                    t: 's',
                    s: { font: { bold: false, color: { rgb: '000000' } } },
                });
            }
            //push two more cells after days
            row.push({
                v: '',
                t: 's',
                s: { font: { bold: false, color: { rgb: '000000' } } },
            }, {
                v: row.slice(4, row.length - 1).reduce((acc, x) => { return acc + parseFloat(x.v) }, 0) + "",
                t: 's',
                s: { font: { bold: false, color: { rgb: '000000' } } },
            });
            tableRows.push(row);
        });


        for (const row of tableRows) {
            for (
                let i = 1;
                i <= this.getDaysInMonth(start.getFullYear(), start.getMonth() + 1);
                i++
            ) {
                row.push({
                    v: '',
                    t: 's',
                    s: { font: { bold: false, color: { rgb: '000000' } } },
                });
            }
            //push two more cells after days
            row.push({
                v: '',
                t: 's',
                s: { font: { bold: false, color: { rgb: '000000' } } },
            }, {
                v: '',
                t: 's',
                s: { font: { bold: false, color: { rgb: '000000' } } },
            });
        }
        return tableRows;
    }

    private generateTableHeadersRow(start: Date) {
        let tableHeadersRow = [
            {
                v: 'Cliente',
                t: 's',
                s: { font: { bold: true, color: { rgb: '000000' } } },
            },
            {
                v: 'Commessa',
                t: 's',
                s: { font: { bold: true, color: { rgb: '000000' } } },
            },
            {
                v: 'Sottocommessa',
                t: 's',
                s: { font: { bold: true, color: { rgb: '000000' } } },
            },
            {
                v: 'Attività',
                t: 's',
                s: { font: { bold: true, color: { rgb: '000000' } } },
            },
        ];

        for (
            let i = 1;
            i <= this.getDaysInMonth(start.getFullYear(), start.getMonth() + 1);
            i++
        ) {
            tableHeadersRow.push({
                v: i + '',
                t: 's',
                s: { font: { bold: true, color: { rgb: '000000' } } },
            });
        }
        tableHeadersRow.push({
            v: '',
            t: 's',
            s: { font: { bold: true, color: { rgb: '000000' } } },
        });

        tableHeadersRow.push({
            v: 'TOTALE',
            t: 's',
            s: { font: { bold: true, color: { rgb: '000000' } } },
        });
        return tableHeadersRow;
    }

    private generateHeaderRows(
        title: string,
        utente: any,
        periodo: string,
        azienda: any
    ) {
        return [
            [
                {
                    v: title,
                    t: 's',
                    s: { font: { bold: true, color: { rgb: '000000' } } },
                },
            ],
            [
                {
                    v: 'Utente',
                    t: 's',
                    s: { font: { bold: true, color: { rgb: '000000' } } },
                },
                {
                    v: 'Periodo',
                    t: 's',
                    s: { font: { bold: true, color: { rgb: '000000' } } },
                },
                {
                    v: 'Stato',
                    t: 's',
                    s: { font: { bold: true, color: { rgb: '000000' } } },
                },
                {
                    v: 'Azienda',
                    t: 's',
                    s: { font: { bold: true, color: { rgb: '000000' } } },
                },
            ],
            [
                {
                    v: utente,
                    t: 's',
                    s: { font: { bold: false, color: { rgb: '000000' } } },
                },
                {
                    v: periodo,
                    t: 's',
                    s: { font: { bold: false, color: { rgb: '000000' } } },
                },
                {
                    v: 'Stato',
                    t: 's',
                    s: { font: { bold: false, color: { rgb: '000000' } } },
                },
                {
                    v: azienda,
                    t: 's',
                    s: { font: { bold: false, color: { rgb: '000000' } } },
                },
            ],
            [],
        ];
    }

    getDaysInMonth(year, month) {
        return new Date(year, month, 0).getDate();
    }

    data = {
        id: 2,
        dataAggiornamento: "2022-12-05T16:07:03",
        idStatoChiusura: 2,
        statoChiusura: "Chiuso",
        oreMensili: "168:00",
        totaleOre: "168:00",
        totaleOreOrdinarie: "168:00",
        totaleOreReperibilita: "00:00",
        totaleOreTurni: "00:00",
        totaleOreAltro: "00:00",
        totaleOreAssenza: "00:00",
        differenza: "",
        straordinarioFeriale: "00:00",
        straordinarioNotturno: "00:00",
        straordinarioFestivo: "00:00",
        oreRecuperi: "00:00",
        modalitaCasa: "00:00",
        modalitaUfficio: "00:00",
        modalitaCliente: "00:00",
        presenze: [
            {
                dataPresenza: "2022-11-02",
                idTipoModalitaLavoro: null,
                tipoModalitaLavoro: null,
                attivita: [
                    {
                        idAttivita: 12265,
                        codiceAttivita: "22_15-ITE-XXX",
                        descrizioneAttivita: "22_15-ITE-XXX",
                        idCommessa: 7644,
                        codiceCommessa: "22_15-ITE-XXX",
                        descrizioneCommessa: "Area Tecnica",
                        idSottoCommessa: 29101,
                        codiceSottoCommessa: "22_15-ITE-XXX",
                        descrizioneSottoCommessa: "Area Tecnica",
                        items: [
                            {
                                progressivo: 1,
                                numeroMinuti: 420,
                                idTipoFatturazione: 3,
                                turni: false,
                                reperibilita: false,
                                note: null,
                                orari: [
                                    {
                                        start: "2022-11-02T01:00:00",
                                        end: "2022-11-02T08:00:00"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        idAttivita: 41434,
                        codiceAttivita: "2842_BET22-000162",
                        descrizioneAttivita: "2842_BET22-000162",
                        idCommessa: 46152,
                        codiceCommessa: "2842_BET22-000162",
                        descrizioneCommessa: "Prj Data Management (DWH) Pillar 1",
                        idSottoCommessa: 46151,
                        codiceSottoCommessa: "2842_BET22-000162",
                        descrizioneSottoCommessa: "Prj Data Management (DWH) Pillar 1",
                        items: [
                            {
                                progressivo: 1,
                                numeroMinuti: 180,
                                idTipoFatturazione: 39,
                                turni: false,
                                reperibilita: false,
                                note: null,
                                orari: [
                                    {
                                        start: "2022-11-02T08:00:00",
                                        end: "2022-11-02T11:00:00"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        idAttivita: 42131,
                        codiceAttivita: "2865_SCA22-XXXXXX",
                        descrizioneAttivita: "2865_SCA22-XXXXXX",
                        idCommessa: 47208,
                        codiceCommessa: "2865_SCA22-XXXXXX",
                        descrizioneCommessa: "Modulo Rendicontazione",
                        idSottoCommessa: 47207,
                        codiceSottoCommessa: "2865_SCA22-XXXXXX",
                        descrizioneSottoCommessa: "Modulo Rendicontazione",
                        items: [
                            {
                                progressivo: 1,
                                numeroMinuti: 180,
                                idTipoFatturazione: 39,
                                turni: false,
                                reperibilita: false,
                                note: null,
                                orari: [
                                    {
                                        start: "2022-11-02T12:00:00",
                                        end: "2022-11-02T15:00:00"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        idAttivita: 4462,
                        codiceAttivita: "29_15-ITE-XXX",
                        descrizioneAttivita: "29_15-ITE-XXX",
                        idCommessa: 2154,
                        codiceCommessa: "29_15-ITE-XXX",
                        descrizioneCommessa: "Area Tecnica_Formazione e addestramento\r\n",
                        idSottoCommessa: 27122,
                        codiceSottoCommessa: "29_15-ITE-XXX",
                        descrizioneSottoCommessa: "Area Tecnica_Formazione e addestramento\r\n",
                        items: [
                            {
                                progressivo: 1,
                                numeroMinuti: 120,
                                idTipoFatturazione: 3,
                                turni: false,
                                reperibilita: false,
                                note: null,
                                orari: [
                                    {
                                        start: "2022-11-02T15:00:00",
                                        end: "2022-11-02T17:00:00"
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                dataPresenza: "2022-11-03",
                idTipoModalitaLavoro: null,
                tipoModalitaLavoro: null,
                attivita: [
                    {
                        idAttivita: 38133,
                        codiceAttivita: "2661_ETT21-XXXXXX",
                        descrizioneAttivita: "2661_ETT21-XXXXXX",
                        idCommessa: 42085,
                        codiceCommessa: "2661_ETT21-XXXXXX",
                        descrizioneCommessa: "VDT",
                        idSottoCommessa: 42084,
                        codiceSottoCommessa: "2661_ETT21-XXXXXX",
                        descrizioneSottoCommessa: "VDT",
                        items: [
                            {
                                progressivo: 1,
                                numeroMinuti: 420,
                                idTipoFatturazione: 39,
                                turni: false,
                                reperibilita: false,
                                note: null,
                                orari: [
                                    {
                                        start: "2022-11-03T01:00:00",
                                        end: "2022-11-03T08:00:00"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        idAttivita: 4460,
                        codiceAttivita: "27_15-ITE-XXX",
                        descrizioneAttivita: "27_15-ITE-XXX",
                        idCommessa: 2152,
                        codiceCommessa: "27_15-ITE-XXX",
                        descrizioneCommessa: "Area Tecnica - Ricerca e sperimentazione\r\n",
                        idSottoCommessa: 27120,
                        codiceSottoCommessa: "27_15-ITE-XXX",
                        descrizioneSottoCommessa: "Area Tecnica - Ricerca e sperimentazione\r\n",
                        items: [
                            {
                                progressivo: 1,
                                numeroMinuti: 210,
                                idTipoFatturazione: 3,
                                turni: false,
                                reperibilita: false,
                                note: null,
                                orari: [
                                    {
                                        start: "2022-11-03T12:30:00",
                                        end: "2022-11-03T16:00:00"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        idAttivita: 41434,
                        codiceAttivita: "2842_BET22-000162",
                        descrizioneAttivita: "2842_BET22-000162",
                        idCommessa: 46152,
                        codiceCommessa: "2842_BET22-000162",
                        descrizioneCommessa: "Prj Data Management (DWH) Pillar 1",
                        idSottoCommessa: 46151,
                        codiceSottoCommessa: "2842_BET22-000162",
                        descrizioneSottoCommessa: "Prj Data Management (DWH) Pillar 1",
                        items: [
                            {
                                progressivo: 1,
                                numeroMinuti: 90,
                                idTipoFatturazione: 39,
                                turni: false,
                                reperibilita: false,
                                note: null,
                                orari: [
                                    {
                                        start: "2022-11-03T08:00:00",
                                        end: "2022-11-03T09:30:00"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        idAttivita: 42131,
                        codiceAttivita: "2865_SCA22-XXXXXX",
                        descrizioneAttivita: "2865_SCA22-XXXXXX",
                        idCommessa: 47208,
                        codiceCommessa: "2865_SCA22-XXXXXX",
                        descrizioneCommessa: "Modulo Rendicontazione",
                        idSottoCommessa: 47207,
                        codiceSottoCommessa: "2865_SCA22-XXXXXX",
                        descrizioneSottoCommessa: "Modulo Rendicontazione",
                        items: [
                            {
                                progressivo: 1,
                                numeroMinuti: 120,
                                idTipoFatturazione: 39,
                                turni: false,
                                reperibilita: false,
                                note: null,
                                orari: [
                                    {
                                        start: "2022-11-03T09:30:00",
                                        end: "2022-11-03T11:30:00"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        idAttivita: 42131,
                        codiceAttivita: "2865_SCA22-XXXXXX",
                        descrizioneAttivita: "2865_SCA22-XXXXXX",
                        idCommessa: 47208,
                        codiceCommessa: "2865_SCA22-XXXXXX",
                        descrizioneCommessa: "Modulo Rendicontazione",
                        idSottoCommessa: 47207,
                        codiceSottoCommessa: "2865_SCA22-XXXXXX",
                        descrizioneSottoCommessa: "Modulo Rendicontazione",
                        items: [
                            {
                                progressivo: 2,
                                numeroMinuti: 60,
                                idTipoFatturazione: 39,
                                turni: false,
                                reperibilita: false,
                                note: null,
                                orari: [
                                    {
                                        start: "2022-11-03T16:00:00",
                                        end: "2022-11-03T17:00:00"
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                dataPresenza: "2022-11-04",
                idTipoModalitaLavoro: null,
                tipoModalitaLavoro: null,
                attivita: [
                    {
                        idAttivita: 38133,
                        codiceAttivita: "2661_ETT21-XXXXXX",
                        descrizioneAttivita: "2661_ETT21-XXXXXX",
                        idCommessa: 42085,
                        codiceCommessa: "2661_ETT21-XXXXXX",
                        descrizioneCommessa: "VDT",
                        idSottoCommessa: 42084,
                        codiceSottoCommessa: "2661_ETT21-XXXXXX",
                        descrizioneSottoCommessa: "VDT",
                        items: [
                            {
                                progressivo: 1,
                                numeroMinuti: 480,
                                idTipoFatturazione: 39,
                                turni: false,
                                reperibilita: false,
                                note: null,
                                orari: [
                                    {
                                        start: "2022-11-04T00:00:00",
                                        end: "2022-11-04T08:00:00"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        idAttivita: 4460,
                        codiceAttivita: "27_15-ITE-XXX",
                        descrizioneAttivita: "27_15-ITE-XXX",
                        idCommessa: 2152,
                        codiceCommessa: "27_15-ITE-XXX",
                        descrizioneCommessa: "Area Tecnica - Ricerca e sperimentazione\r\n",
                        idSottoCommessa: 27120,
                        codiceSottoCommessa: "27_15-ITE-XXX",
                        descrizioneSottoCommessa: "Area Tecnica - Ricerca e sperimentazione\r\n",
                        items: [
                            {
                                progressivo: 1,
                                numeroMinuti: 180,
                                idTipoFatturazione: 3,
                                turni: false,
                                reperibilita: false,
                                note: null,
                                orari: [
                                    {
                                        start: "2022-11-04T13:00:00",
                                        end: "2022-11-04T16:00:00"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        idAttivita: 42131,
                        codiceAttivita: "2865_SCA22-XXXXXX",
                        descrizioneAttivita: "2865_SCA22-XXXXXX",
                        idCommessa: 47208,
                        codiceCommessa: "2865_SCA22-XXXXXX",
                        descrizioneCommessa: "Modulo Rendicontazione",
                        idSottoCommessa: 47207,
                        codiceSottoCommessa: "2865_SCA22-XXXXXX",
                        descrizioneSottoCommessa: "Modulo Rendicontazione",
                        items: [
                            {
                                progressivo: 1,
                                numeroMinuti: 240,
                                idTipoFatturazione: 39,
                                turni: false,
                                reperibilita: false,
                                note: null,
                                orari: [
                                    {
                                        start: "2022-11-04T08:00:00",
                                        end: "2022-11-04T12:00:00"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        idAttivita: 4462,
                        codiceAttivita: "29_15-ITE-XXX",
                        descrizioneAttivita: "29_15-ITE-XXX",
                        idCommessa: 2154,
                        codiceCommessa: "29_15-ITE-XXX",
                        descrizioneCommessa: "Area Tecnica_Formazione e addestramento\r\n",
                        idSottoCommessa: 27122,
                        codiceSottoCommessa: "29_15-ITE-XXX",
                        descrizioneSottoCommessa: "Area Tecnica_Formazione e addestramento\r\n",
                        items: [
                            {
                                progressivo: 1,
                                numeroMinuti: 60,
                                idTipoFatturazione: 3,
                                turni: false,
                                reperibilita: false,
                                note: null,
                                orari: [
                                    {
                                        start: "2022-11-04T16:00:00",
                                        end: "2022-11-04T17:00:00"
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                dataPresenza: "2022-11-07",
                idTipoModalitaLavoro: null,
                tipoModalitaLavoro: null,
                attivita: [
                    {
                        idAttivita: 12265,
                        codiceAttivita: "22_15-ITE-XXX",
                        descrizioneAttivita: "22_15-ITE-XXX",
                        idCommessa: 7644,
                        codiceCommessa: "22_15-ITE-XXX",
                        descrizioneCommessa: "Area Tecnica",
                        idSottoCommessa: 29101,
                        codiceSottoCommessa: "22_15-ITE-XXX",
                        descrizioneSottoCommessa: "Area Tecnica",
                        items: [
                            {
                                progressivo: 1,
                                numeroMinuti: 240,
                                idTipoFatturazione: 3,
                                turni: false,
                                reperibilita: false,
                                note: null,
                                orari: [
                                    {
                                        start: "2022-11-07T00:00:00",
                                        end: "2022-11-07T04:00:00"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        idAttivita: 12265,
                        codiceAttivita: "22_15-ITE-XXX",
                        descrizioneAttivita: "22_15-ITE-XXX",
                        idCommessa: 7644,
                        codiceCommessa: "22_15-ITE-XXX",
                        descrizioneCommessa: "Area Tecnica",
                        idSottoCommessa: 29101,
                        codiceSottoCommessa: "22_15-ITE-XXX",
                        descrizioneSottoCommessa: "Area Tecnica",
                        items: [
                            {
                                progressivo: 2,
                                numeroMinuti: 120,
                                idTipoFatturazione: 3,
                                turni: false,
                                reperibilita: false,
                                note: null,
                                orari: [
                                    {
                                        start: "2022-11-07T09:00:00",
                                        end: "2022-11-07T11:00:00"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        idAttivita: 38133,
                        codiceAttivita: "2661_ETT21-XXXXXX",
                        descrizioneAttivita: "2661_ETT21-XXXXXX",
                        idCommessa: 42085,
                        codiceCommessa: "2661_ETT21-XXXXXX",
                        descrizioneCommessa: "VDT",
                        idSottoCommessa: 42084,
                        codiceSottoCommessa: "2661_ETT21-XXXXXX",
                        descrizioneSottoCommessa: "VDT",
                        items: [
                            {
                                progressivo: 1,
                                numeroMinuti: 240,
                                idTipoFatturazione: 39,
                                turni: false,
                                reperibilita: false,
                                note: null,
                                orari: [
                                    {
                                        start: "2022-11-07T04:30:00",
                                        end: "2022-11-07T08:30:00"
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                dataPresenza: "2022-11-08",
                idTipoModalitaLavoro: null,
                tipoModalitaLavoro: null,
                attivita: [
                    {
                        idAttivita: 12265,
                        codiceAttivita: "22_15-ITE-XXX",
                        descrizioneAttivita: "22_15-ITE-XXX",
                        idCommessa: 7644,
                        codiceCommessa: "22_15-ITE-XXX",
                        descrizioneCommessa: "Area Tecnica",
                        idSottoCommessa: 29101,
                        codiceSottoCommessa: "22_15-ITE-XXX",
                        descrizioneSottoCommessa: "Area Tecnica",
                        items: [
                            {
                                progressivo: 1,
                                numeroMinuti: 240,
                                idTipoFatturazione: 3,
                                turni: false,
                                reperibilita: false,
                                note: null,
                                orari: [
                                    {
                                        start: "2022-11-08T00:00:00",
                                        end: "2022-11-08T04:00:00"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        idAttivita: 38133,
                        codiceAttivita: "2661_ETT21-XXXXXX",
                        descrizioneAttivita: "2661_ETT21-XXXXXX",
                        idCommessa: 42085,
                        codiceCommessa: "2661_ETT21-XXXXXX",
                        descrizioneCommessa: "VDT",
                        idSottoCommessa: 42084,
                        codiceSottoCommessa: "2661_ETT21-XXXXXX",
                        descrizioneSottoCommessa: "VDT",
                        items: [
                            {
                                progressivo: 1,
                                numeroMinuti: 240,
                                idTipoFatturazione: 39,
                                turni: false,
                                reperibilita: false,
                                note: null,
                                orari: [
                                    {
                                        start: "2022-11-08T04:30:00",
                                        end: "2022-11-08T08:30:00"
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                dataPresenza: "2022-11-09",
                idTipoModalitaLavoro: null,
                tipoModalitaLavoro: null,
                attivita: [
                    {
                        idAttivita: 12265,
                        codiceAttivita: "22_15-ITE-XXX",
                        descrizioneAttivita: "22_15-ITE-XXX",
                        idCommessa: 7644,
                        codiceCommessa: "22_15-ITE-XXX",
                        descrizioneCommessa: "Area Tecnica",
                        idSottoCommessa: 29101,
                        codiceSottoCommessa: "22_15-ITE-XXX",
                        descrizioneSottoCommessa: "Area Tecnica",
                        items: [
                            {
                                progressivo: 1,
                                numeroMinuti: 240,
                                idTipoFatturazione: 3,
                                turni: false,
                                reperibilita: false,
                                note: null,
                                orari: [
                                    {
                                        start: "2022-11-09T00:00:00",
                                        end: "2022-11-09T04:00:00"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        idAttivita: 38133,
                        codiceAttivita: "2661_ETT21-XXXXXX",
                        descrizioneAttivita: "2661_ETT21-XXXXXX",
                        idCommessa: 42085,
                        codiceCommessa: "2661_ETT21-XXXXXX",
                        descrizioneCommessa: "VDT",
                        idSottoCommessa: 42084,
                        codiceSottoCommessa: "2661_ETT21-XXXXXX",
                        descrizioneSottoCommessa: "VDT",
                        items: [
                            {
                                progressivo: 1,
                                numeroMinuti: 240,
                                idTipoFatturazione: 39,
                                turni: false,
                                reperibilita: false,
                                note: null,
                                orari: [
                                    {
                                        start: "2022-11-09T04:30:00",
                                        end: "2022-11-09T08:30:00"
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                dataPresenza: "2022-11-10",
                idTipoModalitaLavoro: null,
                tipoModalitaLavoro: null,
                attivita: [
                    {
                        idAttivita: 12265,
                        codiceAttivita: "22_15-ITE-XXX",
                        descrizioneAttivita: "22_15-ITE-XXX",
                        idCommessa: 7644,
                        codiceCommessa: "22_15-ITE-XXX",
                        descrizioneCommessa: "Area Tecnica",
                        idSottoCommessa: 29101,
                        codiceSottoCommessa: "22_15-ITE-XXX",
                        descrizioneSottoCommessa: "Area Tecnica",
                        items: [
                            {
                                progressivo: 1,
                                numeroMinuti: 240,
                                idTipoFatturazione: 3,
                                turni: false,
                                reperibilita: false,
                                note: null,
                                orari: [
                                    {
                                        start: "2022-11-10T00:00:00",
                                        end: "2022-11-10T04:00:00"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        idAttivita: 38133,
                        codiceAttivita: "2661_ETT21-XXXXXX",
                        descrizioneAttivita: "2661_ETT21-XXXXXX",
                        idCommessa: 42085,
                        codiceCommessa: "2661_ETT21-XXXXXX",
                        descrizioneCommessa: "VDT",
                        idSottoCommessa: 42084,
                        codiceSottoCommessa: "2661_ETT21-XXXXXX",
                        descrizioneSottoCommessa: "VDT",
                        items: [
                            {
                                progressivo: 1,
                                numeroMinuti: 240,
                                idTipoFatturazione: 39,
                                turni: false,
                                reperibilita: false,
                                note: null,
                                orari: [
                                    {
                                        start: "2022-11-10T04:30:00",
                                        end: "2022-11-10T08:30:00"
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                dataPresenza: "2022-11-11",
                idTipoModalitaLavoro: null,
                tipoModalitaLavoro: null,
                attivita: [
                    {
                        idAttivita: 12265,
                        codiceAttivita: "22_15-ITE-XXX",
                        descrizioneAttivita: "22_15-ITE-XXX",
                        idCommessa: 7644,
                        codiceCommessa: "22_15-ITE-XXX",
                        descrizioneCommessa: "Area Tecnica",
                        idSottoCommessa: 29101,
                        codiceSottoCommessa: "22_15-ITE-XXX",
                        descrizioneSottoCommessa: "Area Tecnica",
                        items: [
                            {
                                progressivo: 1,
                                numeroMinuti: 240,
                                idTipoFatturazione: 3,
                                turni: false,
                                reperibilita: false,
                                note: null,
                                orari: [
                                    {
                                        start: "2022-11-11T00:00:00",
                                        end: "2022-11-11T04:00:00"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        idAttivita: 38133,
                        codiceAttivita: "2661_ETT21-XXXXXX",
                        descrizioneAttivita: "2661_ETT21-XXXXXX",
                        idCommessa: 42085,
                        codiceCommessa: "2661_ETT21-XXXXXX",
                        descrizioneCommessa: "VDT",
                        idSottoCommessa: 42084,
                        codiceSottoCommessa: "2661_ETT21-XXXXXX",
                        descrizioneSottoCommessa: "VDT",
                        items: [
                            {
                                progressivo: 1,
                                numeroMinuti: 240,
                                idTipoFatturazione: 39,
                                turni: false,
                                reperibilita: false,
                                note: null,
                                orari: [
                                    {
                                        start: "2022-11-11T04:30:00",
                                        end: "2022-11-11T08:30:00"
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                dataPresenza: "2022-11-14",
                idTipoModalitaLavoro: null,
                tipoModalitaLavoro: null,
                attivita: [
                    {
                        idAttivita: 38133,
                        codiceAttivita: "2661_ETT21-XXXXXX",
                        descrizioneAttivita: "2661_ETT21-XXXXXX",
                        idCommessa: 42085,
                        codiceCommessa: "2661_ETT21-XXXXXX",
                        descrizioneCommessa: "VDT",
                        idSottoCommessa: 42084,
                        codiceSottoCommessa: "2661_ETT21-XXXXXX",
                        descrizioneSottoCommessa: "VDT",
                        items: [
                            {
                                progressivo: 1,
                                numeroMinuti: 60,
                                idTipoFatturazione: 39,
                                turni: false,
                                reperibilita: false,
                                note: null,
                                orari: [
                                    {
                                        start: "2022-11-14T12:30:00",
                                        end: "2022-11-14T13:30:00"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        idAttivita: 38133,
                        codiceAttivita: "2661_ETT21-XXXXXX",
                        descrizioneAttivita: "2661_ETT21-XXXXXX",
                        idCommessa: 42085,
                        codiceCommessa: "2661_ETT21-XXXXXX",
                        descrizioneCommessa: "VDT",
                        idSottoCommessa: 42084,
                        codiceSottoCommessa: "2661_ETT21-XXXXXX",
                        descrizioneSottoCommessa: "VDT",
                        items: [
                            {
                                progressivo: 2,
                                numeroMinuti: 120,
                                idTipoFatturazione: 39,
                                turni: false,
                                reperibilita: false,
                                note: null,
                                orari: [
                                    {
                                        start: "2022-11-14T16:00:00",
                                        end: "2022-11-14T18:00:00"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        idAttivita: 4460,
                        codiceAttivita: "27_15-ITE-XXX",
                        descrizioneAttivita: "27_15-ITE-XXX",
                        idCommessa: 2152,
                        codiceCommessa: "27_15-ITE-XXX",
                        descrizioneCommessa: "Area Tecnica - Ricerca e sperimentazione\r\n",
                        idSottoCommessa: 27120,
                        codiceSottoCommessa: "27_15-ITE-XXX",
                        descrizioneSottoCommessa: "Area Tecnica - Ricerca e sperimentazione\r\n",
                        items: [
                            {
                                progressivo: 1,
                                numeroMinuti: 90,
                                idTipoFatturazione: 3,
                                turni: false,
                                reperibilita: false,
                                note: null,
                                orari: [
                                    {
                                        start: "2022-11-14T13:30:00",
                                        end: "2022-11-14T15:00:00"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        idAttivita: 42131,
                        codiceAttivita: "2865_SCA22-XXXXXX",
                        descrizioneAttivita: "2865_SCA22-XXXXXX",
                        idCommessa: 47208,
                        codiceCommessa: "2865_SCA22-XXXXXX",
                        descrizioneCommessa: "Modulo Rendicontazione",
                        idSottoCommessa: 47207,
                        codiceSottoCommessa: "2865_SCA22-XXXXXX",
                        descrizioneSottoCommessa: "Modulo Rendicontazione",
                        items: [
                            {
                                progressivo: 1,
                                numeroMinuti: 210,
                                idTipoFatturazione: 39,
                                turni: false,
                                reperibilita: false,
                                note: null,
                                orari: [
                                    {
                                        start: "2022-11-14T09:00:00",
                                        end: "2022-11-14T12:30:00"
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                dataPresenza: "2022-11-15",
                idTipoModalitaLavoro: null,
                tipoModalitaLavoro: null,
                attivita: [
                    {
                        idAttivita: 38133,
                        codiceAttivita: "2661_ETT21-XXXXXX",
                        descrizioneAttivita: "2661_ETT21-XXXXXX",
                        idCommessa: 42085,
                        codiceCommessa: "2661_ETT21-XXXXXX",
                        descrizioneCommessa: "VDT",
                        idSottoCommessa: 42084,
                        codiceSottoCommessa: "2661_ETT21-XXXXXX",
                        descrizioneSottoCommessa: "VDT",
                        items: [
                            {
                                progressivo: 1,
                                numeroMinuti: 60,
                                idTipoFatturazione: 39,
                                turni: false,
                                reperibilita: false,
                                note: null,
                                orari: [
                                    {
                                        start: "2022-11-15T12:30:00",
                                        end: "2022-11-15T13:30:00"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        idAttivita: 38133,
                        codiceAttivita: "2661_ETT21-XXXXXX",
                        descrizioneAttivita: "2661_ETT21-XXXXXX",
                        idCommessa: 42085,
                        codiceCommessa: "2661_ETT21-XXXXXX",
                        descrizioneCommessa: "VDT",
                        idSottoCommessa: 42084,
                        codiceSottoCommessa: "2661_ETT21-XXXXXX",
                        descrizioneSottoCommessa: "VDT",
                        items: [
                            {
                                progressivo: 2,
                                numeroMinuti: 60,
                                idTipoFatturazione: 39,
                                turni: false,
                                reperibilita: false,
                                note: null,
                                orari: [
                                    {
                                        start: "2022-11-15T15:30:00",
                                        end: "2022-11-15T16:30:00"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        idAttivita: 4460,
                        codiceAttivita: "27_15-ITE-XXX",
                        descrizioneAttivita: "27_15-ITE-XXX",
                        idCommessa: 2152,
                        codiceCommessa: "27_15-ITE-XXX",
                        descrizioneCommessa: "Area Tecnica - Ricerca e sperimentazione\r\n",
                        idSottoCommessa: 27120,
                        codiceSottoCommessa: "27_15-ITE-XXX",
                        descrizioneSottoCommessa: "Area Tecnica - Ricerca e sperimentazione\r\n",
                        items: [
                            {
                                progressivo: 1,
                                numeroMinuti: 90,
                                idTipoFatturazione: 3,
                                turni: false,
                                reperibilita: false,
                                note: null,
                                orari: [
                                    {
                                        start: "2022-11-15T13:30:00",
                                        end: "2022-11-15T15:00:00"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        idAttivita: 42131,
                        codiceAttivita: "2865_SCA22-XXXXXX",
                        descrizioneAttivita: "2865_SCA22-XXXXXX",
                        idCommessa: 47208,
                        codiceCommessa: "2865_SCA22-XXXXXX",
                        descrizioneCommessa: "Modulo Rendicontazione",
                        idSottoCommessa: 47207,
                        codiceSottoCommessa: "2865_SCA22-XXXXXX",
                        descrizioneSottoCommessa: "Modulo Rendicontazione",
                        items: [
                            {
                                progressivo: 1,
                                numeroMinuti: 180,
                                idTipoFatturazione: 39,
                                turni: false,
                                reperibilita: false,
                                note: null,
                                orari: [
                                    {
                                        start: "2022-11-15T09:00:00",
                                        end: "2022-11-15T12:00:00"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        idAttivita: 42625,
                        codiceAttivita: "2903_BET22-000262",
                        descrizioneAttivita: "2903_BET22-000262",
                        idCommessa: 47973,
                        codiceCommessa: "2903_BET22-000262",
                        descrizioneCommessa: "Prj Data Management (DWH) Pillar 2",
                        idSottoCommessa: 47972,
                        codiceSottoCommessa: "2903_BET22-000262",
                        descrizioneSottoCommessa: "Prj Data Management (DWH) Pillar 2",
                        items: [
                            {
                                progressivo: 1,
                                numeroMinuti: 90,
                                idTipoFatturazione: 39,
                                turni: false,
                                reperibilita: false,
                                note: null,
                                orari: [
                                    {
                                        start: "2022-11-15T16:30:00",
                                        end: "2022-11-15T18:00:00"
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                dataPresenza: "2022-11-16",
                idTipoModalitaLavoro: null,
                tipoModalitaLavoro: null,
                attivita: [
                    {
                        idAttivita: 38133,
                        codiceAttivita: "2661_ETT21-XXXXXX",
                        descrizioneAttivita: "2661_ETT21-XXXXXX",
                        idCommessa: 42085,
                        codiceCommessa: "2661_ETT21-XXXXXX",
                        descrizioneCommessa: "VDT",
                        idSottoCommessa: 42084,
                        codiceSottoCommessa: "2661_ETT21-XXXXXX",
                        descrizioneSottoCommessa: "VDT",
                        items: [
                            {
                                progressivo: 1,
                                numeroMinuti: 60,
                                idTipoFatturazione: 39,
                                turni: false,
                                reperibilita: false,
                                note: null,
                                orari: [
                                    {
                                        start: "2022-11-16T12:30:00",
                                        end: "2022-11-16T13:30:00"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        idAttivita: 38133,
                        codiceAttivita: "2661_ETT21-XXXXXX",
                        descrizioneAttivita: "2661_ETT21-XXXXXX",
                        idCommessa: 42085,
                        codiceCommessa: "2661_ETT21-XXXXXX",
                        descrizioneCommessa: "VDT",
                        idSottoCommessa: 42084,
                        codiceSottoCommessa: "2661_ETT21-XXXXXX",
                        descrizioneSottoCommessa: "VDT",
                        items: [
                            {
                                progressivo: 2,
                                numeroMinuti: 60,
                                idTipoFatturazione: 39,
                                turni: false,
                                reperibilita: false,
                                note: null,
                                orari: [
                                    {
                                        start: "2022-11-16T17:00:00",
                                        end: "2022-11-16T18:00:00"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        idAttivita: 4460,
                        codiceAttivita: "27_15-ITE-XXX",
                        descrizioneAttivita: "27_15-ITE-XXX",
                        idCommessa: 2152,
                        codiceCommessa: "27_15-ITE-XXX",
                        descrizioneCommessa: "Area Tecnica - Ricerca e sperimentazione\r\n",
                        idSottoCommessa: 27120,
                        codiceSottoCommessa: "27_15-ITE-XXX",
                        descrizioneSottoCommessa: "Area Tecnica - Ricerca e sperimentazione\r\n",
                        items: [
                            {
                                progressivo: 1,
                                numeroMinuti: 180,
                                idTipoFatturazione: 3,
                                turni: false,
                                reperibilita: false,
                                note: null,
                                orari: [
                                    {
                                        start: "2022-11-16T13:30:00",
                                        end: "2022-11-16T16:30:00"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        idAttivita: 42131,
                        codiceAttivita: "2865_SCA22-XXXXXX",
                        descrizioneAttivita: "2865_SCA22-XXXXXX",
                        idCommessa: 47208,
                        codiceCommessa: "2865_SCA22-XXXXXX",
                        descrizioneCommessa: "Modulo Rendicontazione",
                        idSottoCommessa: 47207,
                        codiceSottoCommessa: "2865_SCA22-XXXXXX",
                        descrizioneSottoCommessa: "Modulo Rendicontazione",
                        items: [
                            {
                                progressivo: 1,
                                numeroMinuti: 180,
                                idTipoFatturazione: 39,
                                turni: false,
                                reperibilita: false,
                                note: null,
                                orari: [
                                    {
                                        start: "2022-11-16T09:00:00",
                                        end: "2022-11-16T12:00:00"
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                dataPresenza: "2022-11-17",
                idTipoModalitaLavoro: null,
                tipoModalitaLavoro: null,
                attivita: [
                    {
                        idAttivita: 38133,
                        codiceAttivita: "2661_ETT21-XXXXXX",
                        descrizioneAttivita: "2661_ETT21-XXXXXX",
                        idCommessa: 42085,
                        codiceCommessa: "2661_ETT21-XXXXXX",
                        descrizioneCommessa: "VDT",
                        idSottoCommessa: 42084,
                        codiceSottoCommessa: "2661_ETT21-XXXXXX",
                        descrizioneSottoCommessa: "VDT",
                        items: [
                            {
                                progressivo: 1,
                                numeroMinuti: 120,
                                idTipoFatturazione: 39,
                                turni: false,
                                reperibilita: false,
                                note: null,
                                orari: [
                                    {
                                        start: "2022-11-17T16:00:00",
                                        end: "2022-11-17T18:00:00"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        idAttivita: 4460,
                        codiceAttivita: "27_15-ITE-XXX",
                        descrizioneAttivita: "27_15-ITE-XXX",
                        idCommessa: 2152,
                        codiceCommessa: "27_15-ITE-XXX",
                        descrizioneCommessa: "Area Tecnica - Ricerca e sperimentazione\r\n",
                        idSottoCommessa: 27120,
                        codiceSottoCommessa: "27_15-ITE-XXX",
                        descrizioneSottoCommessa: "Area Tecnica - Ricerca e sperimentazione\r\n",
                        items: [
                            {
                                progressivo: 1,
                                numeroMinuti: 90,
                                idTipoFatturazione: 3,
                                turni: false,
                                reperibilita: false,
                                note: null,
                                orari: [
                                    {
                                        start: "2022-11-17T13:00:00",
                                        end: "2022-11-17T14:30:00"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        idAttivita: 42131,
                        codiceAttivita: "2865_SCA22-XXXXXX",
                        descrizioneAttivita: "2865_SCA22-XXXXXX",
                        idCommessa: 47208,
                        codiceCommessa: "2865_SCA22-XXXXXX",
                        descrizioneCommessa: "Modulo Rendicontazione",
                        idSottoCommessa: 47207,
                        codiceSottoCommessa: "2865_SCA22-XXXXXX",
                        descrizioneSottoCommessa: "Modulo Rendicontazione",
                        items: [
                            {
                                progressivo: 1,
                                numeroMinuti: 180,
                                idTipoFatturazione: 39,
                                turni: false,
                                reperibilita: false,
                                note: null,
                                orari: [
                                    {
                                        start: "2022-11-17T09:00:00",
                                        end: "2022-11-17T12:00:00"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        idAttivita: 42625,
                        codiceAttivita: "2903_BET22-000262",
                        descrizioneAttivita: "2903_BET22-000262",
                        idCommessa: 47973,
                        codiceCommessa: "2903_BET22-000262",
                        descrizioneCommessa: "Prj Data Management (DWH) Pillar 2",
                        idSottoCommessa: 47972,
                        codiceSottoCommessa: "2903_BET22-000262",
                        descrizioneSottoCommessa: "Prj Data Management (DWH) Pillar 2",
                        items: [
                            {
                                progressivo: 1,
                                numeroMinuti: 90,
                                idTipoFatturazione: 39,
                                turni: false,
                                reperibilita: false,
                                note: null,
                                orari: [
                                    {
                                        start: "2022-11-17T14:30:00",
                                        end: "2022-11-17T16:00:00"
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                dataPresenza: "2022-11-18",
                idTipoModalitaLavoro: null,
                tipoModalitaLavoro: null,
                attivita: [
                    {
                        idAttivita: 38133,
                        codiceAttivita: "2661_ETT21-XXXXXX",
                        descrizioneAttivita: "2661_ETT21-XXXXXX",
                        idCommessa: 42085,
                        codiceCommessa: "2661_ETT21-XXXXXX",
                        descrizioneCommessa: "VDT",
                        idSottoCommessa: 42084,
                        codiceSottoCommessa: "2661_ETT21-XXXXXX",
                        descrizioneSottoCommessa: "VDT",
                        items: [
                            {
                                progressivo: 1,
                                numeroMinuti: 90,
                                idTipoFatturazione: 39,
                                turni: false,
                                reperibilita: false,
                                note: null,
                                orari: [
                                    {
                                        start: "2022-11-18T16:30:00",
                                        end: "2022-11-18T18:00:00"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        idAttivita: 4460,
                        codiceAttivita: "27_15-ITE-XXX",
                        descrizioneAttivita: "27_15-ITE-XXX",
                        idCommessa: 2152,
                        codiceCommessa: "27_15-ITE-XXX",
                        descrizioneCommessa: "Area Tecnica - Ricerca e sperimentazione\r\n",
                        idSottoCommessa: 27120,
                        codiceSottoCommessa: "27_15-ITE-XXX",
                        descrizioneSottoCommessa: "Area Tecnica - Ricerca e sperimentazione\r\n",
                        items: [
                            {
                                progressivo: 1,
                                numeroMinuti: 90,
                                idTipoFatturazione: 3,
                                turni: false,
                                reperibilita: false,
                                note: null,
                                orari: [
                                    {
                                        start: "2022-11-18T13:00:00",
                                        end: "2022-11-18T14:30:00"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        idAttivita: 42131,
                        codiceAttivita: "2865_SCA22-XXXXXX",
                        descrizioneAttivita: "2865_SCA22-XXXXXX",
                        idCommessa: 47208,
                        codiceCommessa: "2865_SCA22-XXXXXX",
                        descrizioneCommessa: "Modulo Rendicontazione",
                        idSottoCommessa: 47207,
                        codiceSottoCommessa: "2865_SCA22-XXXXXX",
                        descrizioneSottoCommessa: "Modulo Rendicontazione",
                        items: [
                            {
                                progressivo: 1,
                                numeroMinuti: 180,
                                idTipoFatturazione: 39,
                                turni: false,
                                reperibilita: false,
                                note: null,
                                orari: [
                                    {
                                        start: "2022-11-18T09:00:00",
                                        end: "2022-11-18T12:00:00"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        idAttivita: 4462,
                        codiceAttivita: "29_15-ITE-XXX",
                        descrizioneAttivita: "29_15-ITE-XXX",
                        idCommessa: 2154,
                        codiceCommessa: "29_15-ITE-XXX",
                        descrizioneCommessa: "Area Tecnica_Formazione e addestramento\r\n",
                        idSottoCommessa: 27122,
                        codiceSottoCommessa: "29_15-ITE-XXX",
                        descrizioneSottoCommessa: "Area Tecnica_Formazione e addestramento\r\n",
                        items: [
                            {
                                progressivo: 1,
                                numeroMinuti: 120,
                                idTipoFatturazione: 3,
                                turni: false,
                                reperibilita: false,
                                note: null,
                                orari: [
                                    {
                                        start: "2022-11-18T14:30:00",
                                        end: "2022-11-18T16:30:00"
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                dataPresenza: "2022-11-21",
                idTipoModalitaLavoro: null,
                tipoModalitaLavoro: null,
                attivita: [
                    {
                        idAttivita: 4460,
                        codiceAttivita: "27_15-ITE-XXX",
                        descrizioneAttivita: "27_15-ITE-XXX",
                        idCommessa: 2152,
                        codiceCommessa: "27_15-ITE-XXX",
                        descrizioneCommessa: "Area Tecnica - Ricerca e sperimentazione\r\n",
                        idSottoCommessa: 27120,
                        codiceSottoCommessa: "27_15-ITE-XXX",
                        descrizioneSottoCommessa: "Area Tecnica - Ricerca e sperimentazione\r\n",
                        items: [
                            {
                                progressivo: 1,
                                numeroMinuti: 60,
                                idTipoFatturazione: 3,
                                turni: false,
                                reperibilita: false,
                                note: null,
                                orari: [
                                    {
                                        start: "2022-11-21T15:00:00",
                                        end: "2022-11-21T16:00:00"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        idAttivita: 4460,
                        codiceAttivita: "27_15-ITE-XXX",
                        descrizioneAttivita: "27_15-ITE-XXX",
                        idCommessa: 2152,
                        codiceCommessa: "27_15-ITE-XXX",
                        descrizioneCommessa: "Area Tecnica - Ricerca e sperimentazione\r\n",
                        idSottoCommessa: 27120,
                        codiceSottoCommessa: "27_15-ITE-XXX",
                        descrizioneSottoCommessa: "Area Tecnica - Ricerca e sperimentazione\r\n",
                        items: [
                            {
                                progressivo: 2,
                                numeroMinuti: 120,
                                idTipoFatturazione: 3,
                                turni: false,
                                reperibilita: false,
                                note: null,
                                orari: [
                                    {
                                        start: "2022-11-21T16:00:00",
                                        end: "2022-11-21T18:00:00"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        idAttivita: 42131,
                        codiceAttivita: "2865_SCA22-XXXXXX",
                        descrizioneAttivita: "2865_SCA22-XXXXXX",
                        idCommessa: 47208,
                        codiceCommessa: "2865_SCA22-XXXXXX",
                        descrizioneCommessa: "Modulo Rendicontazione",
                        idSottoCommessa: 47207,
                        codiceSottoCommessa: "2865_SCA22-XXXXXX",
                        descrizioneSottoCommessa: "Modulo Rendicontazione",
                        items: [
                            {
                                progressivo: 1,
                                numeroMinuti: 300,
                                idTipoFatturazione: 39,
                                turni: false,
                                reperibilita: false,
                                note: null,
                                orari: [
                                    {
                                        start: "2022-11-21T09:00:00",
                                        end: "2022-11-21T14:00:00"
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                dataPresenza: "2022-11-22",
                idTipoModalitaLavoro: null,
                tipoModalitaLavoro: null,
                attivita: [
                    {
                        idAttivita: 4460,
                        codiceAttivita: "27_15-ITE-XXX",
                        descrizioneAttivita: "27_15-ITE-XXX",
                        idCommessa: 2152,
                        codiceCommessa: "27_15-ITE-XXX",
                        descrizioneCommessa: "Area Tecnica - Ricerca e sperimentazione\r\n",
                        idSottoCommessa: 27120,
                        codiceSottoCommessa: "27_15-ITE-XXX",
                        descrizioneSottoCommessa: "Area Tecnica - Ricerca e sperimentazione\r\n",
                        items: [
                            {
                                progressivo: 1,
                                numeroMinuti: 60,
                                idTipoFatturazione: 3,
                                turni: false,
                                reperibilita: false,
                                note: null,
                                orari: [
                                    {
                                        start: "2022-11-22T15:00:00",
                                        end: "2022-11-22T16:00:00"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        idAttivita: 4460,
                        codiceAttivita: "27_15-ITE-XXX",
                        descrizioneAttivita: "27_15-ITE-XXX",
                        idCommessa: 2152,
                        codiceCommessa: "27_15-ITE-XXX",
                        descrizioneCommessa: "Area Tecnica - Ricerca e sperimentazione\r\n",
                        idSottoCommessa: 27120,
                        codiceSottoCommessa: "27_15-ITE-XXX",
                        descrizioneSottoCommessa: "Area Tecnica - Ricerca e sperimentazione\r\n",
                        items: [
                            {
                                progressivo: 2,
                                numeroMinuti: 120,
                                idTipoFatturazione: 3,
                                turni: false,
                                reperibilita: false,
                                note: null,
                                orari: [
                                    {
                                        start: "2022-11-22T16:00:00",
                                        end: "2022-11-22T18:00:00"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        idAttivita: 42131,
                        codiceAttivita: "2865_SCA22-XXXXXX",
                        descrizioneAttivita: "2865_SCA22-XXXXXX",
                        idCommessa: 47208,
                        codiceCommessa: "2865_SCA22-XXXXXX",
                        descrizioneCommessa: "Modulo Rendicontazione",
                        idSottoCommessa: 47207,
                        codiceSottoCommessa: "2865_SCA22-XXXXXX",
                        descrizioneSottoCommessa: "Modulo Rendicontazione",
                        items: [
                            {
                                progressivo: 1,
                                numeroMinuti: 300,
                                idTipoFatturazione: 39,
                                turni: false,
                                reperibilita: false,
                                note: null,
                                orari: [
                                    {
                                        start: "2022-11-22T09:00:00",
                                        end: "2022-11-22T14:00:00"
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                dataPresenza: "2022-11-23",
                idTipoModalitaLavoro: null,
                tipoModalitaLavoro: null,
                attivita: [
                    {
                        idAttivita: 38133,
                        codiceAttivita: "2661_ETT21-XXXXXX",
                        descrizioneAttivita: "2661_ETT21-XXXXXX",
                        idCommessa: 42085,
                        codiceCommessa: "2661_ETT21-XXXXXX",
                        descrizioneCommessa: "VDT",
                        idSottoCommessa: 42084,
                        codiceSottoCommessa: "2661_ETT21-XXXXXX",
                        descrizioneSottoCommessa: "VDT",
                        items: [
                            {
                                progressivo: 1,
                                numeroMinuti: 30,
                                idTipoFatturazione: 39,
                                turni: false,
                                reperibilita: false,
                                note: null,
                                orari: [
                                    {
                                        start: "2022-11-23T17:30:00",
                                        end: "2022-11-23T18:00:00"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        idAttivita: 4460,
                        codiceAttivita: "27_15-ITE-XXX",
                        descrizioneAttivita: "27_15-ITE-XXX",
                        idCommessa: 2152,
                        codiceCommessa: "27_15-ITE-XXX",
                        descrizioneCommessa: "Area Tecnica - Ricerca e sperimentazione\r\n",
                        idSottoCommessa: 27120,
                        codiceSottoCommessa: "27_15-ITE-XXX",
                        descrizioneSottoCommessa: "Area Tecnica - Ricerca e sperimentazione\r\n",
                        items: [
                            {
                                progressivo: 1,
                                numeroMinuti: 360,
                                idTipoFatturazione: 3,
                                turni: false,
                                reperibilita: false,
                                note: null,
                                orari: [
                                    {
                                        start: "2022-11-23T11:30:00",
                                        end: "2022-11-23T17:30:00"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        idAttivita: 42625,
                        codiceAttivita: "2903_BET22-000262",
                        descrizioneAttivita: "2903_BET22-000262",
                        idCommessa: 47973,
                        codiceCommessa: "2903_BET22-000262",
                        descrizioneCommessa: "Prj Data Management (DWH) Pillar 2",
                        idSottoCommessa: 47972,
                        codiceSottoCommessa: "2903_BET22-000262",
                        descrizioneSottoCommessa: "Prj Data Management (DWH) Pillar 2",
                        items: [
                            {
                                progressivo: 1,
                                numeroMinuti: 90,
                                idTipoFatturazione: 39,
                                turni: false,
                                reperibilita: false,
                                note: null,
                                orari: [
                                    {
                                        start: "2022-11-23T09:00:00",
                                        end: "2022-11-23T10:30:00"
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                dataPresenza: "2022-11-24",
                idTipoModalitaLavoro: null,
                tipoModalitaLavoro: null,
                attivita: [
                    {
                        idAttivita: 4460,
                        codiceAttivita: "27_15-ITE-XXX",
                        descrizioneAttivita: "27_15-ITE-XXX",
                        idCommessa: 2152,
                        codiceCommessa: "27_15-ITE-XXX",
                        descrizioneCommessa: "Area Tecnica - Ricerca e sperimentazione\r\n",
                        idSottoCommessa: 27120,
                        codiceSottoCommessa: "27_15-ITE-XXX",
                        descrizioneSottoCommessa: "Area Tecnica - Ricerca e sperimentazione\r\n",
                        items: [
                            {
                                progressivo: 1,
                                numeroMinuti: 120,
                                idTipoFatturazione: 3,
                                turni: false,
                                reperibilita: false,
                                note: null,
                                orari: [
                                    {
                                        start: "2022-11-24T16:00:00",
                                        end: "2022-11-24T18:00:00"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        idAttivita: 42131,
                        codiceAttivita: "2865_SCA22-XXXXXX",
                        descrizioneAttivita: "2865_SCA22-XXXXXX",
                        idCommessa: 47208,
                        codiceCommessa: "2865_SCA22-XXXXXX",
                        descrizioneCommessa: "Modulo Rendicontazione",
                        idSottoCommessa: 47207,
                        codiceSottoCommessa: "2865_SCA22-XXXXXX",
                        descrizioneSottoCommessa: "Modulo Rendicontazione",
                        items: [
                            {
                                progressivo: 1,
                                numeroMinuti: 270,
                                idTipoFatturazione: 39,
                                turni: false,
                                reperibilita: false,
                                note: null,
                                orari: [
                                    {
                                        start: "2022-11-24T09:00:00",
                                        end: "2022-11-24T13:30:00"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        idAttivita: 42625,
                        codiceAttivita: "2903_BET22-000262",
                        descrizioneAttivita: "2903_BET22-000262",
                        idCommessa: 47973,
                        codiceCommessa: "2903_BET22-000262",
                        descrizioneCommessa: "Prj Data Management (DWH) Pillar 2",
                        idSottoCommessa: 47972,
                        codiceSottoCommessa: "2903_BET22-000262",
                        descrizioneSottoCommessa: "Prj Data Management (DWH) Pillar 2",
                        items: [
                            {
                                progressivo: 1,
                                numeroMinuti: 90,
                                idTipoFatturazione: 39,
                                turni: false,
                                reperibilita: false,
                                note: null,
                                orari: [
                                    {
                                        start: "2022-11-24T14:30:00",
                                        end: "2022-11-24T16:00:00"
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                dataPresenza: "2022-11-25",
                idTipoModalitaLavoro: null,
                tipoModalitaLavoro: null,
                attivita: [
                    {
                        idAttivita: 4460,
                        codiceAttivita: "27_15-ITE-XXX",
                        descrizioneAttivita: "27_15-ITE-XXX",
                        idCommessa: 2152,
                        codiceCommessa: "27_15-ITE-XXX",
                        descrizioneCommessa: "Area Tecnica - Ricerca e sperimentazione\r\n",
                        idSottoCommessa: 27120,
                        codiceSottoCommessa: "27_15-ITE-XXX",
                        descrizioneSottoCommessa: "Area Tecnica - Ricerca e sperimentazione\r\n",
                        items: [
                            {
                                progressivo: 1,
                                numeroMinuti: 180,
                                idTipoFatturazione: 3,
                                turni: false,
                                reperibilita: false,
                                note: null,
                                orari: [
                                    {
                                        start: "2022-11-25T15:00:00",
                                        end: "2022-11-25T18:00:00"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        idAttivita: 42131,
                        codiceAttivita: "2865_SCA22-XXXXXX",
                        descrizioneAttivita: "2865_SCA22-XXXXXX",
                        idCommessa: 47208,
                        codiceCommessa: "2865_SCA22-XXXXXX",
                        descrizioneCommessa: "Modulo Rendicontazione",
                        idSottoCommessa: 47207,
                        codiceSottoCommessa: "2865_SCA22-XXXXXX",
                        descrizioneSottoCommessa: "Modulo Rendicontazione",
                        items: [
                            {
                                progressivo: 1,
                                numeroMinuti: 300,
                                idTipoFatturazione: 39,
                                turni: false,
                                reperibilita: false,
                                note: null,
                                orari: [
                                    {
                                        start: "2022-11-25T09:00:00",
                                        end: "2022-11-25T14:00:00"
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ],
        presenzeGroupedByAttivita: {
            4460: [
                {
                    dataPresenza: "2022-11-03",
                    idTipoModalitaLavoro: null,
                    codiceAttivita: "27_15-ITE-XXX",
                    codiceCommessa: "27_15-ITE-XXX",
                    codiceSottoCommessa: "27_15-ITE-XXX",
                    idAttivita: 4460,
                    idCommessa: 2152,
                    idSottoCommessa: 27120,
                    numeroMinuti: 210,
                    turni: false,
                    reperibilita: false,
                    progressivo: 1
                },
                {
                    dataPresenza: "2022-11-04",
                    idTipoModalitaLavoro: null,
                    codiceAttivita: "27_15-ITE-XXX",
                    codiceCommessa: "27_15-ITE-XXX",
                    codiceSottoCommessa: "27_15-ITE-XXX",
                    idAttivita: 4460,
                    idCommessa: 2152,
                    idSottoCommessa: 27120,
                    numeroMinuti: 180,
                    turni: false,
                    reperibilita: false,
                    progressivo: 1
                },
                {
                    dataPresenza: "2022-11-14",
                    idTipoModalitaLavoro: null,
                    codiceAttivita: "27_15-ITE-XXX",
                    codiceCommessa: "27_15-ITE-XXX",
                    codiceSottoCommessa: "27_15-ITE-XXX",
                    idAttivita: 4460,
                    idCommessa: 2152,
                    idSottoCommessa: 27120,
                    numeroMinuti: 90,
                    turni: false,
                    reperibilita: false,
                    progressivo: 1
                },
                {
                    dataPresenza: "2022-11-15",
                    idTipoModalitaLavoro: null,
                    codiceAttivita: "27_15-ITE-XXX",
                    codiceCommessa: "27_15-ITE-XXX",
                    codiceSottoCommessa: "27_15-ITE-XXX",
                    idAttivita: 4460,
                    idCommessa: 2152,
                    idSottoCommessa: 27120,
                    numeroMinuti: 90,
                    turni: false,
                    reperibilita: false,
                    progressivo: 1
                },
                {
                    dataPresenza: "2022-11-16",
                    idTipoModalitaLavoro: null,
                    codiceAttivita: "27_15-ITE-XXX",
                    codiceCommessa: "27_15-ITE-XXX",
                    codiceSottoCommessa: "27_15-ITE-XXX",
                    idAttivita: 4460,
                    idCommessa: 2152,
                    idSottoCommessa: 27120,
                    numeroMinuti: 180,
                    turni: false,
                    reperibilita: false,
                    progressivo: 1
                },
                {
                    dataPresenza: "2022-11-17",
                    idTipoModalitaLavoro: null,
                    codiceAttivita: "27_15-ITE-XXX",
                    codiceCommessa: "27_15-ITE-XXX",
                    codiceSottoCommessa: "27_15-ITE-XXX",
                    idAttivita: 4460,
                    idCommessa: 2152,
                    idSottoCommessa: 27120,
                    numeroMinuti: 90,
                    turni: false,
                    reperibilita: false,
                    progressivo: 1
                },
                {
                    dataPresenza: "2022-11-18",
                    idTipoModalitaLavoro: null,
                    codiceAttivita: "27_15-ITE-XXX",
                    codiceCommessa: "27_15-ITE-XXX",
                    codiceSottoCommessa: "27_15-ITE-XXX",
                    idAttivita: 4460,
                    idCommessa: 2152,
                    idSottoCommessa: 27120,
                    numeroMinuti: 90,
                    turni: false,
                    reperibilita: false,
                    progressivo: 1
                },
                {
                    dataPresenza: "2022-11-21",
                    idTipoModalitaLavoro: null,
                    codiceAttivita: "27_15-ITE-XXX",
                    codiceCommessa: "27_15-ITE-XXX",
                    codiceSottoCommessa: "27_15-ITE-XXX",
                    idAttivita: 4460,
                    idCommessa: 2152,
                    idSottoCommessa: 27120,
                    numeroMinuti: 60,
                    turni: false,
                    reperibilita: false,
                    progressivo: 1
                },
                {
                    dataPresenza: "2022-11-21",
                    idTipoModalitaLavoro: null,
                    codiceAttivita: "27_15-ITE-XXX",
                    codiceCommessa: "27_15-ITE-XXX",
                    codiceSottoCommessa: "27_15-ITE-XXX",
                    idAttivita: 4460,
                    idCommessa: 2152,
                    idSottoCommessa: 27120,
                    numeroMinuti: 120,
                    turni: false,
                    reperibilita: false,
                    progressivo: 2
                },
                {
                    dataPresenza: "2022-11-22",
                    idTipoModalitaLavoro: null,
                    codiceAttivita: "27_15-ITE-XXX",
                    codiceCommessa: "27_15-ITE-XXX",
                    codiceSottoCommessa: "27_15-ITE-XXX",
                    idAttivita: 4460,
                    idCommessa: 2152,
                    idSottoCommessa: 27120,
                    numeroMinuti: 60,
                    turni: false,
                    reperibilita: false,
                    progressivo: 1
                },
                {
                    dataPresenza: "2022-11-22",
                    idTipoModalitaLavoro: null,
                    codiceAttivita: "27_15-ITE-XXX",
                    codiceCommessa: "27_15-ITE-XXX",
                    codiceSottoCommessa: "27_15-ITE-XXX",
                    idAttivita: 4460,
                    idCommessa: 2152,
                    idSottoCommessa: 27120,
                    numeroMinuti: 120,
                    turni: false,
                    reperibilita: false,
                    progressivo: 2
                },
                {
                    dataPresenza: "2022-11-23",
                    idTipoModalitaLavoro: null,
                    codiceAttivita: "27_15-ITE-XXX",
                    codiceCommessa: "27_15-ITE-XXX",
                    codiceSottoCommessa: "27_15-ITE-XXX",
                    idAttivita: 4460,
                    idCommessa: 2152,
                    idSottoCommessa: 27120,
                    numeroMinuti: 360,
                    turni: false,
                    reperibilita: false,
                    progressivo: 1
                },
                {
                    dataPresenza: "2022-11-24",
                    idTipoModalitaLavoro: null,
                    codiceAttivita: "27_15-ITE-XXX",
                    codiceCommessa: "27_15-ITE-XXX",
                    codiceSottoCommessa: "27_15-ITE-XXX",
                    idAttivita: 4460,
                    idCommessa: 2152,
                    idSottoCommessa: 27120,
                    numeroMinuti: 120,
                    turni: false,
                    reperibilita: false,
                    progressivo: 1
                },
                {
                    dataPresenza: "2022-11-25",
                    idTipoModalitaLavoro: null,
                    codiceAttivita: "27_15-ITE-XXX",
                    codiceCommessa: "27_15-ITE-XXX",
                    codiceSottoCommessa: "27_15-ITE-XXX",
                    idAttivita: 4460,
                    idCommessa: 2152,
                    idSottoCommessa: 27120,
                    numeroMinuti: 180,
                    turni: false,
                    reperibilita: false,
                    progressivo: 1
                }
            ],
            4462: [
                {
                    dataPresenza: "2022-11-02",
                    idTipoModalitaLavoro: null,
                    codiceAttivita: "29_15-ITE-XXX",
                    codiceCommessa: "29_15-ITE-XXX",
                    codiceSottoCommessa: "29_15-ITE-XXX",
                    idAttivita: 4462,
                    idCommessa: 2154,
                    idSottoCommessa: 27122,
                    numeroMinuti: 120,
                    turni: false,
                    reperibilita: false,
                    progressivo: 1
                },
                {
                    dataPresenza: "2022-11-04",
                    idTipoModalitaLavoro: null,
                    codiceAttivita: "29_15-ITE-XXX",
                    codiceCommessa: "29_15-ITE-XXX",
                    codiceSottoCommessa: "29_15-ITE-XXX",
                    idAttivita: 4462,
                    idCommessa: 2154,
                    idSottoCommessa: 27122,
                    numeroMinuti: 60,
                    turni: false,
                    reperibilita: false,
                    progressivo: 1
                },
                {
                    dataPresenza: "2022-11-18",
                    idTipoModalitaLavoro: null,
                    codiceAttivita: "29_15-ITE-XXX",
                    codiceCommessa: "29_15-ITE-XXX",
                    codiceSottoCommessa: "29_15-ITE-XXX",
                    idAttivita: 4462,
                    idCommessa: 2154,
                    idSottoCommessa: 27122,
                    numeroMinuti: 120,
                    turni: false,
                    reperibilita: false,
                    progressivo: 1
                }
            ],
            12265: [
                {
                    dataPresenza: "2022-11-02",
                    idTipoModalitaLavoro: null,
                    codiceAttivita: "22_15-ITE-XXX",
                    codiceCommessa: "22_15-ITE-XXX",
                    codiceSottoCommessa: "22_15-ITE-XXX",
                    idAttivita: 12265,
                    idCommessa: 7644,
                    idSottoCommessa: 29101,
                    numeroMinuti: 420,
                    turni: false,
                    reperibilita: false,
                    progressivo: 1
                },
                {
                    dataPresenza: "2022-11-07",
                    idTipoModalitaLavoro: null,
                    codiceAttivita: "22_15-ITE-XXX",
                    codiceCommessa: "22_15-ITE-XXX",
                    codiceSottoCommessa: "22_15-ITE-XXX",
                    idAttivita: 12265,
                    idCommessa: 7644,
                    idSottoCommessa: 29101,
                    numeroMinuti: 240,
                    turni: false,
                    reperibilita: false,
                    progressivo: 1
                },
                {
                    dataPresenza: "2022-11-07",
                    idTipoModalitaLavoro: null,
                    codiceAttivita: "22_15-ITE-XXX",
                    codiceCommessa: "22_15-ITE-XXX",
                    codiceSottoCommessa: "22_15-ITE-XXX",
                    idAttivita: 12265,
                    idCommessa: 7644,
                    idSottoCommessa: 29101,
                    numeroMinuti: 120,
                    turni: false,
                    reperibilita: false,
                    progressivo: 2
                },
                {
                    dataPresenza: "2022-11-08",
                    idTipoModalitaLavoro: null,
                    codiceAttivita: "22_15-ITE-XXX",
                    codiceCommessa: "22_15-ITE-XXX",
                    codiceSottoCommessa: "22_15-ITE-XXX",
                    idAttivita: 12265,
                    idCommessa: 7644,
                    idSottoCommessa: 29101,
                    numeroMinuti: 240,
                    turni: false,
                    reperibilita: false,
                    progressivo: 1
                },
                {
                    dataPresenza: "2022-11-09",
                    idTipoModalitaLavoro: null,
                    codiceAttivita: "22_15-ITE-XXX",
                    codiceCommessa: "22_15-ITE-XXX",
                    codiceSottoCommessa: "22_15-ITE-XXX",
                    idAttivita: 12265,
                    idCommessa: 7644,
                    idSottoCommessa: 29101,
                    numeroMinuti: 240,
                    turni: false,
                    reperibilita: false,
                    progressivo: 1
                },
                {
                    dataPresenza: "2022-11-10",
                    idTipoModalitaLavoro: null,
                    codiceAttivita: "22_15-ITE-XXX",
                    codiceCommessa: "22_15-ITE-XXX",
                    codiceSottoCommessa: "22_15-ITE-XXX",
                    idAttivita: 12265,
                    idCommessa: 7644,
                    idSottoCommessa: 29101,
                    numeroMinuti: 240,
                    turni: false,
                    reperibilita: false,
                    progressivo: 1
                },
                {
                    dataPresenza: "2022-11-11",
                    idTipoModalitaLavoro: null,
                    codiceAttivita: "22_15-ITE-XXX",
                    codiceCommessa: "22_15-ITE-XXX",
                    codiceSottoCommessa: "22_15-ITE-XXX",
                    idAttivita: 12265,
                    idCommessa: 7644,
                    idSottoCommessa: 29101,
                    numeroMinuti: 240,
                    turni: false,
                    reperibilita: false,
                    progressivo: 1
                }
            ],
            38133: [
                {
                    dataPresenza: "2022-11-03",
                    idTipoModalitaLavoro: null,
                    codiceAttivita: "2661_ETT21-XXXXXX",
                    codiceCommessa: "2661_ETT21-XXXXXX",
                    codiceSottoCommessa: "2661_ETT21-XXXXXX",
                    idAttivita: 38133,
                    idCommessa: 42085,
                    idSottoCommessa: 42084,
                    numeroMinuti: 420,
                    turni: false,
                    reperibilita: false,
                    progressivo: 1
                },
                {
                    dataPresenza: "2022-11-04",
                    idTipoModalitaLavoro: null,
                    codiceAttivita: "2661_ETT21-XXXXXX",
                    codiceCommessa: "2661_ETT21-XXXXXX",
                    codiceSottoCommessa: "2661_ETT21-XXXXXX",
                    idAttivita: 38133,
                    idCommessa: 42085,
                    idSottoCommessa: 42084,
                    numeroMinuti: 480,
                    turni: false,
                    reperibilita: false,
                    progressivo: 1
                },
                {
                    dataPresenza: "2022-11-07",
                    idTipoModalitaLavoro: null,
                    codiceAttivita: "2661_ETT21-XXXXXX",
                    codiceCommessa: "2661_ETT21-XXXXXX",
                    codiceSottoCommessa: "2661_ETT21-XXXXXX",
                    idAttivita: 38133,
                    idCommessa: 42085,
                    idSottoCommessa: 42084,
                    numeroMinuti: 240,
                    turni: false,
                    reperibilita: false,
                    progressivo: 1
                },
                {
                    dataPresenza: "2022-11-08",
                    idTipoModalitaLavoro: null,
                    codiceAttivita: "2661_ETT21-XXXXXX",
                    codiceCommessa: "2661_ETT21-XXXXXX",
                    codiceSottoCommessa: "2661_ETT21-XXXXXX",
                    idAttivita: 38133,
                    idCommessa: 42085,
                    idSottoCommessa: 42084,
                    numeroMinuti: 240,
                    turni: false,
                    reperibilita: false,
                    progressivo: 1
                },
                {
                    dataPresenza: "2022-11-09",
                    idTipoModalitaLavoro: null,
                    codiceAttivita: "2661_ETT21-XXXXXX",
                    codiceCommessa: "2661_ETT21-XXXXXX",
                    codiceSottoCommessa: "2661_ETT21-XXXXXX",
                    idAttivita: 38133,
                    idCommessa: 42085,
                    idSottoCommessa: 42084,
                    numeroMinuti: 240,
                    turni: false,
                    reperibilita: false,
                    progressivo: 1
                },
                {
                    dataPresenza: "2022-11-10",
                    idTipoModalitaLavoro: null,
                    codiceAttivita: "2661_ETT21-XXXXXX",
                    codiceCommessa: "2661_ETT21-XXXXXX",
                    codiceSottoCommessa: "2661_ETT21-XXXXXX",
                    idAttivita: 38133,
                    idCommessa: 42085,
                    idSottoCommessa: 42084,
                    numeroMinuti: 240,
                    turni: false,
                    reperibilita: false,
                    progressivo: 1
                },
                {
                    dataPresenza: "2022-11-11",
                    idTipoModalitaLavoro: null,
                    codiceAttivita: "2661_ETT21-XXXXXX",
                    codiceCommessa: "2661_ETT21-XXXXXX",
                    codiceSottoCommessa: "2661_ETT21-XXXXXX",
                    idAttivita: 38133,
                    idCommessa: 42085,
                    idSottoCommessa: 42084,
                    numeroMinuti: 240,
                    turni: false,
                    reperibilita: false,
                    progressivo: 1
                },
                {
                    dataPresenza: "2022-11-14",
                    idTipoModalitaLavoro: null,
                    codiceAttivita: "2661_ETT21-XXXXXX",
                    codiceCommessa: "2661_ETT21-XXXXXX",
                    codiceSottoCommessa: "2661_ETT21-XXXXXX",
                    idAttivita: 38133,
                    idCommessa: 42085,
                    idSottoCommessa: 42084,
                    numeroMinuti: 60,
                    turni: false,
                    reperibilita: false,
                    progressivo: 1
                },
                {
                    dataPresenza: "2022-11-14",
                    idTipoModalitaLavoro: null,
                    codiceAttivita: "2661_ETT21-XXXXXX",
                    codiceCommessa: "2661_ETT21-XXXXXX",
                    codiceSottoCommessa: "2661_ETT21-XXXXXX",
                    idAttivita: 38133,
                    idCommessa: 42085,
                    idSottoCommessa: 42084,
                    numeroMinuti: 120,
                    turni: false,
                    reperibilita: false,
                    progressivo: 2
                },
                {
                    dataPresenza: "2022-11-15",
                    idTipoModalitaLavoro: null,
                    codiceAttivita: "2661_ETT21-XXXXXX",
                    codiceCommessa: "2661_ETT21-XXXXXX",
                    codiceSottoCommessa: "2661_ETT21-XXXXXX",
                    idAttivita: 38133,
                    idCommessa: 42085,
                    idSottoCommessa: 42084,
                    numeroMinuti: 60,
                    turni: false,
                    reperibilita: false,
                    progressivo: 1
                },
                {
                    dataPresenza: "2022-11-15",
                    idTipoModalitaLavoro: null,
                    codiceAttivita: "2661_ETT21-XXXXXX",
                    codiceCommessa: "2661_ETT21-XXXXXX",
                    codiceSottoCommessa: "2661_ETT21-XXXXXX",
                    idAttivita: 38133,
                    idCommessa: 42085,
                    idSottoCommessa: 42084,
                    numeroMinuti: 60,
                    turni: false,
                    reperibilita: false,
                    progressivo: 2
                },
                {
                    dataPresenza: "2022-11-16",
                    idTipoModalitaLavoro: null,
                    codiceAttivita: "2661_ETT21-XXXXXX",
                    codiceCommessa: "2661_ETT21-XXXXXX",
                    codiceSottoCommessa: "2661_ETT21-XXXXXX",
                    idAttivita: 38133,
                    idCommessa: 42085,
                    idSottoCommessa: 42084,
                    numeroMinuti: 60,
                    turni: false,
                    reperibilita: false,
                    progressivo: 1
                },
                {
                    dataPresenza: "2022-11-16",
                    idTipoModalitaLavoro: null,
                    codiceAttivita: "2661_ETT21-XXXXXX",
                    codiceCommessa: "2661_ETT21-XXXXXX",
                    codiceSottoCommessa: "2661_ETT21-XXXXXX",
                    idAttivita: 38133,
                    idCommessa: 42085,
                    idSottoCommessa: 42084,
                    numeroMinuti: 60,
                    turni: false,
                    reperibilita: false,
                    progressivo: 2
                },
                {
                    dataPresenza: "2022-11-17",
                    idTipoModalitaLavoro: null,
                    codiceAttivita: "2661_ETT21-XXXXXX",
                    codiceCommessa: "2661_ETT21-XXXXXX",
                    codiceSottoCommessa: "2661_ETT21-XXXXXX",
                    idAttivita: 38133,
                    idCommessa: 42085,
                    idSottoCommessa: 42084,
                    numeroMinuti: 120,
                    turni: false,
                    reperibilita: false,
                    progressivo: 1
                },
                {
                    dataPresenza: "2022-11-18",
                    idTipoModalitaLavoro: null,
                    codiceAttivita: "2661_ETT21-XXXXXX",
                    codiceCommessa: "2661_ETT21-XXXXXX",
                    codiceSottoCommessa: "2661_ETT21-XXXXXX",
                    idAttivita: 38133,
                    idCommessa: 42085,
                    idSottoCommessa: 42084,
                    numeroMinuti: 90,
                    turni: false,
                    reperibilita: false,
                    progressivo: 1
                },
                {
                    dataPresenza: "2022-11-23",
                    idTipoModalitaLavoro: null,
                    codiceAttivita: "2661_ETT21-XXXXXX",
                    codiceCommessa: "2661_ETT21-XXXXXX",
                    codiceSottoCommessa: "2661_ETT21-XXXXXX",
                    idAttivita: 38133,
                    idCommessa: 42085,
                    idSottoCommessa: 42084,
                    numeroMinuti: 30,
                    turni: false,
                    reperibilita: false,
                    progressivo: 1
                }
            ],
            41434: [
                {
                    dataPresenza: "2022-11-02",
                    idTipoModalitaLavoro: null,
                    codiceAttivita: "2842_BET22-000162",
                    codiceCommessa: "2842_BET22-000162",
                    codiceSottoCommessa: "2842_BET22-000162",
                    idAttivita: 41434,
                    idCommessa: 46152,
                    idSottoCommessa: 46151,
                    numeroMinuti: 180,
                    turni: false,
                    reperibilita: false,
                    progressivo: 1
                },
                {
                    dataPresenza: "2022-11-03",
                    idTipoModalitaLavoro: null,
                    codiceAttivita: "2842_BET22-000162",
                    codiceCommessa: "2842_BET22-000162",
                    codiceSottoCommessa: "2842_BET22-000162",
                    idAttivita: 41434,
                    idCommessa: 46152,
                    idSottoCommessa: 46151,
                    numeroMinuti: 90,
                    turni: false,
                    reperibilita: false,
                    progressivo: 1
                }
            ],
            42131: [
                {
                    dataPresenza: "2022-11-02",
                    idTipoModalitaLavoro: null,
                    codiceAttivita: "2865_SCA22-XXXXXX",
                    codiceCommessa: "2865_SCA22-XXXXXX",
                    codiceSottoCommessa: "2865_SCA22-XXXXXX",
                    idAttivita: 42131,
                    idCommessa: 47208,
                    idSottoCommessa: 47207,
                    numeroMinuti: 180,
                    turni: false,
                    reperibilita: false,
                    progressivo: 1
                },
                {
                    dataPresenza: "2022-11-03",
                    idTipoModalitaLavoro: null,
                    codiceAttivita: "2865_SCA22-XXXXXX",
                    codiceCommessa: "2865_SCA22-XXXXXX",
                    codiceSottoCommessa: "2865_SCA22-XXXXXX",
                    idAttivita: 42131,
                    idCommessa: 47208,
                    idSottoCommessa: 47207,
                    numeroMinuti: 120,
                    turni: false,
                    reperibilita: false,
                    progressivo: 1
                },
                {
                    dataPresenza: "2022-11-03",
                    idTipoModalitaLavoro: null,
                    codiceAttivita: "2865_SCA22-XXXXXX",
                    codiceCommessa: "2865_SCA22-XXXXXX",
                    codiceSottoCommessa: "2865_SCA22-XXXXXX",
                    idAttivita: 42131,
                    idCommessa: 47208,
                    idSottoCommessa: 47207,
                    numeroMinuti: 60,
                    turni: false,
                    reperibilita: false,
                    progressivo: 2
                },
                {
                    dataPresenza: "2022-11-04",
                    idTipoModalitaLavoro: null,
                    codiceAttivita: "2865_SCA22-XXXXXX",
                    codiceCommessa: "2865_SCA22-XXXXXX",
                    codiceSottoCommessa: "2865_SCA22-XXXXXX",
                    idAttivita: 42131,
                    idCommessa: 47208,
                    idSottoCommessa: 47207,
                    numeroMinuti: 240,
                    turni: false,
                    reperibilita: false,
                    progressivo: 1
                },
                {
                    dataPresenza: "2022-11-14",
                    idTipoModalitaLavoro: null,
                    codiceAttivita: "2865_SCA22-XXXXXX",
                    codiceCommessa: "2865_SCA22-XXXXXX",
                    codiceSottoCommessa: "2865_SCA22-XXXXXX",
                    idAttivita: 42131,
                    idCommessa: 47208,
                    idSottoCommessa: 47207,
                    numeroMinuti: 210,
                    turni: false,
                    reperibilita: false,
                    progressivo: 1
                },
                {
                    dataPresenza: "2022-11-15",
                    idTipoModalitaLavoro: null,
                    codiceAttivita: "2865_SCA22-XXXXXX",
                    codiceCommessa: "2865_SCA22-XXXXXX",
                    codiceSottoCommessa: "2865_SCA22-XXXXXX",
                    idAttivita: 42131,
                    idCommessa: 47208,
                    idSottoCommessa: 47207,
                    numeroMinuti: 180,
                    turni: false,
                    reperibilita: false,
                    progressivo: 1
                },
                {
                    dataPresenza: "2022-11-16",
                    idTipoModalitaLavoro: null,
                    codiceAttivita: "2865_SCA22-XXXXXX",
                    codiceCommessa: "2865_SCA22-XXXXXX",
                    codiceSottoCommessa: "2865_SCA22-XXXXXX",
                    idAttivita: 42131,
                    idCommessa: 47208,
                    idSottoCommessa: 47207,
                    numeroMinuti: 180,
                    turni: false,
                    reperibilita: false,
                    progressivo: 1
                },
                {
                    dataPresenza: "2022-11-17",
                    idTipoModalitaLavoro: null,
                    codiceAttivita: "2865_SCA22-XXXXXX",
                    codiceCommessa: "2865_SCA22-XXXXXX",
                    codiceSottoCommessa: "2865_SCA22-XXXXXX",
                    idAttivita: 42131,
                    idCommessa: 47208,
                    idSottoCommessa: 47207,
                    numeroMinuti: 180,
                    turni: false,
                    reperibilita: false,
                    progressivo: 1
                },
                {
                    dataPresenza: "2022-11-18",
                    idTipoModalitaLavoro: null,
                    codiceAttivita: "2865_SCA22-XXXXXX",
                    codiceCommessa: "2865_SCA22-XXXXXX",
                    codiceSottoCommessa: "2865_SCA22-XXXXXX",
                    idAttivita: 42131,
                    idCommessa: 47208,
                    idSottoCommessa: 47207,
                    numeroMinuti: 180,
                    turni: false,
                    reperibilita: false,
                    progressivo: 1
                },
                {
                    dataPresenza: "2022-11-21",
                    idTipoModalitaLavoro: null,
                    codiceAttivita: "2865_SCA22-XXXXXX",
                    codiceCommessa: "2865_SCA22-XXXXXX",
                    codiceSottoCommessa: "2865_SCA22-XXXXXX",
                    idAttivita: 42131,
                    idCommessa: 47208,
                    idSottoCommessa: 47207,
                    numeroMinuti: 300,
                    turni: false,
                    reperibilita: false,
                    progressivo: 1
                },
                {
                    dataPresenza: "2022-11-22",
                    idTipoModalitaLavoro: null,
                    codiceAttivita: "2865_SCA22-XXXXXX",
                    codiceCommessa: "2865_SCA22-XXXXXX",
                    codiceSottoCommessa: "2865_SCA22-XXXXXX",
                    idAttivita: 42131,
                    idCommessa: 47208,
                    idSottoCommessa: 47207,
                    numeroMinuti: 300,
                    turni: false,
                    reperibilita: false,
                    progressivo: 1
                },
                {
                    dataPresenza: "2022-11-24",
                    idTipoModalitaLavoro: null,
                    codiceAttivita: "2865_SCA22-XXXXXX",
                    codiceCommessa: "2865_SCA22-XXXXXX",
                    codiceSottoCommessa: "2865_SCA22-XXXXXX",
                    idAttivita: 42131,
                    idCommessa: 47208,
                    idSottoCommessa: 47207,
                    numeroMinuti: 270,
                    turni: false,
                    reperibilita: false,
                    progressivo: 1
                },
                {
                    dataPresenza: "2022-11-25",
                    idTipoModalitaLavoro: null,
                    codiceAttivita: "2865_SCA22-XXXXXX",
                    codiceCommessa: "2865_SCA22-XXXXXX",
                    codiceSottoCommessa: "2865_SCA22-XXXXXX",
                    idAttivita: 42131,
                    idCommessa: 47208,
                    idSottoCommessa: 47207,
                    numeroMinuti: 300,
                    turni: false,
                    reperibilita: false,
                    progressivo: 1
                }
            ],
            42625: [
                {
                    dataPresenza: "2022-11-15",
                    idTipoModalitaLavoro: null,
                    codiceAttivita: "2903_BET22-000262",
                    codiceCommessa: "2903_BET22-000262",
                    codiceSottoCommessa: "2903_BET22-000262",
                    idAttivita: 42625,
                    idCommessa: 47973,
                    idSottoCommessa: 47972,
                    numeroMinuti: 90,
                    turni: false,
                    reperibilita: false,
                    progressivo: 1
                },
                {
                    dataPresenza: "2022-11-17",
                    idTipoModalitaLavoro: null,
                    codiceAttivita: "2903_BET22-000262",
                    codiceCommessa: "2903_BET22-000262",
                    codiceSottoCommessa: "2903_BET22-000262",
                    idAttivita: 42625,
                    idCommessa: 47973,
                    idSottoCommessa: 47972,
                    numeroMinuti: 90,
                    turni: false,
                    reperibilita: false,
                    progressivo: 1
                },
                {
                    dataPresenza: "2022-11-23",
                    idTipoModalitaLavoro: null,
                    codiceAttivita: "2903_BET22-000262",
                    codiceCommessa: "2903_BET22-000262",
                    codiceSottoCommessa: "2903_BET22-000262",
                    idAttivita: 42625,
                    idCommessa: 47973,
                    idSottoCommessa: 47972,
                    numeroMinuti: 90,
                    turni: false,
                    reperibilita: false,
                    progressivo: 1
                },
                {
                    dataPresenza: "2022-11-24",
                    idTipoModalitaLavoro: null,
                    codiceAttivita: "2903_BET22-000262",
                    codiceCommessa: "2903_BET22-000262",
                    codiceSottoCommessa: "2903_BET22-000262",
                    idAttivita: 42625,
                    idCommessa: 47973,
                    idSottoCommessa: 47972,
                    numeroMinuti: 90,
                    turni: false,
                    reperibilita: false,
                    progressivo: 1
                }
            ]
        }
    }
}
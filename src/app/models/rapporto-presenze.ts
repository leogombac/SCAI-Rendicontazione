import { Injectable } from '@angular/core';
import { read, utils, writeFile } from 'xlsx-js-style';


export class RapportoPresenze {
    title;
    periodo;
    headerRows;
    tableHeadersRow;
    tableRows;
    rows;
    constructor(utente, azienda, data) {
        //data = this.data;
        const title = 'Rapporto presenze';
        let start = new Date(data.inizio);
        let periodo = start.getFullYear() + '/' + (start.getMonth() + 1);

        this.headerRows = this.generateHeaderRows(title, utente, periodo, azienda);

        this.tableHeadersRow = this.generateTableHeadersRow(start);

        this.tableRows = this.generateTableRows(start);

        //fill rows************************************
        this.setOrdinari(data, this.tableRows);

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
        let tableRows = [
            [
                {
                    v: 'OR.NORM',
                    t: 's',
                    s: { font: { bold: true, color: { rgb: '000000' } } },
                },
                {
                    v: 'ORARIO NORMALE',
                    t: 's',
                    s: { font: { bold: true, color: { rgb: '000000' } } },
                },
            ],
            [
                {
                    v: 'ST.NORM',
                    t: 's',
                    s: { font: { bold: true, color: { rgb: '000000' } } },
                },
                {
                    v: 'STRAORDINARIO',
                    t: 's',
                    s: { font: { bold: true, color: { rgb: '000000' } } },
                },
            ],
            [
                {
                    v: 'ST.NOTT',
                    t: 's',
                    s: { font: { bold: true, color: { rgb: '000000' } } },
                },
                {
                    v: 'STRAORDINARIO',
                    t: 's',
                    s: { font: { bold: true, color: { rgb: '000000' } } },
                },
            ],
            [
                {
                    v: 'ST.FEST',
                    t: 's',
                    s: { font: { bold: true, color: { rgb: '000000' } } },
                },
                {
                    v: 'STRAORDINARIO',
                    t: 's',
                    s: { font: { bold: true, color: { rgb: '000000' } } },
                },
            ],
            [
                {
                    v: 'ASS.COLL',
                    t: 's',
                    s: { font: { bold: true, color: { rgb: '000000' } } },
                },
                {
                    v: 'ASSENZA',
                    t: 's',
                    s: { font: { bold: true, color: { rgb: '000000' } } },
                },
            ],
        ];

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
                v: 'Tipo',
                t: 's',
                s: { font: { bold: true, color: { rgb: '000000' } } },
            },
            {
                v: 'Descrizione',
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
        id: 3,
        dataAggiornamento: "2022-11-18T13:35:15",
        idStatoChiusura: 3,
        statoChiusura: "Vistato",
        oreMensili: "168:00",
        totaleOre: "168:00",
        totaleOreOrdinarie: "168:00",
        totaleOreReperibilita: "00:00",
        totaleOreTurni: "00:00",
        totaleOreAltro: "00:00",
        totaleOreAssenza: "10:00",
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
                dataPresenza: "2022-10-03",
                idTipoModalitaLavoro: null,
                tipoModalitaLavoro: null,
                attivita: [
                    {
                        idAttivita: 42131,
                        codiceAttivita: "2865_SCA22-XXXXXX",
                        idCommessa: 47208,
                        codiceCommessa: "2865_SCA22-XXXXXX",
                        idSottoCommessa: 47207,
                        codiceSottoCommessa: "2865_SCA22-XXXXXX",
                        items: [
                            {
                                progressivo: 1,
                                numeroMinuti: 480,
                                idTipoFatturazione: 39,
                                turni: false,
                                reperibilita: false,
                                note: null,
                                orari: []
                            }
                        ]
                    }
                ]
            },
            {
                dataPresenza: "2022-10-04",
                idTipoModalitaLavoro: null,
                tipoModalitaLavoro: null,
                attivita: [
                    {
                        idAttivita: 4460,
                        codiceAttivita: "27_15-ITE-XXX",
                        idCommessa: 2152,
                        codiceCommessa: "27_15-ITE-XXX",
                        idSottoCommessa: 27120,
                        codiceSottoCommessa: "27_15-ITE-XXX",
                        items: [
                            {
                                progressivo: 1,
                                numeroMinuti: 60,
                                idTipoFatturazione: 3,
                                turni: false,
                                reperibilita: false,
                                note: null,
                                orari: []
                            }
                        ]
                    },
                    {
                        idAttivita: 42131,
                        codiceAttivita: "2865_SCA22-XXXXXX",
                        idCommessa: 47208,
                        codiceCommessa: "2865_SCA22-XXXXXX",
                        idSottoCommessa: 47207,
                        codiceSottoCommessa: "2865_SCA22-XXXXXX",
                        items: [
                            {
                                progressivo: 1,
                                numeroMinuti: 330,
                                idTipoFatturazione: 39,
                                turni: false,
                                reperibilita: false,
                                note: null,
                                orari: []
                            }
                        ]
                    },
                    {
                        idAttivita: 42625,
                        codiceAttivita: "2903_BET22-000262",
                        idCommessa: 47973,
                        codiceCommessa: "2903_BET22-000262",
                        idSottoCommessa: 47972,
                        codiceSottoCommessa: "2903_BET22-000262",
                        items: [
                            {
                                progressivo: 1,
                                numeroMinuti: 90,
                                idTipoFatturazione: 39,
                                turni: false,
                                reperibilita: false,
                                note: null,
                                orari: []
                            }
                        ]
                    }
                ]
            },
            {
                dataPresenza: "2022-10-05",
                idTipoModalitaLavoro: null,
                tipoModalitaLavoro: null,
                attivita: [
                    {
                        idAttivita: 4460,
                        codiceAttivita: "27_15-ITE-XXX",
                        idCommessa: 2152,
                        codiceCommessa: "27_15-ITE-XXX",
                        idSottoCommessa: 27120,
                        codiceSottoCommessa: "27_15-ITE-XXX",
                        items: [
                            {
                                progressivo: 1,
                                numeroMinuti: 180,
                                idTipoFatturazione: 3,
                                turni: false,
                                reperibilita: false,
                                note: null,
                                orari: []
                            }
                        ]
                    },
                    {
                        idAttivita: 42131,
                        codiceAttivita: "2865_SCA22-XXXXXX",
                        idCommessa: 47208,
                        codiceCommessa: "2865_SCA22-XXXXXX",
                        idSottoCommessa: 47207,
                        codiceSottoCommessa: "2865_SCA22-XXXXXX",
                        items: [
                            {
                                progressivo: 1,
                                numeroMinuti: 210,
                                idTipoFatturazione: 39,
                                turni: false,
                                reperibilita: false,
                                note: null,
                                orari: []
                            }
                        ]
                    },
                    {
                        idAttivita: 42625,
                        codiceAttivita: "2903_BET22-000262",
                        idCommessa: 47973,
                        codiceCommessa: "2903_BET22-000262",
                        idSottoCommessa: 47972,
                        codiceSottoCommessa: "2903_BET22-000262",
                        items: [
                            {
                                progressivo: 1,
                                numeroMinuti: 90,
                                idTipoFatturazione: 39,
                                turni: false,
                                reperibilita: false,
                                note: null,
                                orari: []
                            }
                        ]
                    }
                ]
            },
            {
                dataPresenza: "2022-10-06",
                idTipoModalitaLavoro: null,
                tipoModalitaLavoro: null,
                attivita: [
                    {
                        idAttivita: 4460,
                        codiceAttivita: "27_15-ITE-XXX",
                        idCommessa: 2152,
                        codiceCommessa: "27_15-ITE-XXX",
                        idSottoCommessa: 27120,
                        codiceSottoCommessa: "27_15-ITE-XXX",
                        items: [
                            {
                                progressivo: 1,
                                numeroMinuti: 60,
                                idTipoFatturazione: 3,
                                turni: false,
                                reperibilita: false,
                                note: null,
                                orari: []
                            }
                        ]
                    },
                    {
                        idAttivita: 42131,
                        codiceAttivita: "2865_SCA22-XXXXXX",
                        idCommessa: 47208,
                        codiceCommessa: "2865_SCA22-XXXXXX",
                        idSottoCommessa: 47207,
                        codiceSottoCommessa: "2865_SCA22-XXXXXX",
                        items: [
                            {
                                progressivo: 1,
                                numeroMinuti: 330,
                                idTipoFatturazione: 39,
                                turni: false,
                                reperibilita: false,
                                note: null,
                                orari: []
                            }
                        ]
                    },
                    {
                        idAttivita: 42625,
                        codiceAttivita: "2903_BET22-000262",
                        idCommessa: 47973,
                        codiceCommessa: "2903_BET22-000262",
                        idSottoCommessa: 47972,
                        codiceSottoCommessa: "2903_BET22-000262",
                        items: [
                            {
                                progressivo: 1,
                                numeroMinuti: 90,
                                idTipoFatturazione: 39,
                                turni: false,
                                reperibilita: false,
                                note: null,
                                orari: []
                            }
                        ]
                    }
                ]
            },
            {
                dataPresenza: "2022-10-07",
                idTipoModalitaLavoro: null,
                tipoModalitaLavoro: null,
                attivita: [
                    {
                        idAttivita: 4460,
                        codiceAttivita: "27_15-ITE-XXX",
                        idCommessa: 2152,
                        codiceCommessa: "27_15-ITE-XXX",
                        idSottoCommessa: 27120,
                        codiceSottoCommessa: "27_15-ITE-XXX",
                        items: [
                            {
                                progressivo: 1,
                                numeroMinuti: 60,
                                idTipoFatturazione: 3,
                                turni: false,
                                reperibilita: false,
                                note: null,
                                orari: []
                            }
                        ]
                    },
                    {
                        idAttivita: 41457,
                        codiceAttivita: "2836_SCA22-XXXXXX",
                        idCommessa: 46205,
                        codiceCommessa: "2836_SCA22-XXXXXX",
                        idSottoCommessa: 46204,
                        codiceSottoCommessa: "2836_SCA22-XXXXXX",
                        items: [
                            {
                                progressivo: 1,
                                numeroMinuti: 240,
                                idTipoFatturazione: 39,
                                turni: false,
                                reperibilita: false,
                                note: null,
                                orari: []
                            }
                        ]
                    },
                    {
                        idAttivita: 42131,
                        codiceAttivita: "2865_SCA22-XXXXXX",
                        idCommessa: 47208,
                        codiceCommessa: "2865_SCA22-XXXXXX",
                        idSottoCommessa: 47207,
                        codiceSottoCommessa: "2865_SCA22-XXXXXX",
                        items: [
                            {
                                progressivo: 1,
                                numeroMinuti: 180,
                                idTipoFatturazione: 39,
                                turni: false,
                                reperibilita: false,
                                note: null,
                                orari: []
                            }
                        ]
                    }
                ]
            },
            {
                dataPresenza: "2022-10-10",
                idTipoModalitaLavoro: null,
                tipoModalitaLavoro: null,
                attivita: [
                    {
                        idAttivita: 4460,
                        codiceAttivita: "27_15-ITE-XXX",
                        idCommessa: 2152,
                        codiceCommessa: "27_15-ITE-XXX",
                        idSottoCommessa: 27120,
                        codiceSottoCommessa: "27_15-ITE-XXX",
                        items: [
                            {
                                progressivo: 1,
                                numeroMinuti: 60,
                                idTipoFatturazione: 3,
                                turni: false,
                                reperibilita: false,
                                note: null,
                                orari: []
                            }
                        ]
                    },
                    {
                        idAttivita: 42131,
                        codiceAttivita: "2865_SCA22-XXXXXX",
                        idCommessa: 47208,
                        codiceCommessa: "2865_SCA22-XXXXXX",
                        idSottoCommessa: 47207,
                        codiceSottoCommessa: "2865_SCA22-XXXXXX",
                        items: [
                            {
                                progressivo: 1,
                                numeroMinuti: 360,
                                idTipoFatturazione: 39,
                                turni: false,
                                reperibilita: false,
                                note: null,
                                orari: []
                            }
                        ]
                    },
                    {
                        idAttivita: 42625,
                        codiceAttivita: "2903_BET22-000262",
                        idCommessa: 47973,
                        codiceCommessa: "2903_BET22-000262",
                        idSottoCommessa: 47972,
                        codiceSottoCommessa: "2903_BET22-000262",
                        items: [
                            {
                                progressivo: 1,
                                numeroMinuti: 60,
                                idTipoFatturazione: 39,
                                turni: false,
                                reperibilita: false,
                                note: null,
                                orari: []
                            }
                        ]
                    }
                ]
            },
            {
                dataPresenza: "2022-10-11",
                idTipoModalitaLavoro: null,
                tipoModalitaLavoro: null,
                attivita: [
                    {
                        idAttivita: 4460,
                        codiceAttivita: "27_15-ITE-XXX",
                        idCommessa: 2152,
                        codiceCommessa: "27_15-ITE-XXX",
                        idSottoCommessa: 27120,
                        codiceSottoCommessa: "27_15-ITE-XXX",
                        items: [
                            {
                                progressivo: 1,
                                numeroMinuti: 60,
                                idTipoFatturazione: 3,
                                turni: false,
                                reperibilita: false,
                                note: null,
                                orari: []
                            }
                        ]
                    },
                    {
                        idAttivita: 41457,
                        codiceAttivita: "2836_SCA22-XXXXXX",
                        idCommessa: 46205,
                        codiceCommessa: "2836_SCA22-XXXXXX",
                        idSottoCommessa: 46204,
                        codiceSottoCommessa: "2836_SCA22-XXXXXX",
                        items: [
                            {
                                progressivo: 1,
                                numeroMinuti: 60,
                                idTipoFatturazione: 39,
                                turni: false,
                                reperibilita: false,
                                note: null,
                                orari: []
                            }
                        ]
                    },
                    {
                        idAttivita: 42131,
                        codiceAttivita: "2865_SCA22-XXXXXX",
                        idCommessa: 47208,
                        codiceCommessa: "2865_SCA22-XXXXXX",
                        idSottoCommessa: 47207,
                        codiceSottoCommessa: "2865_SCA22-XXXXXX",
                        items: [
                            {
                                progressivo: 1,
                                numeroMinuti: 360,
                                idTipoFatturazione: 39,
                                turni: false,
                                reperibilita: false,
                                note: null,
                                orari: []
                            }
                        ]
                    }
                ]
            },
            {
                dataPresenza: "2022-10-12",
                idTipoModalitaLavoro: null,
                tipoModalitaLavoro: null,
                attivita: [
                    {
                        idAttivita: 4460,
                        codiceAttivita: "27_15-ITE-XXX",
                        idCommessa: 2152,
                        codiceCommessa: "27_15-ITE-XXX",
                        idSottoCommessa: 27120,
                        codiceSottoCommessa: "27_15-ITE-XXX",
                        items: [
                            {
                                progressivo: 1,
                                numeroMinuti: 90,
                                idTipoFatturazione: 3,
                                turni: false,
                                reperibilita: false,
                                note: null,
                                orari: []
                            }
                        ]
                    },
                    {
                        idAttivita: 42131,
                        codiceAttivita: "2865_SCA22-XXXXXX",
                        idCommessa: 47208,
                        codiceCommessa: "2865_SCA22-XXXXXX",
                        idSottoCommessa: 47207,
                        codiceSottoCommessa: "2865_SCA22-XXXXXX",
                        items: [
                            {
                                progressivo: 1,
                                numeroMinuti: 330,
                                idTipoFatturazione: 39,
                                turni: false,
                                reperibilita: false,
                                note: null,
                                orari: []
                            }
                        ]
                    },
                    {
                        idAttivita: 42625,
                        codiceAttivita: "2903_BET22-000262",
                        idCommessa: 47973,
                        codiceCommessa: "2903_BET22-000262",
                        idSottoCommessa: 47972,
                        codiceSottoCommessa: "2903_BET22-000262",
                        items: [
                            {
                                progressivo: 1,
                                numeroMinuti: 60,
                                idTipoFatturazione: 39,
                                turni: false,
                                reperibilita: false,
                                note: null,
                                orari: []
                            }
                        ]
                    }
                ]
            },
            {
                dataPresenza: "2022-10-13",
                idTipoModalitaLavoro: null,
                tipoModalitaLavoro: null,
                attivita: [
                    {
                        idAttivita: 42131,
                        codiceAttivita: "2865_SCA22-XXXXXX",
                        idCommessa: 47208,
                        codiceCommessa: "2865_SCA22-XXXXXX",
                        idSottoCommessa: 47207,
                        codiceSottoCommessa: "2865_SCA22-XXXXXX",
                        items: [
                            {
                                progressivo: 1,
                                numeroMinuti: 60,
                                idTipoFatturazione: 39,
                                turni: false,
                                reperibilita: false,
                                note: null,
                                orari: []
                            }
                        ]
                    },
                    {
                        idAttivita: 4462,
                        codiceAttivita: "29_15-ITE-XXX",
                        idCommessa: 2154,
                        codiceCommessa: "29_15-ITE-XXX",
                        idSottoCommessa: 27122,
                        codiceSottoCommessa: "29_15-ITE-XXX",
                        items: [
                            {
                                progressivo: 1,
                                numeroMinuti: 360,
                                idTipoFatturazione: 3,
                                turni: false,
                                reperibilita: false,
                                note: null,
                                orari: []
                            }
                        ]
                    },
                    {
                        idAttivita: 42625,
                        codiceAttivita: "2903_BET22-000262",
                        idCommessa: 47973,
                        codiceCommessa: "2903_BET22-000262",
                        idSottoCommessa: 47972,
                        codiceSottoCommessa: "2903_BET22-000262",
                        items: [
                            {
                                progressivo: 1,
                                numeroMinuti: 60,
                                idTipoFatturazione: 39,
                                turni: false,
                                reperibilita: false,
                                note: null,
                                orari: []
                            }
                        ]
                    }
                ]
            },
            {
                dataPresenza: "2022-10-14",
                idTipoModalitaLavoro: null,
                tipoModalitaLavoro: null,
                attivita: [
                    {
                        idAttivita: 4462,
                        codiceAttivita: "29_15-ITE-XXX",
                        idCommessa: 2154,
                        codiceCommessa: "29_15-ITE-XXX",
                        idSottoCommessa: 27122,
                        codiceSottoCommessa: "29_15-ITE-XXX",
                        items: [
                            {
                                progressivo: 1,
                                numeroMinuti: 480,
                                idTipoFatturazione: 3,
                                turni: false,
                                reperibilita: false,
                                note: null,
                                orari: []
                            }
                        ]
                    }
                ]
            },
            {
                dataPresenza: "2022-10-17",
                idTipoModalitaLavoro: null,
                tipoModalitaLavoro: null,
                attivita: [
                    {
                        idAttivita: 41457,
                        codiceAttivita: "2836_SCA22-XXXXXX",
                        idCommessa: 46205,
                        codiceCommessa: "2836_SCA22-XXXXXX",
                        idSottoCommessa: 46204,
                        codiceSottoCommessa: "2836_SCA22-XXXXXX",
                        items: [
                            {
                                progressivo: 1,
                                numeroMinuti: 420,
                                idTipoFatturazione: 39,
                                turni: false,
                                reperibilita: false,
                                note: null,
                                orari: []
                            }
                        ]
                    },
                    {
                        idAttivita: 42131,
                        codiceAttivita: "2865_SCA22-XXXXXX",
                        idCommessa: 47208,
                        codiceCommessa: "2865_SCA22-XXXXXX",
                        idSottoCommessa: 47207,
                        codiceSottoCommessa: "2865_SCA22-XXXXXX",
                        items: [
                            {
                                progressivo: 1,
                                numeroMinuti: 60,
                                idTipoFatturazione: 39,
                                turni: false,
                                reperibilita: false,
                                note: null,
                                orari: []
                            }
                        ]
                    }
                ]
            },
            {
                dataPresenza: "2022-10-18",
                idTipoModalitaLavoro: null,
                tipoModalitaLavoro: null,
                attivita: [
                    {
                        idAttivita: 41457,
                        codiceAttivita: "2836_SCA22-XXXXXX",
                        idCommessa: 46205,
                        codiceCommessa: "2836_SCA22-XXXXXX",
                        idSottoCommessa: 46204,
                        codiceSottoCommessa: "2836_SCA22-XXXXXX",
                        items: [
                            {
                                progressivo: 1,
                                numeroMinuti: 240,
                                idTipoFatturazione: 39,
                                turni: false,
                                reperibilita: false,
                                note: null,
                                orari: []
                            }
                        ]
                    },
                    {
                        idAttivita: 42131,
                        codiceAttivita: "2865_SCA22-XXXXXX",
                        idCommessa: 47208,
                        codiceCommessa: "2865_SCA22-XXXXXX",
                        idSottoCommessa: 47207,
                        codiceSottoCommessa: "2865_SCA22-XXXXXX",
                        items: [
                            {
                                progressivo: 1,
                                numeroMinuti: 180,
                                idTipoFatturazione: 39,
                                turni: false,
                                reperibilita: false,
                                note: null,
                                orari: []
                            }
                        ]
                    },
                    {
                        idAttivita: 42625,
                        codiceAttivita: "2903_BET22-000262",
                        idCommessa: 47973,
                        codiceCommessa: "2903_BET22-000262",
                        idSottoCommessa: 47972,
                        codiceSottoCommessa: "2903_BET22-000262",
                        items: [
                            {
                                progressivo: 1,
                                numeroMinuti: 60,
                                idTipoFatturazione: 39,
                                turni: false,
                                reperibilita: false,
                                note: null,
                                orari: []
                            }
                        ]
                    }
                ]
            },
            {
                dataPresenza: "2022-10-19",
                idTipoModalitaLavoro: null,
                tipoModalitaLavoro: null,
                attivita: [
                    {
                        idAttivita: 4460,
                        codiceAttivita: "27_15-ITE-XXX",
                        idCommessa: 2152,
                        codiceCommessa: "27_15-ITE-XXX",
                        idSottoCommessa: 27120,
                        codiceSottoCommessa: "27_15-ITE-XXX",
                        items: [
                            {
                                progressivo: 1,
                                numeroMinuti: 150,
                                idTipoFatturazione: 3,
                                turni: false,
                                reperibilita: false,
                                note: null,
                                orari: []
                            }
                        ]
                    },
                    {
                        idAttivita: 41457,
                        codiceAttivita: "2836_SCA22-XXXXXX",
                        idCommessa: 46205,
                        codiceCommessa: "2836_SCA22-XXXXXX",
                        idSottoCommessa: 46204,
                        codiceSottoCommessa: "2836_SCA22-XXXXXX",
                        items: [
                            {
                                progressivo: 1,
                                numeroMinuti: 90,
                                idTipoFatturazione: 39,
                                turni: false,
                                reperibilita: false,
                                note: null,
                                orari: []
                            }
                        ]
                    },
                    {
                        idAttivita: 42131,
                        codiceAttivita: "2865_SCA22-XXXXXX",
                        idCommessa: 47208,
                        codiceCommessa: "2865_SCA22-XXXXXX",
                        idSottoCommessa: 47207,
                        codiceSottoCommessa: "2865_SCA22-XXXXXX",
                        items: [
                            {
                                progressivo: 1,
                                numeroMinuti: 240,
                                idTipoFatturazione: 39,
                                turni: false,
                                reperibilita: false,
                                note: null,
                                orari: []
                            }
                        ]
                    }
                ]
            },
            {
                dataPresenza: "2022-10-20",
                idTipoModalitaLavoro: null,
                tipoModalitaLavoro: null,
                attivita: [
                    {
                        idAttivita: 41457,
                        codiceAttivita: "2836_SCA22-XXXXXX",
                        idCommessa: 46205,
                        codiceCommessa: "2836_SCA22-XXXXXX",
                        idSottoCommessa: 46204,
                        codiceSottoCommessa: "2836_SCA22-XXXXXX",
                        items: [
                            {
                                progressivo: 1,
                                numeroMinuti: 180,
                                idTipoFatturazione: 39,
                                turni: false,
                                reperibilita: false,
                                note: null,
                                orari: []
                            }
                        ]
                    },
                    {
                        idAttivita: 42131,
                        codiceAttivita: "2865_SCA22-XXXXXX",
                        idCommessa: 47208,
                        codiceCommessa: "2865_SCA22-XXXXXX",
                        idSottoCommessa: 47207,
                        codiceSottoCommessa: "2865_SCA22-XXXXXX",
                        items: [
                            {
                                progressivo: 1,
                                numeroMinuti: 300,
                                idTipoFatturazione: 39,
                                turni: false,
                                reperibilita: false,
                                note: null,
                                orari: []
                            }
                        ]
                    }
                ]
            },
            {
                dataPresenza: "2022-10-21",
                idTipoModalitaLavoro: null,
                tipoModalitaLavoro: null,
                attivita: [
                    {
                        idAttivita: 42131,
                        codiceAttivita: "2865_SCA22-XXXXXX",
                        idCommessa: 47208,
                        codiceCommessa: "2865_SCA22-XXXXXX",
                        idSottoCommessa: 47207,
                        codiceSottoCommessa: "2865_SCA22-XXXXXX",
                        items: [
                            {
                                progressivo: 1,
                                numeroMinuti: 240,
                                idTipoFatturazione: 39,
                                turni: false,
                                reperibilita: false,
                                note: null,
                                orari: []
                            }
                        ]
                    },
                    {
                        idAttivita: 42625,
                        codiceAttivita: "2903_BET22-000262",
                        idCommessa: 47973,
                        codiceCommessa: "2903_BET22-000262",
                        idSottoCommessa: 47972,
                        codiceSottoCommessa: "2903_BET22-000262",
                        items: [
                            {
                                progressivo: 1,
                                numeroMinuti: 120,
                                idTipoFatturazione: 39,
                                turni: false,
                                reperibilita: false,
                                note: null,
                                orari: []
                            }
                        ]
                    },
                    {
                        idAttivita: 323,
                        codiceAttivita: "Festività",
                        idCommessa: 267,
                        codiceCommessa: "Festività",
                        idSottoCommessa: 25759,
                        codiceSottoCommessa: "Festività",
                        items: [
                            {
                                progressivo: 1,
                                numeroMinuti: 120,
                                idTipoFatturazione: 1,
                                turni: false,
                                reperibilita: false,
                                note: null,
                                orari: []
                            }
                        ]
                    }
                ]
            },
            {
                dataPresenza: "2022-10-24",
                idTipoModalitaLavoro: null,
                tipoModalitaLavoro: null,
                attivita: [
                    {
                        idAttivita: 4460,
                        codiceAttivita: "27_15-ITE-XXX",
                        idCommessa: 2152,
                        codiceCommessa: "27_15-ITE-XXX",
                        idSottoCommessa: 27120,
                        codiceSottoCommessa: "27_15-ITE-XXX",
                        items: [
                            {
                                progressivo: 1,
                                numeroMinuti: 60,
                                idTipoFatturazione: 3,
                                turni: false,
                                reperibilita: false,
                                note: null,
                                orari: []
                            }
                        ]
                    },
                    {
                        idAttivita: 42131,
                        codiceAttivita: "2865_SCA22-XXXXXX",
                        idCommessa: 47208,
                        codiceCommessa: "2865_SCA22-XXXXXX",
                        idSottoCommessa: 47207,
                        codiceSottoCommessa: "2865_SCA22-XXXXXX",
                        items: [
                            {
                                progressivo: 1,
                                numeroMinuti: 360,
                                idTipoFatturazione: 39,
                                turni: false,
                                reperibilita: false,
                                note: null,
                                orari: []
                            }
                        ]
                    },
                    {
                        idAttivita: 42625,
                        codiceAttivita: "2903_BET22-000262",
                        idCommessa: 47973,
                        codiceCommessa: "2903_BET22-000262",
                        idSottoCommessa: 47972,
                        codiceSottoCommessa: "2903_BET22-000262",
                        items: [
                            {
                                progressivo: 1,
                                numeroMinuti: 60,
                                idTipoFatturazione: 39,
                                turni: false,
                                reperibilita: false,
                                note: null,
                                orari: []
                            }
                        ]
                    }
                ]
            },
            {
                dataPresenza: "2022-10-25",
                idTipoModalitaLavoro: null,
                tipoModalitaLavoro: null,
                attivita: [
                    {
                        idAttivita: 4460,
                        codiceAttivita: "27_15-ITE-XXX",
                        idCommessa: 2152,
                        codiceCommessa: "27_15-ITE-XXX",
                        idSottoCommessa: 27120,
                        codiceSottoCommessa: "27_15-ITE-XXX",
                        items: [
                            {
                                progressivo: 1,
                                numeroMinuti: 150,
                                idTipoFatturazione: 3,
                                turni: false,
                                reperibilita: false,
                                note: null,
                                orari: []
                            }
                        ]
                    },
                    {
                        idAttivita: 42131,
                        codiceAttivita: "2865_SCA22-XXXXXX",
                        idCommessa: 47208,
                        codiceCommessa: "2865_SCA22-XXXXXX",
                        idSottoCommessa: 47207,
                        codiceSottoCommessa: "2865_SCA22-XXXXXX",
                        items: [
                            {
                                progressivo: 1,
                                numeroMinuti: 300,
                                idTipoFatturazione: 39,
                                turni: false,
                                reperibilita: false,
                                note: null,
                                orari: []
                            }
                        ]
                    },
                    {
                        idAttivita: 42625,
                        codiceAttivita: "2903_BET22-000262",
                        idCommessa: 47973,
                        codiceCommessa: "2903_BET22-000262",
                        idSottoCommessa: 47972,
                        codiceSottoCommessa: "2903_BET22-000262",
                        items: [
                            {
                                progressivo: 1,
                                numeroMinuti: 30,
                                idTipoFatturazione: 39,
                                turni: false,
                                reperibilita: false,
                                note: null,
                                orari: []
                            }
                        ]
                    }
                ]
            },
            {
                dataPresenza: "2022-10-26",
                idTipoModalitaLavoro: null,
                tipoModalitaLavoro: null,
                attivita: [
                    {
                        idAttivita: 4460,
                        codiceAttivita: "27_15-ITE-XXX",
                        idCommessa: 2152,
                        codiceCommessa: "27_15-ITE-XXX",
                        idSottoCommessa: 27120,
                        codiceSottoCommessa: "27_15-ITE-XXX",
                        items: [
                            {
                                progressivo: 1,
                                numeroMinuti: 60,
                                idTipoFatturazione: 3,
                                turni: false,
                                reperibilita: false,
                                note: null,
                                orari: []
                            }
                        ]
                    },
                    {
                        idAttivita: 42131,
                        codiceAttivita: "2865_SCA22-XXXXXX",
                        idCommessa: 47208,
                        codiceCommessa: "2865_SCA22-XXXXXX",
                        idSottoCommessa: 47207,
                        codiceSottoCommessa: "2865_SCA22-XXXXXX",
                        items: [
                            {
                                progressivo: 1,
                                numeroMinuti: 240,
                                idTipoFatturazione: 39,
                                turni: false,
                                reperibilita: false,
                                note: null,
                                orari: []
                            }
                        ]
                    },
                    {
                        idAttivita: 42625,
                        codiceAttivita: "2903_BET22-000262",
                        idCommessa: 47973,
                        codiceCommessa: "2903_BET22-000262",
                        idSottoCommessa: 47972,
                        codiceSottoCommessa: "2903_BET22-000262",
                        items: [
                            {
                                progressivo: 1,
                                numeroMinuti: 180,
                                idTipoFatturazione: 39,
                                turni: false,
                                reperibilita: false,
                                note: null,
                                orari: []
                            }
                        ]
                    }
                ]
            },
            {
                dataPresenza: "2022-10-27",
                idTipoModalitaLavoro: null,
                tipoModalitaLavoro: null,
                attivita: [
                    {
                        idAttivita: 4460,
                        codiceAttivita: "27_15-ITE-XXX",
                        idCommessa: 2152,
                        codiceCommessa: "27_15-ITE-XXX",
                        idSottoCommessa: 27120,
                        codiceSottoCommessa: "27_15-ITE-XXX",
                        items: [
                            {
                                progressivo: 1,
                                numeroMinuti: 60,
                                idTipoFatturazione: 3,
                                turni: false,
                                reperibilita: false,
                                note: null,
                                orari: []
                            }
                        ]
                    },
                    {
                        idAttivita: 42131,
                        codiceAttivita: "2865_SCA22-XXXXXX",
                        idCommessa: 47208,
                        codiceCommessa: "2865_SCA22-XXXXXX",
                        idSottoCommessa: 47207,
                        codiceSottoCommessa: "2865_SCA22-XXXXXX",
                        items: [
                            {
                                progressivo: 1,
                                numeroMinuti: 300,
                                idTipoFatturazione: 39,
                                turni: false,
                                reperibilita: false,
                                note: null,
                                orari: []
                            }
                        ]
                    },
                    {
                        idAttivita: 42625,
                        codiceAttivita: "2903_BET22-000262",
                        idCommessa: 47973,
                        codiceCommessa: "2903_BET22-000262",
                        idSottoCommessa: 47972,
                        codiceSottoCommessa: "2903_BET22-000262",
                        items: [
                            {
                                progressivo: 1,
                                numeroMinuti: 120,
                                idTipoFatturazione: 39,
                                turni: false,
                                reperibilita: false,
                                note: null,
                                orari: []
                            }
                        ]
                    }
                ]
            },
            {
                dataPresenza: "2022-10-28",
                idTipoModalitaLavoro: null,
                tipoModalitaLavoro: null,
                attivita: [
                    {
                        idAttivita: 4460,
                        codiceAttivita: "27_15-ITE-XXX",
                        idCommessa: 2152,
                        codiceCommessa: "27_15-ITE-XXX",
                        idSottoCommessa: 27120,
                        codiceSottoCommessa: "27_15-ITE-XXX",
                        items: [
                            {
                                progressivo: 1,
                                numeroMinuti: 120,
                                idTipoFatturazione: 3,
                                turni: false,
                                reperibilita: false,
                                note: null,
                                orari: []
                            }
                        ]
                    },
                    {
                        idAttivita: 42131,
                        codiceAttivita: "2865_SCA22-XXXXXX",
                        idCommessa: 47208,
                        codiceCommessa: "2865_SCA22-XXXXXX",
                        idSottoCommessa: 47207,
                        codiceSottoCommessa: "2865_SCA22-XXXXXX",
                        items: [
                            {
                                progressivo: 1,
                                numeroMinuti: 300,
                                idTipoFatturazione: 39,
                                turni: false,
                                reperibilita: false,
                                note: null,
                                orari: []
                            }
                        ]
                    },
                    {
                        idAttivita: 42625,
                        codiceAttivita: "2903_BET22-000262",
                        idCommessa: 47973,
                        codiceCommessa: "2903_BET22-000262",
                        idSottoCommessa: 47972,
                        codiceSottoCommessa: "2903_BET22-000262",
                        items: [
                            {
                                progressivo: 1,
                                numeroMinuti: 60,
                                idTipoFatturazione: 39,
                                turni: false,
                                reperibilita: false,
                                note: null,
                                orari: []
                            }
                        ]
                    }
                ]
            },
            {
                dataPresenza: "2022-10-31",
                idTipoModalitaLavoro: null,
                tipoModalitaLavoro: null,
                attivita: [
                    {
                        idAttivita: 322,
                        codiceAttivita: "Ferie",
                        idCommessa: 266,
                        codiceCommessa: "Ferie",
                        idSottoCommessa: 25758,
                        codiceSottoCommessa: "Ferie",
                        items: [
                            {
                                progressivo: 1,
                                numeroMinuti: 480,
                                idTipoFatturazione: 1,
                                turni: false,
                                reperibilita: false,
                                note: null,
                                orari: []
                            }
                        ]
                    }
                ]
            }
        ],
        presenzeGroupedByAttivita: {
            322: [
                {
                    dataPresenza: "2022-10-31",
                    idTipoModalitaLavoro: null,
                    codiceAttivita: "Ferie",
                    codiceCommessa: "Ferie",
                    codiceSottoCommessa: "Ferie",
                    idAttivita: 322,
                    idCommessa: 266,
                    idSottoCommessa: 25758,
                    numeroMinuti: 480,
                    turni: false,
                    reperibilita: false,
                    progressivo: 1
                }
            ],
            323: [
                {
                    dataPresenza: "2022-10-21",
                    idTipoModalitaLavoro: null,
                    codiceAttivita: "Festività",
                    codiceCommessa: "Festività",
                    codiceSottoCommessa: "Festività",
                    idAttivita: 323,
                    idCommessa: 267,
                    idSottoCommessa: 25759,
                    numeroMinuti: 120,
                    turni: false,
                    reperibilita: false,
                    progressivo: 1
                }
            ],
            4460: [
                {
                    dataPresenza: "2022-10-04",
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
                    dataPresenza: "2022-10-05",
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
                    dataPresenza: "2022-10-06",
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
                    dataPresenza: "2022-10-07",
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
                    dataPresenza: "2022-10-10",
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
                    dataPresenza: "2022-10-11",
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
                    dataPresenza: "2022-10-12",
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
                    dataPresenza: "2022-10-19",
                    idTipoModalitaLavoro: null,
                    codiceAttivita: "27_15-ITE-XXX",
                    codiceCommessa: "27_15-ITE-XXX",
                    codiceSottoCommessa: "27_15-ITE-XXX",
                    idAttivita: 4460,
                    idCommessa: 2152,
                    idSottoCommessa: 27120,
                    numeroMinuti: 150,
                    turni: false,
                    reperibilita: false,
                    progressivo: 1
                },
                {
                    dataPresenza: "2022-10-24",
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
                    dataPresenza: "2022-10-25",
                    idTipoModalitaLavoro: null,
                    codiceAttivita: "27_15-ITE-XXX",
                    codiceCommessa: "27_15-ITE-XXX",
                    codiceSottoCommessa: "27_15-ITE-XXX",
                    idAttivita: 4460,
                    idCommessa: 2152,
                    idSottoCommessa: 27120,
                    numeroMinuti: 150,
                    turni: false,
                    reperibilita: false,
                    progressivo: 1
                },
                {
                    dataPresenza: "2022-10-26",
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
                    dataPresenza: "2022-10-27",
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
                    dataPresenza: "2022-10-28",
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
                }
            ],
            4462: [
                {
                    dataPresenza: "2022-10-13",
                    idTipoModalitaLavoro: null,
                    codiceAttivita: "29_15-ITE-XXX",
                    codiceCommessa: "29_15-ITE-XXX",
                    codiceSottoCommessa: "29_15-ITE-XXX",
                    idAttivita: 4462,
                    idCommessa: 2154,
                    idSottoCommessa: 27122,
                    numeroMinuti: 360,
                    turni: false,
                    reperibilita: false,
                    progressivo: 1
                },
                {
                    dataPresenza: "2022-10-14",
                    idTipoModalitaLavoro: null,
                    codiceAttivita: "29_15-ITE-XXX",
                    codiceCommessa: "29_15-ITE-XXX",
                    codiceSottoCommessa: "29_15-ITE-XXX",
                    idAttivita: 4462,
                    idCommessa: 2154,
                    idSottoCommessa: 27122,
                    numeroMinuti: 480,
                    turni: false,
                    reperibilita: false,
                    progressivo: 1
                }
            ],
            41457: [
                {
                    dataPresenza: "2022-10-07",
                    idTipoModalitaLavoro: null,
                    codiceAttivita: "2836_SCA22-XXXXXX",
                    codiceCommessa: "2836_SCA22-XXXXXX",
                    codiceSottoCommessa: "2836_SCA22-XXXXXX",
                    idAttivita: 41457,
                    idCommessa: 46205,
                    idSottoCommessa: 46204,
                    numeroMinuti: 240,
                    turni: false,
                    reperibilita: false,
                    progressivo: 1
                },
                {
                    dataPresenza: "2022-10-11",
                    idTipoModalitaLavoro: null,
                    codiceAttivita: "2836_SCA22-XXXXXX",
                    codiceCommessa: "2836_SCA22-XXXXXX",
                    codiceSottoCommessa: "2836_SCA22-XXXXXX",
                    idAttivita: 41457,
                    idCommessa: 46205,
                    idSottoCommessa: 46204,
                    numeroMinuti: 60,
                    turni: false,
                    reperibilita: false,
                    progressivo: 1
                },
                {
                    dataPresenza: "2022-10-17",
                    idTipoModalitaLavoro: null,
                    codiceAttivita: "2836_SCA22-XXXXXX",
                    codiceCommessa: "2836_SCA22-XXXXXX",
                    codiceSottoCommessa: "2836_SCA22-XXXXXX",
                    idAttivita: 41457,
                    idCommessa: 46205,
                    idSottoCommessa: 46204,
                    numeroMinuti: 420,
                    turni: false,
                    reperibilita: false,
                    progressivo: 1
                },
                {
                    dataPresenza: "2022-10-18",
                    idTipoModalitaLavoro: null,
                    codiceAttivita: "2836_SCA22-XXXXXX",
                    codiceCommessa: "2836_SCA22-XXXXXX",
                    codiceSottoCommessa: "2836_SCA22-XXXXXX",
                    idAttivita: 41457,
                    idCommessa: 46205,
                    idSottoCommessa: 46204,
                    numeroMinuti: 240,
                    turni: false,
                    reperibilita: false,
                    progressivo: 1
                },
                {
                    dataPresenza: "2022-10-19",
                    idTipoModalitaLavoro: null,
                    codiceAttivita: "2836_SCA22-XXXXXX",
                    codiceCommessa: "2836_SCA22-XXXXXX",
                    codiceSottoCommessa: "2836_SCA22-XXXXXX",
                    idAttivita: 41457,
                    idCommessa: 46205,
                    idSottoCommessa: 46204,
                    numeroMinuti: 90,
                    turni: false,
                    reperibilita: false,
                    progressivo: 1
                },
                {
                    dataPresenza: "2022-10-20",
                    idTipoModalitaLavoro: null,
                    codiceAttivita: "2836_SCA22-XXXXXX",
                    codiceCommessa: "2836_SCA22-XXXXXX",
                    codiceSottoCommessa: "2836_SCA22-XXXXXX",
                    idAttivita: 41457,
                    idCommessa: 46205,
                    idSottoCommessa: 46204,
                    numeroMinuti: 180,
                    turni: false,
                    reperibilita: false,
                    progressivo: 1
                }
            ],
            42131: [
                {
                    dataPresenza: "2022-10-03",
                    idTipoModalitaLavoro: null,
                    codiceAttivita: "2865_SCA22-XXXXXX",
                    codiceCommessa: "2865_SCA22-XXXXXX",
                    codiceSottoCommessa: "2865_SCA22-XXXXXX",
                    idAttivita: 42131,
                    idCommessa: 47208,
                    idSottoCommessa: 47207,
                    numeroMinuti: 480,
                    turni: false,
                    reperibilita: false,
                    progressivo: 1
                },
                {
                    dataPresenza: "2022-10-04",
                    idTipoModalitaLavoro: null,
                    codiceAttivita: "2865_SCA22-XXXXXX",
                    codiceCommessa: "2865_SCA22-XXXXXX",
                    codiceSottoCommessa: "2865_SCA22-XXXXXX",
                    idAttivita: 42131,
                    idCommessa: 47208,
                    idSottoCommessa: 47207,
                    numeroMinuti: 330,
                    turni: false,
                    reperibilita: false,
                    progressivo: 1
                },
                {
                    dataPresenza: "2022-10-05",
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
                    dataPresenza: "2022-10-06",
                    idTipoModalitaLavoro: null,
                    codiceAttivita: "2865_SCA22-XXXXXX",
                    codiceCommessa: "2865_SCA22-XXXXXX",
                    codiceSottoCommessa: "2865_SCA22-XXXXXX",
                    idAttivita: 42131,
                    idCommessa: 47208,
                    idSottoCommessa: 47207,
                    numeroMinuti: 330,
                    turni: false,
                    reperibilita: false,
                    progressivo: 1
                },
                {
                    dataPresenza: "2022-10-07",
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
                    dataPresenza: "2022-10-10",
                    idTipoModalitaLavoro: null,
                    codiceAttivita: "2865_SCA22-XXXXXX",
                    codiceCommessa: "2865_SCA22-XXXXXX",
                    codiceSottoCommessa: "2865_SCA22-XXXXXX",
                    idAttivita: 42131,
                    idCommessa: 47208,
                    idSottoCommessa: 47207,
                    numeroMinuti: 360,
                    turni: false,
                    reperibilita: false,
                    progressivo: 1
                },
                {
                    dataPresenza: "2022-10-11",
                    idTipoModalitaLavoro: null,
                    codiceAttivita: "2865_SCA22-XXXXXX",
                    codiceCommessa: "2865_SCA22-XXXXXX",
                    codiceSottoCommessa: "2865_SCA22-XXXXXX",
                    idAttivita: 42131,
                    idCommessa: 47208,
                    idSottoCommessa: 47207,
                    numeroMinuti: 360,
                    turni: false,
                    reperibilita: false,
                    progressivo: 1
                },
                {
                    dataPresenza: "2022-10-12",
                    idTipoModalitaLavoro: null,
                    codiceAttivita: "2865_SCA22-XXXXXX",
                    codiceCommessa: "2865_SCA22-XXXXXX",
                    codiceSottoCommessa: "2865_SCA22-XXXXXX",
                    idAttivita: 42131,
                    idCommessa: 47208,
                    idSottoCommessa: 47207,
                    numeroMinuti: 330,
                    turni: false,
                    reperibilita: false,
                    progressivo: 1
                },
                {
                    dataPresenza: "2022-10-13",
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
                    progressivo: 1
                },
                {
                    dataPresenza: "2022-10-17",
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
                    progressivo: 1
                },
                {
                    dataPresenza: "2022-10-18",
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
                    dataPresenza: "2022-10-19",
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
                    dataPresenza: "2022-10-20",
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
                    dataPresenza: "2022-10-21",
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
                    dataPresenza: "2022-10-24",
                    idTipoModalitaLavoro: null,
                    codiceAttivita: "2865_SCA22-XXXXXX",
                    codiceCommessa: "2865_SCA22-XXXXXX",
                    codiceSottoCommessa: "2865_SCA22-XXXXXX",
                    idAttivita: 42131,
                    idCommessa: 47208,
                    idSottoCommessa: 47207,
                    numeroMinuti: 360,
                    turni: false,
                    reperibilita: false,
                    progressivo: 1
                },
                {
                    dataPresenza: "2022-10-25",
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
                    dataPresenza: "2022-10-26",
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
                    dataPresenza: "2022-10-27",
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
                    dataPresenza: "2022-10-28",
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
                    dataPresenza: "2022-10-04",
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
                    dataPresenza: "2022-10-05",
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
                    dataPresenza: "2022-10-06",
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
                    dataPresenza: "2022-10-10",
                    idTipoModalitaLavoro: null,
                    codiceAttivita: "2903_BET22-000262",
                    codiceCommessa: "2903_BET22-000262",
                    codiceSottoCommessa: "2903_BET22-000262",
                    idAttivita: 42625,
                    idCommessa: 47973,
                    idSottoCommessa: 47972,
                    numeroMinuti: 60,
                    turni: false,
                    reperibilita: false,
                    progressivo: 1
                },
                {
                    dataPresenza: "2022-10-12",
                    idTipoModalitaLavoro: null,
                    codiceAttivita: "2903_BET22-000262",
                    codiceCommessa: "2903_BET22-000262",
                    codiceSottoCommessa: "2903_BET22-000262",
                    idAttivita: 42625,
                    idCommessa: 47973,
                    idSottoCommessa: 47972,
                    numeroMinuti: 60,
                    turni: false,
                    reperibilita: false,
                    progressivo: 1
                },
                {
                    dataPresenza: "2022-10-13",
                    idTipoModalitaLavoro: null,
                    codiceAttivita: "2903_BET22-000262",
                    codiceCommessa: "2903_BET22-000262",
                    codiceSottoCommessa: "2903_BET22-000262",
                    idAttivita: 42625,
                    idCommessa: 47973,
                    idSottoCommessa: 47972,
                    numeroMinuti: 60,
                    turni: false,
                    reperibilita: false,
                    progressivo: 1
                },
                {
                    dataPresenza: "2022-10-18",
                    idTipoModalitaLavoro: null,
                    codiceAttivita: "2903_BET22-000262",
                    codiceCommessa: "2903_BET22-000262",
                    codiceSottoCommessa: "2903_BET22-000262",
                    idAttivita: 42625,
                    idCommessa: 47973,
                    idSottoCommessa: 47972,
                    numeroMinuti: 60,
                    turni: false,
                    reperibilita: false,
                    progressivo: 1
                },
                {
                    dataPresenza: "2022-10-21",
                    idTipoModalitaLavoro: null,
                    codiceAttivita: "2903_BET22-000262",
                    codiceCommessa: "2903_BET22-000262",
                    codiceSottoCommessa: "2903_BET22-000262",
                    idAttivita: 42625,
                    idCommessa: 47973,
                    idSottoCommessa: 47972,
                    numeroMinuti: 120,
                    turni: false,
                    reperibilita: false,
                    progressivo: 1
                },
                {
                    dataPresenza: "2022-10-24",
                    idTipoModalitaLavoro: null,
                    codiceAttivita: "2903_BET22-000262",
                    codiceCommessa: "2903_BET22-000262",
                    codiceSottoCommessa: "2903_BET22-000262",
                    idAttivita: 42625,
                    idCommessa: 47973,
                    idSottoCommessa: 47972,
                    numeroMinuti: 60,
                    turni: false,
                    reperibilita: false,
                    progressivo: 1
                },
                {
                    dataPresenza: "2022-10-25",
                    idTipoModalitaLavoro: null,
                    codiceAttivita: "2903_BET22-000262",
                    codiceCommessa: "2903_BET22-000262",
                    codiceSottoCommessa: "2903_BET22-000262",
                    idAttivita: 42625,
                    idCommessa: 47973,
                    idSottoCommessa: 47972,
                    numeroMinuti: 30,
                    turni: false,
                    reperibilita: false,
                    progressivo: 1
                },
                {
                    dataPresenza: "2022-10-26",
                    idTipoModalitaLavoro: null,
                    codiceAttivita: "2903_BET22-000262",
                    codiceCommessa: "2903_BET22-000262",
                    codiceSottoCommessa: "2903_BET22-000262",
                    idAttivita: 42625,
                    idCommessa: 47973,
                    idSottoCommessa: 47972,
                    numeroMinuti: 180,
                    turni: false,
                    reperibilita: false,
                    progressivo: 1
                },
                {
                    dataPresenza: "2022-10-27",
                    idTipoModalitaLavoro: null,
                    codiceAttivita: "2903_BET22-000262",
                    codiceCommessa: "2903_BET22-000262",
                    codiceSottoCommessa: "2903_BET22-000262",
                    idAttivita: 42625,
                    idCommessa: 47973,
                    idSottoCommessa: 47972,
                    numeroMinuti: 120,
                    turni: false,
                    reperibilita: false,
                    progressivo: 1
                },
                {
                    dataPresenza: "2022-10-28",
                    idTipoModalitaLavoro: null,
                    codiceAttivita: "2903_BET22-000262",
                    codiceCommessa: "2903_BET22-000262",
                    codiceSottoCommessa: "2903_BET22-000262",
                    idAttivita: 42625,
                    idCommessa: 47973,
                    idSottoCommessa: 47972,
                    numeroMinuti: 60,
                    turni: false,
                    reperibilita: false,
                    progressivo: 1
                }
            ]
        }
    }
}
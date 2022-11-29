/* tslint:disable */
/* eslint-disable */
import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpContext } from '@angular/common/http';
import { BaseService } from '../base-service';
import { ApiConfiguration } from '../api-configuration';
import { StrictHttpResponse } from '../strict-http-response';
import { RequestBuilder } from '../request-builder';
import { Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';

import { PresenzaInserimentoInput } from '../models/presenza-inserimento-input';

@Injectable({
  providedIn: 'root',
})
export class CommesseService extends BaseService {
  constructor(
    config: ApiConfiguration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * Path part for operation consuntivazioneCommesseGet
   */
  static readonly ConsuntivazioneCommesseGetPath = '/consuntivazione/commesse';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `consuntivazioneCommesseGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  consuntivazioneCommesseGet$Response(params?: {
    IdCommessa?: number;
    IdAttivita?: number;
    IdAzienda?: number;
    Commessa?: string;
    CodiceCommessa?: string;
    Azienda?: string;
    Inizio?: string;
    Fine?: string;
    Page?: number;
    PageSize?: number;
    Skip?: number;
    context?: HttpContext
  }
): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, CommesseService.ConsuntivazioneCommesseGetPath, 'get');
    if (params) {
      rb.query('IdCommessa', params.IdCommessa, {});
      rb.query('IdAttivita', params.IdAttivita, {});
      rb.query('IdAzienda', params.IdAzienda, {});
      rb.query('Commessa', params.Commessa, {});
      rb.query('CodiceCommessa', params.CodiceCommessa, {});
      rb.query('Azienda', params.Azienda, {});
      rb.query('Inizio', params.Inizio, {});
      rb.query('Fine', params.Fine, {});
      rb.query('Page', params.Page, {});
      rb.query('PageSize', params.PageSize, {});
      rb.query('Skip', params.Skip, {});
    }

    return this.http.request(rb.build({
      responseType: 'text',
      accept: '*/*',
      context: params?.context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return (r as HttpResponse<any>).clone({ body: undefined }) as StrictHttpResponse<void>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `consuntivazioneCommesseGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  consuntivazioneCommesseGet(params?: {
    IdCommessa?: number;
    IdAttivita?: number;
    IdAzienda?: number;
    Commessa?: string;
    CodiceCommessa?: string;
    Azienda?: string;
    Inizio?: string;
    Fine?: string;
    Page?: number;
    PageSize?: number;
    Skip?: number;
    context?: HttpContext
  }
): Observable<void> {

    return this.consuntivazioneCommesseGet$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation consuntivazioneCommessePresenzeTipiModalitaLavoroGet
   */
  static readonly ConsuntivazioneCommessePresenzeTipiModalitaLavoroGetPath = '/consuntivazione/commesse/presenze/tipi-modalita-lavoro';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `consuntivazioneCommessePresenzeTipiModalitaLavoroGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  consuntivazioneCommessePresenzeTipiModalitaLavoroGet$Response(params?: {
    context?: HttpContext
  }
): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, CommesseService.ConsuntivazioneCommessePresenzeTipiModalitaLavoroGetPath, 'get');
    if (params) {
    }

    return this.http.request(rb.build({
      responseType: 'text',
      accept: '*/*',
      context: params?.context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return (r as HttpResponse<any>).clone({ body: undefined }) as StrictHttpResponse<void>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `consuntivazioneCommessePresenzeTipiModalitaLavoroGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  consuntivazioneCommessePresenzeTipiModalitaLavoroGet(params?: {
    context?: HttpContext
  }
): Observable<void> {

    return this.consuntivazioneCommessePresenzeTipiModalitaLavoroGet$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation consuntivazioneCommesseIdCommessaPresenzeUtenteIdUtenteAnnoMeseGiornoGet
   */
  static readonly ConsuntivazioneCommesseIdCommessaPresenzeUtenteIdUtenteAnnoMeseGiornoGetPath = '/consuntivazione/commesse/{idCommessa}/presenze/utente/{idUtente}/{anno}-{mese}-{giorno}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `consuntivazioneCommesseIdCommessaPresenzeUtenteIdUtenteAnnoMeseGiornoGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  consuntivazioneCommesseIdCommessaPresenzeUtenteIdUtenteAnnoMeseGiornoGet$Response(params: {
    idCommessa: number;
    idUtente: number;
    anno: number;
    mese: number;
    giorno: number;
    context?: HttpContext
  }
): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, CommesseService.ConsuntivazioneCommesseIdCommessaPresenzeUtenteIdUtenteAnnoMeseGiornoGetPath, 'get');
    if (params) {
      rb.path('idCommessa', params.idCommessa, {});
      rb.path('idUtente', params.idUtente, {});
      rb.path('anno', params.anno, {});
      rb.path('mese', params.mese, {});
      rb.path('giorno', params.giorno, {});
    }

    return this.http.request(rb.build({
      responseType: 'text',
      accept: '*/*',
      context: params?.context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return (r as HttpResponse<any>).clone({ body: undefined }) as StrictHttpResponse<void>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `consuntivazioneCommesseIdCommessaPresenzeUtenteIdUtenteAnnoMeseGiornoGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  consuntivazioneCommesseIdCommessaPresenzeUtenteIdUtenteAnnoMeseGiornoGet(params: {
    idCommessa: number;
    idUtente: number;
    anno: number;
    mese: number;
    giorno: number;
    context?: HttpContext
  }
): Observable<void> {

    return this.consuntivazioneCommesseIdCommessaPresenzeUtenteIdUtenteAnnoMeseGiornoGet$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation consuntivazioneCommesseIdCommessaPresenzeUtenteIdUtentePost
   */
  static readonly ConsuntivazioneCommesseIdCommessaPresenzeUtenteIdUtentePostPath = '/consuntivazione/commesse/{idCommessa}/presenze/utente/{idUtente}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `consuntivazioneCommesseIdCommessaPresenzeUtenteIdUtentePost()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  consuntivazioneCommesseIdCommessaPresenzeUtenteIdUtentePost$Response(params: {
    idCommessa: number;
    idUtente: number;
    context?: HttpContext
    body?: PresenzaInserimentoInput
  }
): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, CommesseService.ConsuntivazioneCommesseIdCommessaPresenzeUtenteIdUtentePostPath, 'post');
    if (params) {
      rb.path('idCommessa', params.idCommessa, {});
      rb.path('idUtente', params.idUtente, {});
      rb.body(params.body, 'application/*+json');
    }

    return this.http.request(rb.build({
      responseType: 'text',
      accept: '*/*',
      context: params?.context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return (r as HttpResponse<any>).clone({ body: undefined }) as StrictHttpResponse<void>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `consuntivazioneCommesseIdCommessaPresenzeUtenteIdUtentePost$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  consuntivazioneCommesseIdCommessaPresenzeUtenteIdUtentePost(params: {
    idCommessa: number;
    idUtente: number;
    context?: HttpContext
    body?: PresenzaInserimentoInput
  }
): Observable<void> {

    return this.consuntivazioneCommesseIdCommessaPresenzeUtenteIdUtentePost$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation consuntivazioneCommesseIdCommessaPresenzeUtenteIdUtenteAnnoMeseGiornoOreMinutiIdAttivitaProgressivoDelete
   */
  static readonly ConsuntivazioneCommesseIdCommessaPresenzeUtenteIdUtenteAnnoMeseGiornoOreMinutiIdAttivitaProgressivoDeletePath = '/consuntivazione/commesse/{idCommessa}/presenze/utente/{idUtente}/{anno}-{mese}-{giorno}/{ore}-{minuti}/{idAttivita}/{progressivo}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `consuntivazioneCommesseIdCommessaPresenzeUtenteIdUtenteAnnoMeseGiornoOreMinutiIdAttivitaProgressivoDelete()` instead.
   *
   * This method doesn't expect any request body.
   */
  consuntivazioneCommesseIdCommessaPresenzeUtenteIdUtenteAnnoMeseGiornoOreMinutiIdAttivitaProgressivoDelete$Response(params: {
    idCommessa: number;
    idAttivita: number;
    progressivo: number;
    idUtente: number;
    anno: number;
    mese: number;
    giorno: number;
    ore: number;
    minuti: number;
    context?: HttpContext
  }
): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, CommesseService.ConsuntivazioneCommesseIdCommessaPresenzeUtenteIdUtenteAnnoMeseGiornoOreMinutiIdAttivitaProgressivoDeletePath, 'delete');
    if (params) {
      rb.path('idCommessa', params.idCommessa, {});
      rb.path('idAttivita', params.idAttivita, {});
      rb.path('progressivo', params.progressivo, {});
      rb.path('idUtente', params.idUtente, {});
      rb.path('anno', params.anno, {});
      rb.path('mese', params.mese, {});
      rb.path('giorno', params.giorno, {});
      rb.path('ore', params.ore, {});
      rb.path('minuti', params.minuti, {});
    }

    return this.http.request(rb.build({
      responseType: 'text',
      accept: '*/*',
      context: params?.context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return (r as HttpResponse<any>).clone({ body: undefined }) as StrictHttpResponse<void>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `consuntivazioneCommesseIdCommessaPresenzeUtenteIdUtenteAnnoMeseGiornoOreMinutiIdAttivitaProgressivoDelete$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  consuntivazioneCommesseIdCommessaPresenzeUtenteIdUtenteAnnoMeseGiornoOreMinutiIdAttivitaProgressivoDelete(params: {
    idCommessa: number;
    idAttivita: number;
    progressivo: number;
    idUtente: number;
    anno: number;
    mese: number;
    giorno: number;
    ore: number;
    minuti: number;
    context?: HttpContext
  }
): Observable<void> {

    return this.consuntivazioneCommesseIdCommessaPresenzeUtenteIdUtenteAnnoMeseGiornoOreMinutiIdAttivitaProgressivoDelete$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

}

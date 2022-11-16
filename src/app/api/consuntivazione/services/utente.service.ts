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

import { EnumTipiBollatura } from '../models/enum-tipi-bollatura';
import { InserimentoPresenza } from '../models/inserimento-presenza';

@Injectable({
  providedIn: 'root',
})
export class UtenteService extends BaseService {
  constructor(
    config: ApiConfiguration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * Path part for operation consuntivazioneUtenteIdUtenteAziendeGet
   */
  static readonly ConsuntivazioneUtenteIdUtenteAziendeGetPath = '/consuntivazione/utente/{idUtente}/aziende';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `consuntivazioneUtenteIdUtenteAziendeGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  consuntivazioneUtenteIdUtenteAziendeGet$Response(params: {
    idUtente: number;
    context?: HttpContext
  }
): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, UtenteService.ConsuntivazioneUtenteIdUtenteAziendeGetPath, 'get');
    if (params) {
      rb.path('idUtente', params.idUtente, {});
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
   * To access the full response (for headers, for example), `consuntivazioneUtenteIdUtenteAziendeGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  consuntivazioneUtenteIdUtenteAziendeGet(params: {
    idUtente: number;
    context?: HttpContext
  }
): Observable<void> {

    return this.consuntivazioneUtenteIdUtenteAziendeGet$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation consuntivazioneUtenteIdUtenteDatiOperativiGet
   */
  static readonly ConsuntivazioneUtenteIdUtenteDatiOperativiGetPath = '/consuntivazione/utente/{idUtente}/dati-operativi';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `consuntivazioneUtenteIdUtenteDatiOperativiGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  consuntivazioneUtenteIdUtenteDatiOperativiGet$Response(params: {
    idUtente: number;
    filtro?: string;
    aziendaAssunzione?: number;
    context?: HttpContext
  }
): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, UtenteService.ConsuntivazioneUtenteIdUtenteDatiOperativiGetPath, 'get');
    if (params) {
      rb.path('idUtente', params.idUtente, {});
      rb.query('filtro', params.filtro, {});
      rb.query('aziendaAssunzione', params.aziendaAssunzione, {});
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
   * To access the full response (for headers, for example), `consuntivazioneUtenteIdUtenteDatiOperativiGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  consuntivazioneUtenteIdUtenteDatiOperativiGet(params: {
    idUtente: number;
    filtro?: string;
    aziendaAssunzione?: number;
    context?: HttpContext
  }
): Observable<void> {

    return this.consuntivazioneUtenteIdUtenteDatiOperativiGet$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation consuntivazioneUtenteIdUtentePresenzeIdAziendaAnnoMeseGiornoGet
   */
  static readonly ConsuntivazioneUtenteIdUtentePresenzeIdAziendaAnnoMeseGiornoGetPath = '/consuntivazione/utente/{idUtente}/presenze/{idAzienda}/{anno}-{mese}-{giorno}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `consuntivazioneUtenteIdUtentePresenzeIdAziendaAnnoMeseGiornoGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  consuntivazioneUtenteIdUtentePresenzeIdAziendaAnnoMeseGiornoGet$Response(params: {
    idUtente: number;
    idAzienda: number;
    anno: number;
    mese: number;
    giorno: number;
    context?: HttpContext
  }
): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, UtenteService.ConsuntivazioneUtenteIdUtentePresenzeIdAziendaAnnoMeseGiornoGetPath, 'get');
    if (params) {
      rb.path('idUtente', params.idUtente, {});
      rb.path('idAzienda', params.idAzienda, {});
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
   * To access the full response (for headers, for example), `consuntivazioneUtenteIdUtentePresenzeIdAziendaAnnoMeseGiornoGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  consuntivazioneUtenteIdUtentePresenzeIdAziendaAnnoMeseGiornoGet(params: {
    idUtente: number;
    idAzienda: number;
    anno: number;
    mese: number;
    giorno: number;
    context?: HttpContext
  }
): Observable<void> {

    return this.consuntivazioneUtenteIdUtentePresenzeIdAziendaAnnoMeseGiornoGet$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation consuntivazioneUtenteIdUtentePresenzeAnnoMeseGiornoPost
   */
  static readonly ConsuntivazioneUtenteIdUtentePresenzeAnnoMeseGiornoPostPath = '/consuntivazione/utente/{idUtente}/presenze/{anno}-{mese}-{giorno}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `consuntivazioneUtenteIdUtentePresenzeAnnoMeseGiornoPost()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  consuntivazioneUtenteIdUtentePresenzeAnnoMeseGiornoPost$Response(params: {
    idUtente: number;
    anno: number;
    mese: number;
    giorno: number;
    context?: HttpContext
    body?: InserimentoPresenza
  }
): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, UtenteService.ConsuntivazioneUtenteIdUtentePresenzeAnnoMeseGiornoPostPath, 'post');
    if (params) {
      rb.path('idUtente', params.idUtente, {});
      rb.path('anno', params.anno, {});
      rb.path('mese', params.mese, {});
      rb.path('giorno', params.giorno, {});
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
   * To access the full response (for headers, for example), `consuntivazioneUtenteIdUtentePresenzeAnnoMeseGiornoPost$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  consuntivazioneUtenteIdUtentePresenzeAnnoMeseGiornoPost(params: {
    idUtente: number;
    anno: number;
    mese: number;
    giorno: number;
    context?: HttpContext
    body?: InserimentoPresenza
  }
): Observable<void> {

    return this.consuntivazioneUtenteIdUtentePresenzeAnnoMeseGiornoPost$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation consuntivazioneUtenteIdUtenteCommesseIdAziendaGet
   */
  static readonly ConsuntivazioneUtenteIdUtenteCommesseIdAziendaGetPath = '/consuntivazione/utente/{idUtente}/commesse/{idAzienda}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `consuntivazioneUtenteIdUtenteCommesseIdAziendaGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  consuntivazioneUtenteIdUtenteCommesseIdAziendaGet$Response(params: {
    idUtente: number;
    idAzienda: number;
    filtro?: string;
    context?: HttpContext
  }
): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, UtenteService.ConsuntivazioneUtenteIdUtenteCommesseIdAziendaGetPath, 'get');
    if (params) {
      rb.path('idUtente', params.idUtente, {});
      rb.path('idAzienda', params.idAzienda, {});
      rb.query('filtro', params.filtro, {});
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
   * To access the full response (for headers, for example), `consuntivazioneUtenteIdUtenteCommesseIdAziendaGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  consuntivazioneUtenteIdUtenteCommesseIdAziendaGet(params: {
    idUtente: number;
    idAzienda: number;
    filtro?: string;
    context?: HttpContext
  }
): Observable<void> {

    return this.consuntivazioneUtenteIdUtenteCommesseIdAziendaGet$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation consuntivazioneUtenteIdUtenteCommesseIdAziendaAnnoMeseGiornoGet
   */
  static readonly ConsuntivazioneUtenteIdUtenteCommesseIdAziendaAnnoMeseGiornoGetPath = '/consuntivazione/utente/{idUtente}/commesse/{idAzienda}/{anno}-{mese}-{giorno}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `consuntivazioneUtenteIdUtenteCommesseIdAziendaAnnoMeseGiornoGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  consuntivazioneUtenteIdUtenteCommesseIdAziendaAnnoMeseGiornoGet$Response(params: {
    idUtente: number;
    idAzienda: number;
    anno: number;
    mese: number;
    giorno: number;
    filtro?: string;
    context?: HttpContext
  }
): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, UtenteService.ConsuntivazioneUtenteIdUtenteCommesseIdAziendaAnnoMeseGiornoGetPath, 'get');
    if (params) {
      rb.path('idUtente', params.idUtente, {});
      rb.path('idAzienda', params.idAzienda, {});
      rb.path('anno', params.anno, {});
      rb.path('mese', params.mese, {});
      rb.path('giorno', params.giorno, {});
      rb.query('filtro', params.filtro, {});
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
   * To access the full response (for headers, for example), `consuntivazioneUtenteIdUtenteCommesseIdAziendaAnnoMeseGiornoGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  consuntivazioneUtenteIdUtenteCommesseIdAziendaAnnoMeseGiornoGet(params: {
    idUtente: number;
    idAzienda: number;
    anno: number;
    mese: number;
    giorno: number;
    filtro?: string;
    context?: HttpContext
  }
): Observable<void> {

    return this.consuntivazioneUtenteIdUtenteCommesseIdAziendaAnnoMeseGiornoGet$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation consuntivazioneUtenteIdUtenteBollatureAnnoMeseGiornoGet
   */
  static readonly ConsuntivazioneUtenteIdUtenteBollatureAnnoMeseGiornoGetPath = '/consuntivazione/utente/{idUtente}/bollature/{anno}-{mese}-{giorno}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `consuntivazioneUtenteIdUtenteBollatureAnnoMeseGiornoGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  consuntivazioneUtenteIdUtenteBollatureAnnoMeseGiornoGet$Response(params: {
    idUtente: number;
    anno: number;
    mese: number;
    giorno: number;
    context?: HttpContext
  }
): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, UtenteService.ConsuntivazioneUtenteIdUtenteBollatureAnnoMeseGiornoGetPath, 'get');
    if (params) {
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
   * To access the full response (for headers, for example), `consuntivazioneUtenteIdUtenteBollatureAnnoMeseGiornoGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  consuntivazioneUtenteIdUtenteBollatureAnnoMeseGiornoGet(params: {
    idUtente: number;
    anno: number;
    mese: number;
    giorno: number;
    context?: HttpContext
  }
): Observable<void> {

    return this.consuntivazioneUtenteIdUtenteBollatureAnnoMeseGiornoGet$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation consuntivazioneUtenteIdUtenteBollatureAnnoMeseGiornoOreMinutiSecondiTipoPost
   */
  static readonly ConsuntivazioneUtenteIdUtenteBollatureAnnoMeseGiornoOreMinutiSecondiTipoPostPath = '/consuntivazione/utente/{idUtente}/bollature/{anno}-{mese}-{giorno}/{ore}-{minuti}-{secondi}/{tipo}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `consuntivazioneUtenteIdUtenteBollatureAnnoMeseGiornoOreMinutiSecondiTipoPost()` instead.
   *
   * This method doesn't expect any request body.
   */
  consuntivazioneUtenteIdUtenteBollatureAnnoMeseGiornoOreMinutiSecondiTipoPost$Response(params: {
    idUtente: number;
    anno: number;
    mese: number;
    giorno: number;
    ore: number;
    minuti: number;
    secondi: number;
    tipo: EnumTipiBollatura;
    context?: HttpContext
  }
): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, UtenteService.ConsuntivazioneUtenteIdUtenteBollatureAnnoMeseGiornoOreMinutiSecondiTipoPostPath, 'post');
    if (params) {
      rb.path('idUtente', params.idUtente, {});
      rb.path('anno', params.anno, {});
      rb.path('mese', params.mese, {});
      rb.path('giorno', params.giorno, {});
      rb.path('ore', params.ore, {});
      rb.path('minuti', params.minuti, {});
      rb.path('secondi', params.secondi, {});
      rb.path('tipo', params.tipo, {});
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
   * To access the full response (for headers, for example), `consuntivazioneUtenteIdUtenteBollatureAnnoMeseGiornoOreMinutiSecondiTipoPost$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  consuntivazioneUtenteIdUtenteBollatureAnnoMeseGiornoOreMinutiSecondiTipoPost(params: {
    idUtente: number;
    anno: number;
    mese: number;
    giorno: number;
    ore: number;
    minuti: number;
    secondi: number;
    tipo: EnumTipiBollatura;
    context?: HttpContext
  }
): Observable<void> {

    return this.consuntivazioneUtenteIdUtenteBollatureAnnoMeseGiornoOreMinutiSecondiTipoPost$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation consuntivazioneUtenteIdUtenteBollatureAnnoMeseGiornoOreMinutiSecondiDelete
   */
  static readonly ConsuntivazioneUtenteIdUtenteBollatureAnnoMeseGiornoOreMinutiSecondiDeletePath = '/consuntivazione/utente/{idUtente}/bollature/{anno}-{mese}-{giorno}/{ore}-{minuti}-{secondi}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `consuntivazioneUtenteIdUtenteBollatureAnnoMeseGiornoOreMinutiSecondiDelete()` instead.
   *
   * This method doesn't expect any request body.
   */
  consuntivazioneUtenteIdUtenteBollatureAnnoMeseGiornoOreMinutiSecondiDelete$Response(params: {
    idUtente: number;
    anno: number;
    mese: number;
    giorno: number;
    ore: number;
    minuti: number;
    secondi: number;
    context?: HttpContext
  }
): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, UtenteService.ConsuntivazioneUtenteIdUtenteBollatureAnnoMeseGiornoOreMinutiSecondiDeletePath, 'delete');
    if (params) {
      rb.path('idUtente', params.idUtente, {});
      rb.path('anno', params.anno, {});
      rb.path('mese', params.mese, {});
      rb.path('giorno', params.giorno, {});
      rb.path('ore', params.ore, {});
      rb.path('minuti', params.minuti, {});
      rb.path('secondi', params.secondi, {});
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
   * To access the full response (for headers, for example), `consuntivazioneUtenteIdUtenteBollatureAnnoMeseGiornoOreMinutiSecondiDelete$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  consuntivazioneUtenteIdUtenteBollatureAnnoMeseGiornoOreMinutiSecondiDelete(params: {
    idUtente: number;
    anno: number;
    mese: number;
    giorno: number;
    ore: number;
    minuti: number;
    secondi: number;
    context?: HttpContext
  }
): Observable<void> {

    return this.consuntivazioneUtenteIdUtenteBollatureAnnoMeseGiornoOreMinutiSecondiDelete$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

}

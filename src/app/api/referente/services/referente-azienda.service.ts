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

import { EnumStatiChiusura } from '../models/enum-stati-chiusura';
import { EnumTipiUtente } from '../models/enum-tipi-utente';

@Injectable({
  providedIn: 'root',
})
export class ReferenteAziendaService extends BaseService {
  constructor(
    config: ApiConfiguration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * Path part for operation referenteIdUtenteAziendaIdAziendaConsuntivazioneAnnoMeseGet
   */
  static readonly ReferenteIdUtenteAziendaIdAziendaConsuntivazioneAnnoMeseGetPath = '/referente/{idUtente}/azienda/{idAzienda}/consuntivazione/{anno}-{mese}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `referenteIdUtenteAziendaIdAziendaConsuntivazioneAnnoMeseGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  referenteIdUtenteAziendaIdAziendaConsuntivazioneAnnoMeseGet$Response(params: {
    idUtente: number;
    idAzienda: number;
    anno: number;
    mese: number;
    context?: HttpContext
  }
): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, ReferenteAziendaService.ReferenteIdUtenteAziendaIdAziendaConsuntivazioneAnnoMeseGetPath, 'get');
    if (params) {
      rb.path('idUtente', params.idUtente, {});
      rb.path('idAzienda', params.idAzienda, {});
      rb.path('anno', params.anno, {});
      rb.path('mese', params.mese, {});
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
   * To access the full response (for headers, for example), `referenteIdUtenteAziendaIdAziendaConsuntivazioneAnnoMeseGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  referenteIdUtenteAziendaIdAziendaConsuntivazioneAnnoMeseGet(params: {
    idUtente: number;
    idAzienda: number;
    anno: number;
    mese: number;
    context?: HttpContext
  }
): Observable<void> {

    return this.referenteIdUtenteAziendaIdAziendaConsuntivazioneAnnoMeseGet$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation referenteIdUtenteAziendaIdAziendaConsuntivazioneAnnoMeseRecuperiMinutiSaldoMinutiPost
   */
  static readonly ReferenteIdUtenteAziendaIdAziendaConsuntivazioneAnnoMeseRecuperiMinutiSaldoMinutiPostPath = '/referente/{idUtente}/azienda/{idAzienda}/consuntivazione/{anno}-{mese}/recuperi/{minuti}/{saldoMinuti}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `referenteIdUtenteAziendaIdAziendaConsuntivazioneAnnoMeseRecuperiMinutiSaldoMinutiPost()` instead.
   *
   * This method doesn't expect any request body.
   */
  referenteIdUtenteAziendaIdAziendaConsuntivazioneAnnoMeseRecuperiMinutiSaldoMinutiPost$Response(params: {
    idUtente: number;
    idAzienda: number;
    anno: number;
    mese: number;
    minuti: number;
    saldoMinuti: number;
    context?: HttpContext
  }
): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, ReferenteAziendaService.ReferenteIdUtenteAziendaIdAziendaConsuntivazioneAnnoMeseRecuperiMinutiSaldoMinutiPostPath, 'post');
    if (params) {
      rb.path('idUtente', params.idUtente, {});
      rb.path('idAzienda', params.idAzienda, {});
      rb.path('anno', params.anno, {});
      rb.path('mese', params.mese, {});
      rb.path('minuti', params.minuti, {});
      rb.path('saldoMinuti', params.saldoMinuti, {});
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
   * To access the full response (for headers, for example), `referenteIdUtenteAziendaIdAziendaConsuntivazioneAnnoMeseRecuperiMinutiSaldoMinutiPost$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  referenteIdUtenteAziendaIdAziendaConsuntivazioneAnnoMeseRecuperiMinutiSaldoMinutiPost(params: {
    idUtente: number;
    idAzienda: number;
    anno: number;
    mese: number;
    minuti: number;
    saldoMinuti: number;
    context?: HttpContext
  }
): Observable<void> {

    return this.referenteIdUtenteAziendaIdAziendaConsuntivazioneAnnoMeseRecuperiMinutiSaldoMinutiPost$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation referenteIdUtenteAziendaIdAziendaConsuntivazioneAnnoMeseStatoChiusuraStatoNuovoPost
   */
  static readonly ReferenteIdUtenteAziendaIdAziendaConsuntivazioneAnnoMeseStatoChiusuraStatoNuovoPostPath = '/referente/{idUtente}/azienda/{idAzienda}/consuntivazione/{anno}-{mese}/stato-chiusura/{statoNuovo}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `referenteIdUtenteAziendaIdAziendaConsuntivazioneAnnoMeseStatoChiusuraStatoNuovoPost()` instead.
   *
   * This method doesn't expect any request body.
   */
  referenteIdUtenteAziendaIdAziendaConsuntivazioneAnnoMeseStatoChiusuraStatoNuovoPost$Response(params: {
    idUtente: number;
    idAzienda: number;
    anno: number;
    mese: number;
    statoNuovo: EnumStatiChiusura;
    context?: HttpContext
  }
): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, ReferenteAziendaService.ReferenteIdUtenteAziendaIdAziendaConsuntivazioneAnnoMeseStatoChiusuraStatoNuovoPostPath, 'post');
    if (params) {
      rb.path('idUtente', params.idUtente, {});
      rb.path('idAzienda', params.idAzienda, {});
      rb.path('anno', params.anno, {});
      rb.path('mese', params.mese, {});
      rb.path('statoNuovo', params.statoNuovo, {});
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
   * To access the full response (for headers, for example), `referenteIdUtenteAziendaIdAziendaConsuntivazioneAnnoMeseStatoChiusuraStatoNuovoPost$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  referenteIdUtenteAziendaIdAziendaConsuntivazioneAnnoMeseStatoChiusuraStatoNuovoPost(params: {
    idUtente: number;
    idAzienda: number;
    anno: number;
    mese: number;
    statoNuovo: EnumStatiChiusura;
    context?: HttpContext
  }
): Observable<void> {

    return this.referenteIdUtenteAziendaIdAziendaConsuntivazioneAnnoMeseStatoChiusuraStatoNuovoPost$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation referenteIdUtenteAziendaIdAziendaAnnoMeseStatoUtentiGet
   */
  static readonly ReferenteIdUtenteAziendaIdAziendaAnnoMeseStatoUtentiGetPath = '/referente/{idUtente}/azienda/{idAzienda}/{anno}-{mese}/stato-utenti';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `referenteIdUtenteAziendaIdAziendaAnnoMeseStatoUtentiGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  referenteIdUtenteAziendaIdAziendaAnnoMeseStatoUtentiGet$Response(params: {
    idUtente: number;
    idAzienda: number;
    anno: number;
    mese: number;
    Stato?: EnumStatiChiusura;
    Tipo?: EnumTipiUtente;
    Straordinari?: boolean;
    Trasferte?: boolean;
    Recuperi?: boolean;
    AziendaPreferita?: boolean;
    Nome?: string;
    Page?: number;
    PageSize?: number;
    Skip?: number;
    context?: HttpContext
  }
): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, ReferenteAziendaService.ReferenteIdUtenteAziendaIdAziendaAnnoMeseStatoUtentiGetPath, 'get');
    if (params) {
      rb.path('idUtente', params.idUtente, {});
      rb.path('idAzienda', params.idAzienda, {});
      rb.path('anno', params.anno, {});
      rb.path('mese', params.mese, {});
      rb.query('Stato', params.Stato, {});
      rb.query('Tipo', params.Tipo, {});
      rb.query('Straordinari', params.Straordinari, {});
      rb.query('Trasferte', params.Trasferte, {});
      rb.query('Recuperi', params.Recuperi, {});
      rb.query('AziendaPreferita', params.AziendaPreferita, {});
      rb.query('Nome', params.Nome, {});
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
   * To access the full response (for headers, for example), `referenteIdUtenteAziendaIdAziendaAnnoMeseStatoUtentiGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  referenteIdUtenteAziendaIdAziendaAnnoMeseStatoUtentiGet(params: {
    idUtente: number;
    idAzienda: number;
    anno: number;
    mese: number;
    Stato?: EnumStatiChiusura;
    Tipo?: EnumTipiUtente;
    Straordinari?: boolean;
    Trasferte?: boolean;
    Recuperi?: boolean;
    AziendaPreferita?: boolean;
    Nome?: string;
    Page?: number;
    PageSize?: number;
    Skip?: number;
    context?: HttpContext
  }
): Observable<void> {

    return this.referenteIdUtenteAziendaIdAziendaAnnoMeseStatoUtentiGet$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

}

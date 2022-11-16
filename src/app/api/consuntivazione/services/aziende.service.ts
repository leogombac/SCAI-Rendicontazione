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

import { InserisciTrasfertaInput } from '../models/inserisci-trasferta-input';

@Injectable({
  providedIn: 'root',
})
export class AziendeService extends BaseService {
  constructor(
    config: ApiConfiguration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * Path part for operation consuntivazioneAziendeGet
   */
  static readonly ConsuntivazioneAziendeGetPath = '/consuntivazione/aziende';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `consuntivazioneAziendeGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  consuntivazioneAziendeGet$Response(params?: {
    context?: HttpContext
  }
): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, AziendeService.ConsuntivazioneAziendeGetPath, 'get');
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
   * To access the full response (for headers, for example), `consuntivazioneAziendeGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  consuntivazioneAziendeGet(params?: {
    context?: HttpContext
  }
): Observable<void> {

    return this.consuntivazioneAziendeGet$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation consuntivazioneAziendeIdAziendaGet
   */
  static readonly ConsuntivazioneAziendeIdAziendaGetPath = '/consuntivazione/aziende/{idAzienda}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `consuntivazioneAziendeIdAziendaGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  consuntivazioneAziendeIdAziendaGet$Response(params: {
    idAzienda: number;
    context?: HttpContext
  }
): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, AziendeService.ConsuntivazioneAziendeIdAziendaGetPath, 'get');
    if (params) {
      rb.path('idAzienda', params.idAzienda, {});
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
   * To access the full response (for headers, for example), `consuntivazioneAziendeIdAziendaGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  consuntivazioneAziendeIdAziendaGet(params: {
    idAzienda: number;
    context?: HttpContext
  }
): Observable<void> {

    return this.consuntivazioneAziendeIdAziendaGet$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation consuntivazioneAziendeIdAziendaUtenteIdUtenteFestivitaGet
   */
  static readonly ConsuntivazioneAziendeIdAziendaUtenteIdUtenteFestivitaGetPath = '/consuntivazione/aziende/{idAzienda}/utente/{idUtente}/festivita';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `consuntivazioneAziendeIdAziendaUtenteIdUtenteFestivitaGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  consuntivazioneAziendeIdAziendaUtenteIdUtenteFestivitaGet$Response(params: {
    idAzienda: number;
    idUtente: number;
    context?: HttpContext
  }
): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, AziendeService.ConsuntivazioneAziendeIdAziendaUtenteIdUtenteFestivitaGetPath, 'get');
    if (params) {
      rb.path('idAzienda', params.idAzienda, {});
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
   * To access the full response (for headers, for example), `consuntivazioneAziendeIdAziendaUtenteIdUtenteFestivitaGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  consuntivazioneAziendeIdAziendaUtenteIdUtenteFestivitaGet(params: {
    idAzienda: number;
    idUtente: number;
    context?: HttpContext
  }
): Observable<void> {

    return this.consuntivazioneAziendeIdAziendaUtenteIdUtenteFestivitaGet$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation consuntivazioneAziendeIdAziendaUtenteIdUtenteTrasferteGet
   */
  static readonly ConsuntivazioneAziendeIdAziendaUtenteIdUtenteTrasferteGetPath = '/consuntivazione/aziende/{idAzienda}/utente/{idUtente}/trasferte';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `consuntivazioneAziendeIdAziendaUtenteIdUtenteTrasferteGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  consuntivazioneAziendeIdAziendaUtenteIdUtenteTrasferteGet$Response(params: {
    idAzienda: number;
    idUtente: number;
    idAttivita?: number;
    context?: HttpContext
  }
): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, AziendeService.ConsuntivazioneAziendeIdAziendaUtenteIdUtenteTrasferteGetPath, 'get');
    if (params) {
      rb.path('idAzienda', params.idAzienda, {});
      rb.path('idUtente', params.idUtente, {});
      rb.query('idAttivita', params.idAttivita, {});
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
   * To access the full response (for headers, for example), `consuntivazioneAziendeIdAziendaUtenteIdUtenteTrasferteGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  consuntivazioneAziendeIdAziendaUtenteIdUtenteTrasferteGet(params: {
    idAzienda: number;
    idUtente: number;
    idAttivita?: number;
    context?: HttpContext
  }
): Observable<void> {

    return this.consuntivazioneAziendeIdAziendaUtenteIdUtenteTrasferteGet$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation consuntivazioneAziendeIdAziendaUtenteIdUtenteTrasfertePost
   */
  static readonly ConsuntivazioneAziendeIdAziendaUtenteIdUtenteTrasfertePostPath = '/consuntivazione/aziende/{idAzienda}/utente/{idUtente}/trasferte';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `consuntivazioneAziendeIdAziendaUtenteIdUtenteTrasfertePost()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  consuntivazioneAziendeIdAziendaUtenteIdUtenteTrasfertePost$Response(params: {
    idAzienda: number;
    idUtente: number;
    context?: HttpContext
    body?: InserisciTrasfertaInput
  }
): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, AziendeService.ConsuntivazioneAziendeIdAziendaUtenteIdUtenteTrasfertePostPath, 'post');
    if (params) {
      rb.path('idAzienda', params.idAzienda, {});
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
   * To access the full response (for headers, for example), `consuntivazioneAziendeIdAziendaUtenteIdUtenteTrasfertePost$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  consuntivazioneAziendeIdAziendaUtenteIdUtenteTrasfertePost(params: {
    idAzienda: number;
    idUtente: number;
    context?: HttpContext
    body?: InserisciTrasfertaInput
  }
): Observable<void> {

    return this.consuntivazioneAziendeIdAziendaUtenteIdUtenteTrasfertePost$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

}

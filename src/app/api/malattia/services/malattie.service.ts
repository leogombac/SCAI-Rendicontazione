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


@Injectable({
  providedIn: 'root',
})
export class MalattieService extends BaseService {
  constructor(
    config: ApiConfiguration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * Path part for operation malattieTipologieGet
   */
  static readonly MalattieTipologieGetPath = '/malattie/tipologie';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `malattieTipologieGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  malattieTipologieGet$Response(params?: {
    context?: HttpContext
  }
): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, MalattieService.MalattieTipologieGetPath, 'get');
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
   * To access the full response (for headers, for example), `malattieTipologieGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  malattieTipologieGet(params?: {
    context?: HttpContext
  }
): Observable<void> {

    return this.malattieTipologieGet$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

  /**
   * Path part for operation malattieGet
   */
  static readonly MalattieGetPath = '/malattie';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `malattieGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  malattieGet$Response(params?: {
    IdMalattia?: number;
    IdUtente?: number;
    IdTipologia?: number;
    IdAzienda?: number;
    Nome?: string;
    Azienda?: string;
    CodiceCertificato?: string;
    Tipologia?: string;
    Inizio?: string;
    Fine?: string;
    Page?: number;
    PageSize?: number;
    Skip?: number;
    context?: HttpContext
  }
): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, MalattieService.MalattieGetPath, 'get');
    if (params) {
      rb.query('IdMalattia', params.IdMalattia, {});
      rb.query('IdUtente', params.IdUtente, {});
      rb.query('IdTipologia', params.IdTipologia, {});
      rb.query('IdAzienda', params.IdAzienda, {});
      rb.query('Nome', params.Nome, {});
      rb.query('Azienda', params.Azienda, {});
      rb.query('CodiceCertificato', params.CodiceCertificato, {});
      rb.query('Tipologia', params.Tipologia, {});
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
   * To access the full response (for headers, for example), `malattieGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  malattieGet(params?: {
    IdMalattia?: number;
    IdUtente?: number;
    IdTipologia?: number;
    IdAzienda?: number;
    Nome?: string;
    Azienda?: string;
    CodiceCertificato?: string;
    Tipologia?: string;
    Inizio?: string;
    Fine?: string;
    Page?: number;
    PageSize?: number;
    Skip?: number;
    context?: HttpContext
  }
): Observable<void> {

    return this.malattieGet$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

}

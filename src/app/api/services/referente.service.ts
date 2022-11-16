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
export class ReferenteService extends BaseService {
  constructor(
    config: ApiConfiguration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * Path part for operation consuntivazioneReferenteIdReferenteAziendaIdAziendaUtentiGet
   */
  static readonly ConsuntivazioneReferenteIdReferenteAziendaIdAziendaUtentiGetPath = '/consuntivazione/referente/{idReferente}/azienda/{idAzienda}/utenti';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `consuntivazioneReferenteIdReferenteAziendaIdAziendaUtentiGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  consuntivazioneReferenteIdReferenteAziendaIdAziendaUtentiGet$Response(params: {
    idReferente: number;
    idAzienda: number;
    filtro?: string;
    context?: HttpContext
  }
): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, ReferenteService.ConsuntivazioneReferenteIdReferenteAziendaIdAziendaUtentiGetPath, 'get');
    if (params) {
      rb.path('idReferente', params.idReferente, {});
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
   * To access the full response (for headers, for example), `consuntivazioneReferenteIdReferenteAziendaIdAziendaUtentiGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  consuntivazioneReferenteIdReferenteAziendaIdAziendaUtentiGet(params: {
    idReferente: number;
    idAzienda: number;
    filtro?: string;
    context?: HttpContext
  }
): Observable<void> {

    return this.consuntivazioneReferenteIdReferenteAziendaIdAziendaUtentiGet$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

}

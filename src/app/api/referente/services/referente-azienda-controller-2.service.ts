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

@Injectable({
  providedIn: 'root',
})
export class ReferenteAziendaController2Service extends BaseService {
  constructor(
    config: ApiConfiguration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * Path part for operation referenteAziendaIdAziendaConsuntivazioneAnnoMeseStatoChiusuraStatoNuovoPost
   */
  static readonly ReferenteAziendaIdAziendaConsuntivazioneAnnoMeseStatoChiusuraStatoNuovoPostPath = '/referente/azienda/{idAzienda}/consuntivazione/{anno}-{mese}/stato-chiusura/{statoNuovo}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `referenteAziendaIdAziendaConsuntivazioneAnnoMeseStatoChiusuraStatoNuovoPost()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  referenteAziendaIdAziendaConsuntivazioneAnnoMeseStatoChiusuraStatoNuovoPost$Response(params: {
    idAzienda: number;
    anno: number;
    mese: number;
    statoNuovo: EnumStatiChiusura;
    context?: HttpContext
    body?: Array<number>
  }
): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, ReferenteAziendaController2Service.ReferenteAziendaIdAziendaConsuntivazioneAnnoMeseStatoChiusuraStatoNuovoPostPath, 'post');
    if (params) {
      rb.path('idAzienda', params.idAzienda, {});
      rb.path('anno', params.anno, {});
      rb.path('mese', params.mese, {});
      rb.path('statoNuovo', params.statoNuovo, {});
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
   * To access the full response (for headers, for example), `referenteAziendaIdAziendaConsuntivazioneAnnoMeseStatoChiusuraStatoNuovoPost$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  referenteAziendaIdAziendaConsuntivazioneAnnoMeseStatoChiusuraStatoNuovoPost(params: {
    idAzienda: number;
    anno: number;
    mese: number;
    statoNuovo: EnumStatiChiusura;
    context?: HttpContext
    body?: Array<number>
  }
): Observable<void> {

    return this.referenteAziendaIdAziendaConsuntivazioneAnnoMeseStatoChiusuraStatoNuovoPost$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

}

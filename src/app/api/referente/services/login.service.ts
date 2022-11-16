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

import { LoginRequest } from '../models/login-request';
import { LoginResponse } from '../models/login-response';

@Injectable({
  providedIn: 'root',
})
export class LoginService extends BaseService {
  constructor(
    config: ApiConfiguration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * Path part for operation referenteLoginPost
   */
  static readonly ReferenteLoginPostPath = '/referente/login';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `referenteLoginPost$Plain()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  referenteLoginPost$Plain$Response(params?: {
    context?: HttpContext
    body?: LoginRequest
  }
): Observable<StrictHttpResponse<LoginResponse>> {

    const rb = new RequestBuilder(this.rootUrl, LoginService.ReferenteLoginPostPath, 'post');
    if (params) {
      rb.body(params.body, 'application/*+json');
    }

    return this.http.request(rb.build({
      responseType: 'text',
      accept: 'text/plain',
      context: params?.context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<LoginResponse>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `referenteLoginPost$Plain$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  referenteLoginPost$Plain(params?: {
    context?: HttpContext
    body?: LoginRequest
  }
): Observable<LoginResponse> {

    return this.referenteLoginPost$Plain$Response(params).pipe(
      map((r: StrictHttpResponse<LoginResponse>) => r.body as LoginResponse)
    );
  }

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `referenteLoginPost$Json()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  referenteLoginPost$Json$Response(params?: {
    context?: HttpContext
    body?: LoginRequest
  }
): Observable<StrictHttpResponse<LoginResponse>> {

    const rb = new RequestBuilder(this.rootUrl, LoginService.ReferenteLoginPostPath, 'post');
    if (params) {
      rb.body(params.body, 'application/*+json');
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'text/json',
      context: params?.context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<LoginResponse>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `referenteLoginPost$Json$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  referenteLoginPost$Json(params?: {
    context?: HttpContext
    body?: LoginRequest
  }
): Observable<LoginResponse> {

    return this.referenteLoginPost$Json$Response(params).pipe(
      map((r: StrictHttpResponse<LoginResponse>) => r.body as LoginResponse)
    );
  }

}

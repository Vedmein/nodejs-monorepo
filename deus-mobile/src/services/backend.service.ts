import { Injectable } from '@angular/core'
import { Headers, RequestOptionsArgs, Response, Http } from "@angular/http";
import { Observable } from 'rxjs/Rx';

@Injectable()
export class BackendService {
  private _rootUrl: string = 'http://dev.alice.digital/api-mock/master';
  private _jsonRequestOpts: RequestOptionsArgs = {
    headers: (() => {
      let h = new Headers();
      h.append('Content-Type', 'application/json');
      h.append('Accept', 'application/json');
      return h;
    })()
  };

  private _sid: string = null;
  constructor(private _http: Http) { }

  // Returns sid in case of successful authentification
  public auth(username: string, password: string): Observable<string> {
    let authPayload: string = JSON.stringify({ login: username, password: password });
    return this._http.post(this._rootUrl + '/auth', authPayload, this._jsonRequestOpts)
      .map((response: Response) => {
        if (response && response.json() && response.json()['sid']) {
          let sid: string = response.json()['sid'];
          console.log(`Successful login, get sid=${sid}`);
          return sid
        }
        return null;
      });
  }

  public setSid(sid: string) { this._sid = sid; }

  // Returns if access to area is allowed for currently logged user
  public access(areaName: string): Observable<boolean> {
    let accessPayload = JSON.stringify({ area_name: areaName, sid: this._sid });
    return this._http.post(this._rootUrl + '/access', accessPayload, this._jsonRequestOpts)
      .map((response: Response) => {
        return (response && response.json() && response.json()['granted'])
      });
  }

  // Returns "UI state", i.e. information to generate app pages
  public submitEvents(events: Array<any>): Observable<any> {
    let submitPayload = JSON.stringify({ events: events, sid: this._sid });    
    return this._http.post(this._rootUrl + '/submit', submitPayload, this._jsonRequestOpts)
      .map((response: Response) => {
        // TODO: get optional "config"" update?
        return response.json()['pages'];
      });
  } 
}
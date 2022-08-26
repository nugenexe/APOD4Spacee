import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of, Subscription } from 'rxjs';
import { APOD, NASAAPOD } from './apod';
import config from '../../config.json' assert {type: 'json'}

@Injectable({
  providedIn: 'root'
})
export class APODService {

  constructor(private http: HttpClient) { }

  getAPOD(date: string): Observable<APOD> {
    // TODO "caching" by implementing database save and check before making call

    let url = `${config.apodAPIDomain}?api_key=${config.apodAPIKey}&date=${date}`;
    return this.http.get<NASAAPOD>(url)
      .pipe(
        map((resp: NASAAPOD) => {
          let apod: APOD = {
            copyright: resp.copyright,
            date: resp.date,
            explanation: resp.explanation,
            mediaType: resp.media_type,
            url: resp.url
          };

          return apod;
        }),
        catchError(val => of({
          date: date
        } as APOD))
      )
  }
}

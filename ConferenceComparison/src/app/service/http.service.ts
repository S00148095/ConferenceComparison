import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class HttpService {
  APIURL: string = "https://conferencecomparison.firebaseio.com/";
  constructor(private http: HttpClient) { }

  public getTeamGames(competition,team): Observable<any>{    
    return this.http.get(this.APIURL + competition + "/Clubs/" + team + ".json");
  }
}

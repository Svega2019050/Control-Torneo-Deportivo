import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RestUserService } from '../restUser/rest-user.service';
import { CONNECTION } from '../globa.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RestTorneoService {
  public uri;
  public token;
  public user;

  constructor(private http:HttpClient, private restUser:RestUserService) { 
    this.uri = CONNECTION.URI;
  }

  private extractData(res:Response){
    let body = res;
    return body || [] || {}
  }
  public httpOptionsAuth = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.getToken()
    })
  }

  getToken(){
    let token = localStorage.getItem('token');
    if(token != undefined || token != null){
      this.token = token;
    }else{
      this.token = null
    }
    return this.token;
  }

  saveTorneo(idUser, torneo){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.restUser.getToken()
    })
    let params = JSON.stringify(torneo);
    return this.http.put(this.uri+idUser+'/saveTorne', params,{headers:headers} )
    .pipe(map(this.extractData))
  }

  updateTorneo(idUser, torneo){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.restUser.getToken()
    })
    let params = JSON.stringify(torneo)
    return this.http.put(this.uri+idUser+'/updateTorneo/'+torneo._id,params, {headers:headers})
    .pipe(map(this.extractData))
  }

  removeTorneo(idUser, idTorne){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.restUser.getToken()
    })
    return this.http.put(this.uri+idUser+'/removeTorneo/'+idTorne._id, null,{headers:headers})
    .pipe(map(this.extractData))
  }

  getTorneo(){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.restUser.getToken()
    })
    return this.http.get(this.uri+'getTorneos', {headers:headers})
    .pipe(map(this.extractData))
  }

}

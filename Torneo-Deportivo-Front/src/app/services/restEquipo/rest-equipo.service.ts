import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CONNECTION } from '../globa.service';
import { map } from 'rxjs/operators';
import { RestTorneoService } from '../restTorneo/rest-torneo.service';
import { RestUserService } from '../restUser/rest-user.service';

@Injectable({
  providedIn: 'root'
})
export class RestEquipoService {
  public uri;
  public token;
  public user;

 private extractData(res:Response){
    let body = res;
    return body || [] || {}
  }

  constructor(private http:HttpClient, private restTorneo: RestTorneoService, private restUser:RestUserService ) { 
    this.uri = CONNECTION.URI;
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

  saveEquipo(idUser, equipo, torneo){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.restTorneo.getToken()
    })
    let params = JSON.stringify(equipo);
    let torneoParams = JSON.parse(torneo);
    return this.http.put(this.uri+torneoParams._id+'/equipoSave/'+idUser, params, {headers:headers})
    .pipe(map(this.extractData))
  }

  removeEquipo(idUser, torneo,equipo){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.restTorneo.getToken()
    })
    return this.http.put(this.uri+idUser+ '/equipoEliminar/'+ torneo._id + '/' + equipo._id , null,{headers:headers})
    .pipe(map(this.extractData))
  }

  updateEquipo(idUser, equipo,torneo){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.restTorneo.getToken()
    })
    let params = JSON.stringify(equipo);

    return this.http.put(this.uri+ idUser +  '/equipoEliminar/'+ torneo._id + '/'+ equipo._id, params,{headers:headers})
    .pipe(map(this.extractData))
  }

  getEquipo(){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.restTorneo.getToken()
    })
    return this.http.get(this.uri+'getEquipo', {headers:headers})
    .pipe(map(this.extractData))
  }
}

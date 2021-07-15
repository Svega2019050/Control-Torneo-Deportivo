import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CONNECTION } from '../globa.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RestJugadorService {

  public uri;
  public token;
  public user;

  constructor(private http:HttpClient) {
  this.uri = CONNECTION.URI;
 }

 private extractData(res:Response){
   let body = res;
   return body || [] || {};
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

 saveJugador(idEquipo, jugador, userId){
   let headers = new HttpHeaders({
     'Content-Type': 'application/json',
     'Authorization': this.getToken()
    })
    let params = JSON.stringify(jugador);
    return this.http.put(this.uri+idEquipo+'/jugadorSave/'+userId, params, {headers: headers}).pipe(map(this.extractData))
 }

 updateJugador(userid, idEquipo, jugador, idJugador){
   let headers = new HttpHeaders({
     'Content-Type': 'application/json',
     'Authorization': this.getToken()
   })
   let params = JSON.stringify(jugador);
   return this.http.put(`${this.uri}${userid}/${idEquipo}/jugadorUpdate/${idJugador}`, params, {headers:headers}).pipe(map(this.extractData))
 }

 removeJugador(userid, equipoId, idJugador){
   let headers = new HttpHeaders({
     'Content-Type': 'application/json',
     'Authorization': this.getToken()
    })
    return this.http.put(`${this.uri}${userid}/${equipoId}/jugadorEliminar/${idJugador}`, null, {headers: headers}).pipe(map(this.extractData))
 }

}

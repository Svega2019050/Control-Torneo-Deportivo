import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CONNECTION } from 'src/app/services/globa.service';
import { RestUserService } from '../../services/restUser/rest-user.service';
import {RestTorneoService} from '../../services/restTorneo/rest-torneo.service';
import { RestEquipoService } from 'src/app/services/restEquipo/rest-equipo.service';
import { Equipo } from 'src/app/models/equipo';

@Component({
  selector: 'app-home-equipo',
  templateUrl: './home-equipo.component.html',
  styleUrls: ['./home-equipo.component.css']
})
export class HomeEquipoComponent implements OnInit {
  public filesToUpload:Array<File>;
  EquipoSelected: Equipo;
  equipos:[];
  equipo;
  token;
  torneo;
  user;
  uri;

  constructor(private router: Router, private restUser:RestUserService,
    private restTorneo:RestTorneoService, private restEquipo:RestEquipoService) { 
      this.EquipoSelected = new Equipo('','','','',[]);
  }

  ngOnInit(): void {
    this.EquipoSelected = new Equipo('','','','',[]);
    this.torneo = JSON.parse(localStorage.getItem('selectedTorneo'));
    this.uri = CONNECTION.URI;
    localStorage.removeItem('selectedEquipo');
    this.listEquipo(); 
  }

  ngDoCheck(){
    this.token = this.restUser.getToken();
    this.user = this.restUser.getUser();

  }
  
  obtenerData(equipo){
    this.EquipoSelected = equipo;
    console.log(this.EquipoSelected)
  }

  onSubmit(form){
    let torneo = localStorage.getItem('selectedTorneo');
    this.restEquipo.saveEquipo(this.user._id, this.EquipoSelected, torneo).subscribe((res:any)=>{
      if(res.equipoPush){
        alert(res.message)
        form.reset();
        delete res.equipoPush.password;
        this.torneo = res.equipoPush;
        localStorage.setItem('torneo', JSON.stringify(this.torneo))
        this.listEquipo();
      }else{
        alert(res.message)
        this.listEquipo();
      }
    },
    error=> alert(error.error.message))
  }

  listEquipo(){
    this.restEquipo.getEquipo().subscribe((res:any)=>{
      if(res.equipos){
        this.equipos = res.equipos;
        console.log(this.equipos)
      }else{
        
      }
    },
    error=> alert(error.error.message));
  }
  
  removeEquipo(){
    this.restEquipo.removeEquipo(this.user._id, this.torneo, this.EquipoSelected).subscribe((res:any)=>{
      if (res.equipoPull) {
        alert(res.message)
        this.torneo = res.equipoPush;
        localStorage.setItem('torneo', JSON.stringify(res.equipoPush))
        this.torneo = this.restTorneo.getTorneo();
        this.equipos = this.torneo.equipos;

      } else {
        alert(res.message)
      }
      this.listEquipo();
    })
    error => alert(error.error.message) 
    console.log(this.EquipoSelected)
  }

  updateEquipo(){
    this.restEquipo.updateEquipo(this.user._id, this.torneo, this.EquipoSelected).subscribe((res:any)=>{
      if (res.message) {
        alert(res.message);
        localStorage.setItem('torneo', JSON.stringify(this.torneo))
       
      } else {
        alert(res.message);    
        this.user = this.restUser.getUser();
        this.torneo = this.user.torneo;  
        location.reload()
      }
    })
    error =>alert(error.error.message)
  }

  saveEquipoJugador(equipo){
    localStorage.setItem('selectedEquipo',JSON.stringify(equipo));
    
    console.log("equipo", equipo);
    // para ingresar torneo en el local storage
  }
}

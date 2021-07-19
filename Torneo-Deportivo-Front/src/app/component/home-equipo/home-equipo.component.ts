import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CONNECTION } from 'src/app/services/globa.service';
import { RestUserService } from '../../services/restUser/rest-user.service';
import {RestTorneoService} from '../../services/restTorneo/rest-torneo.service';
import { RestEquipoService } from 'src/app/services/restEquipo/rest-equipo.service';
import { Equipo } from 'src/app/models/equipo';
import { Marcador } from 'src/app/models/marcador.model';

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
  MarcadorSelected: Marcador;
  marcadors:[];
  marcador;
  public opcionesEquipo = ['nel'];

  token;
  torneo;
 
  user;
  uri;

  

  constructor(private router: Router, private restUser:RestUserService,
    private restTorneo:RestTorneoService, private restEquipo:RestEquipoService) { 
      this.EquipoSelected = new Equipo('','','','',[]);
      this.MarcadorSelected = new Marcador('','','','',[],[]);
  }

  ngOnInit(): void {
    this.MarcadorSelected = new Marcador('','','','',[],[]);
    this.EquipoSelected = new Equipo('','','','',[]);
    this.torneo = JSON.parse(localStorage.getItem('selectedTorneo'));
    this.user = JSON.parse(localStorage.getItem('user'));
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
  obtenerData2(marcador){
    this.MarcadorSelected = marcador;
  }

  onSubmit(form){
    let torneo = localStorage.getItem('selectedTorneo');
    this.restEquipo.saveEquipo(this.user._id, this.EquipoSelected, torneo).subscribe((res:any)=>{
      if(res.equipoPush){
        alert(res.message)
        form.reset();
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


  onSubmit2(form){
    let torneo = localStorage.getItem('selectedTorneo');
    this.restEquipo.saveMarcador(this.user._id, this.MarcadorSelected, torneo).subscribe((res:any)=>{
      if(res.MarcadorPush){
        alert(res.message)
        form.reset();
        this.torneo = res.MarcadorPush;
        localStorage.setItem('torneo', JSON.stringify(this.torneo))
        this.listEquipo();
      }else{
        alert(res.message)
        this.listEquipo();
      }
    },
    error=> alert(error.error.message))
  }

  listMarcador(){
    this.restEquipo.getMarcador().subscribe((res:any)=>{
      if(res.marcadors){
        this.marcador = res.marcadors;
        console.log(this.marcadors)
      }else{
        console.log(this.marcadors)
      }
    },
    error=> alert(error.error.message));
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
        
      }
      this.listEquipo();
    })
    error => alert(error.error.message) 
    console.log(this.EquipoSelected)
  }

  updateEquipo(){
    let torneo = localStorage.getItem('selectedTorneo');
    this.restEquipo.updateEquipo(this.user._id, this.EquipoSelected, torneo).subscribe((res:any)=>{
      if (res.message) {

        alert(res.message);

        this.torneo = res.message;

        localStorage.setItem('torneo', JSON.stringify(res.message))
        location.reload()

        
      } else {
        console.log(this.EquipoSelected)
        location.reload()
      }
    })
    error =>alert(error.error.message)
    console.log(this.torneo)
  }

  saveEquipoJugador(equipo){
    localStorage.setItem('selectedEquipo',JSON.stringify(equipo));
    
    console.log("equipo", equipo);
    // para ingresar torneo en el local storage
  }

  saveMarcador(marcador){
    localStorage.setItem('selectedMarcador',JSON.stringify(this.marcador));
    
    console.log("equipo", marcador);
    // para ingresar torneo en el local storage
  }

  listEquiposTorneo(){
    this.restTorneo.getTorneoId(this.user._id, this.torneo).subscribe((res:any)=>{
      if(res.getTorneoId){
        localStorage.setItem('torneo',JSON.stringify(this.torneo));
        this.torneo = res.getTorneoId;
      }
    })
  }
}
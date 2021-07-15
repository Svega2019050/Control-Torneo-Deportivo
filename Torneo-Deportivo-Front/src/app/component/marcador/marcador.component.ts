import { Component, OnInit } from '@angular/core';
import { Marcador } from 'src/app/models/marcador.model';
import { Router } from '@angular/router';
import { CONNECTION } from 'src/app/services/globa.service';
import { RestUserService } from '../../services/restUser/rest-user.service';
import {RestTorneoService} from '../../services/restTorneo/rest-torneo.service';
import { RestEquipoService } from 'src/app/services/restEquipo/rest-equipo.service';
import { Equipo } from 'src/app/models/equipo';
@Component({
  selector: 'app-marcador',
  templateUrl: './marcador.component.html',
  styleUrls: ['./marcador.component.css']
})
export class MarcadorComponent implements OnInit {
  MarcadorSelected: Marcador;
  marcadors:[];
  equipos: [];
  marcador;
  public opcionesEquipo = ({nameEquipo: Equipo});
  EquipoSelected: Equipo;
  token;
  torneo;
  user;
  uri;

  constructor(private router: Router, private restUser:RestUserService,
    private restTorneo:RestTorneoService, private restEquipo:RestEquipoService) { 
      this.MarcadorSelected = new Marcador('','','','',[],[]);
      this.EquipoSelected = new Equipo('','','','',[]);
  }

  ngOnInit(): void {
    this.MarcadorSelected = new Marcador('','','','',[],[]);
    this.torneo = JSON.parse(localStorage.getItem('selectedTorneo'));
    this.uri = CONNECTION.URI;
  }

  ngDoCheck(){
    this.token = this.restUser.getToken();
    this.user = this.restUser.getUser();
  }

  obtenerData(marcador,equipo){
    this.MarcadorSelected = marcador;
    this.EquipoSelected = equipo;
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
  onSubmit(form){
    let torneo = localStorage.getItem('selectedTorneo');
    this.restEquipo.saveMarcador(this.user._id, this.MarcadorSelected, torneo).subscribe((res:any)=>{
      if(res.TorneoPush){
        alert(res.message)
        form.reset();;
        this.torneo = res.TorneoPush;
        localStorage.setItem('torneo', JSON.stringify(this.torneo))
      }else{
        alert(res.message)
      }
    },
    error=> alert(error.error.message))
  }

}

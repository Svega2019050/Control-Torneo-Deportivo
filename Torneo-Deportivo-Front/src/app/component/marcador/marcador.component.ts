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
  marcador;
  public opcionesEquipo = [];
  public data: any;

  token;
  torneo;
  user;
  uri;

  constructor(private router: Router, private restUser:RestUserService,
    private restTorneo:RestTorneoService, private restEquipo:RestEquipoService) { 
      this.MarcadorSelected = new Marcador('','','','',[],[]);
      this.data = [
        { Value: 37, Label: "Cooling", Summary: "Cooling 37%" },
        { Value: 25, Label: "Residential", Summary: "Residential 25%" },
        { Value: 12, Label: "Heating", Summary: "Heating 12%" },
        { Value: 11, Label: "Lighting", Summary: "Lighting 11%" },
        { Value: 18, Label: "Other", Summary: "Other 18%" }
    ];
     
  }

  ngOnInit(): void {
    this.MarcadorSelected = new Marcador('','','','',[],[]);
    this.torneo = JSON.parse(localStorage.getItem('selectedTorneo'));
    this.uri = CONNECTION.URI;
    this.listMarcador(); 
  }

  ngDoCheck(){
    this.token = this.restUser.getToken();
    this.user = this.restUser.getUser();
  }

  obtenerData(marcador){
    this.MarcadorSelected = marcador;
  }

  listMarcador(){
    this.restEquipo.getMarcador().subscribe((res:any)=>{
      if(res.marcadors){
        this.marcadors = res.marcadors;
        console.log(this.marcadors)
      }else{
        console.log(this.marcadors)
      }
    },
    error=> alert(error.error.message));
  }

  onSubmit(form){
    let torneo = localStorage.getItem('selectedTorneo');
    this.restEquipo.saveMarcador(this.user._id, this.MarcadorSelected, torneo).subscribe((res:any)=>{
      if(res.TorneoPush){
        alert(res.message)
        
        this.torneo = res.TorneoPush;
        localStorage.setItem('torneo', JSON.stringify(this.torneo))
      }else{
        alert(res.message)
      }
    },
    error=> alert(error.error.message))
  }


  
}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CONNECTION } from 'src/app/services/globa.service';
import { RestUserService } from '../../services/restUser/rest-user.service';
import { Torneo } from '../../models/torneo';
import {RestTorneoService} from '../../services/restTorneo/rest-torneo.service';

@Component({
  selector: 'app-torneo',
  templateUrl: './torneo.component.html',
  styleUrls: ['./torneo.component.css']
})
export class TorneoComponent implements OnInit {
  torneos:[];
  public TorneoSelected: Torneo;
  public filesToUpload:Array<File>;
  token: String;
  user;


  constructor(private router: Router, private restUser:RestUserService,
    private restTorneo:RestTorneoService) { 
  }

  ngOnInit(): void {
    this.TorneoSelected = new Torneo('','','',[],[]);
    this.user = this.restUser.getUser();
    this.torneos = this.user.torneos;
    this.listTorneo();
  }

  ngDoCheck(){
    this.token = this.restUser.getToken();
    this.user = this.restUser.getUser();
  }

  obtenerData(torneo){
    this.TorneoSelected = torneo;
  }

  listTorneo(){
    this.restTorneo.getTorneo().subscribe((res:any)=>{
      if(res.torneos){
        this.torneos = res.torneos;
        console.log(this.torneos)
      }else{
        
      }
    },
    error=> alert(error.error.message));
  }

}

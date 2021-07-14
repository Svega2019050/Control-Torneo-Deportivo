import { Component, OnInit ,DoCheck} from '@angular/core';
import { Router } from '@angular/router';
import { CONNECTION } from 'src/app/services/globa.service';
import { RestUserService } from '../../services/restUser/rest-user.service';
import { Torneo } from '../../models/torneo';
import {RestTorneoService} from '../../services/restTorneo/rest-torneo.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, DoCheck {
  
  torneo: Torneo;
  public filesToUpload:Array<File>;
  token: String;
  user;
  uri;

  constructor(private router: Router, private restUser:RestUserService,
    private restTorneo:RestTorneoService) { 
    this.torneo = new Torneo('','','',[],[]);
  }

  ngOnInit(): void {
    this.token = localStorage.getItem('token');
    this.user = JSON.parse(localStorage.getItem('user'));
    this.uri = CONNECTION.URI;
  }
  ngDoCheck(){
    this.token = this.restUser.getToken();
    this.user = this.restUser.getUser();
  }
  
  onSubmit(form){
    this.restTorneo.saveTorneo(this.user._id, this.torneo).subscribe((res:any)=>{
      if(res.TorneoPush){
        alert(res.message)
        form.reset();
        delete res.TorneoPush.password;
        this.user = res.TorneoPush;
        localStorage.setItem('user', JSON.stringify(this.user));
        location.reload()
      }else{
        alert(res.message)
        location.reload()
      }
    },
    error=> alert(error.error.message))
  }

 
}

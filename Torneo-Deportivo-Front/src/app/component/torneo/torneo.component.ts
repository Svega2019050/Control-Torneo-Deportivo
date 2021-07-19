import { Component, OnInit ,DoCheck} from '@angular/core';
import { CONNECTION } from 'src/app/services/globa.service';
import { RestUserService } from '../../services/restUser/rest-user.service';
import { UploadTorneoService } from '../../services/uploadTorneo/upload-torneo.service';
import { Torneo } from '../../models/torneo';
import {RestTorneoService} from '../../services/restTorneo/rest-torneo.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-torneo',
  templateUrl: './torneo.component.html',
  styleUrls: ['./torneo.component.css']
})
export class TorneoComponent implements OnInit,DoCheck {
  torneos:[];
  public TorneoSelected: Torneo;
  torneo;
  torneo2: Torneo;
  message;
  public filesToUpload:Array<File>;
  token;
  user;
  uri;

  constructor(private restUser:RestUserService,
    private restTorneo:RestTorneoService, private uploadTorneo: UploadTorneoService) { 
      this.torneo2 = new Torneo('','','',[],[]);
  }

  ngOnInit(): void {
    this.TorneoSelected = new Torneo('','','',[],[]);
    localStorage.removeItem('selectedTorneo');
    this.uri = CONNECTION.URI;
    this.listTorneo();
    
  }
  

  ngDoCheck(){
    this.token = this.restUser.getToken();
    this.user = this.restUser.getUser();
  }


  obtenerData(torneo){
    this.TorneoSelected = torneo;
    console.log(this.TorneoSelected)
  }

  listTorneo(){
    this.restTorneo.getTorneo().subscribe((res:any)=>{
      if(res.torneos){
        this.torneos = res.torneos;
      }else{
        
      }
    },
    error => alert(error.error.message));
  }
  
  saveTorneo(){
    this.restTorneo.saveTorneo(this.user._id,this.TorneoSelected).subscribe((res:any)=>{
      if(res.torneoPush){
        localStorage.setItem('user',JSON.stringify(this.user))
        this.user = res.torneoPush
        Swal.fire({       
          icon: 'success',
          title: 'Torneo Guardado Correctamente',
          showConfirmButton: false,
          timer: 1500,         
        });  
      }
      this.listTorneo();
    },error =>{
      if (error.status == 401) {
        Swal.fire({
          icon: 'error',
          title: 'Lo sentimos...',
          text: 'Nombre de Torneo ya en uso'        
        })
      }
    })
  }

  updateTorneo(){
    this.restTorneo.updateTorneo(this.user._id, this.TorneoSelected).subscribe((res:any)=>{
      if (res.message) {
        localStorage.setItem('user',JSON.stringify(this.user));
        Swal.fire({       
          icon: 'success',
          title: 'Torneo Actualizado Correctamente',
          showConfirmButton: false,
          timer: 1500,         
        });  
      } 
     
    },
    error => {
      if (error.status == 401) {
        Swal.fire({
          icon: 'error',
          title: 'Lo sentimos...',
          text: 'Nombre de Torneo ya en uso'        
        })
      }
    })
    this.listTorneo();
  }
  
  removeTorneo(){
    this.restTorneo.removeTorneo(this.user._id, this.TorneoSelected).subscribe((res:any)=>{
      if (res.torneoPull) {
          alert(res.message)
          localStorage.setItem('user',JSON.stringify(res.torneoPull));
          this.user = this.restUser.getUser();
          this.torneos = this.user.torneos;
      } else {
        Swal.fire({       
          icon: 'success',
          title: 'Torneo Eliminado Correctamente',
          showConfirmButton: false,
          timer: 1500,         
        });  
      }
      this.listTorneo();
    },
    error => alert(error.error.message))
    
  }

  
  uploadImageTorneo(){
    this.uploadTorneo.fileRequest(this.user._id, this.torneo, [], this.filesToUpload, this.token, 'image')
      .then((res:any)=>{
        if(res.user){
          this.user.image = res.userImage;
          localStorage.setItem('user', JSON.stringify(this.user));

        }else{
          alert(res.message);
          
        }
      })
  }


  fileChange(fileInput){
    this.filesToUpload = <Array<File>>fileInput.target.files;
    console.log(this.filesToUpload)
  }

  saveTorneoEquipo(torneo){
    localStorage.setItem('selectedTorneo',JSON.stringify(torneo));
    
    console.log("torneo", torneo);
    // para ingresar torneo en el local storage
  }

}

import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user';
import { RestUserService } from '../../services/restUser/rest-user.service';
import { Router } from '@angular/router';
import { UploadUserService } from '../../services/uploadUser/upload-user.service';
import { CONNECTION } from '../../services/globa.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent implements OnInit {
  public user:User;
  public token;
  public possiblePass;
  public filesToUpload:Array<File>;
  public uri:string;
  userLogged;

  constructor(private restUser:RestUserService, 
              private router: Router,
              private uploadUser: UploadUserService) { 
    this.possiblePass = '';
    this.user = this.restUser.getUser();
    this.token = this.restUser.getToken();
    this.uri = CONNECTION.URI;
    
  }

  ngOnInit(): void {
  }
  
  onSubmit(){
    delete this.user.password;
    this.restUser.updateUser(this.user).subscribe((res:any)=>{
      if(res.userUpdated){
        
        location.reload()
        alert(res.message);
        localStorage.setItem('user', JSON.stringify(res.userUpdated));

      }else{     
        localStorage.setItem('user', JSON.stringify(this.user));
        this.user = this.restUser.getUser();    
        Swal.fire({       
          icon: 'success',
          title: 'Usuario Actualizado Correctamente',
          showConfirmButton: false,
          timer: 1500
        })   

      }
    },
    error=> alert(error.error.message))
  }


  deleteUser(){
    this.restUser.deleteUser(this.user._id, this.possiblePass).subscribe((res:any)=>{
      if(!res.userRemoved){
        alert(res.message)
      }else{
        alert(res.message)
        localStorage.clear();
        this.router.navigateByUrl('home');
      }
    },
    error => alert(error.error.message))
  }

  uploadImage(){
    this.uploadUser.fileRequest(this.user._id, [], this.filesToUpload, this.token, 'image')
      .then((res:any)=>{
        if(res.user){
          this.user.image = res.userImage;
          localStorage.setItem('user', JSON.stringify(this.user));
        }else{
          alert(res.message)
        }
      })
  }

  fileChange(fileInput){
    this.filesToUpload = <Array<File>>fileInput.target.files;
    console.log(this.filesToUpload)
  }



}

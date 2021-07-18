import { Component, OnInit } from '@angular/core';
import { CONNECTION } from 'src/app/services/globa.service';
import { RestUserService } from '../../services/restUser/rest-user.service';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user';
import Swal from 'sweetalert2';
import { of } from 'rxjs';
@Component({
  selector: 'app-list-user',
  templateUrl: './list-user.component.html',
  styleUrls: ['./list-user.component.css']
})
export class ListUserComponent implements OnInit {
  users:[];
  public optionsRole = ['ROLE_ADMIN', 'ROLE_USER'];
  public possiblePass;
  public userSelected: User;
  search;
  message;
  token: String;
  user;
  uri;

  constructor(private restUser:RestUserService, private router: Router) {
    this.possiblePass = '';
    this.user = this.restUser.getUser();
    this.token = this.restUser.getToken();
    this.uri = CONNECTION.URI;
    this.userSelected = new User('','','','','','','','','',[]);
    this.possiblePass = '';
   }

  ngOnInit(): void {
    this.userSelected = new User('','','','','','','','','',[]);
    this.token = localStorage.getItem('token');
    this.user = JSON.parse(localStorage.getItem('user'));
    this.uri = CONNECTION.URI;
    this.listUsers();
  }

  ngDoCheck(){
    this.token = this.restUser.getToken();
    this.user = this.restUser.getUser();
  }

  listUsers(){
    this.restUser.getUsers().subscribe((res:any)=>{
      if(res.users){
        this.users = res.users;
        console.log(this.users)
      }else{
        alert(res.message)
      }
    },
    error=> alert(error.error.message));
    console.log(this.users)
  }

  obtenerData(user){
    this.userSelected = user;
    if(this.userSelected.role == 'ROLE_ADMIN'){
      Swal.fire({
        icon: 'error',
        title: 'Lo sentimos...',
        text: 'No puedes Eliminar o Actualizar Un usuario Administrador'        
      })
      this.listUsers();
    }
  }

 deleteUser(){
    this.restUser.deleteUserAdmin(this.user._id, this.userSelected, this.possiblePass ).subscribe((res:any)=>{
      if (res.userDelete) {   
        localStorage.setItem('user',JSON.stringify(res.userDelete));
        this.user = this.restUser.getUser();

      }else{
        Swal.fire({       
          icon: 'success',
          title: 'Usuario Eliminado Correctamente',
          showConfirmButton: false,
          timer: 1500
        })
        
      }
      this.listUsers();
    }, 
    error =>{
      Swal.fire({
        icon: 'error',
        title: 'Lo Sentimos...',
        text: 'Contraseña Incorrecta!'
      })
    });
   
    
  }

  updateUserAdmin(){
    this.restUser.updateUserAdmin(this.user._id, this.userSelected).subscribe((res:any)=>{     
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
    })
    error => alert(error.error.message);
    
  }
  


}

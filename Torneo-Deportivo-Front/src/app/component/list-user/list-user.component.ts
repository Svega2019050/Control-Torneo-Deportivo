import { Component, OnInit } from '@angular/core';
import { CONNECTION } from 'src/app/services/globa.service';
import { RestUserService } from '../../services/restUser/rest-user.service';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user';

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
    console.log(this.userSelected)
  }

 deleteUser(){
    this.restUser.deleteUserAdmin(this.user._id, this.userSelected).subscribe((res:any)=>{
      if (res.userDelete) {        
        localStorage.setItem('user',JSON.stringify(res.userDelete));
        this.user = this.restUser.getUser();
      } else {
        alert(res.message)
      }
      this.listUsers();
    })
    error => alert(error.error.message);
    
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
          location.reload()        
          alert(res.message);
        }
    })
    error => alert(error.error.message);
    
  }
  


}

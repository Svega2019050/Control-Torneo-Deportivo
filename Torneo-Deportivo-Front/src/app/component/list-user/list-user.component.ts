import { Component, OnInit } from '@angular/core';
import { CONNECTION } from 'src/app/services/globa.service';
import { RestUserService } from '../../services/restUser/rest-user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-user',
  templateUrl: './list-user.component.html',
  styleUrls: ['./list-user.component.css']
})
export class ListUserComponent implements OnInit {
  users:[];
  public possiblePass;
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
   }

  ngOnInit(): void {
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

}

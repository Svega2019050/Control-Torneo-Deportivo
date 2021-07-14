import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CONNECTION } from 'src/app/services/globa.service';
import { RestUserService } from 'src/app/services/restUser/rest-user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  token: String;
  user;
  uri;

  constructor(private router: Router, private restUser:RestUserService) { }

  ngOnInit(): void {
    this.token = localStorage.getItem('token');
    this.user = JSON.parse(localStorage.getItem('user'));
    this.uri = CONNECTION.URI;
  }
  ngDoCheck(){
    this.token = this.restUser.getToken();
    this.user = this.restUser.getUser();
  }

  deleteData(){
    localStorage.removeItem('username');
   // localStorage.clear();
  }

  logOut(){
    localStorage.clear();
    this.router.navigateByUrl('home');
  }
}

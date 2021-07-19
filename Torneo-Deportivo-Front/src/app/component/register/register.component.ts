import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user';
import { RestUserService } from '../../services/restUser/rest-user.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  public user:User;
  message;
  username:string;

  constructor(private restUser:RestUserService) {
    this.user = new User('', '', '', '', '', '', '', '', 'ROLE_USER', []);
   }

  ngOnInit(): void {
  }

  onSubmit(register){
    this.restUser.saveUser(this.user).subscribe((res:any)=>{
      this.message = res.message;
      if(res.userSaved){
        Swal.fire({       
          icon: 'success',
          title: 'Usuario Guardado Correctamente',
          showConfirmButton: false,
          timer: 1500
        })
        register.reset();
      }else{
        Swal.fire({
          icon: 'error',
          title: 'Lo Sentimos...',
          text: 'Este Usuario ya existe!'
        })
      }
    })
  }

}

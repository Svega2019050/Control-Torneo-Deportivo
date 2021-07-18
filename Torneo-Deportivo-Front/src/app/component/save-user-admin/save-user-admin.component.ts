import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user';
import { RestUserService } from '../../services/restUser/rest-user.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-save-user-admin',
  templateUrl: './save-user-admin.component.html',
  styleUrls: ['./save-user-admin.component.css']
})
export class SaveUserAdminComponent implements OnInit {
  public optionsRole = ['ROLE_ADMIN', 'ROLE_USER'];
  public user:User;
  message;
  public userLogg;
  public token;

  constructor(private restUser:RestUserService) {
    this.user = new User('','','','','','','','','', []);
    this.token = this.restUser.getToken();
    this.userLogg = this.restUser.getUser();
   }

  ngOnInit(): void {
  }

  onSubmit(statusForm){
    this.restUser.saverUserByAdmin(this.user, this.userLogg._id).subscribe((res:any)=>{
      if(res.userSaved){
        this.user = new User('','','','','','','','','', []);
        statusForm.reset();
        Swal.fire({       
          icon: 'success',
          title: 'Usuario Guardado Correctamente',
          showConfirmButton: false,
          timer: 1500
        })
      }else{
        Swal.fire({
          icon: 'error',
          title: 'Lo sentimos...',
          text: 'Nombre de Usuaio Ya en Uso'
        })
      }
    },
    error=> alert(error.error.message))
  }

}

import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user';
import { RestUserService } from '../../services/restUser/rest-user.service';

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
        alert(res.message);
        this.user = new User('','','','','','','','','', []);
        statusForm.reset();
      }else{
        alert(res.message)
      }
    },
    error=> alert(error.error.message))
  }

}

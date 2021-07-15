import { Component, OnInit } from '@angular/core';
import { Jugador } from '../../models/jugador';
import { RestJugadorService } from '../../services/restJugador/rest-jugador.service';
import { Router } from '@angular/router'

@Component({
  selector: 'app-jugador',
  templateUrl: './jugador.component.html',
  styleUrls: ['./jugador.component.css']
})
export class JugadorComponent implements OnInit {

  public jugador:Jugador;

  constructor(private restJugador:RestJugadorService, private router:Router) {
    this.jugador = new Jugador("","",0);
  }

  ngOnInit(): void {
  }

  onSubmit(marcador){
    let equipo = JSON.parse(localStorage.getItem('equipo'))
    let user = JSON.parse(localStorage.getItem('user'))
    this.restJugador.saveJugador(equipo._id, this.jugador, user._id).subscribe((res:any) => {
      if(res){
        alert("Jugador creado");
        this.router.navigateByUrl('home-equipo')
      }
    })
  }

}

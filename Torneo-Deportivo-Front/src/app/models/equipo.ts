export class Equipo{
    constructor(
        public _id: string,
        public nameEquipo: String,
        public stockJugadores: String,
        public imageEquipo: String,
        public jugador:[]
    ){}
}
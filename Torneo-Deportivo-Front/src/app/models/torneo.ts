export class Torneo{
    constructor(
        public _id: string,
        public name: String,
        public imageTorneo: String,
        public equipo:[],
        public marcador:[]
    ){}
}
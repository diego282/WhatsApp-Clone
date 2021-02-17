import { ClassEvent } from "./ClassEvent.js";

export class Model extends ClassEvent {

    constructor() {
        super(); // aqui e para não ter conflito entre os construtores
        this._data = {}; // variavel de dados, vazia
    }

    fromJSON(json) {

        this._data = Object.assign(this._data, json); // aqui mesclar os dados, e oq tem conflito matem o mais novo

        this.trigger('datachange', this._data); // aqui avisa a quem quiser ouvir essa mudança, enviando os dados

    }

    toJSON() {

        return this._data;

    }

}
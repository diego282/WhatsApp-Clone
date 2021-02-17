export class ClassEvent {

    constructor() {

        this._events = {}; // objeto que sera usado para criar todos os eventos utilizados aq
    }

    on(eventName, fn) { // pegar o nome e a função

        if (!this._events[eventName]) // ver se o evento ja esta dentro do objeto

            this._events[eventName] = new Array(); // ser nao tiver nada tranforma em um array
        this._events[eventName].push(fn); // adiciona a função ao array
    }

    trigger() { // gatilho para avisar

        // arguments: e uma 'funçao' nativa para falar que aquilo e obrigatorio
        let args = [...arguments]; // converte o arguments para um array
        let eventName = args.shift(); // remove o primeiro elemento de um array, que e sempre o nome e passa para a varivel

        args.push(new Event(eventName));

        if (this._events[eventName] instanceof Array) { // ver ser e um array

            this._events[eventName].forEach(fn => { // percorre o array

                fn.apply(null, args); // executa um codigo que vc colocou no array, passando null e dps os argumentos
            });
        }
    }
}
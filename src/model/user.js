// import { Firebase } from './../util/firebase.js';
// import { ClassEvent } from './../util/ClassEvent.js';



// export class User extends ClassEvent {

//     constructor(key) {

//         super();

//         this.key = key;

//         this.getByKey();

//     }

//     getByKey() {

//         return new Promise((s, f) => {

//             User.getRef().doc(this.key).onSnapshot(doc => {

//                 this.doc = doc;

//                 this.fromJSON(doc.data());

//                 s(doc);

//             });

//         });

//     }


//     static getRef() { // pega a referencia

//         return Firebase.db().collection('/users'); // oega a coleção de usuario
//     }

//     static findByEmail(email) { // encontrar por e-mail

//         return User.getRef().doc(email); // pegar a coleção users e dps um documento, com id email
//     }
// }

import { Model } from './../util/Model.js'
import { Firebase } from './../util/firebase.js'

export class User extends Model {

    get name() { return this._data.name; }
    set name(value) { this._data.name = value; }

    get email() { return this._data.email; }
    set email(value) { this._data.email = value; }

    get photo() { return this._data.photo; }
    set photo(value) { this._data.photo = value; }

    get chatId() { return this._data.chatId; }
    set chatId(value) { this._data.chatId = value; }

    static getRef() { // pega a referencia

        return Firebase.db().collection('/users'); // pega a coleção de usuario
    }

    constructor(key) {

        super(); // aqui e para não ter conflito entre os construtores

        this.key = key;

        this.getByKey();

    }

    getByKey() {

        return new Promise((s, f) => {

            User.getRef().doc(this.key).onSnapshot(doc => { // pega em tempo real os dados do firebase

                this.doc = doc;

                this.fromJSON(doc.data());

                s(doc);

            });

        });

    }

    save() { // sava no banco de dados

        return User.getRef().doc(this.key).set(this.toJSON()); // pega a refencia do documento passado e seta(salva) os dados passado

    }

    addContact(contact) { // adiciona contantos

        return User.getRef().doc(this.email).collection('contacts').doc(btoa(contact.email)).set(contact.toJSON()); // pega a refencia do documento passado, a coleção do contantos o documento dessa coleção e seta(salva) os dados passado

    }

    getContacts(filter = '') { // busca contantos

        return new Promise((s, f) => {

            User.getRef().doc(this.key).collection('contacts').where('name', '>=', filter).onSnapshot(docs => { // pega a coleção de contantos e fica monitorando ela

                let contacts = []; //arrar para armazenar os contatos

                docs.forEach(doc => { // percorre os documentos

                    let data = doc.data(); // pega a data
                    data._key = doc.key; // pega a chabe
                    contacts.push(data); // e adiciona no array

                });

                s(docs); // aqui ser de certo

                this.trigger('contactschange', contacts); // avisa a todos que tiverem ouvido, passa os contacts

            });

        });

    }

}
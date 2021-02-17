import { Model } from './../util/Model.js'
import { Firebase } from './../util/firebase.js'

export class Chat extends Model {

    get users() { return this._data.users; } // retorna os usuarios
    set users(value) { this._data.users = value; }

    constructor() {

        super(); // chama o contrutor do pi, no caso do Model

    }

    static create(meEmail, contactEmail) { // aqui criar o chat novo

        return new Promise((s, f) => {

            let users = {}; // variavel para fazer essa criação

            users[btoa(meEmail)] = true; // passa o seu emaiç em base64
            users[btoa(contactEmail)] = true; // passa o email do contato em base64

            Chat.getRef().add({ // aqui adiciona em chat os dados
                users, // os email passados em bsae64, anteriomente
                timeStamp: new Date() // aqui a data e hora que o chat foi criado
            }).then(doc => {

                Chat.getRef().doc(doc.id).get().then(chat => { // pegar o id desse doc

                    s(chat); // ser de certo volta o chat(id)

                }).catch(err => { f(err) }); //aqui mostra mensagem de erro

            }).catch(err => { f(err) }); //aqui mostra mensagem de erro

        });

    }

    static getRef() { // pega a referencia
        return Firebase.db().collection('chats'); // pega a referencia dos chats no firebase
    }

    static find(meEmail, contactEmail) { // procura ser tem conversa entre os 2 email passado
        return Chat.getRef().where(`users.${btoa(meEmail)}`, '==', true).where(`users.${btoa(contactEmail)}`, '==', true).get(); // aqui vai no firebase,chats e ver qual chat tem esse 2 emial em base64 e retorna
    }

    static createIfNotExists(meEmail, contactEmail) { // caso existir pega o id do chat, ser não criar o chat

        return new Promise((s, f) => {

            Chat.find(meEmail, contactEmail).then(chats => { // pega o seu email e o email do contanto a ser conversado e procura

                if (chats.empty) { // ser o chat não existir

                    Chat.create(meEmail, contactEmail).then(chat => { // aqui criar o chat passado seu email e o do contanto

                        s(chat); // ser ocorrer tudo certo exibir o chat

                    }).catch(err => { f(err); }); // ser de errado volta mensagem de erro

                } else { // aqui ser o chat ja existir

                    chats.forEach(chat => { // percorre todo os chat

                        s(chat); // retorna o chat(id) requirido

                    });

                }

            }).catch(err => { f(err); }); // ser de errado volta mensagem de erro

        });

    }

}
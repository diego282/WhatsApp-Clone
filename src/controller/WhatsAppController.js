import { format } from './../util/format';
import { CameraController } from './CameraController';
import { DocumentPreviewController } from './DocumentPreviewController';
import { MicrophoneController } from './MicrophoneController';
import { ContactsController } from './ContactsController';
import { Firebase } from './../util/firebase';
import { User } from './../model/user';
import { Chat } from './../model/Chat';
import { Message } from '../model/Message';
import { Base64 } from '../util/Base64';
import { Upload } from './../util/Upload';

export class WhatsAppController {

    constructor() {

        this._active = true; // notifica o navegador que o foco está na janela
        this._locale = 'pt-BR';
        this._firebase = new Firebase(); // criando obj Firebase

        this.elementPrototype(); // para aplicar funções e classe sem precisar usar tanto codigo
        this.loadElements(); // mudar os nomes dos id para padrao camelCase
        this.initEvents(); // iniciar todos os eventos
        this.initAuth(); // faz a atenticação do firebase
        this.checkNotifications(); // verifica se o user autorizou notificações de novas msg em caso de tela minimizada

    }

    checkNotifications() { // verifica se o user autorizou notificações de novas msg em caso de tela minimizada

        if (typeof Notification === 'function') {

            if (Notification.permission !== 'granted') {

                this.el.alertNotificationPermission.show();



            } else {

                this.el.alertNotificationPermission.hide();

            }

            this.el.alertNotificationPermission.on('click', e => {

                Notification.requestPermission(permission => {

                    if (permission === "granted") {
                        this.el.alertNotificationPermission.hide();
                        console.info('Notificções permitidas!');
                    }

                });

            });

        }

    }

    initAuth() {

        this._firebase.initAuth()
            .then(response => {

                this._user = new User(response.user.email)

                this._user.on('datachange', data => {

                    document.querySelector('title').innerHTML = data.name + ' - WhatsApp Clone'

                    this.el.inputNamePanelEditProfile.innerHTML = data.name

                    if (data.photo) {

                        let photo = this.el.imgPanelEditProfile
                        photo.src = data.photo
                        photo.show()
                        this.el.imgDefaultPanelEditProfile.hide()

                        let photo2 = this.el.myPhoto.querySelector('img')
                        photo2.src = data.photo
                        photo2.show()

                    }

                    this.initContacts()

                })

                this._user.name = response.user.displayName
                this._user.email = response.user.email
                this._user.photo = response.user.photoURL

                this._user.save().then(() => {

                    this.el.appContent.css({
                        display: 'flex'
                    })

                })

            })
            .catch(err => {
                console.error(err)
            })

    }

    initContacts() {


        this._user.on('contactschange', contacts => {

            this.el.contactsMessagesList.innerHTML = '';

            contacts.forEach(contact => { // percorre os contantos

                let contactEl = document.createElement('div'); // criar um novo elemento

                contactEl.className = 'contact-item'; // fala que a classe a ser usada possir esse no seu escopo

                contactEl.innerHTML = `
                    <div class="dIyEr">
                        <div class="_1WliW" style="height: 49px; width: 49px;">
                            <img src="#" class="Qgzj8 gqwaM photo" style="display:none;">
                            <div class="_3ZW2E">
                                <span data-icon="default-user" class="">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 212 212" width="212" height="212">
                                        <path fill="#DFE5E7" d="M106.251.5C164.653.5 212 47.846 212 106.25S164.653 212 106.25 212C47.846 212 .5 164.654.5 106.25S47.846.5 106.251.5z"></path>
                                        <g fill="#FFF">
                                            <path d="M173.561 171.615a62.767 62.767 0 0 0-2.065-2.955 67.7 67.7 0 0 0-2.608-3.299 70.112 70.112 0 0 0-3.184-3.527 71.097 71.097 0 0 0-5.924-5.47 72.458 72.458 0 0 0-10.204-7.026 75.2 75.2 0 0 0-5.98-3.055c-.062-.028-.118-.059-.18-.087-9.792-4.44-22.106-7.529-37.416-7.529s-27.624 3.089-37.416 7.529c-.338.153-.653.318-.985.474a75.37 75.37 0 0 0-6.229 3.298 72.589 72.589 0 0 0-9.15 6.395 71.243 71.243 0 0 0-5.924 5.47 70.064 70.064 0 0 0-3.184 3.527 67.142 67.142 0 0 0-2.609 3.299 63.292 63.292 0 0 0-2.065 2.955 56.33 56.33 0 0 0-1.447 2.324c-.033.056-.073.119-.104.174a47.92 47.92 0 0 0-1.07 1.926c-.559 1.068-.818 1.678-.818 1.678v.398c18.285 17.927 43.322 28.985 70.945 28.985 27.678 0 52.761-11.103 71.055-29.095v-.289s-.619-1.45-1.992-3.778a58.346 58.346 0 0 0-1.446-2.322zM106.002 125.5c2.645 0 5.212-.253 7.68-.737a38.272 38.272 0 0 0 3.624-.896 37.124 37.124 0 0 0 5.12-1.958 36.307 36.307 0 0 0 6.15-3.67 35.923 35.923 0 0 0 9.489-10.48 36.558 36.558 0 0 0 2.422-4.84 37.051 37.051 0 0 0 1.716-5.25c.299-1.208.542-2.443.725-3.701.275-1.887.417-3.827.417-5.811s-.142-3.925-.417-5.811a38.734 38.734 0 0 0-1.215-5.494 36.68 36.68 0 0 0-3.648-8.298 35.923 35.923 0 0 0-9.489-10.48 36.347 36.347 0 0 0-6.15-3.67 37.124 37.124 0 0 0-5.12-1.958 37.67 37.67 0 0 0-3.624-.896 39.875 39.875 0 0 0-7.68-.737c-21.162 0-37.345 16.183-37.345 37.345 0 21.159 16.183 37.342 37.345 37.342z"></path>
                                        </g>
                                    </svg>
                                </span>
                            </div>
                        </div>
                    </div>
                    <div class="_3j7s9">
                        <div class="_2FBdJ">
                            <div class="_25Ooe">
                                <span dir="auto" title="Nome do Contato" class="_1wjpf">${contact.name}</span>
                            </div>
                            <div class="_3Bxar">
                                <span class="_3T2VG">${format.fbTimeStampToTime(contact.lastMessageTime)}</span>
                            </div>
                        </div>
                        <div class="_1AwDx">
                            <div class="_itDl">
                                <span title="digitando…" class="vdXUe _1wjpf typing" style="display:none">digitando…</span>
                                <span class="_2_LEW last-message">
                                    <div class="_1VfKB">
                                        <span data-icon="status-dblcheck" class="">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18">
                                                <path fill="#263238" fill-opacity=".4" d="M17.394 5.035l-.57-.444a.434.434 0 0 0-.609.076l-6.39 8.198a.38.38 0 0 1-.577.039l-.427-.388a.381.381 0 0 0-.578.038l-.451.576a.497.497 0 0 0 .043.645l1.575 1.51a.38.38 0 0 0 .577-.039l7.483-9.602a.436.436 0 0 0-.076-.609zm-4.892 0l-.57-.444a.434.434 0 0 0-.609.076l-6.39 8.198a.38.38 0 0 1-.577.039l-2.614-2.556a.435.435 0 0 0-.614.007l-.505.516a.435.435 0 0 0 .007.614l3.887 3.8a.38.38 0 0 0 .577-.039l7.483-9.602a.435.435 0 0 0-.075-.609z"></path>
                                            </svg>
                                        </span>
                                    </div>
                                    <span dir="ltr" class="_1wjpf _3NFp9">${contact.lastMessage}</span>
                                    <div class="_3Bxar">
                                        <span>
                                            <div class="_15G96">
                                                <span class="OUeyt messages-count-new" style="display:none;">1</span>
                                            </div>
                                    </span></div>
                                    </span>
                            </div>
                        </div>
                    </div>
                `;

                if (contact.photo) { // ver ser tem foto

                    let img = contactEl.querySelector('.photo'); // pegar o id da foto do contanto
                    img.src = contact.photo; // passa a foto para a variavel
                    img.show(); // aqui exibi a foto do contanto caso tiver

                }

                contactEl.dataset.contact = JSON.stringify(contact);

                this.el.contactsMessagesList.appendChild(contactEl); // coloca o contanto na tela

            });

            this.el.contactsMessagesList.querySelectorAll('.contact-item').forEach(item => {

                item.on('click', event => {

                    let contact = JSON.parse(item.dataset.contact);

                    this.setActiveChat(contact); // chama o metodo

                });

            });

        });

        this._user.getContacts();

    }

    notification(data) {

        if (!this._active && Notification.permission === 'granted') {

            let n = new Notification(this._activeContact.name, {
                icon: this._activeContact.photo,
                body: data.content
            });

            let nSound = new Audio('./audio/alert.mp3');

            nSound.currentTime = 0;
            nSound.play();

            setTimeout(() => {

                if (n) n.close();

            }, 3000);

        }

    }

    setActiveChat(contact) { // seta os dados referente ao chat

        if (this._activeContact) { // ser existir um ultimo contato ativo
            Message.getRef(this._activeContact.chatId).onSnapshot(() => {}); // zeraa o que tava ouvindo anteriomente
        }
        console.log('chatId', contact.chatId);

        this.el.activeName.innerHTML = contact.name; // coloca o nome do contanto na barra de stutus
        this.el.activeStatus.innerHTML = contact.status; // coloca o status do contanto na barra de status

        if (contact.photo) { // ver ser tem foto
            let img = this.el.activePhoto; // seleciona o id da foto da barra de status
            img.src = contact.photo; // passa a foto para variavel
            img.show(); // ixibe a foto
        }

        this._activeContact = contact; // ver qual contanto que est ativo

        this._messagesReceived = [];

        this.el.panelMessagesContainer.innerHTML = ''; // limpa o conteudo do painel de mensagems

        Message.getRef(this._activeContact.chatId).orderBy("timeStamp").onSnapshot(docs => { // pega as mensagem do chat e ordena e sempre fica de olho

            let scrollTop = this.el.panelMessagesContainer.scrollTop; // pega aonde o scroll está
            let scrollTopMax = this.el.panelMessagesContainer.scrollHeight - this.el.panelMessagesContainer.offsetHeight; // maximo que o scroll pode descer

            let autoScroll = (scrollTop >= scrollTopMax); // ver ser ja chegou no limite do scrollTopMax


            docs.forEach(docMsg => { // percorre o array

                let data = docMsg.data(); // pega os dados
                data.id = docMsg.id;
                let message = new Message(); // instaciar
                message.fromJSON(data); // carrega os dados via json
                let messageEl = message.getViewElement((data.from === this._user.email)); // ver se a mensaem e minha 

                if (!this._messagesReceived.filter(msg => { return (msg === docMsg.id) }).length) {
                    this._messagesReceived.push(docMsg.id);
                    this.notification(data);
                }

                if (!this.el.panelMessagesContainer.querySelector('#_' + data.id)) {
                    if (!messageEl) {

                        docMsg.ref.set({ // seta o status
                            status: 'read' // fala que o estado da mensagem e como lida
                        }, {
                            merge: true // mantem todas as outras informações intactas
                        });
                    }

                    this.el.panelMessagesContainer.appendChild(messageEl); // carrega a visualização da mensagem
                } else {

                    let view = message.getViewElement(messageEl); // ver se a mensaem e minha 
                    this.el.panelMessagesContainer.querySelector('#_' + data.id).innerHTML = view.innerHTML; // pega a mensagem que ja está na tela

                }

                if (this.el.panelMessagesContainer.querySelector('#_' + data.id) && messageEl) {

                    let msgEl = this.el.panelMessagesContainer.querySelector('#_' + data.id); // pega a mensagem que ja está na tela
                    msgEl.querySelector('.message-status').innerHTML = message.getStatusViewElement().outerHTML; // atualiza o status da mensagem que ja esta na tela
                }

                if (data.from !== this._user.email) { // aqui ser quem mandoua mensagem for diferente de quem recebeu

                    docMsg.ref.set({ // seta o status
                        status: 'read' // fala que o estado da mensagem e como lida
                    }, {
                        merge: true // mantem todas as outras informações intactas
                    });

                }

                if (data.type === 'contact') { // ver ser o tipo e contanto

                    messageEl.querySelector('.btn-message-send').on('click', e => {


                        Chat.createIfNotExists(this._user.email, data.content.email).then(chat => { // cria o chat ser não existir e ser existir volta o id, pegando seu email e o do contanto para tentar localicar a conversa

                            let contact = new User(data.content.email);

                            contact.on('datachange', userData => { // fica sempre monitorando o chat e avisa todos quandoa ativado

                                contact.chatId = chat.id; // guarda o id da conversa

                                this._user.addContact(contact); // adiciona o contanto quaso nao exitir

                                this._user.chatId = chat.id; // aqui pega o id do chat do seu lado 

                                contact.addContact(this._user); // caso existir pega o id da conversa, e ser nao criar o chat na parte do outro usuario do chat

                                this.setActiveChat(contact); // seta os dados referente ao contato ao abrir a conversa

                            });

                        });

                    });

                }

            });

            if (autoScroll) { // ser for verdadeiro
                this.el.panelMessagesContainer.scrollTop = (this.el.panelMessagesContainer.scrollHeight - this.el.panelMessagesContainer.offsetHeight); // descer a barra para o fim, dps de enviar a mensagem
            } else { // ser for falso
                this.el.panelMessagesContainer.scrollTop = scrollTop; // ser não. mantem a barra no lugar
            }

        });

        this.el.home.hide(); // a tela que não e de conversa some
        this.el.main.css({ // a de bate papo aparece
            display: 'flex'
        });

    }



    loadElements() { // para percorre todos os id e coloca referencia

        this.el = {}; // variavel para alimentar essa mudança

        document.querySelectorAll('[id]').forEach(element => { // seleciona todos os id e percorre eles

            this.el[format.getCamelCase(element.id)] = element; // passa os nome dos id para CamelCase
        });
    }

    elementPrototype() { // para aplicar funções e classe sem precisar usar tanto codigo

        Element.prototype.hide = function() { // prototype para facilita o desaparecer
            this.style.display = 'none'; // tira tudo da tela
            return this; // para alinhar varias chamadas de uma vez

        }
        Element.prototype.show = function() { // prototype para facilita o aparecer
            this.style.display = 'block'; // aparece tudo da tela
            return this; // para alinhar varias chamadas de uma vez
        }
        Element.prototype.toggle = function() { // prototype para facilita o desaparecer e aparecer
            this.style.display = (this.style.display === 'none') ? 'block' : 'none'; // coloca e tira tudo da tela
            return this; // para alinhar varias chamadas de uma vez

        }
        Element.prototype.on = function(events, fn) { // prototype para facilita o tratamento de eventos
            events.split(' ').forEach(event => { // pega o evento passado para para array e percorre ele

                this.addEventListener(event, fn); // adiciona o evento e executa quantas vexes tiver de acordo com a funçao

            });
            return this; // para alinhar varias chamadas de uma vez
        }

        Element.prototype.css = function(styles) { // prototype para facilita CSS
            for (let name in styles) { // sempre que tive um nome no sytle executa novamente
                this.style[name] = styles[name]; // aqui passa somente o classe.css({ dentro oq quer mudar})

            }
            return this; // para alinhar varias chamadas de uma vez
        }
        Element.prototype.addClass = function(name) { // prototype para facilita adicionar classe
            this.classList.add(name); // adiciona classe
            return this; // para alinhar varias chamadas de uma vez

        }
        Element.prototype.removeClass = function(name) { // prototype para facilita a remoção de classe
            this.classList.remove(name); // remove classe
            return this; // para alinhar varias chamadas de uma vez

        }
        Element.prototype.toggleClass = function(name) { // prototype para facilita adicionar ou remover classe
            this.classList.toggle(name); // adiciona ou remove a classe
            return this; // para alinhar varias chamadas de uma vez

        }
        Element.prototype.hasClass = function(name) { // prototype para verificar ser ha a classe
            return this.classList.contains(name); // verifica ser tem a classe
        }

        HTMLFormElement.prototype.getForm = function() { // retorna o formdata

            return new FormData(this);
        }

        HTMLFormElement.prototype.toJson = function() { // retorna o formdata para json

            let json = {};

            this.getForm().forEach((value, key) => {

                json[key] = value;
            });

            return json;
        }
    }

    initEvents() { // inicia os eventos

        this.el.inputSearchContacts.on('keyup', e => { // evento de pesquisa do contato

            if (this.el.inputSearchContacts.value.length > 0) { // ser for maior que 0

                this.el.inputSearchContactsPlaceholder.hide(); // esconde o placeholder
            } else { // ser não for maior que 0

                this.el.inputSearchContactsPlaceholder.show(); // mostrar o placeholder

            }

            this._user.getContacts(this.el.inputSearchContacts.value); // faz a pesquisa do contato
        });

        // graça a metodo de Camelcase podemos chamar o id assim, passando um evento
        this.el.myPhoto.on('click', e => { // para abrir o painel de edição

            this.closeAllLeftPanel(); //antes de abrir quaçquer painel veja o existente
            this.el.panelEditProfile.show(); // abre o painel
            setTimeout(() => { // aplica o efeito de trasição a cada 300 milesegundos
                this.el.panelEditProfile.addClass('open'); // abre o painel de edição
            }, 300);
        });

        this.el.btnNewContact.on('click', event => { // para abrir o painel de contantos

            this.el.panelEditProfile.hide() // esconde o painel de edicao
            this.el.panelAddContact.show() // abre o painel, aplica o efeito de trasição a cada 1 segundo
            setTimeout(() => { // aplica o efeito de trasição a cada 300 milesegundos
                this.el.panelAddContact.addClass('open'); // abre o painel de contatos
            }, 300);
        });


        this.el.btnClosePanelEditProfile.on('click', e => { // para fechar o painel de ediçao 

            this.el.panelEditProfile.removeClass('open'); // fecha o painel de edição
        });

        this.el.btnClosePanelAddContact.on('click', event => { // para fechar o painel de contantos

            this.el.panelAddContact.removeClass('open') // fecha o painel de contantos. com efeito trasição a 300 milesegudos
            this.el.panelAddContact.hide(); // esconde o painel de adicionar contatos


        });

        this.el.photoContainerEditProfile.on('click', e => { // para editar a foto

            this.el.inputProfilePhoto.click(); // abre a janela do window
        });

        this.el.inputNamePanelEditProfile.on('keypress', e => { // para editar o nome

            if (e.key === 'Enter') { // verifica ser foi presionado o botao enter

                e.preventDefault(); // anula o evento normal
                this.el.btnSavePanelEditProfile.click(); // executa o salvamento
            }
        });


        this.el.btnSavePanelEditProfile.on('click', e => { // salva o nome editado

            this.el.btnSavePanelEditProfile.disabled = true; // desabilita o botao de salvar o nome

            this._user.name = this.el.inputNamePanelEditProfile.innerHTML; // pegar os dados e o que foi digitado e seta
            this._user.save().then(() => { // salva a modificação no banco de dados

                this.el.btnSavePanelEditProfile.disabled = false; // destrava o botao de salvar o nome

            });

        });

        this.el.formPanelAddContact.on('submit', e => { // adiciona contanto

            e.preventDefault(); // anula o evento normal

            let btn = this.el.formPanelAddContact.querySelector('[type="submit"]');

            btn.disabled = true;

            let email = this.el.formPanelAddContact.getForm().get('email');
            let contact = new User(email);

            contact.on('datachange', data => {

                if (!data.name) {

                    let error = `O contato ${email} não foi encontrado.`; // mostra que não foi encontrado
                    console.error(error); // mensagem de erro

                } else {

                    Chat.createIfNotExists(this._user.email, email).then(chat => { // ser não tiver criar, ser tiver procura ele

                        contact.chatId = chat.id; // pega o id do chat

                        this._user.addContact(contact); // adiciona o contato

                        this._user.chatId = chat.id;

                        contact.addContact(this._user); // adiciona, o seu contanto no contato que esta conversado

                        console.info(`O contato ${email} foi adicionado.`); // mostra que foi inserido com sucesso
                        this.el.panelAddContact.hide(); // esconde o painel de adicionar contanto

                    });

                }

                btn.disabled = false;

            });

        });
        this.el.contactsMessagesList.querySelectorAll('.contact-item').forEach(item => { // seleciona aonde fica a lista de contantos e percorre ele

            item.on('click', e => { // quando clica no contanto

                this.el.home.hide(); // oculta a tela que aparece embaixo da conversa
                this.el.main.css({ // faz aparece a conversa ao clicar no contato
                    display: 'flex'
                });
            });
        });

        this.el.btnAttach.on('click', e => { // botao de anexar

            e.stopPropagation(); // para a propagação, evitando que sair executado tudo que tem o mesmo evento
            this.el.menuAttach.addClass('open'); // abre a opção do botao anexar
            document.addEventListener('click', this.closeMenuAttach.bind(this)); // quando clicar em algum lugar fechar o botao de anexar, 

        });

        this.el.btnAttachPhoto.on('click', e => { // botao de anexar foto

            this.closeAllMainPanel(); // fecha todos os paineis abertos
            this.el.panelMessagesContainer.show(); // abre o painel de mensagems
            this.el.inputPhoto.click(); // abre o botao fotos
        });

        this.el.inputPhoto.on('change', e => { // pegar as fotos selecionadas


            [...this.el.inputPhoto.files].forEach(file => { // tranforma a coleção em array e percorre ele

                Message.sendImage(this._activeContact.chatId, this._user.email, file); // passa o id do chat quem mandou e o arquivo

            });
        });

        this.el.btnAttachCamera.on('click', e => { // botao de abrir a camera

            this.closeAllMainPanel(); // esconde oq e necessario para abrir o outro painel
            this.el.panelMessagesContainer.hide(); // esconde o container de mensagem
            this.el.panelCamera.addClass('open'); // abre a camera
            this.el.panelCamera.css({ // mudar a configuração do css

                'height': 'calc(100% - -50px)' // faz ficar centro a visuliazaçao do painel da camera
            });

            this._cameraController = new CameraController(this.el.videoCamera); // trata o que aparece na camera antes de ser realizada a fotografia
        });

        this.el.btnClosePanelCamera.on('click', e => { // botao de fecha a camera

            this._cameraController.stop(); // faz a camera para de gravar dps de apertado o botao
            this.closeAllMainPanel(); // esconde oq e necessario para abrir o outro painel
            this.el.panelMessagesContainer.show(); // aparece oq ta embaixo, para exibir oq vai abrir
        });

        this.el.btnTakePicture.on('click', e => { // botao de tirar foto da camera

            let picture = this._cameraController.takePicture(); //captura a foto ao clicar

            this.el.pictureCamera.src = picture; // salva foto tirada 
            this.el.pictureCamera.show(); // e agora exibi na tela
            this.el.videoCamera.hide(); // esconde a parte que exibia o video seu
            this.el.btnReshootPanelCamera.show(); // exibe o botão de tira outra foto
            this.el.containerSendPicture.show(); //mostra o botao de enviar a foto
            this.el.containerTakePicture.hide(); // esconde o botao de tira foto, dps de tirada a foto

        });

        this.el.btnReshootPanelCamera.on('click', e => { // quando vc quer tentar tira uma foto novamente

            this.el.btnReshootPanelCamera.hide(); // esconde o botão de tira outra foto
            this.el.pictureCamera.hide(); // e agora esconde a foto tirada
            this.el.videoCamera.show(); // mostra a parte que exibia o video seu para tira a foto
            this.el.containerSendPicture.hide(); //esconde o botao de enviar a foto
            this.el.containerTakePicture.show(); // mostra o botao de tira foto
        });

        this.el.btnSendPicture.on('click', e => { // botao de enviar a foto

            this.el.btnSendPicture.disabled = true; // trava o botão de enviar, para não clicar mais de uma vex

            let picture = new Image(); // instancia a imagem, para fazer a manipulação da mesma
            picture.src = this.el.pictureCamera.src; // passa o base 64, ou seja a propria imagem
            picture.onload = () => { // fala que ta carregando

                let canvas = document.createElement('canvas'); // criar o canvas para manipular a imagem
                let context = canvas.getContext('2d'); // fala que o contexto e 2d

                canvas.setAttribute('width', picture.width); // coloca valor de largura
                canvas.setAttribute('height', picture.height); // coloca valor de altura

                context.translate(picture.width, 0); // anda com a imagem  no memso valor que a largura, horizontalmnte, verticamente passou(0)
                context.scale(-1, 1); // falar que so ta rotacionando horizontalmente, verticalmente continua igual
                context.drawImage(picture, 0, 0, canvas.width, canvas.height); // desenha a imagem comecando no 0,0 ate altura e largura passada

                Base64.toFile(canvas.toDataURL(Base64.getMimeType(this.el.pictureCamera.src))).then(file => { // pega o base 64 editado e passar ele para fazer o filper

                    Message.sendImage(this._activeContact.chatId, this._user.email, file); // pega o chat, quem mandou e o arquivo, e envia

                    this.closeAllMainPanel(); // fecha todos os paines
                    this._cameraController.stop(); // faz a camera para de gravar dps de apertado o botao
                    this.el.btnReshootPanelCamera.hide(); // esconde o botão de tira outra foto
                    this.el.pictureCamera.hide(); // e agora esconde a foto tirada
                    this.el.videoCamera.show(); // mostra a parte que exibia o video seu para tira a foto
                    this.el.containerSendPicture.hide(); //esconde o botao de enviar a foto
                    this.el.containerTakePicture.show(); // mostra o botao de tira foto
                    this.el.panelMessagesContainer.show(); // aparece oq ta embaixo, para exibir oq vai abrir
                    this.el.btnSendPicture.disabled = false; // destrava o botão de enviar
                });
            };

        });

        this.el.btnAttachDocument.on('click', e => { // botao de anexar documentos

            this.el.inputDocument.click(); // abre o pasta para selecionar o arquivo

        });

        this.el.inputDocument.on('change', e => { // cuida do carregamento do arquivo

            if (this.el.inputDocument.files.length) {

                let file = this.el.inputDocument.files[0]; // pegar um arquivo apenas por vez

                this.closeAllMainPanel(); // veja os paineis
                this.el.panelMessagesContainer.hide(); // esconde oq ta embaixo, para exibir oq vai abrir
                this.el.panelDocumentPreview.addClass('open');

                this.el.panelDocumentPreview.css({ // mudar a configuração do css

                    'height': 'calc(100% - -80px)' // faz ficar centro a visuliazaçao do painel do documento
                        //         // 'height': 'calc(100% - 120px)' // faz ficar centro a visuliazaçao do painel do documento
                });

                this._documentPreview = new DocumentPreviewController(file);
                this._documentPreview.getPreviewData().then(data => {

                    this.el.filePanelDocumentPreview.hide(); // esconde ser tive monstrado um arquivo
                    this.el.imagePanelDocumentPreview.show(); // mostra(o arquivo de imagem) aparece na tela
                    this.el.imgPanelDocumentPreview.src = data.src;
                    this.el.imgPanelDocumentPreview.show();
                    this.el.infoPanelDocumentPreview.innerHTML = data.info; // mensagem que aparece embaixo do arquivo


                }).catch(event => { // caso a promesa de erro

                    if (event) {
                        console.error(event.event);
                    } else {

                        switch (file.type) { // ver qual o tipo de arquivo

                            case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
                            case 'application/msword':
                                this.el.iconPanelDocumentPreview.classList.value = 'jcxhw icon-doc-doc'; // coloca o icone(doc) do tipo fo arquivo
                                break;

                            case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
                            case 'application/vnd.ms-excel':
                                this.el.iconPanelDocumentPreview.className = 'jcxhw icon-doc-xls'; // coloca o icone(xls) do tipo fo arquivo

                                break;

                            case 'application/vnd.ms-powerpoint':
                            case 'application/vnd.openxmlformats-officedocument.presentationml.presentation':
                                this.el.iconPanelDocumentPreview.classList.value = 'jcxhw icon-doc-ppt'; // coloca o icone(ppt) do tipo fo arquivo

                                break;
                            default:
                                this.el.iconPanelDocumentPreview.classList.value = 'jcxhw icon-doc-generic'; // coloca o icone(generico) do tipo fo arquivo
                                // break;
                        }

                        this.el.filePanelDocumentPreview.show(); // mostra  um arquivo
                        this.el.imagePanelDocumentPreview.hide(); // esconde(o arquivo de imagem) 
                        this.el.filenamePanelDocumentPreview.innerHTML = file.name // mostra o nome do arquivo na tela

                    }

                });

            }

        });

        this.el.btnClosePanelDocumentPreview.on('click', e => { // botao de fecha o documento

            this.closeAllMainPanel(); // esconde oq e necessario para abrir o outro painel
            this.el.panelMessagesContainer.show(); // aparece oq ta embaixo, para exibir oq vai abrir

        });

        this.el.btnSendDocument.on('click', event => { // trata o botao de envio do documento

            let documentFile = this.el.inputDocument.files[0];

            if (documentFile.type === 'application/pdf') { // aqui ser o documento for pdf

                Base64.toFile(this.el.imgPanelDocumentPreview.src).then(imageFile => { // pegar uma visualização da primeira pagina do arquivo para exibir

                    Message.sendDocument(this._activeContact.chatId, this._user.email, documentFile, imageFile, this.el.infoPanelDocumentPreview.innerHTML);
                    // passa qual o chat, quem mandou, o documento, a primeira imagem e as informações do documento
                });

            } else { // aqui ser for outro tipo de documento

                Message.sendDocument(this._activeContact.chatId, this._user.email, documentFile);
                // o chat do contato quem mandou e o documento

            }

            this.el.btnClosePanelDocumentPreview.click(); // aqui fechar o painel de enviar documento

        });


        this.el.btnAttachContact.on('click', event => { // botao de anexar contantos

            this._contactsController = new ContactsController(this.el.modalContacts, this._user);

            this._contactsController.open();

            this._contactsController.on('select', contact => {

                Message.sendContact(this._activeContact.chatId, this._user.email, contact);

                this._contactsController.close();

            });
        });

        this.el.btnCloseModalContacts.on('click', event => { // trata o botao fechao do modal contatos

            this._contactsController.close(); // fecha o modal dos contatos
        });

        this.el.btnSendMicrophone.on('click', event => { // botao do microfone

            this.el.recordMicrophone.show(); // vai aparece o visual que o microfone está ativo
            this.el.btnSendMicrophone.hide(); // faz o desenho do microfone sumir
            this.startRecordMicrophoneTime();

        });

        this.el.btnCancelMicrophone.on('click', event => { // botao de cancelar do microfone

            // this._microphoneController.stopRecorder(); // para de gravar o microfone
            this.closeRecordMicrophone(); // faz oq esta dentro da função
        });

        this.el.btnFinishMicrophone.on('click', event => { // botao de finalizar(enviar) do microfone

            // this._microphoneController.stopRecorder(); // para de gravar o microfone

            this._microphoneController.on('recorded', (file, metadata) => {

                Message.sendAudio(this._activeContact.chatId, this._user.email, file, metadata, this._user.photo);

            });

            this.closeRecordMicrophone(); // faz oq esta dentro da função
        });

        this.el.inputText.on('keypress', event => { // cuida dos eventos de teclado ao digitar

            if (event.key === 'Enter' && !event.ctrlKey) { // ser a tecla pressionada for igual a enter e nao ao ctrl
                event.preventDefault(); // para o comportamento padrao
                this.el.btnSend.click(); // manda enviar
            }

        });

        this.el.inputText.on('keyup', e => { // cuida da barra de mensagem

            if (this.el.inputText.innerHTML.length) {

                this.el.inputPlaceholder.hide(); // quando clica na caixa de texto enconde a mensagm dentro
                this.el.btnSendMicrophone.hide(); // faz o desenho do microfone desaparecer
                this.el.btnSend.show(); // mostra o botao de enviar a mensagem

            } else {

                this.el.inputPlaceholder.show(); // ser tive sem texto, mostra novamente a mensagem
                this.el.btnSendMicrophone.show(); // faz o desenho do microfone aparecer
                this.el.btnSend.hide(); // tira o botao de enviar a mensagem
            }

        });

        this.el.btnSend.on('click', e => { // botao de enviar a mensagem

            Message.send(this._activeContact.chatId, this._user.email, 'text', this.el.inputText.innerHTML); // envia a mensagem passado o id do chat do contato atual, quem enviou o tipo e a mensagem em si

            this.el.inputText.innerHTML = ''; // depois que envia limpa o impout de texto
            this.el.panelEmojis.removeClass('open'); // ser enviar um emoji, ele fecha o campo

        });

        this.el.btnEmojis.on('click', e => { // botao dos emojis

            this.el.panelEmojis.toggleClass('open'); // abre e fecha a aba de emojis

            if (this.el.panelEmojis.hasClass('open')) {
                this.el.iconEmojisOpen.hide();
                this.el.iconEmojisClose.show();
            } else {
                this.el.iconEmojisOpen.show();
                this.el.iconEmojisClose.hide();
            }
        });

        this.el.panelEmojis.querySelectorAll('.emojik').forEach(emoji => { // seleciona todos os emojis w percorre eles

            emoji.on('click', e => { // coloca evento de click em cada emoji

                let img = this.el.imgEmojiDefault.cloneNode(); // clonar o elemento

                img.style.cssText = emoji.style.cssText; // pegar o css do emoji
                img.dataset.unicode = emoji.dataset.unicode; // pegar o unicode
                img.alt = emoji.dataset.unicode;

                emoji.classList.forEach(cls => { //percorre todas as classe do emoji

                    img.classList.add(cls); // e adiciona o nome da class, ao objeto img
                });

                //Retorna parte do texto selecionada pelo usuário ou a posição atual do cursor.
                let cursor = window.getSelection();

                //Se o cursor não estiver focado no campo de input, forçamos o focus
                if (!cursor.focusNode || cursor.focusNode.id !== 'input-text') {
                    this.el.inputText.focus();
                    cursor = window.getSelection();
                }

                //Cria um novo objeto de controle de intervalos
                let range = document.createRange();
                //Retorna o intervalo atual do cursor
                range = cursor.getRangeAt(0);
                //Remove o conteúdo selecionado
                range.deleteContents();
                //Cria um fragmento de Documento
                var frag = document.createDocumentFragment();
                //Adiciona a imagem no fragmento
                frag.appendChild(img);
                //inserir o fragmento no intervalo
                range.insertNode(frag);
                //coloca o cursor após a imagem                    
                range.setStartAfter(img);

                this.el.inputText.dispatchEvent(new Event('keyup')); // força um evento a acontecer
            });
        });
    }


    startRecordMicrophoneTime() {

        this._microphoneController = new MicrophoneController();

        this._microphoneController.on('ready', event => {

            this._microphoneController.startRecorder();

        });

        this._microphoneController.on('timer', (data, event) => {

            this.el.recordMicrophoneTimer.innerHTML = data.displayTimer;

        });

    }

    closeRecordMicrophone() { // fecha o microfone tanto ao cancelar como ao enviar

        this._microphoneController.stopRecorder();

        this.el.recordMicrophone.hide(); // vai sumir o visual que o microfone está ativo
        this.el.btnSendMicrophone.show(); // faz o desenho do microfone aparecer

    }

    closeAllMainPanel() { // fechar todos os paineis

        // this.el.panelMessagesContainer.hide(); // esconde oq ta embaixo, para exibir oq vai abrir
        this.el.panelDocumentPreview.style.height = '10%';
        this.el.panelDocumentPreview.removeClass('open'); // esconde oq ta embaixo, para exibir oq vai abrir
        this.el.panelCamera.removeClass('open'); // esconde oq ta embaixo, para exibir oq vai abrir

    }

    closeMenuAttach(e) {

        // e.stopPropagation(); // para a propagação, evitando que sair executado tudo que tem o mesmo evento
        this.el.menuAttach.removeClass('open'); // fechar a opção do botao anexar
        document.removeEventListener('click', this.closeMenuAttach); // remove um evento

    }

    closeAllLeftPanel() { // certifica de veja todo os paineis no lado esquerdo

        this.el.panelEditProfile.hide(); // desparece o painel
        this.el.panelAddContact.hide(); // desparece o painel

    }
}
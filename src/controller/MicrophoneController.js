import { format } from './../util/format';
import { ClassEvent } from "../util/classEvent";

export class MicrophoneController extends ClassEvent {

    constructor() {


        super(); // impede que um constructor anule o outro, e faz chama o pai dele

        this._available = false; // ver ser permitiu usar o audio ou n
        // this._mimeType = 'audio/webm'; // coloca o tipo padrao de audio a ser gravado

        navigator.mediaDevices.getUserMedia({ // faz que a mensagem ao usar o microfone pela primeira vez seja pedida

            audio: true
        }).then(stream => {

            this._available = true; // ver ser permitiu usar o audio ou n
            this._stream = stream;

            // let audio = new Audio(); // passa ao objeto a classe audio
            // audio.srcObject = stream; //URL.createObjectURL(stream); // criar um arquivo binario
            // audio.play(); // executa o audio
            this.trigger('ready', { // avisa quando estiver pronto para gravar
                stream: this._stream,
                audio: this._audio

            });

        }).catch(err => {

            console.error(err);
        });

    }

    isAvailable() { // ver ser foi permitido ou não usar o audio

        return this._available;
    }

    startTimer() {

        let start = Date.now();

        this._recordMicrophoneInterval = setInterval(() => {

            this.trigger('timer', {
                displayTimer: format.toTime(Date.now() - start)
            });

        }, 100);



    }

    play() {

        if (this._available) {

            this._audio = new Audio();

            this._audio.src = URL.createObjectURL(this._stream);

            this._audio.play();

            this.trigger('play', {
                sream: this._stream,
                audio: this._audio
            });

        }

    }

    stop() { // para o audio

        if (this._available) {

            this._stream.getTracks().forEach(track => {

                track.stop(); // para o audio

            });

            this.trigger('stop'); // avisa que esta parando o audio

        }

    }





    startRecorder(options = {}) { // começa a grava de fato o microfone


        if (this.isAvailable()) { // ser tiver permitido usar o audio

            this.startTimer();

            this._mediaRecorder = new MediaRecorder(this._stream, Object.assign(options, {
                mimeType: 'audio/webm'
            })); // comecar a grava passado o objeto a ser gravado e o tipo do arquivo
            this._recordedChuncks = []; // array que vai guardar os pedaços das gravações enviadas para nois
            this._mediaRecorder.addEventListener('dataavailable', e => { // evento para ficar 'ouvindo' a gravação

                if (e.data.size > 0) // ser tive algum dado

                    this._recordedChuncks.push(e.data); //adiciona o dados recebido no array

            });

            this._mediaRecorder.addEventListener('stop', e => { // quando para de gravar ira fazer o que ta abaixo

                let blob = new Blob(this._recordedChuncks, { // pegar o array compactada tudo e transforma em binario 

                    type: 'audio/webm' // passando o tipo do arquivo
                });
                let cx = new AudioContext();

                var fileReader = new FileReader();

                fileReader.onload = e => {

                    cx.decodeAudioData(fileReader.result).then(decode => {

                        let file = new File([blob], 'rec' + new Date().getTime() + '.webm', {
                            type: 'audio/webm',
                            lastModified: Date.now()
                        });

                        this.trigger('recorded', file, decode);

                    });

                };

                fileReader.readAsArrayBuffer(blob);

            });

            this._mediaRecorder.start();
        }
    }

    stopRecorder() { // para a gravação de fato o microfone

        if (this.isAvailable()) { // ser tiver permitido usar o audio

            this._mediaRecorder.stop(); // para de gravar
            this.stop(); // para de escutar a gravação
            this.stopTime(); // para de conta o tempo do audio

        }
    }

    startTime() { // quanto tempo de duração tem o audio

        let start = Date.now(); // pegar o horario atual

        this._recordMicrophoneInterval = setInterval(() => { // passa o tempo que sera atualizado o display

            this.trigger('recordtimer', {

                displayTimer: format.toTime(Date.now() - start)
            });

        }, 100);
    }

    stopTime() { // para a contagem da duração do audio

        clearInterval(this._recordMicrophoneInterval); //apaga o intervalo de tempo

    }
}

//PARTE ABAIXO LER O ARQUIVO E EXECUTA EM TEMPO DE EXECUÇÃO

// console.log('file', file); // so para ver os dados na tela
// let reader = new FileReader(); //declara um arquivo de leitura

// reader.onload = e => {

//     console.log('reader file', file); // so para ver os dados na tela
//     let audio = new Audio(reader.result);
//     audio.play(); // toca o audio
// }
// reader.readAsDataURL(file); // lear o arquivo
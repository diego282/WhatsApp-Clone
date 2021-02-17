export class CameraController {

    constructor(videoEl) {

        this._videoEl = videoEl;

        navigator.mediaDevices.getUserMedia({ // faz que a mensagem ao usar a camera pela primeira vez seja pedida

            video: true
        }).then(stream => {

            this._stream = stream;
            this._videoEl.srcObject = stream; // criar um arquivo binario
            this._videoEl.play(); //mostra o que ta acontecendo na tela

        }).catch(err => {

            console.error(err);
        });
    }

    stop() { // para a camera

        this._stream.getTracks().forEach(track => { // percore o array

            track.stop(); // faz para de "grava a tela"
        });
    }

    takePicture(mimeType = 'imagem/png') { // para captura a foto, no formato png

        let canvas = document.createElement('canvas'); // criar o elemento canvas do html 5

        canvas.setAttribute('width', this._videoEl.videoWidth) // seta a largura  dessa paleta do canvas, de acordo com o proptio video
        canvas.setAttribute('heigth', this._videoEl.videoHeigth) // seta a altura  dessa paleta do canvas, de acordo com o proptio video

        let context = canvas.getContext('2d'); // falar que vai funcionar no modo 2D

        context.drawImage(this._videoEl, 0, 0, canvas.width, canvas.height); // desenha a imagem, no elemento,posição,altura e largura passadas

        return canvas.toDataURL(mimeType) // tranforma em base 64, no formato passado
    }
}

//OUTRA OPÇÃO PARA FAZER O "VIDEO" APARECE E
// navigator.mediaDevices.getUserMedia({
//     video: true
// }).then(stream => {

//     let mediaStream = new MediaStream(stream);
//     this._videoEl.srcObject = mediaStream;
//     this._videoEl.play();

// })
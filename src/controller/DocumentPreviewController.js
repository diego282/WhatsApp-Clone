const pdfjsLib = require('pdfjs-dist');
const path = require('path');

pdfjsLib.GlobalWorkerOptions.workerSrc = path.resolve(__dirname, '../../dist/pdf.worker.bundle.js') // aponta o caminho para não falhar nenhuma geração da capa pdf

export class DocumentPreviewController {

    constructor(file) {

        this._file = file;
    }

    getPreviewData() { // obter dados de visualização

        return new Promise((resolve, reject) => { // retorna uma promessa

            let reader = new FileReader(); // ler o arquivo

            switch (this._file.type) { // ver qual o tipo do arquivo

                case 'image/png':
                case 'image/jpeg':
                case 'image/jpg':
                case 'image/gif':
                    reader.onload = e => { // aqui caso o carregamento de certo

                        resolve({ // volta o resultado

                            src: reader.result,
                            info: this._file.name
                        });
                    }
                    reader.onerror = e => { // caso o carregamento falhar

                        reject(e); // volta a mensagem de erro
                    }
                    reader.readAsDataURL(this._file);
                    break;

                case 'application/pdf':

                    reader.onload = e => {

                        // Carregar as propriedades do PDFJS
                        // Fazer uma conversao de um array buffer para array de 8bits
                        pdfjsLib.getDocument(new Uint8Array(reader.result))
                            .then(pdf => {

                                //console.log('pdf', pdf)
                                // pegar o numero da página que queremos
                                pdf.getPage(1).then(page => {

                                    // console.log("page", page)

                                    // Pegar o viewport que é o espaço de 
                                    // visualização da nossa página
                                    let viewport = page.getViewport(1);

                                    let canvas = document.createElement('canvas'); // aqui criar o elemento
                                    let canvasContext = canvas.getContext('2d'); // fala que o contexto e 2d

                                    canvas.width = viewport.width; // aqui ver largura
                                    canvas.height = viewport.height; // aqui ver altura

                                    // Método dentro o ViewPage
                                    page.render({

                                        canvasContext,
                                        viewport

                                    }).then(() => {

                                        let plural_singular = (pdf.numPages > 1) ? 's' : ''; // aqui ser tive mais de 1 pagina, coloca paginas

                                        resolve({

                                            // Caminho da imagem
                                            src: canvas.toDataURL('image/png'),
                                            info: `${pdf.numPages} página${plural_singular}` // aqui ser tive  1 pagina, coloca pagina

                                        });

                                    }).catch(err => {

                                        reject(err)

                                    });


                                }).catch(err => {

                                    reject(err)

                                });

                            }).catch(err => {

                                reject(err)

                            });

                    }

                    reader.readAsArrayBuffer(this._file);
                    break;

                default:
                    reject();

            }

        });

    }

}
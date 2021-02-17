const path = require('path');

module.exports = {

    entry: { // arquivos de entrada
        app: './src/app.js',
        'pdf.worker': 'pdfjs-dist/build/pdf.worker.entry.js'
    },
    output: {
        filename: '[name].bundle.js', // nome do arquivo compilado
        path: path.join(__dirname, 'dist'),
        publicPath: 'dist'
    }
}
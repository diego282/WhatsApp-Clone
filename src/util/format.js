export class format {

    static getCamelCase(text) { // muda os nomes para um Padrao CamelCase

        let div = document.createElement('div'); // vai criar um elemento html para captura o dataset
        div.innerHTML = `<div data-${text}='id'></div>`; // faz acontece a mudanca do nome

        return Object.keys(div.firstChild.dataset)[0]; // retorna as chaves encontrada pegando a div que criamos e dps a filho dele no dataset
    }

    static toTime(duration) { // para mudar o visual do tempo na tela


        let seconds = parseInt(duration / 1000) % 60; // faz que os segundos não passe de 60, e pega o resto
        let minutes = parseInt((duration / (1000 * 60)) % 60); // faz que os minutos não passe de 60, e pega o resto;
        let hours = parseInt((duration / (1000 * 60 * 60)) % 24); // faz que a hora não passe de 24, e pega o resto;

        if (hours > 0) {

            return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        } else {

            return `${minutes}:${seconds.toString().padStart(2, '0')}`;
        }
    }

    static fbTimeStampToTime(timeStamp) {

        return (timeStamp && typeof timeStamp.toDate === 'function') ? format.dateToTime(timeStamp.toDate()) : '';

    }

    static dateToTime(date, locale = 'pt-BR') {

        let string = '';

        if (date && date instanceof Date) {
            string = date.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' });
        }

        return string;

    }

}
// Seleciona os elementos HTML onde os dados serão exibidos
const diaSemana = document.getElementById("data-semana");
const dataAtual = document.getElementById("data-atual");
const horaAtual = document.getElementById("data-hora");
const userLocation = document.getElementById("user-location"); // Novo elemento para localização

// Função para atualizar o conteúdo dos elementos com a data e hora atuais
function updateContentHour() {
    if (diaSemana) {
        diaSemana.textContent = getWeekDay();
    }
    if (dataAtual) {
        dataAtual.textContent = getCurrentDate();
    }
    if (horaAtual) {
        horaAtual.textContent = getCurrentTime();
    }
    if (userLocation) {
        getUserLocation();
    }
}

// Retorna a hora atual no formato HH:MM:SS, com dois dígitos para horas, minutos e segundos
function getCurrentTime() {
    const date = new Date(); // Cria um novo objeto Date com a data e hora atuais

    // Formata as horas, minutos e segundos com dois dígitos
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    // Retorna a hora no formato HH:MM:SS
    return hours + ":" + minutes + ":" + seconds;
}

// Retorna a data atual formatada de acordo com a localidade do usuário
function getCurrentDate() {
    const date = new Date(); // Cria um novo objeto Date com a data e hora atuais

    // Formata a data com base na localidade do usuário
    const formatter = new Intl.DateTimeFormat(undefined, {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
    
    // Retorna a data formatada
    return formatter.format(date);
}

// Retorna o dia da semana atual como uma string com um número e o nome do dia
function getWeekDay() {
    // Array com os nomes dos dias da semana e seus respectivos números
    const daysOfWeek = ["0 - Domingo", "1 - Segunda", "2 - Terça", "3 - Quarta", "4 - Quinta", "5 - Sexta", "6 - Sábado"];
    const date = new Date(); // Cria um novo objeto Date com a data e hora atuais
    // Obtém o número do dia da semana e retorna o nome correspondente
    return daysOfWeek[date.getDay()];
}

// Função para obter e exibir a localização do usuário
function getUserLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            function(position) {
                // Obtém a latitude e longitude do usuário
                const latitude = position.coords.latitude.toFixed(4);
                const longitude = position.coords.longitude.toFixed(4);
                // Atualiza o conteúdo do elemento userLocation com a latitude e longitude
                userLocation.textContent = `Localização: Latitude ${latitude}, Longitude ${longitude}`;
            },
            function(error) {
                // Em caso de erro ao obter a localização
                userLocation.textContent = "Não foi possível obter a localização.";
            }
        );
    } else {
        // Geolocalização não suportada
        userLocation.textContent = "Geolocalização não é suportada pelo seu navegador.";
    }
}

// Atualiza imediatamente o conteúdo dos elementos ao carregar a página, sem esperar 1 segundo
updateContentHour();

// Atualiza o conteúdo a cada segundo
setInterval(updateContentHour, 1000);

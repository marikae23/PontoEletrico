// TO-DO:
// organizar código
const diaSemana = document.getElementById("dia-semana");
const dataAtual = document.getElementById("data-atual");
const horaAtual = document.getElementById("hora-atual");
const btnRegistrarPonto = document.getElementById("btn-registrar-ponto");

btnRegistrarPonto.addEventListener("click", register);

diaSemana.textContent = getWeekDay();
dataAtual.textContent = getCurrentDate();

const dialogPonto = document.getElementById("dialog-ponto");

const dialogData = document.getElementById("dialog-data");
dialogData.textContent = "Data: " + getCurrentDate();

const dialogHora = document.getElementById("dialog-hora");
//dialogHora.textContent = getCurrentTime();

const selectRegisterType = document.getElementById("register-type");


// TO-DO:
// finalizar a função
function setRegisterType() {
    let lastType = localStorage.getItem("lastRegisterType");
    if(lastType == "entrada") {
        selectRegisterType.value = "intervalo";
        return;
    }
    if(lastType == "intervalo") {

    }
    if(lastType == "volta-intervalo") {
        
    }
    if(lastType == "saida") {
    
    }
    // Continuar de acordo com as regras abaixo
    // REGRA
    // ÚLTIMO PONTO DO USUÁRIO  |  VALOR DA OPTION DO SELECT
    // Entrada                  |  Intervalo
    // Intervalo                |  Volta Intervalo
    // Volta Intervalo          |  Saída
    // Saída                    |  Entrada
}



const btnDialogRegister = document.getElementById("btn-dialog-register");
btnDialogRegister.addEventListener("click", async () => {
    // PENSAR: o que fazer quando um usuário registrar o mesmo tipo de ponto
    // dentro de x minutos?

    let register = await getObjectRegister(selectRegisterType.value);
    saveRegisterLocalStorage(register);
    
    localStorage.setItem("lastRegister", JSON.stringify(register));

    const alertaSucesso = document.getElementById("alerta-ponto-registrado");
    alertaSucesso.classList.remove("hidden");
    alertaSucesso.classList.add("show");

    setTimeout(() => {
        alertaSucesso.classList.remove("show");
        alertaSucesso.classList.add("hidden");
    }, 5000);

    dialogPonto.close();
});



// cria um objeto correspondente a um registro de ponto
// com data/hora/localizacao atualizados
// o parâmetro é o tipo de ponto
async function getObjectRegister(registerType) {    

    const location = await getUserLocation();

    console.log(location);

    ponto = {
        "date": getCurrentDate(),
        "time": getCurrentTime(),
        "location": location,
        "id": 1,
        "type": registerType
    }
    return ponto;
}

const btnDialogFechar = document.getElementById("dialog-fechar");
btnDialogFechar.addEventListener("click", () => {
    dialogPonto.close();
})


let registersLocalStorage = getRegisterLocalStorage("register");


function saveRegisterLocalStorage(register) {
    registersLocalStorage.push(register);
    localStorage.setItem("register", JSON.stringify(registersLocalStorage));
}

function getRegisterLocalStorage(key) {

    let registers = localStorage.getItem(key);

    if(!registers) {
        return [];
    }

    return JSON.parse(registers);
}

// O que é uma função assíncrona?
// O que é um objeto Javascript?
// O que é uma instância?
// O que é PROTOTYPE?
/*
function getUserLocation() {
    navigator.geolocation.getCurrentPosition((position) => {   
        let userLocation = {
            "lat": position.coords.latitude,
            "long": position.coords.longitude
        }
        return userLocation;
    });
}
*/


// Como garantir que uma função assíncrona já foi executada/processada?
// Possíveis soluções

//getUserLocation(functionCallback) {
    //navigator.geolocation.getCurrentPosition((position) => {
        //userLocation = {
            //OBJETO com lat e long
        //}
        //functionCallback(userLocation)
    //})
//}

// OU

//getUserLocation() {
    //return new Promise((suc, fail) => {
        //navigator.geolocation.getCurrentPosition()
    //})

    
//}
 
function getUserLocation() {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition((position) => {
            let userLocation = {
                "latitude": position.coords.latitude,
                "longitude": position.coords.longitude
            }
            resolve(userLocation);
        }, 
        (error) => {
            reject("Erro " + error);
        });
    });
}


function register() {

    const dialogUltimoRegistro = document.getElementById("dialog-ultimo-registro");
    let lastRegister = JSON.parse(localStorage.getItem("lastRegister"));

    if(lastRegister) {
        let lastDateRegister = lastRegister.date;
        let lastTimeRegister = lastRegister.time;
        let lastRegisterType = lastRegister.type;

        dialogUltimoRegistro.textContent = "Último Registro: " + lastDateRegister + " | " + lastTimeRegister + " | " + lastRegisterType;
    }

    dialogHora.textContent = "Hora: " + getCurrentTime();

    let interval = setInterval(() => {
        dialogHora.textContent = "Hora: " + getCurrentTime();
    }, 1000);

    console.log(interval);

    // TO-DO:
    // Podemos manter esses setInterval sem finalizar?
    // Como podemos usar o clearInterval()?

    dialogPonto.showModal();
}


function updateContentHour() {
    horaAtual.textContent = getCurrentTime();
}


function getCurrentTime() {
    const date = new Date();
    return String(date.getHours()).padStart(2, '0') + ":" + String(date.getMinutes()).padStart(2, '0') + ":" + String(date.getSeconds()).padStart(2, '0');
}


function getCurrentDate() {
    const date = new Date(); 
    let mes = date.getMonth() + 1;
    return String(date.getDate()).padStart(2, '0') + "/" + String(mes).padStart(2, '0') + "/" +  String(date.getFullYear()).padStart(2, '0');
}

function getWeekDay() {
    const date = new Date()
    const day = date.getDay()
    const daynames = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"];
    return daynames[day]
}

updateContentHour();
setInterval(updateContentHour, 1000);

console.log(getCurrentTime());
console.log(getCurrentDate());
console.log(getWeekDay());
function updateDateTime() {
    const diaSemana = document.getElementById("dia-semana");
    const dataAtual = document.getElementById("data-atual");
    const horaAtual = document.getElementById("hora-atual");

    diaSemana.textContent = getWeekDay();
    dataAtual.textContent = getCurrentDate();
    horaAtual.textContent = getCurrentTime();
}

setInterval(updateDateTime, 1000);

const dialog = document.getElementById("dialog-ponto");
const dialogAusencia = document.getElementById("dialog-ausencia");
const overlay = document.querySelector(".overlay");
const btnFechar = document.getElementById("dialog-fechar");
const btnFecharAusencia = document.getElementById("dialog-ausencia-fechar");

function abrirDialogoPonto() {
    fecharTodosOsDialogos(); 
    dialog.showModal();
    overlay.classList.add("visible");
}

function abrirDialogoAusencia() {
    fecharTodosOsDialogos(); 
    dialogAusencia.showModal();
    overlay.classList.add("visible");
}

// Registrando ponto
const btnRegistrarPonto = document.getElementById("btn-registrar-ponto");
btnRegistrarPonto.addEventListener("click", () => {
    const dialogData = document.getElementById("dialog-data");
    const dialogHora = document.getElementById("dialog-hora");
    const dialogUltimoRegistro = document.getElementById("dialog-ultimo-registro");

    dialogData.textContent = "Data: " + getCurrentDate();
    dialogHora.textContent = "Hora: " + getCurrentTime();

    const lastRegister = JSON.parse(localStorage.getItem("lastRegister"));
    if (lastRegister) {
        dialogUltimoRegistro.textContent = `Último Registro: ${lastRegister.date} | ${lastRegister.time} | ${lastRegister.type}`;
    } else {
        dialogUltimoRegistro.textContent = "Nenhum registro encontrado.";
    }

    abrirDialogoPonto(); 
});

btnFechar.addEventListener("click", function() {
    dialog.close();
    overlay.classList.remove("visible");
});

const btnRelatorio = document.getElementById('btn-relatorio');
btnRelatorio.addEventListener('click', function() {
    window.location.href = '../Relatorio/relatorio.html';
});

const btnDialogRegister = document.getElementById("btn-dialog-register");
btnDialogRegister.addEventListener("click", async () => {
    const dataRegistro = document.getElementById("data-registro").value; 
    const registerType = document.getElementById("register-type").value;
    const observacao = document.getElementById("observacao").value;

    if (new Date(dataRegistro) > new Date()) {
        alert("Não é permitido registrar um ponto em uma data futura.");
        return;
    }

    const register = await createRegisterObject(registerType, dataRegistro, observacao);
    
    saveRegisterLocalStorage(register);
    localStorage.setItem("lastRegister", JSON.stringify(register));

    showSuccessAlert();
    dialog.close(); 
});

// Justificativa de ausência
// Verificar o porque do botão ausência não está funcionando direito
const btnAusencia = document.getElementById('btn-ausencia');
btnAusencia.addEventListener('click', function() {
    abrirDialogoAusencia(); 
});

btnFecharAusencia.addEventListener('click', function() {
    dialogAusencia.close();
    overlay.classList.remove("visible");
});

const btnDialogAusencia = document.getElementById("btn-dialog-ausencia");
btnDialogAusencia.addEventListener("click", () => {
    const ausencia = document.getElementById("ausencia").value;
    const arquivo = document.getElementById("upload-arquivo").files[0]; 

    if (!ausencia) {
        alert("Por favor, descreva sua ausência.");
        return;
    }

    alert("Ausência registrada com sucesso!"); 
    dialogAusencia.close(); 
    overlay.classList.remove("visible");
});

function getCurrentTime() {
    const date = new Date();
    return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;
}

function getCurrentDate() {
    const date = new Date();
    return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
}

function getWeekDay() {
    const dayNames = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"];
    return dayNames[new Date().getDay()];
}

async function createRegisterObject(type, date, observation) {
    const location = await getUserLocation();
    return {
        date: date,
        time: getCurrentTime(),
        location: `Lat: ${location.latitude}, Long: ${location.longitude}`,
        type: type,
        observation: observation 
    };
}

function saveRegisterLocalStorage(register) {
    let registers = JSON.parse(localStorage.getItem("register")) || [];
    registers.push(register);
    localStorage.setItem("register", JSON.stringify(registers));
}

function showSuccessAlert() {
    const alertaSucesso = document.getElementById("alerta-ponto-registrado");
    alertaSucesso.classList.remove("hidden");
    alertaSucesso.classList.add("show");
    setTimeout(() => {
        alertaSucesso.classList.remove("show");
        alertaSucesso.classList.add("hidden");
    }, 3000);
}

function getUserLocation() {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
            position => resolve({ latitude: position.coords.latitude, longitude: position.coords.longitude }),
            error => reject("Erro ao obter localização: " + error.message)
        );
    });
}

function fecharTodosOsDialogos() {
    dialog.close();
    dialogAusencia.close();
    overlay.classList.remove("visible");
}

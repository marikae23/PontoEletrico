document.addEventListener("DOMContentLoaded", function () {
    // Atualiza a data e hora atuais
    setInterval(atualizarDataHora, 1000);
    atualizarDataHora();
});

function atualizarDataHora() {
    const elementoDataHora = document.getElementById("currentDateTime");
    const agora = new Date();
    elementoDataHora.innerText = agora.toLocaleString("pt-BR");
}

// Função para registrar ponto com a hora atual
function registrarPonto(tipo) {
    const agora = new Date();
    const ponto = {
        data: agora.toLocaleDateString("pt-BR"),
        hora: agora.toLocaleTimeString("pt-BR"),
        tipo: tipo,
        observacao: "",
        manual: false
    };
    salvarPonto(ponto);
}

// Função para registrar ponto manualmente
function registrarPontoManual() {
    const dataManual = document.getElementById("manualDate").value;
    const horaManual = document.getElementById("manualTime").value;
    const observacao = document.getElementById("observation").value;

    if (!dataManual || !horaManual) {
        alert("Preencha a data e hora.");
        return;
    }

    const dataHora = new Date(`${dataManual}T${horaManual}`);
    const agora = new Date();

    if (dataHora > agora) {
        alert("Não é possível registrar uma data futura.");
        return;
    }

    const ponto = {
        data: dataHora.toLocaleDateString("pt-BR"),
        hora: dataHora.toLocaleTimeString("pt-BR"),
        tipo: "manual",
        observacao: observacao,
        manual: true
    };
    salvarPonto(ponto);
}

// Função para registrar ausência com justificativa
function registrarAusencia() {
    const motivo = document.getElementById("absenceReason").value;
    const arquivo = document.getElementById("absenceFile").files[0];

    if (!motivo) {
        alert("Preencha o motivo da ausência.");
        return;
    }

    const ponto = {
        data: new Date().toLocaleDateString("pt-BR"),
        hora: "Ausente",
        tipo: "ausencia",
        motivo: motivo,
        arquivo: arquivo ? arquivo.name : "",
        manual: true
    };
    salvarPonto(ponto);
}

// Função para salvar o ponto no localStorage
function salvarPonto(ponto) {
    let pontos = JSON.parse(localStorage.getItem("pontos")) || [];

    // Evita registros duplicados para o mesmo tipo no mesmo dia
    const registroExistente = pontos.find(p => p.data === ponto.data && p.tipo === ponto.tipo && !p.manual);
    if (registroExistente) {
        alert("Já existe um registro de " + ponto.tipo + " para hoje.");
        return;
    }

    pontos.push(ponto);
    localStorage.setItem("pontos", JSON.stringify(pontos));
    alert("Ponto registrado com sucesso!");

    // Atualiza a exibição dos registros se houver uma seção de relatório na página
    if (typeof carregarRelatorio === 'function') {
        carregarRelatorio();
    }
}

// Função para carregar registros e atualizá-los em uma tabela
function carregarRegistros() {
    let pontos = JSON.parse(localStorage.getItem("pontos")) || [];
    const tabela = document.getElementById("tabelaRegistros");
    tabela.innerHTML = "";

    pontos.forEach((ponto, index) => {
        const linha = tabela.insertRow();
        linha.insertCell(0).innerText = ponto.data;
        linha.insertCell(1).innerText = ponto.hora;
        linha.insertCell(2).innerText = ponto.tipo;
        linha.insertCell(3).innerText = ponto.observacao;

        const editarCelula = linha.insertCell(4);
        const editarBotao = document.createElement("button");
        editarBotao.innerText = "Editar";
        editarBotao.onclick = () => editarRegistro(index);
        editarCelula.appendChild(editarBotao);
    });
}

// Função para editar um registro existente
function editarRegistro(index) {
    let pontos = JSON.parse(localStorage.getItem("pontos"));
    const ponto = pontos[index];

    const novaHora = prompt("Informe a nova hora:", ponto.hora);
    const novaObservacao = prompt("Informe a nova observação:", ponto.observacao);

    if (novaHora) ponto.hora = novaHora;
    if (novaObservacao) ponto.observacao = novaObservacao;

    localStorage.setItem("pontos", JSON.stringify(pontos));
    carregarRegistros();
}

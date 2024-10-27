document.addEventListener("DOMContentLoaded", function () {
    setInterval(atualizarDataHora, 1000); //função para constantemente retornar a hora -> 1 segundo
    atualizarDataHora(); //aparecer a hora logo apos inicio da pagina
});

function atualizarDataHora() { //funcao de atualizar hora
    const elementoDataHora = document.getElementById("currentDateTime"); //local aonde colocaremos a hora
    const agora = new Date(); // chatch da hora
    elementoDataHora.innerText = agora.toLocaleString("pt-BR"); // adaptação da hora para formato BR
}


function registrarPonto(tipo) { //funcao de registrar ponto
    const agora = new Date(); //recolhe hora atual
    const ponto = { //objeto ponto, que entrara em uma lista de pontos no localstorage
        data: agora.toLocaleDateString("pt-BR"), //adaptaçao pro br
        hora: agora.toLocaleTimeString("pt-BR"), //adaptaçao pro br
        tipo: tipo, //tipo recebido em um ponto padrao
        observacao: "",
        manual: false //nao foi inserido manualmente
    };
    salvarPonto(ponto); //salva o ponto criado
}


function registrarPontoManual() { //registrar ponto de forma manual
    const dataManual = document.getElementById("manualDate").value; //local de inserir data manual
    const horaManual = document.getElementById("manualTime").value; //local de inserir tempo manual
    const observacao = document.getElementById("observation").value; //local de inserir observação

    if (!dataManual || !horaManual) { //caso hora OU data nao foi inserida
        alert("Preencha a data e hora."); //alerte que precisa dos DOIS
        return;
    }

    const dataHora = new Date(`${dataManual}T${horaManual}`); //cria uma data com os parametros anteriores
    const agora = new Date(); // catch na hora atual

    if (dataHora > agora) { //checa se a hora inserida é maior que a hora atual
        alert("Não é possível registrar uma data futura."); //horas posteriores nao podem entrar
        return;
    }

    const ponto = { //cria objeto ponto que ira ser salvo
        data: dataHora.toLocaleDateString("pt-BR"), //adaptaçao pro br
        hora: dataHora.toLocaleTimeString("pt-BR"), //adaptaçao pro br
        tipo: "manual", //o tipo é manual
        observacao: observacao,
        manual: true //manual = true quer dizer que o ponto foi manualmente inserido
    };
    salvarPonto(ponto); // salva o ponto criado manualmente
}


function registrarAusencia() { //funcao para o registro de ausencia
    const motivo = document.getElementById("absenceReason").value; // catch no motivo da falta
    const arquivo = document.getElementById("absenceFile").files[0]; //pega o arquivo da falta

    if (!motivo) { //checa se existe um motivo
        alert("Preencha o motivo da ausência."); //caso nao tenha avise o usuario- precisa ter
        return;
    }

    const ponto = { //criar objeto ponto
        data: new Date().toLocaleDateString("pt-BR"), //data atual convertida pro br
        hora: "Ausente", 
        tipo: "ausencia",
        motivo: motivo, //motivo da falta
        arquivo: arquivo ? arquivo.name : "", //salva o arquivo caso exista, se não coloca vazio
        manual: true //foi inserido manualmente
    };
    salvarPonto(ponto); //salvamento de ponto
}


function salvarPonto(ponto) { //funcao de salvar ponto
    let pontos = JSON.parse(localStorage.getItem("pontos")) || []; // checa se no local storage existe pontos (uma lista de ponto), caso nao tenha pontos se torna uma lista vazia

    
    const registroExistente = pontos.find(p => p.data === ponto.data && p.tipo === ponto.tipo && !p.manual); //check para ver se o ponto sendo salvo ja existe (nao devemos possuir o mesmo tipo de ponto na mesma data)
    if (registroExistente) { //faz o check caso exista
        alert("Já existe um registro de " + ponto.tipo + " para hoje."); //se existe alerta o usuario sobre
        return;
    }

    pontos.push(ponto); // coloca o ponto sendo salvo dentro da lista de pontos
    localStorage.setItem("pontos", JSON.stringify(pontos));//manda essa lista como JSON para o localstorage
    alert("Ponto registrado com sucesso!");//alerta que o ponto foi salvo
}
document.addEventListener("DOMContentLoaded", function () {
    carregarRelatorio();//carrega todos os relatorios com a pagina carregada
});

function carregarRelatorio() { //carrega os relatorios
    const pontos = JSON.parse(localStorage.getItem("pontos")) || []; //recebe os ponts do localstorage ou cria uma lista vazia
    const reportContent = document.getElementById("reportContent"); //acha o local aonde vamos colocar os pontos
    
    reportContent.innerHTML = "";//apaga todos os pontos em exibição

   
    const pontosAgrupados = agruparPontosPorData(pontos); //faz uma agrupação de ponto por data
    
    for (let data in pontosAgrupados) { //para cada data dentro da lista de pontos
        const dateSection = document.createElement("div"); //cria uma div
        dateSection.classList.add("date-section");//coloca a classe date-section na div criada para aplicação de CSS
        dateSection.innerHTML = `<h2>${data}</h2>`;//insere a data nessa div
        
        pontosAgrupados[data].forEach((ponto, index) => { //para cada data da lista dos pontos agrupados acessamos o ponto dessa lista e o index dele
            const pontoElement = document.createElement("div"); //criamos uma div
            pontoElement.classList.add("point-entry"); //adicionamos a classe point-entry para inserir CSS
            

            if (ponto.manual) { //se o ponto for colocado manualmente inserimos a classe manual-entry (para colocar uma barra vermelha na esquerda demonstrando que foi manual)
                pontoElement.classList.add("manual-entry");
            }
            
            
            pontoElement.innerHTML = `
                <p>Hora: ${ponto.hora}, Tipo: ${ponto.tipo} ${ponto.observacao ? "(Observação: " + ponto.observacao + ")" : ""}${ponto.arquivo ? "(arquivo: " + ponto.arquivo + ")": ""}</p>
                <button onclick="editarPonto('${data}', ${index})">Editar</button>
                <button onclick="excluirPonto()">Excluir</button>`; //modificamos a div criada para possuir as caracteristicas e inserimos um botao "editar" que executa uma funcao que permite a edicao desse ponto
            
            dateSection.appendChild(pontoElement); //colocamos a div de ponto dentro da div de data, fazendo com que os pontos sejam inseridos dentro de sua data especifica
        });
        
        reportContent.appendChild(dateSection); //coloca a div de data dentro da div aonde todos os pontos se localizam
    }
}

function agruparPontosPorData(pontos) { //agrupando os pontos por data
    const agrupados = {}; //cria um objeto que recebera varias datas, para cada data coloca o ponto equivalente
    pontos.forEach(ponto => {
        if (!agrupados[ponto.data]) { //caso ainda nao exista essa data no objeto "agrupados" essa data é criada
            agrupados[ponto.data] = [];
        }
        agrupados[ponto.data].push(ponto); //coloca o ponto dentro da lista da data especifica dele
    });
    return agrupados;
}

function editarPonto(data, index) { //funcao para editar pontos
    const pontos = JSON.parse(localStorage.getItem("pontos")); //pegamos os pontos do localstorage
    const ponto = pontos.find((p, idx) => p.data === data && idx === index); //checamos se o existe um ponto com mesmo index e data, ou seja um ponto igual
    
    if (ponto) { //se existir um ponto igual
        
        const novaHora = prompt("Informe a nova hora:", ponto.hora); //criamos uma variavel para inserir nova hora, caso nenhuma for o ponto.hora é escolhido
        const novaObservacao = prompt("Informe a nova observação:", ponto.observacao);//criamos uma variavel para inserir nova obs, caso nenhuma for ponto.obs é escolhido
        
        if (novaHora) ponto.hora = novaHora; //checa se novahora existe a atribui a hora do ponto
        if (novaObservacao) ponto.observacao = novaObservacao; //checa se novaobservação existe e substitui a obs antiga pela nova

        localStorage.setItem("pontos", JSON.stringify(pontos));//atualiza o local storage com as mudanças
        carregarRelatorio(); //carrega todos os pontos novamente para mostrar o ponto editado
    }
}

function excluirPonto() { //nunca pode excluir pontos :/
    alert("Ponto não pode ser excluído.");
}

function filtrarPontos() { //funcao que aplica os filtros de ponto
    const filtro = document.getElementById("filter").value; //checa qual filtro selecionado
    let pontos = JSON.parse(localStorage.getItem("pontos")) || []; //catch nos pontos , caso nenhum lista vaiza
    const agora = new Date(); //pega hora atual

    if (filtro === "lastWeek") { //se o filtro for "lastweek", ou seja ultima semana
        const umaSemanaAtras = new Date(); //data que sera de uma semana atras
        umaSemanaAtras.setDate(agora.getDate() - 7); //data de uma semana atras

        pontos = pontos.filter(ponto => { //filtra a lista de pontos que temos
            const dataPonto = new Date(ponto.data.split('/').reverse().join('-')); //new date recebe yyyy-mm-dd , como nossa data esta em PT-BR nos voltamos para o padrao
            return dataPonto >= umaSemanaAtras;//retorna TRUE se a data tiver acontecido a menso dee uma semana, adicionando o ponto nos pontos
        });
    } else if (filtro === "lastMonth") { //mesma coisa que o da semana passada mas dessa vez para um mes
        const umMesAtras = new Date();
        umMesAtras.setMonth(agora.getMonth() - 1); //diminui o mes em 1 ao inves de diminuir os dias em 7
        pontos = pontos.filter(ponto => {
            const dataPonto = new Date(ponto.data.split('/').reverse().join('-'));
            return dataPonto >= umMesAtras;
        });
    }

  
    const reportContent = document.getElementById("reportContent"); // onde colocaremos os pontos
    reportContent.innerHTML = ""; //limpa todos os pontos
    const pontosAgrupados = agruparPontosPorData(pontos); //agrupa por data

    for (let data in pontosAgrupados) {
        const dateSection = document.createElement("div"); //cria div
        dateSection.classList.add("date-section"); //aplica classe
        dateSection.innerHTML = `<h2>${data}</h2>`;//data da div

        pontosAgrupados[data].forEach((ponto, index) => { //da mesma forma que carregar relatorio ele ira inserir os pontos, contudo usando os pontos filtrados e nao todos eles
            const pontoElement = document.createElement("div");
            pontoElement.classList.add("point-entry");

            
            if (ponto.manual) {
                pontoElement.classList.add("manual-entry");
            }
            if (ponto.observacao) {
                pontoElement.classList.add("observation-entry");
            }

            pontoElement.innerHTML = `
                <p>Hora: ${ponto.hora}, Tipo: ${ponto.tipo} ${ponto.observacao ? "(Observação: " + ponto.observacao + ")" : ""}${ponto.arquivo ? "(arquivo: " + ponto.arquivo + ")": ""}</p>
                <button onclick="editarPonto('${data}', ${index})">Editar</button>
                <button onclick="excluirPonto()">Excluir</button> 
            `; 

            dateSection.appendChild(pontoElement);
        });

        reportContent.appendChild(dateSection);
    }
}
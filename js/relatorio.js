document.addEventListener("DOMContentLoaded", function () {
    carregarRelatorio();
});

function carregarRelatorio() {
    // Recupera os pontos do localStorage
    const pontos = JSON.parse(localStorage.getItem("pontos")) || [];
    const reportContent = document.getElementById("reportContent");
    
    reportContent.innerHTML = "";

    // Agrupa os pontos por data
    const pontosAgrupados = agruparPontosPorData(pontos);
    
    for (let data in pontosAgrupados) {
        const dateSection = document.createElement("div");
        dateSection.classList.add("date-section");
        dateSection.innerHTML = `<h2>${data}</h2>`;
        
        pontosAgrupados[data].forEach((ponto, index) => {
            const pontoElement = document.createElement("div");
            pontoElement.classList.add("point-entry");
            
            // Marcação diferenciada para entradas manuais e com observação
            if (ponto.manual) {
                pontoElement.classList.add("manual-entry");
            }
            if (ponto.observacao) {
                pontoElement.classList.add("observation-entry");
            }
            
            pontoElement.innerHTML = `
                <p>Hora: ${ponto.hora}, Tipo: ${ponto.tipo} ${ponto.observacao ? "(Observação: " + ponto.observacao + ")" : ""}</p>
                <button onclick="editarPonto('${data}', ${index})">Editar</button>
                <button onclick="excluirPonto()">Excluir</button>
            `;
            
            dateSection.appendChild(pontoElement);
        });
        
        reportContent.appendChild(dateSection);
    }
}

function agruparPontosPorData(pontos) {
    const agrupados = {};
    pontos.forEach(ponto => {
        if (!agrupados[ponto.data]) {
            agrupados[ponto.data] = [];
        }
        agrupados[ponto.data].push(ponto);
    });
    return agrupados;
}

function editarPonto(data, index) {
    const pontos = JSON.parse(localStorage.getItem("pontos"));
    const ponto = pontos.find((p, idx) => p.data === data && idx === index);
    
    if (ponto) {
        // Solicita ao usuário os novos valores para o ponto
        const novaHora = prompt("Informe a nova hora:", ponto.hora);
        const novaObservacao = prompt("Informe a nova observação:", ponto.observacao);
        
        if (novaHora) ponto.hora = novaHora;
        if (novaObservacao) ponto.observacao = novaObservacao;
        
        // Atualiza o ponto no localStorage
        localStorage.setItem("pontos", JSON.stringify(pontos));
        carregarRelatorio();
    }
}

function excluirPonto() {
    alert("Ponto não pode ser excluído.");
}

function filtrarPontos() {
    const filtro = document.getElementById("filter").value;
    let pontos = JSON.parse(localStorage.getItem("pontos")) || [];
    const agora = new Date();
    
    if (filtro === "lastWeek") {
        const umaSemanaAtras = new Date();
        umaSemanaAtras.setDate(agora.getDate() - 7);
        pontos = pontos.filter(ponto => new Date(ponto.data) >= umaSemanaAtras);
    } else if (filtro === "lastMonth") {
        const umMesAtras = new Date();
        umMesAtras.setMonth(agora.getMonth() - 1);
        pontos = pontos.filter(ponto => new Date(ponto.data) >= umMesAtras);
    }
    
    const reportContent = document.getElementById("reportContent");
    reportContent.innerHTML = "";
    const pontosAgrupados = agruparPontosPorData(pontos);
    
    for (let data in pontosAgrupados) {
        const dateSection = document.createElement("div");
        dateSection.classList.add("date-section");
        dateSection.innerHTML = `<h2>${data}</h2>`;
        
        pontosAgrupados[data].forEach((ponto, index) => {
            const pontoElement = document.createElement("div");
            pontoElement.classList.add("point-entry");
            
            // Marcação diferenciada para entradas manuais e com observação
            if (ponto.manual) {
                pontoElement.classList.add("manual-entry");
            }
            if (ponto.observacao) {
                pontoElement.classList.add("observation-entry");
            }
            
            pontoElement.innerHTML = `
                <p>Hora: ${ponto.hora}, Tipo: ${ponto.tipo} ${ponto.observacao ? "(Observação: " + ponto.observacao + ")" : ""}</p>
                <button onclick="editarPonto('${data}', ${index})">Editar</button>
                <button onclick="excluirPonto()">Excluir</button>
            `;
            
            dateSection.appendChild(pontoElement);
        });
        
        reportContent.appendChild(dateSection);
    }
}

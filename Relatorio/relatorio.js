document.addEventListener("DOMContentLoaded", () => {
    const tabelaRelatorio = document.getElementById("tabela-relatorio").getElementsByTagName("tbody")[0];
    const registros = JSON.parse(localStorage.getItem("register")) || [];
    const filtroSemana = document.getElementById("filtro-semana");
    const filtroMes = document.getElementById("filtro-mes");
    
    function adicionarRegistros(registrosFiltrados) {
        tabelaRelatorio.innerHTML = "";
        registrosFiltrados.forEach((registro, index) => {
            const linha = tabelaRelatorio.insertRow();
            linha.insertCell(0).textContent = registro.date;
            linha.insertCell(1).textContent = registro.time;
            linha.insertCell(2).textContent = registro.type;
            linha.insertCell(3).textContent = `Lat: ${registro.location.latitude}, Long: ${registro.location.longitude}`;
            linha.insertCell(4).textContent = registro.observacao || "-";

            const celulaAcoes = linha.insertCell(5);
            const btnEditar = document.createElement("button");
            const btnExcluir = document.createElement("button");

            btnEditar.textContent = "Editar";
            btnEditar.addEventListener("click", () => editarRegistro(index));
            btnExcluir.textContent = "Excluir";
            btnExcluir.addEventListener("click", () => alert("Não é possível excluir um ponto registrado."));

            celulaAcoes.appendChild(btnEditar);
            celulaAcoes.appendChild(btnExcluir);
        });
    }

    const btnRelatorio = document.getElementById('btn-voltar');
        btnRelatorio.addEventListener('click', function() {
            window.location.href = '../Index/index.html';
        });

    filtroSemana.addEventListener("click", () => {
        const registrosFiltrados = registros.filter((registro) => {
            const dataRegistro = new Date(registro.date.split("/").reverse().join("-"));
            const dataAtual = new Date();
            return (dataAtual - dataRegistro) / (1000 * 60 * 60 * 24) <= 7;
        });
        adicionarRegistros(registrosFiltrados);
    });

    filtroMes.addEventListener("click", () => {
        const registrosFiltrados = registros.filter((registro) => {
            const dataRegistro = new Date(registro.date.split("/").reverse().join("-"));
            const dataAtual = new Date();
            return (dataAtual - dataRegistro) / (1000 * 60 * 60 * 24) <= 30;
        });
        adicionarRegistros(registrosFiltrados);
    });

    adicionarRegistros(registros);
});

function editarRegistro(index) {
    const registros = JSON.parse(localStorage.getItem("register")) || [];
    const registro = registros[index];
    // Exibir um diálogo para editar (ou reabasteça o formulário de registro e reutilize)
    // Atualize no localStorage após a edição
    // Adicione uma lógica de edição aqui.
}

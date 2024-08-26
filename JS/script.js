const data = new Date();

//Retorna a hora atual (Hora, minuto e segundo)
function getCurrentTime() {
    const date = new Date();
    return date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
}

//Retorna a data atual no padrão DD/MM/AAAA
function getCurrentDate() {
    const date = new Date();
    
    let mes = date.getMonth() + 1

    return date.getDate() + "/" + mes + "/" + date.getFullYear();
}

console.log(getCurrentTime());
console.log(getCurrentDate());
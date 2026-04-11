const divLogin = document.querySelector('.login'); 
const formulario = document.getElementById('loginForm');
const divCalculo = document.querySelector('.calculoCashback'); 
const botaoCalcular = document.getElementById('botaoCalcular');

// 1. LÓGICA DE LOGIN (Para esconder a caixa branca e mostrar o cálculo)
formulario.addEventListener('submit', function(event) {
    event.preventDefault(); 
    
    const nomeUsuario = document.getElementById('usuario').value;

    if (divLogin) divLogin.style.display = 'none'; // Esconde a div login inteira
    
    if (divCalculo) {
        divCalculo.style.display = 'block'; 
        divCalculo.classList.add('mostrar');
    }

    const titulo = document.querySelector('h1');
    if (titulo) titulo.innerText = `Bem-vindo, ${nomeUsuario}!`;
});

// 2. LÓGICA DE CÁLCULO LOCAL (Sem precisar do servidor Flask agora)
// 2. LÓGICA DE CÁLCULO E ENVIO PARA O BANCO
botaoCalcular.addEventListener('click', async function() { // Adicionamos 'async' aqui
    const valorDigitado = parseFloat(document.getElementById('valorCompra').value);
    const checkVip = document.getElementById('isVip');
    const eVip = (checkVip && checkVip.checked);

    if (isNaN(valorDigitado) || valorDigitado <= 0) {
        alert("Por favor, digite um valor válido.");
        return;
    }

    // Cálculos
    let taxaBase = valorDigitado > 500 ? 0.10 : 0.05;
    let cashbackBase = valorDigitado * taxaBase;
    let cashbackTotal = eVip ? cashbackBase * 1.10 : cashbackBase;

    // 1. Exibição no site (o que você já tinha)
    const campoResultado = document.getElementById('resultado');
    if (campoResultado) {
        const infoTaxa = (taxaBase * 100).toFixed(0);
        const rotuloVip = eVip ? " + Bônus VIP" : "";
        campoResultado.innerText = `Cashback (${infoTaxa}%${rotuloVip}): R$ ${cashbackTotal.toFixed(2)}`;
    }

    // 2. ENVIO PARA O PYTHON (O que estava faltando!)
    try {
        await fetch('https://sistema-cashback-ses5.onrender.com/calcular', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                valor: valorDigitado,
                vip: eVip
            })
        });
        console.log("Dados enviados para o banco com sucesso!");
    } catch (erro) {
        console.error("Erro ao conectar com o servidor Python:", erro);
    }
});

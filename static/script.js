const divLogin = document.querySelector('.login'); 
const formulario = document.getElementById('loginForm');
const divCalculo = document.querySelector('.calculoCashback'); 
const botaoCalcular = document.getElementById('botaoCalcular');

formulario.addEventListener('submit', function(event) {
    event.preventDefault(); 
    
    const nomeUsuario = document.getElementById('usuario').value;

    if (divLogin) divLogin.style.display = 'none';
    
    if (divCalculo) {
        divCalculo.style.display = 'block'; 
        divCalculo.classList.add('mostrar');
    }

    const titulo = document.querySelector('h1');
    if (titulo) titulo.innerText = `Bem-vindo, ${nomeUsuario}!`;
});


botaoCalcular.addEventListener('click', async function() { 
    const valorDigitado = parseFloat(document.getElementById('valorCompra').value);
    const checkVip = document.getElementById('isVip');
    const eVip = (checkVip && checkVip.checked);

    if (isNaN(valorDigitado) || valorDigitado <= 0) {
        alert("Por favor, digite um valor válido.");
        return;
    }

    
    let taxaBase = valorDigitado > 500 ? 0.10 : 0.05;
    let cashbackBase = valorDigitado * taxaBase;
    let cashbackTotal = eVip ? cashbackBase * 1.10 : cashbackBase;

    
    const campoResultado = document.getElementById('resultado');
    if (campoResultado) {
        const infoTaxa = (taxaBase * 100).toFixed(0);
        const rotuloVip = eVip ? " + Bônus VIP" : "";
        campoResultado.innerText = `Cashback (${infoTaxa}%${rotuloVip}): R$ ${cashbackTotal.toFixed(2)}`;
    }

    
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

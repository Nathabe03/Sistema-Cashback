from flask import Flask, request, jsonify, render_template
import httpx 
import os

# Configuramos o static_folder='.' para o Flask achar o CSS e JS na pasta principal
app = Flask(__name__, template_folder='templates', static_folder='.')

# Configuração manual para o CORS
@app.after_request
def add_cors_headers(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
    response.headers.add('Access-Control-Allow-Methods', 'POST, GET')
    return response

URL_BASE = "https://khmbgkydgrncwghjbuck.supabase.co/rest/v1/historico_consultas"
CHAVE_ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtobWJna3lkZ3JuY3dnaGpidWNrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU4NDYwNTIsImV4cCI6MjA5MTQyMjA1Mn0.GN_6mhsU5UA2IiC3Hp2oVkp8eKFSGpGGhu6hdn6Tlm4"

# NOVA ROTA: Quando você abrir o link do Render, ele vai ler esta parte
@app.route('/')
def home():
    return render_template('index.html')

@app.route('/calcular', methods=['POST'])
def rota_calcular():
    dados = request.json
    valor = float(dados.get('valor', 0))
    cupom = float(dados.get('cupom', 0))
    vip = dados.get('vip', False)
    
    valor_com_desconto = valor * (1 - (cupom / 100))
    taxa = 0.10 if valor_com_desconto > 500 else 0.05
    cashback = valor_com_desconto * taxa
    if vip: cashback *= 1.10
    
    resultado = round(cashback, 2)

    headers = {
        "apikey": CHAVE_ANON,
        "Authorization": f"Bearer {CHAVE_ANON}",
        "Content-Type": "application/json",
        "Prefer": "return=minimal"
    }
    
    payload = {
        "usuario_ip": request.remote_addr,
        "tipo_cliente": "VIP" if vip else "Comum",
        "valor_compra": valor,
        "valor_cashback": resultado
    }

    try:
        with httpx.Client() as client:
            client.post(URL_BASE, json=payload, headers=headers)
    except:
        pass 

    return jsonify({"cashback": resultado})

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port)

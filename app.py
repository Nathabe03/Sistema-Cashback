from flask import Flask, request, jsonify, render_template
import httpx 
import os

app = Flask(__name__, template_folder='templates', static_folder='static')

@app.after_request
def add_cors_headers(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
    response.headers.add('Access-Control-Allow-Methods', 'POST, GET')
    return response

URL_BASE = os.getenv("SUPABASE_URL")
CHAVE_ANON = os.getenv("SUPABASE_KEY")

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

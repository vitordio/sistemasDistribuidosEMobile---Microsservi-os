const express = require('express')
const axios = require('axios');

const app = express();
app.use(express.json());

const palavraChave = 'importante';
const funcoes = {
    ObversacaoCriada: (observacao) => {
        observacao.status = observacao.texto.include(palavraChave) ? 'importante' : 'comum';
        axios.post('http://172.26.240.1/eventos', {
            tipo: 'ObservacaoClassificada',
            dados: observacao
        });
    }
}
app.post('/eventos', (req, res) => {
    try {
        const objeto = funcoes[req.body.tipo]
        objeto(req.body.dados);
    } catch (err) {}
    
    res.status(200).send({ msg: 'OK' });
});

app.listen(7000, () => console.log("Classificação. Porta 7000"));
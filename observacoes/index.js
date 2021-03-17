const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());

// Objeto para guardar as observações de cada lembrete
const observacoesPorLembreteId = {};

// Gerador de IDs
const { v4: uuuidv4 } = require('uuid');

// :id é um placeholder
// exemplo: /lembretes/1222/observacoes
app.post('/lembretes/:id/observacoes', async (req, res) => {
    const idObs = uuuidv4();
    const { texto } = req.body;

    // req.params dá acesso à lista de parâmetros da URl
    const observacoesDoLembrete = observacoesPorLembreteId[req.params.id] || [];
    observacoesDoLembrete.push({ id: idObs, texto });

    observacoesPorLembreteId[req.params.id] = observacoesDoLembrete;

    await axios.post('http://localhost:1000/eventos', {
        tipo: 'ObservacaoCriada',
        dados: {
            id: idObs,
            lembreteId: req.params.id
        }
    })

    res.status(201).send(observacoesDoLembrete)

});

// Para cada microsserviço, a recepção de eventos é feita no endpoint /eventos usando o método POST
// adicioamos essa requisição a ambos microsservicos de lembretes e observações
app.post('/eventos', (req, res) => {
    console.log(req.body);
    res.status(200).send({ msg: 'OK' });
})

app.get('/lembretes/:id/observacoes', (req, res) => {
    res.send(observacoesPorLembreteId[req.params.id] || []);
});

app.listen(5000, (() => console.log('Observações do lembrete. Porta 5000') ));
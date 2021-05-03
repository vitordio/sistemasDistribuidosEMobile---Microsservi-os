const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());

// Objeto para guardar as observações de cada lembrete
const observacoesPorLembreteId = {};

// Gerador de IDs
const { v4: uuuidv4 } = require('uuid');

const funcoes = {
    ObservacaoClassificada: (observacao) => {
        const observacoes = observacoesPorLembreteId[observacao.lembreteId]
        const observacaoParaAtualizar = observacoes.find(obs => obs.id === observacao.id)
        observacaoParaAtualizar.status = observacao.status;

        axios.post('http://172.26.240.1:1000', {
            tipo: 'ObservacaoAtualizada',
            dados: {
                id: observacao.id,
                texto: observacao.texto,
                lembreteId: observacao.lembreteId,
                status: observacao.status
            }
        })
    }
}
// :id é um placeholder
// exemplo: /lembretes/1222/observacoes
app.post('/lembretes/:id/observacoes', async (req, res) => {
    const idObs = uuuidv4();
    const { texto } = req.body;

    // req.params dá acesso à lista de parâmetros da URl
    const observacoesDoLembrete = observacoesPorLembreteId[req.params.id] || [];
    observacoesDoLembrete.push({ id: idObs, texto, status: 'aguardando' });

    observacoesPorLembreteId[req.params.id] = observacoesDoLembrete;

    await axios.post('http://172.26.240.1:1000/eventos', {
        tipo: 'ObservacaoCriada',
        dados: {
            id: idObs,
            lembreteId: req.params.id,
            status: 'aguardando'
        }
    })

    res.status(201).send(observacoesDoLembrete)

});

// Para cada microsserviço, a recepção de eventos é feita no endpoint /eventos usando o método POST
// adicioamos essa requisição a ambos microsservicos de lembretes e observações
app.post('/eventos', (req, res) => {
    try {
        const objeto = funcoes[req.body.tipo]
        objeto(req.body.dados);
    } catch (err) {}
    
    res.status(200).send({ msg: 'OK' });
})

app.get('/lembretes/:id/observacoes', (req, res) => {
    res.send(observacoesPorLembreteId[req.params.id] || []);
});

app.listen(5000, (() => console.log('Observações do lembrete. Porta 5000') ));
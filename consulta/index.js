const express = require('express');
const axios = require('axios')

const app = express();
app.use(express.json());

// O microsserviço de consulta atualiza a base de acordo com o tipo do evento que recebe
/*
    - EventoCriado - Acessa a base usando o identicador do lembrete e associa
    a ele o objeto existente no campo dados do evento.

    - ObservacaoCriada - Acessa a base usando o identicador do lembrete a que
    a observação criada está associada. A seguir, acessa o campo observacoes
    do lembrete - criando uma lista vazia caso ainda não exista - e adiciona o
    objeto existente no campos dados do evento à coleção.
*/
const baseConsulta = {};

// As funções de tratamento de evento serão valores em um mapa - um objeto
// JSON - em que as chaves são os tipos dos respectivos eventos.
const funcoes = {
    LembreteCriado: (lembrete) => {
        console.log(lembrete);
        baseConsulta[lembrete.idLembrete] = lembrete;
    },
    ObservacaoCriada: (observacao) => {
        const observacoes = baseConsulta[observacao.lembreteId]['observacoes'] || [];
        observacoes.push(observacao);
        baseConsulta[observacao.lembreteId]['observacoes'] = observacoes;
    },
    ObservacaoAtualizada: (observacao) => {
        const observacoes = baseConsulta[observacao.lembreteId]['observacoes']
        const indice = observacoes.findIndex(obs => obs.id === observacao.id);
        observacoes[indice] = observacao;
    }
}

app.get('/lembretes', (req, res) => {
    res.status(200).send(baseConsulta)
})

app.post('/eventos', (req, res) => {
    try {
        const objeto = funcoes[req.body.tipo];
        objeto(req.body.dados);
    } catch (err) {}

    res.status(200).send(baseConsulta);
})

// Sempre que o serviço entrar em execução, consultaremos a base de dados 
// do barramento e processa cada evento recebido
app.listen(6000, async () => {
    console.log('Consultas. Porta 6000');
    
    const resp = await axios.get('http://172.26.240.1/eventos')

    // axios entregará os dados na propriedade data
    resp.data.forEach((valor, indice, colecao) => {
        try{
            const objeto = funcoes[valor.tipo]
            objeto(valor.dados)
        } catch(err) {}
    })
}); 
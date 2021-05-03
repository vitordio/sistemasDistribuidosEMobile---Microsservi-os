const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());

// Gerador de IDs
const { v4: uuuidv4 } = require('uuid');

// Objeto para guardar os lembretes como se fosse uma base de dados
const lembretes = {};

app.get('/lembretes', (req, res) => {
    res.send(lembretes);
});

app.post('/lembretes', async (req, res) => {
    const idLembrete = uuuidv4();
    const { texto } = req.body;

    lembretes[idLembrete] = {
        idLembrete, texto
    }

    await axios.post("http://barramento-de-eventos-service:1000/eventos", {
        tipo: "LembreteCriado",
        dados: {
            idLembrete,
            texto
        }
    });

    res.status(201).send(lembretes[idLembrete]);
})

// Para cada microsserviço, a recepção de eventos é feita no endpoint /eventos usando o método POST
// adicioamos essa requisição a ambos microsservicos de lembretes e observações
app.post('/eventos', (req, res) => {
    console.log(req.body);
    res.status(200).send({ msg: 'OK' });
})

app.listen(4000, () => {
    console.log('Nova versão') 
    console.log('Nova versão agora usando versão Docker HUB.') 
    console.log('Lembretes. Porta 4000.') 
})
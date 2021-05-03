const express = require('express');
// para enviar eventos para os demais microsserviços
const axios = require('axios');

const app = express();
app.use(express.json());


// Base de dados de eventos para armazenar os eventos quando algum microsserviço estiver fora do ar
const eventos = [];

app.post('/eventos', (req, res) => {
    try {
        const evento = req.body;
        
        // Adicionamos o evento na base de dados
        eventos.push(evento);
    
        //envia o evento para o microsserviço de lembretes
        axios.post('http://lembretes-service:4000/eventos', evento);
    
        //envia o evento para o microsserviço de observações
        // axios.post('http://172.26.240.1:5000/eventos', evento);
        
        //envia o evento para o microsserviço de consulta
        // axios.post("http://172.26.240.1:6000/eventos", evento);
    
        // envia o evento para o microsserviço de classificacao
        // axios.post("http://172.26.240.1:7000/eventos", evento);
    } catch (err) {}

    res.status(200).send({ msg: 'OK' });
})

app.get('/eventos', (req, res) => {
    res.send(eventos)
})

app.listen((1000), () => console.log('Barramento de eventoss. Porta 1000'));
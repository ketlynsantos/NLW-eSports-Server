import express from 'express'

const app = express()

/**  HTP methods / API RESTful /
    HTTP Codes (Mostra se a resposta que recebemos é valida)
        Iniciados em 2 - Sucesso
        Iniciados em 3 - Redirecionamento
        Iniciados em 4 - Erros gerado pela nossa aplicação
        Iniciados em 5 - Erros inesperados

GET, POST, PUT(edição)), PATCH(edição de informações especificas), DELETE
*/

//Listagem de games
app.get('/games', (request, response) => {
    return response.json([])
})

//Criando ads
app.post('/ads', (request, response) => {
    return response.status(201).json([])
})

//Listando os anúncios de acordo com o jogo
app.get('/games/:id/ads', (request, response) => {
    // const gameId = request.params.id

    return response.json([
        { id: 1, name: 'Anúncio 1'},
        { id: 2, name: 'Anúncio 2'},
        { id: 3, name: 'Anúncio 3'},
        { id: 4, name: 'Anúncio 4'},
        { id: 5, name: 'Anúncio 5'},
    ])
})

app.get('/ads/:id/discord', (request, response) => {
    // const adId = request.params.id

    return response.json([])
})

app.listen(3333)
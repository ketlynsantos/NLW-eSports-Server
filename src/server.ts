import express from 'express'
import cors from 'cors'
import { PrismaClient } from '@prisma/client' 
import { convertHourStringToMinutes } from './utils/convert-hour-string-to-minutes'
import { convertMinutesToHoursStrig } from './utils/convert-minutes-to-hours-string'

const app = express()
const prisma = new PrismaClient({
    log: ['query']
})

/**  HTP methods / API RESTful /
    HTTP Codes (Mostra se a resposta que recebemos é valida)
        Iniciados em 2 - Sucesso
        Iniciados em 3 - Redirecionamento
        Iniciados em 4 - Erros gerado pela nossa aplicação
        Iniciados em 5 - Erros inesperados

GET, POST, PUT(edição)), PATCH(edição de informações especificas), DELETE
*/

app.use(express.json())
app.use(cors())

//Listagem de games
app.get('/games', async (request, response) => {
    const games = await prisma.game.findMany({
        include: {
          _count: {
            select: {
                ads: true
            }
          }
        }
    })

    return response.json(games)
})

//Criando ads
app.post('/games/:id/ads', async (request, response) => {
    const gameId = request.params.id
    const body = request.body

    const ad = await prisma.ad.create({
        data: {
            gameId: gameId,
            name: body.name,
            yearsPlaying: body.yearsPlaying,
            discord: body.discord,
            weekDays: body.weekDays.join(','),
            hourStart: convertHourStringToMinutes(body.hourStart),
            hourEnd: convertHourStringToMinutes(body.hourEnd),
            useVoiceChannel: body.useVoiceChannel,
        }
    })

    return response.status(201).json(ad)
})

//Listando os anúncios de acordo com o jogo
app.get('/games/:id/ads', async (request, response) => {
    const gameId = request.params.id

    const ads = await prisma.ad.findMany({
        //Para não mostrar o campo discord, selecionamos os campos 
        select: {
            id: true,
            name: true,
            weekDays: true,
            useVoiceChannel: true,
            yearsPlaying: true,
            hourStart: true,
            hourEnd: true
        },
        where: {
            gameId,
        },
        orderBy: {
            createdAt: 'desc'
        }
    })

    return response.json(ads.map(ad => {
        return {
            ...ad,
            weekDays: ad.weekDays.split(','),
            hourStart: convertMinutesToHoursStrig(ad.hourStart),
            hourEnd: convertMinutesToHoursStrig(ad.hourEnd)
        }
    }))
})

app.get('/ads/:id/discord', async (request, response) => {
    const adId = request.params.id

    const ad = await prisma.ad.findUniqueOrThrow({
        select: {
            discord: true,
        }, 
        where: {
            id: adId
        }
    })

    return response.json({
        discord: ad.discord,
    })
})

app.listen(3333)
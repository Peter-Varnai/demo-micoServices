/*
 *This file contains a restful API looking towards the frontend
 * and an event producer looking towards the Kafka queue.  
 */

import http from 'node:http';
import { Kafka } from 'kafkajs'
import { dateDiff } from '../helpers/helpers.js'
import { v4 as uuidv4 } from 'uuid'
import { hasDateConflict } from '../caching/cache.js'


const euroPerNight = 55
const cType = {'Content-Type': 'application/json'}
const kafka = new Kafka({
    clientID: 'test-app',
    brokers: ['localhost:9092'],
})


const producer = kafka.producer()
await producer.connect().then(() => {
    console.log('Kafka producer connected.')
}).catch(err => {
    console.error('Failed to connect Kafka producer:', err)
})


const server = http.createServer({ keepAliveTimeout: 60000 }, (req, res) => {

    if (req.method === 'POST' && req.headers['content-type'] === 'application/json') {
        let body = ''

        req.on('data', chunk => {
            body += chunk
        })

        req.on('end', async () => {

            // console.log(JSON.parse(body))
            try {
                const reservationJson = JSON.parse(body)

                const { checkIn, checkOut, apartmentId:aId } = reservationJson

                if (await hasDateConflict(aId, checkIn, checkOut)) {

                    res.writeHead(400, cType)
                    res.end(JSON.stringify({error: "reservation exists already"}))

                    return
                }


                if (checkIn && checkOut) {
                    reservationJson.duration = dateDiff(checkIn, checkOut)
                    reservationJson.price = reservationJson.duration * euroPerNight
                }
                console.log('Reservation request received:\n', reservationJson)

                const topicMessages = [{
                    topic: 'reservation-requests',
                    messages:[
                        {
                            key: 'reservation-request',
                            value: JSON.stringify({ ...reservationJson })
                        }
                    ]
                },
                    {
                        topic: 'payment-requests',
                        messages: [
                            {
                                key: 'payment', 
                                value: JSON.stringify({
                                    user: reservationJson.user,
                                    apartmentId: reservationJson.apartmentId,
                                    checkIn: reservationJson.checkIn,
                                    checkOut: reservationJson.checkOut,
                                        price: reservationJson.price,
                                    reservationId: uuidv4(),
                                    paymentId: uuidv4() 
                                })
                            }
                        ]
                    },
                ]

                await producer.sendBatch({topicMessages})

                res.writeHead(200, cType)
                res.end(JSON.stringify({message: 'JSON received'}))
            } catch (err) {
                console.error('Error:', err)

                res.writeHead(400, cType)
                res.end(JSON.stringify({error: err.message}))
            } 

            /*
             * TODO: Save to DB implementation 
             */

        })
    }

})

server.listen(8000, () => {
    console.log('Starting server on localhost 8000')
})

process.on('SIGTERM', async () => {
    await producer.disconnect()
    server.close()
})

process.on('SIGINT', async () => {
    await producer.disconnect()
    server.close()
})

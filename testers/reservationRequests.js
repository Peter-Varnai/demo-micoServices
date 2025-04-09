import { Kafka } from 'kafkajs'
import { getRandomDates, getRandomName } from '../helpers/helpers.js'
import { cancelConfirmation } from '../caching/cache.js'
import { rApartmantId } from '../helpers/helpers.js'


const kafka = new Kafka({
    clientID: 'test-app',
    brokers: ['localhost:9092'],
})

const producer = kafka.producer()

setInterval(() => {
    const { checkIn, checkOut } = getRandomDates()

    const data = {
        user: getRandomName(),
        checkIn: checkIn,
        checkOut: checkOut,
        apartmentId: rApartmantId(),
        status: 'PENDING',
        timeStamp: new Date().toISOString()
    }

    fetch('http://localhost:8000', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(res => res.text())
        .then(response => console.log('Response:', response))
        // .then(() => {
        //     const cancelledConfirmation = cancelConfirmation()
        //     
        //     console.log('CANCELLING RESERVATION:', cancelledConfirmation)
        //     producer.send({
        //         topic: 'cancel-confirmed-reservations',
        //         messages: [{
        //             value: JSON.stringify({
        //                 reservationId: cancelledConfirmation,
        //                 timeStamp: new Date().toISOString(),
        //             })
        //         }] 
        //     })                        
        // })
        .catch(err => console.error('Error:', err))
}, 1000)


process.on('SIGTERM', async () => {
    await producer.disconnect()
})

process.on('SIGINT', async () => {
    await producer.disconnect()
})

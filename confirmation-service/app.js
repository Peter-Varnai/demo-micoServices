import { Kafka } from 'kafkajs'
import { cacheReservation } from '../caching/cache.js'

const kafka = new Kafka({
    clientID: 'test-app',
    brokers: ['localhost:9092'],
})

const consumer = kafka.consumer({ 
    groupId: 'confirming-reservations',
    sessionTimeout: 30000, 
    heartbeatInterval: 3000,
    maxWaitTimeInMs: 500
})

const producer = kafka.producer()


async function reservationConfirm() {

    try {
        await consumer.connect()
        await consumer.subscribe({ 
            topic: 'payment-successful',
            fromBeginning: false
        })
        await producer.connect()

        console.log('   Confirmation produced connected.')
        await consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                try {
                    const payment = JSON.parse(message.value.toString())
                // if (!payment.transactionId || !payment.reservationId) {
                //   throw new Error('Invalid payment confirmation message')
                // }

                const { checkIn, checkOut, reservationId: rId, apartmentId: aId} = payment


                console.log('reservation confirm', checkIn, checkOut)
                await cacheReservation(rId, aId, checkIn, checkOut)

                await sendConfirmationEmail(payment)

                    await produceConfirmationEvent(payment)

                } catch (error) {
                    console.error(`Failed to process message:`, error)
                }
            }
        })
    } catch (error) {
        console.error('Consumer error:', error)
        process.exit(1)
    }
}


async function confirmReservation() {

    //TODO: implement DB update here
    //
    await new Promise (resolve => setTimeout(resolve, 15))
}


async function sendConfirmationEmail(payment) {
    // await new Promise (resolve => setTimeout(resolve, 45))
    console.log('Sending email of confirmed reservation:', payment)
}


async function produceConfirmationEvent(payment) {

    try {
        await producer.send({
            topic: 'confirmed-reservations',
            messages: [{
                value: JSON.stringify({
                    ...payment,
                    confirmedAt: new Date().toISOString()
                })
            }]
        }) 
    }catch (error) {
        console.error('Failed to produce confirmation;', error)
    }
}


reservationConfirm().catch(console.error)


process.on('SIGTERM', async () => {
  await consumer.disconnect()
  await producer.disconnect()
  process.exit(0)
})

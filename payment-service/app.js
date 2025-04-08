import { Kafka } from 'kafkajs'
import { v4 as uuidv4 } from 'uuid'

const kafka = new Kafka({
    clientID: 'test-app',
    brokers: ['localhost:9092'],
})



const consumer = kafka.consumer({ 
    groupId: 'payment-processing',
    sessionTimeout: 30000, 
    heartbeatInterval: 3000,
    maxWaitTimeInMs: 500
})
const producer = kafka.producer()


async function processPayment(message) {

    try { 
        const paymentRequest = JSON.parse(message.value.toString())

        await new Promise(resolve => setTimeout(resolve, 10));

        console.log('Processing payment:', paymentRequest)
        if (Math.random() < 0.1) {
            throw new Error('Random payment processing failure');
        }

        return {
            transactionId: uuidv4(),
            user: paymentRequest.user,
            reservationId: paymentRequest.reservationID,
            price: paymentRequest.price,
            timestamp: new Date().toISOString(),
            currency: '€', 
            status: 'completed',
        }
    } catch (error) {
        return {
            status: 'failed',
            error: error,
            originalRequest: message.value.toString(),
        }
    }
}


async function handleMessages() {
    await consumer.connect()
    await producer.connect()

    await consumer.subscribe({ topic: 'payment-requests', fromBeginning: false })

    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            try {
                const result = await processPayment(message)

                await producer.send({
                    topic: result.status === 'completed' 
                    ? 'payment-successful' 
                    : 'payment-failed',
                    messages: [{
                        value: JSON.stringify({
                            ...result,
                            processedAt: new Date().toISOString(),
                            kafkaOffset: message.offset
                        })
                    }]
                })
            } catch (error) {
                console.error('Message processing failed:', error)
            }
        },
    })
}


handleMessages().catch(console.error)


process.on('SIGTERM', async () => {
    await consumer.disconnect();
    await producer.disconnect();
});

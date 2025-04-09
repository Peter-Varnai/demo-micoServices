import { createClient } from 'redis'
import { rApartmantId } from '../helpers/helpers.js'


const redisClient = createClient({ url: 'redis://localhost:6379' })
await redisClient.connect()

const toTimestamp = dateStr => new Date(dateStr).getTime()

export async function hasDateConflict(apartmentId, checkIn, checkOut) {
    const key = `confirmed_reservations:${apartmentId}`
    const start = toTimestamp(checkIn)
    const end = toTimestamp(checkOut)

    const conflicts = await redisClient.zRangeByScore(key, 0, end)

    console.log('CHECKING FOR CONFLICTING RESERVATIONS', conflicts)
    for (const reservation of conflicts) {
        const parsed = JSON.parse(reservation)
        const existingStart = toTimestamp(parsed.checkIn)
        const existingEnd = toTimestamp(parsed.checkOut)
        
        const overlap = start < existingEnd && end > existingStart
        if (overlap) {
            return true
        }
    }

    return false
}


export async function cacheReservation(reservationId, apartmentId, checkIn, checkOut) {
    const resData = {
        reservationId,
        checkIn,
        checkOut
    }

    console.log('ADDING CONFIRMATION TO CACHE:', resData)

    redisClient.zAdd(`confirmed_reservations:${apartmentId}`, {
        score: toTimestamp(checkIn),
        value: JSON.stringify(resData)
    })
}


export async function cancelConfirmation() {
    const key =`confirmed_reservations:${rApartmantId()}`

    const count = await redisClient.zCard(key)

    if (count > 0) {
        const randomIndex = Math.floor(Math.random() * count)

        const [randomMember] = await redisClient.zRange(key, randomIndex, randomIndex)

        if (randomMember) {
            await redisClient.zRem(key, randomMember)
            console.log(`Confirmed reservation cancelled: ${randomMember}`)
            try {
                const parsed = JSON.parse(randomMember)
                return parsed.reservationId
            } catch (e) {
                console.error('Failed to parse member:', e)
            }
        }
    }
}

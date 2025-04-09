import { createClient } from 'redis'


const redisClient = createClient({ url: 'redis://localhost:6379' })
await redisClient.connect()

const toTimestamp = dateStr => new Date(dateStr).getTime()

export async function hasDateConflict(checkIn, checkOut) {
    const key = 'confirmed_reservations'
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



export async function cacheReservation(reservationId, checkIn, checkOut) {
    const resData = {
        reservationId,
        checkIn,
        checkOut
    }

    console.log('ADDING CONFIRMATION TO CACHE:', resData)

    redisClient.zAdd('confirmed_reservations', {
        score: toTimestamp(checkIn),
        value: JSON.stringify(resData)
    })

}

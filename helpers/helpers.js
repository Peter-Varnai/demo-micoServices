export function dateDiff(dateStr1, dateStr2) {
    const date1 = new Date(dateStr1)
    const date2 = new Date(dateStr2)
    const diffTime = Math.abs(date2 - date1)
    return Math.floor(diffTime / (1000 * 60 * 60 * 24))
}

export function getRandomDates() {
    const startDate = new Date()

    const randomOffset = Math.floor(Math.random() * 290)
    const checkIn = new Date(startDate)
    checkIn.setDate(checkIn.getDate() + randomOffset)

    const duration = 2 + Math.floor(Math.random() * 14) // 2–18
    const checkOut = new Date(checkIn)
    checkOut.setDate(checkIn.getDate() + duration)

    const format = d => d.toISOString().split('T')[0]

    return {
        checkIn: format(checkIn),
        checkOut: format(checkOut)
    }
}

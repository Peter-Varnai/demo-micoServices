export function dateDiff(dateStr1, dateStr2) {
    const date1 = new Date(dateStr1)
    const date2 = new Date(dateStr2)
    const diffTime = Math.abs(date2 - date1)
    return Math.floor(diffTime / (1000 * 60 * 60 * 24))
}

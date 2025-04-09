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

export function getRandomName() {
    const rNum1 = Math.floor(Math.random() * 30)
    const rNum2 = Math.floor(Math.random() * 30)

    return `${firstNames[rNum1]} ${surNames[rNum2]}}`
}


const firstNames = [
    "Taleri", "Anaya", "Sven", "Ravi", "Zahara",
    "Elias", "Noor", "Leandro", "Chika", "Marek",
    "Soraya", "Mateo", "Amina", "Jun", "Lina",
    "Kofi", "Emiko", "Aleks", "Tariq", "Isla",
    "Farid", "Nyasha", "Niko", "Yara", "Thiago",
    "Selin", "Omar", "Nadia", "Kian", "Ranya"
]

const surNames = [
    "Sanches", "Haddad", "Takeda", "Okonkwo", "Ivanov",
    "Fernandez", "Mbatha", "Dubois", "Yilmaz", "Kowalski",
    "Almeida", "Rahman", "Kim", "Petrov", "Gonzalez",
    "Singh", "Jafari", "Müller", "Nguyen", "Carvalho",
    "Bako", "Tanaka", "Novák", "Lemoine", "Silva",
    "Diop", "Abadi", "Rosales", "Chen", "Kaur"
]


export function rApartmantId() {

    return apartmanIds[Math.floor(Math.random() * 15)]
}

const apartmanIds = ['A1', 'A2', 'A3', 'A4', 'A5',
                    'B1', 'B2', 'B3', 'B4', 'B5',
                    'C1', 'C2', 'C3', 'C4', 'C5']


import { getRandomDates } from '../helpers/helpers.js'

setInterval(() => {

    const rNum1 = Math.floor(Math.random() * 30)
    const rNum2 = Math.floor(Math.random() * 30)

    const { checkIn, checkOut } = getRandomDates()

    const data = {
        user: `${firstNames[rNum1]} ${surNames[rNum2]}}`,
        checkIn: checkIn,
        checkOut: checkOut,
        apartmentId: 'A1',
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
        .catch(err => console.error('Error:', err))
}, 1000)


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




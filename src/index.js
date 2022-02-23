import app from './app'

const mongoose = require('mongoose')

//Connection To Mongodb
const uri = 'mongodb+srv://TourApp:hola1234@cluster0.jeuwo.mongodb.net/mgtravelisimodb_tour?retryWrites=true&w=majority'

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(()=> console.log('[2] Connected to Mongo :)')) 
  .catch(e => console.log('error de conexión', e))

async function main() {
    await app.listen(3000)
    console.log('[1] The app is running on: http://localhost:3000/')
}

main()
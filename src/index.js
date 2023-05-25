import app from './app.js'

async function main() {
    await app.listen(3000)
    console.log('[1] The app is running on: http://localhost:3000/')
}

main()
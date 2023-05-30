import app from './app.js'

async function main() {
    await app.listen(3001)
    console.log('[1] The app is running on: http://localhost:3001/')
}

main()
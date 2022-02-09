import express, { json } from 'express'
import morgan from 'morgan'
import md_tour_rt from "./routes/md_tour.routes"

const app = express()



//Middleware
app.use(morgan('dev'))
app.use(json())

//Routes
app.use("/api/md_tour", md_tour_rt)

export default app;






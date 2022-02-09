import express, { json } from 'express'
import morgan from 'morgan'
import md_tour_rt from "./routes/md_tour.routes"
import gcm_country_rt from "./routes/gcm_country.routes"
import gcm_state_rt from "./routes/gcm_state.routes"
import gcm_city_rt from "./routes/gcm_city.routes"
import address_tour_rt from "./routes/to_address_t.routes"

const app = express()



//Middleware
app.use(morgan('dev'))
app.use(json())

//MD_tour
app.use("/api/md_tour", md_tour_rt)
//Address_tour
app.use("/api/gcm_country",gcm_country_rt)
app.use("/api/gcm_state",gcm_state_rt)
app.use("/api/gcm_city",gcm_city_rt)
app.use("/api/address_tour",address_tour_rt)

export default app;






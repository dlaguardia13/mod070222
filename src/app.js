import express, { json } from 'express'
import morgan from 'morgan'
import md_tour_rt from "./routes/md_tour.routes"
import address_tour_rt from "./routes/to_address_t.routes"
import gcm_country_rt from "./routes/general/gcm_country.routes"
import gcm_state_rt from "./routes/general/gcm_state.routes"
import gcm_city_rt from "./routes/general/gcm_city.routes"
import gcm_complements_rt from "./routes/general/gcm_complement.routes"
import additionalInfo_rt from "./routes/tourAdditional.routes"
import whatWillSee from "./routes/tourWillSeeAndWhat.routes"
import vailability_tr from "./routes/av_for_months.routes"
import itinerary_rt from "./routes/tourItinerary.routes"
import price_type_rt from "./routes/tourPriceType.routes"
import cancellation_rt from "./routes/tourCancellationPolicy.routes"
import custom_terms_rt from "./routes/tourCustomTerm.routes"
import adv_chanels_rt from "./routes/advertisingChanels.routes"

const app = express()



//Middleware
app.use(morgan('dev'))
app.use(json())

//MD_tour
app.use("/api/md_tour", md_tour_rt)
//Tour: Address
app.use("/api/address_tour",address_tour_rt)
//Tour: Addtirional info
app.use("/api/addiInfo",additionalInfo_rt)
//Tour: "Will see" and "what"
app.use("/api/WhatWillSee", whatWillSee)
//Tour: Availability
app.use("/api/availability", vailability_tr)
//Tour: Itinerary
app.use("/api/itinerary", itinerary_rt)
//Tour: Cancellation
app.use("/api/cancellation-policy", cancellation_rt)
//Tour: Price type
app.use("/api/prices", price_type_rt)
//Tour: Service Rules
app.use("/api/service-rules", custom_terms_rt)
//Tour: advertising chanels
app.use("/api/advertising-chanels", adv_chanels_rt)
//general
app.use("/api/gcm_complements", gcm_complements_rt)
app.use("/api/gcm_country",gcm_country_rt)
app.use("/api/gcm_state",gcm_state_rt)
app.use("/api/gcm_city",gcm_city_rt)

export default app;






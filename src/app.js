import express, { json } from 'express'
import morgan from 'morgan'

import user from "./routes/user.routes.js";
import op from "./routes/operation.routes.js";

const app = express()

//Middleware
app.use(morgan('dev'))
app.use(json())

app.use("/api/user", user);
app.use("/api/operation", op);

export default app;






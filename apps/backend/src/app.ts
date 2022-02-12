import express from "express"
import morgan from "morgan"
import "express-async-errors"
import { json, superjsonMdw } from "./super-json"
import video from "./video"
import words from "./words"

export const app = express()

app.disable("x-powered-by")
app.use(morgan("dev"))

// Communication between the backend and the frontend uses under the hood superjson representation
// See : https://www.npmjs.com/package/superjson
// This allow typing to be coherent between the backend and the frontend.
// For example, a Date coming from prisma will be serialize as a json string,
// but automatically transform back to a Date instance on frontend using superjson
// app.use(superjsonMdw)

app.get("/meuh", async (req, res) => {
  json(res, { meuh: true })
})

app.get("/error", async () => {
  throw new Error("Oups !")
})

app.use("/video", video)
app.use("/words", words)

import express from "express"
import { processRequestParams } from "zod-express-middleware"
import { wordsInput } from "@vitexte/api"
import { json } from "./super-json"
import path from "path"
import { readFile } from "fs/promises"

export const words = [
  processRequestParams(wordsInput),
  async (req: express.Request, res: express.Response) => {
    const id = req.params.id
    const dataPath = path.join(path.dirname(__dirname), "data")
    const jsonPath = path.join(dataPath, `video-${id}.json`)
    const words = JSON.parse(await readFile(jsonPath, { encoding: "utf-8" }))
    json(res, words) // TODO WordsOutput type not used here
  },
]

const router = express.Router()
router.get("/:id", ...words)
export default router

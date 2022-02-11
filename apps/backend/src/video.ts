import express from "express"
import { processRequestParams } from "zod-express-middleware"
import { videoInput, WordsOutput } from "@vitexte/api"
import createError from "http-errors"
import { json, superjsonMdw } from "./super-json"
import path from "path"
import { debugLogger } from "./debug"

export const video = [
  processRequestParams(videoInput),
  async (req: express.Request, res: express.Response) => {
    const id = req.params.id
    const dataPath = path.join(path.dirname(__dirname), "data")
    const videoPath = path.join(dataPath, `video-${id}.webm`)
    res.download(videoPath)
  },
]

const router = express.Router()
router.get("/:id", ...video)
export default router

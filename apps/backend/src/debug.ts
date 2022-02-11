import express from "express"

export const debugLogger =
  (tag: string) => (req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.log("log", tag, req.url, req.params, req.query, req.body, req.headers)
    next()
  }

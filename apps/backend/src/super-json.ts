import superjson from "superjson"
import express from "express"
import getRawBody from "raw-body"

export const superjsonMdw = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const buffer = await getRawBody(req, {
      length: req.headers["content-length"],
      limit: "1mb",
    })
    // eslint-disable-next-line import/no-named-as-default-member
    req.body = superjson.parse(buffer.toString())
    console.log("body", req.body, typeof buffer, buffer, buffer.toString())
    return next()
  } catch (err) {
    // no body or unable to parse ?
    if (err instanceof SyntaxError) {
      return next()
    } else {
      return next(err)
    }
  }
}

export const json = (res: express.Response, data: unknown) => {
  res.send(superjson.stringify(data))
}

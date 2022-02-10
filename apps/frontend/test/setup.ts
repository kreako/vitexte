import { config } from "dotenv"
import { beforeAll } from "vitest"
import path from "path"

beforeAll(() => {
  const envPath = path.join(path.dirname(__dirname), ".env")
  console.log("loading .env from", envPath)
  const result = config({ path: envPath })
  if (result.error) {
    throw result.error
  }
})

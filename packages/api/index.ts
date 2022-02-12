import { z } from "zod"

// words
export const wordsInput = z.object({
  id: z.string(),
})
export type WordsInput = z.infer<typeof wordsInput>

export type WordType = {
  start: number
  end: number
  conf: number
  word: string
}

export const wordsOutput = (words: { words: WordType[] }) => words
export type WordsOutput = ReturnType<typeof wordsOutput>

// video
export const videoInput = z.object({
  id: z.string(),
})
export type VideoInput = z.infer<typeof videoInput>

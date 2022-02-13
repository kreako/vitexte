import { z } from "zod"

// words
export const wordsInput = z.object({
  id: z.string(),
})
export type WordsInput = z.infer<typeof wordsInput>

export type WordDeltaType = {
  previous: number
  next: number
}

export type WordType = {
  start: number
  end: number
  conf: number
  delta: WordDeltaType
  word: string
}

export const wordsOutput = (words: { words: WordType[] }) => words
export type WordsOutput = ReturnType<typeof wordsOutput>

// video
export const videoInput = z.object({
  id: z.string(),
})
export type VideoInput = z.infer<typeof videoInput>

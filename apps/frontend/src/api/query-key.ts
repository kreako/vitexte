export const keys = {
  video: (id: number) => [{ scope: "video", id }] as const,
  words: (id: number) => [{ scope: "words", id }] as const,
}

import type { WordsOutput } from "@vitexte/api"
import { QueryFunctionContext, useMutation, useQuery, useQueryClient } from "react-query"
import { keys } from "./query-key"
import { get, put, retryQuery, UseMutationType } from "./utils"

const fetchWords = async ({
  queryKey: [{ id }],
}: QueryFunctionContext<ReturnType<typeof keys["words"]>>): Promise<WordsOutput> => get("/words/1")

export const useWords = (id: number) => {
  return useQuery(keys.words(id), fetchWords, {
    staleTime: Infinity,
    useErrorBoundary: true,
    retry: retryQuery(["AuthenticationError"]),
  })
}

const fetchVideo = async ({
  queryKey: [{ id }],
}: QueryFunctionContext<ReturnType<typeof keys["video"]>>): Promise<WordsOutput> => get("/video/1")

export const useVideo = (id: number) => {
  return useQuery(keys.video(id), fetchVideo, {
    staleTime: Infinity,
    useErrorBoundary: true,
    retry: retryQuery(["AuthenticationError"]),
  })
}

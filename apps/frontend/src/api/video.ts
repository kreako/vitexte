import type { VideoOutput } from "@vitexte/api"
import { useMutation, useQuery, useQueryClient } from "react-query"
import { keysVideo } from "./query-key"
import { get, put, retryQuery, UseMutationType } from "./utils"

const fetchVideo = async (): Promise<VideoOutput> => get("/video/1")

export const useVideo = () => {
  return useQuery(keysVideo.video, fetchVideo, {
    useErrorBoundary: true,
    retry: retryQuery(["AuthenticationError"]),
  })
}

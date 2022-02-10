import { useVideo } from "../api/video"
import Loading from "../components/Loading"
import RawError from "../components/RawError"

function Profile() {
  const video = useVideo()

  if (video.isLoading) {
    return <Loading size={2} />
  }

  if (video.isError) {
    return <RawError error={video.error as Error} />
  }

  return <div className="font-mono">{video.data?.words}</div>
}

export default function Home() {
  return (
    <div className="mt-2 flex flex-col space-y-4 pl-4">
      <Profile />
    </div>
  )
}

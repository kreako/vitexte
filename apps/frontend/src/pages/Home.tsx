import { WordType } from "@cleomacs/api"
import { useRef, useState } from "react"
import { useWords } from "../api/video"
import Loading from "../components/Loading"
import RawError from "../components/RawError"

type WordProps = {
  onClick: () => void
  word: string
}

function Word({ onClick, word }: WordProps) {
  return (
    <button onClick={onClick} className="text-sky-900 hover:text-sky-700">
      {word}
    </button>
  )
}

type WordsProps = {
  onWordClick: (word: WordType) => () => void
}

function Words({ onWordClick }: WordsProps) {
  const words = useWords(1)

  if (words.data) {
    return (
      <div className="flex flex-row flex-wrap space-x-2">
        {words.data.words.map((w) => (
          <Word onClick={onWordClick(w)} word={w.word} key={w.start} />
        ))}
      </div>
    )
  }

  if (words.isError) {
    return <RawError error={words.error as Error} />
  }

  return <Loading size={2} />
}

type VideoProps = {
  onDuration: (duration: number) => void
  onCurrentTime: (currentTime: number) => void
  setRef: (ref: HTMLVideoElement) => void
}

function Video({ onDuration, onCurrentTime, setRef }: VideoProps) {
  const ref = useRef<HTMLVideoElement>(null!)
  const setLocalRef = (element: HTMLVideoElement) => {
    ref.current = element
    setRef(element)
  }
  const onTimeUpdate = () => {
    onCurrentTime(ref.current.currentTime)
  }
  const onPlay = () => {
    onDuration(ref.current.duration)
  }
  return <video src="/api/video/1" ref={setLocalRef} onTimeUpdate={onTimeUpdate} onPlay={onPlay} />
}

export default function Home() {
  const video = useRef<HTMLMediaElement>()
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)

  const onDuration = (duration: number) => {
    setDuration(duration)
  }

  const onCurrentTime = (duration: number) => {
    setCurrentTime(duration)
  }

  const setVideoRef = (element: HTMLVideoElement) => {
    video.current = element
  }

  const play = () => {
    if (video.current) {
      video.current.play()
    }
  }

  const pause = () => {
    if (video.current) {
      video.current.pause()
    }
  }

  const onWordClick = (word: WordType) => () => {
    const start = word.start
    const end = word.end
    if (video.current) {
      video.current.currentTime = start
      play()
    }
  }

  return (
    <div className="mt-2 flex flex-row space-x-4 pl-4">
      <div className="h-screen w-1/2 overflow-auto">
        <Words onWordClick={onWordClick} />
      </div>
      <div className="h-screen w-1/2 overflow-hidden">
        <div className="h-2/3">
          <Video onDuration={onDuration} onCurrentTime={onCurrentTime} setRef={setVideoRef} />
        </div>
        <div className="h-1/3">
          <div>CurrentTime : {currentTime}</div>
          <div>Duration : {duration}</div>
          <div className="flex flex-row space-x-2">
            <button
              onClick={play}
              className="rounded-md border border-sky-900 px-4 py-2 text-sky-900"
            >
              Play
            </button>
            <button
              onClick={pause}
              className="rounded-md border border-sky-900 px-4 py-2 text-sky-900"
            >
              Pause
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

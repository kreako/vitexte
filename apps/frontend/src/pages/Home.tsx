import { WordType } from "@vitexte/api"
import { useRef, useState } from "react"
import { useWords } from "../api/video"
import Loading from "../components/Loading"
import RawError from "../components/RawError"
import * as Tone from "tone"
import { useEffectOnce } from "usehooks-ts"

const DEFAULT_SPACE_REM = 0.125

const deltaToSpaceRem = (delta: number) => {
  if (delta > 0.1) {
    const s = 4 * delta + DEFAULT_SPACE_REM
    return `${s}rem`
  } else {
    return `${DEFAULT_SPACE_REM}rem`
  }
}

type WordProps = {
  word: WordType
}

function Word({ word }: WordProps) {
  return (
    <span
      data-start={word.start}
      data-end={word.end}
      style={{
        marginLeft: deltaToSpaceRem(word.delta.previous),
        marginRight: deltaToSpaceRem(word.delta.next),
      }}
    >
      {word.word}
    </span>
  )
}

type WordsProps = {
  onWordSelection: (start: number, end: number) => void
}

function Words({ onWordSelection }: WordsProps) {
  const words = useWords(1)

  const onMouseUp = () => {
    const selection = window.getSelection()
    if (selection == null) {
      return
    }
    const r = selection.getRangeAt(0)

    // start
    const startElement = r.startContainer
    const start = startElement.parentElement?.getAttribute("data-start")
    if (start == null) {
      // start not defined ???
      return
    }

    // end
    let endElement = r.endContainer
    if (r.endOffset === 0) {
      // end element is the previous one, so search for it
      if (r.endContainer.parentElement) {
        const previousSibling = r.endContainer.parentElement.previousSibling
        if (previousSibling) {
          if (previousSibling.childNodes.length === 1) {
            endElement = previousSibling.childNodes[0]
          }
        }
      }
    }
    const end = endElement.parentElement?.getAttribute("data-end")
    if (end == null) {
      // end not defined ???
      return
    }

    const startNb = parseFloat(start)
    const endNb = parseFloat(end)
    onWordSelection(startNb, endNb)
  }

  if (words.data) {
    return (
      <div onMouseUp={onMouseUp} className="flex flex-row flex-wrap">
        {words.data.words.map((w) => (
          <Word word={w} key={w.start} />
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
  setRef: (ref: HTMLAudioElement) => void
}

function Video({ onDuration, onCurrentTime, setRef }: VideoProps) {
  const ref = useRef<HTMLAudioElement>(null!)
  const setLocalRef = (element: HTMLAudioElement) => {
    ref.current = element
    setRef(element)
  }
  const onTimeUpdate = () => {
    onCurrentTime(ref.current.currentTime)
  }
  const onPlay = () => {
    onDuration(ref.current.duration)
  }
  return <audio src="/api/video/1" ref={setLocalRef} onTimeUpdate={onTimeUpdate} onPlay={onPlay} />
}

function useVideoController() {
  const ref = useRef<HTMLAudioElement>()
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [_loop, setLoop] = useState({ loop: false, start: 0, end: 0 })
  const [count, setCount] = useState(0)

  const onDuration = (duration: number) => {
    setDuration(duration)
  }

  const onCurrentTime = (currentTime: number) => {
    setCurrentTime(currentTime)
    setCount(count + 1)
    if (currentTime > 100) {
      pause()
    }
    if (_loop.loop) {
      if (currentTime >= _loop.end) {
        seek(_loop.start)
      }
    }
  }

  const setVideoRef = (element: HTMLAudioElement) => {
    ref.current = element
  }

  const play = () => {
    if (ref.current) {
      ref.current.play()
    }
  }

  const pause = () => {
    if (ref.current) {
      ref.current.pause()
    }
    setLoop({ loop: false, start: 0, end: 0 })
  }

  const seek = (to: number) => {
    if (ref.current) {
      ref.current.currentTime = to
    }
  }

  const loop = (start: number, end: number) => {
    setLoop({ loop: true, start, end })
    seek(start)
    play()
  }

  const element = (
    <Video onDuration={onDuration} onCurrentTime={onCurrentTime} setRef={setVideoRef} />
  )

  return { duration, currentTime, play, pause, seek, loop, element, count }
}

function useTonePlayer() {
  const [loaded, setLoaded] = useState(false)
  const player = useRef<Tone.Player | null>(null)

  useEffectOnce(() => {
    player.current = new Tone.Player("/api/video/1", () => {
      setLoaded(true)
    }).toDestination()
  })

  const loop = (start: number, end: number) => {
    if (!loaded || player.current == null) {
      return
    }
    player.current.loop = true
    player.current.loopStart = start
    player.current.loopEnd = end
    player.current.seek(start)
    player.current.start()
  }

  const stop = () => {
    if (!loaded || player.current == null) {
      return
    }
    player.current.stop()
  }

  return { loop, stop }
}

export default function Home() {
  const video = useVideoController()
  const [display, setDisplay] = useState(false)

  const player = useTonePlayer()

  const onWordSelection = (start: number, end: number) => {
    //video.seek(start)
    // video.play()
    // video.loop(start, end)
    player.loop(start, end)
  }

  return (
    <div className="mt-2 flex flex-row space-x-4 pl-4">
      <div className="h-screen w-1/2 overflow-auto">
        <Words onWordSelection={onWordSelection} />
      </div>
      <div className="h-screen w-1/2 overflow-hidden">
        <div className="h-2/3">{video.element}</div>
        <div className="h-1/3">
          {display && (
            <>
              <div>CurrentTime : {video.currentTime}</div>
              <div>Duration : {video.duration}</div>
              <div>Count : {video.count}</div>
            </>
          )}
          <div className="flex flex-row space-x-2">
            <button
              onClick={() => video.seek(0)}
              className="rounded-md border border-sky-900 px-4 py-2 text-sky-900"
            >
              Seek to 0
            </button>
            <button
              onClick={video.play}
              className="rounded-md border border-sky-900 px-4 py-2 text-sky-900"
            >
              Play
            </button>
            <button
              onClick={player.stop}
              className="rounded-md border border-sky-900 px-4 py-2 text-sky-900"
            >
              Stop
            </button>
            <button
              onClick={() => setDisplay(!display)}
              className="rounded-md border border-sky-900 px-4 py-2 text-sky-900"
            >
              Display
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

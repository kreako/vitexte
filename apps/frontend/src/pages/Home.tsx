import { WordType } from "@vitexte/api"
import { useRef, useState } from "react"
import { useWords } from "../api/video"
import Loading from "../components/Loading"
import RawError from "../components/RawError"
import * as Tone from "tone"
import { useEffectOnce } from "usehooks-ts"
import Toolbar, { ToolMode } from "../components/Toolbar"
import { deleteWord, addWordsSelection, selectedState, SelectionModel } from "../selection-model"

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
  onClick: () => void
  word: WordType
  selected: boolean
}

function Word({ word, onClick, selected }: WordProps) {
  let confClass = ""
  if (word.conf < 1) {
    confClass = "bg-sky-50"
  }
  let textClass = "text-sky-900 hover:text-sky-700"
  if (selected) {
    textClass = "bg-pink-300 text-pink-900 hover:text-pink-700"
  }
  return (
    <span
      onClick={onClick}
      data-start={word.start}
      data-end={word.end}
      style={{
        marginLeft: deltaToSpaceRem(word.delta.previous),
        marginRight: deltaToSpaceRem(word.delta.next),
      }}
      className={`${textClass} ${confClass} `}
    >
      {word.word}
    </span>
  )
}

type WordsProps = {
  onWordSelection: (start: WordType, end: WordType) => void
  clearWordSelection: () => void
  toolMode: ToolMode
}

function Words({ onWordSelection, clearWordSelection, toolMode }: WordsProps) {
  const words = useWords(1)
  const [selection, setSelection] = useState<SelectionModel>({ root: null })
  const [select2PointsStart, setSelect2PointsStart] = useState<number | null>(null)

  const onWordCick = (index: number) => () => {
    if (toolMode === "select") {
      setSelection(addWordsSelection(selection, index, index))
    } else if (toolMode === "select-2points") {
      if (select2PointsStart == null) {
        // only the start of the selection
        setSelect2PointsStart(index)
        setSelection(addWordsSelection(selection, index, index))
        clearWordSelection()
      } else {
        // Selection is complete with this new click
        const firstSelectedWordIsStart = select2PointsStart < index
        const start = firstSelectedWordIsStart ? select2PointsStart : index
        const end = firstSelectedWordIsStart ? index : select2PointsStart
        setSelection(addWordsSelection(selection, start, end))
        setSelect2PointsStart(null)
        if (words.data?.words) {
          onWordSelection(words.data.words[start], words.data.words[end])
        }
      }
    } else if (toolMode === "delete") {
      setSelection(deleteWord(selection, index))
    }
  }

  if (words.data) {
    return (
      <>
        <div className={`relative flex flex-row flex-wrap overflow-auto leading-loose`}>
          {words.data.words.map((w, index) => (
            <Word
              word={w}
              onClick={onWordCick(index)}
              selected={selectedState(selection, index)}
              key={w.start}
            />
          ))}
        </div>
        {/* <div>{JSON.stringify(selection)}</div> */}
      </>
    )
  }

  if (words.isError) {
    return <RawError error={words.error as Error} />
  }

  return <Loading size={2} />
}

type VideoProps = {
  onDuration: (duration: number) => void
  setRef: (ref: HTMLVideoElement) => void
}

function Video({ onDuration, setRef }: VideoProps) {
  const ref = useRef<HTMLVideoElement>(null!)
  const setLocalRef = (element: HTMLVideoElement) => {
    ref.current = element
    setRef(element)
  }
  const onPlay = () => {
    onDuration(ref.current.duration)
  }
  return <video src="/api/video/1" ref={setLocalRef} onPlay={onPlay} />
}

function useVideoController() {
  const ref = useRef<HTMLAudioElement>()
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const _loop = useRef({ loop: false, start: 0, end: 0 })

  const onDuration = (duration: number) => {
    setDuration(duration)
  }

  const tick = () => {
    if (ref.current == null) {
      return
    }
    const t = ref.current.currentTime
    setCurrentTime(t)
    console.log("loop", _loop.current)
    if (_loop.current.loop) {
      if (t >= _loop.current.end) {
        seek(_loop.current.start)
      }
    }
    if (!ref.current.paused) {
      requestAnimationFrame(tick)
    }
  }

  const setVideoRef = (element: HTMLAudioElement) => {
    ref.current = element
  }

  const play = () => {
    if (ref.current) {
      ref.current.play()
      tick()
    }
  }

  const pause = () => {
    if (ref.current) {
      ref.current.pause()
    }
    _loop.current = { loop: false, start: 0, end: 0 }
  }

  const seek = (to: number) => {
    if (ref.current) {
      ref.current.currentTime = to
    }
  }

  const loop = (start: number, end: number) => {
    _loop.current = { loop: true, start, end }
    seek(start)
    play()
  }

  const element = <Video onDuration={onDuration} setRef={setVideoRef} />

  return { duration, currentTime, play, pause, seek, loop, element, _loop }
}

function useTonePlayer() {
  const [loaded, setLoaded] = useState(false)
  const rootBuffer = useRef<Tone.ToneAudioBuffer | null>(null)
  const player = useRef<Tone.Player | null>(null)
  const buffer = useRef<Tone.ToneAudioBuffer | null>(null)

  useEffectOnce(() => {
    // At init, load the whole sound
    rootBuffer.current = new Tone.ToneAudioBuffer("/api/video/1", () => {
      setLoaded(true)
    })

    // Setup a callback for video update
    Tone.Transport.scheduleRepeat((time) => {
      Tone.Draw.schedule(() => {
        // TODO
        // console.log("draw", time)
      }, time)
    }, 1 / 12) // 12 fps for now
    // Launch the transport, already in loop mode
    // So no glitch on first loop() call
    Tone.Transport.setLoopPoints(0, 10)
    Tone.Transport.loop = true
    Tone.Transport.start()
  })

  const loop = (start: number, end: number) => {
    if (!loaded || rootBuffer.current == null) {
      return
    }
    // Reset seconds to 0
    Tone.Transport.seconds = 0
    // Cleanup previous player/buffer if any
    if (player.current != null) {
      // There is sometimes a strange RangeError due to TickSource.getElapsedSeconds returning
      // a nearly 0 but negative like :
      //
      // Uncaught RangeError: Value must be within [0, Infinity], got: -5.684341886080802e-14
      // assertRange Debug.ts:17
      // setStateAtTime StateTimeline.ts:53
      // stop Source.ts:241
      // ...
      if (Tone.Transport.seconds <= 0) {
        // Force to 0
      player.current.stop(0)
      } else {
        // Let Tone compute the value itself
        player.current.stop()
      }
      player.current.dispose()
    }
    if (buffer.current != null) {
      buffer.current.dispose()
    }
    // Set the new loop to the correct length
    Tone.Transport.setLoopPoints(0, end - start)
    Tone.Transport.loop = true
    Tone.Transport.seconds = 0

    // Extract the selected sound from the root buffer
    buffer.current = rootBuffer.current.slice(start, end)
    // A player
    player.current = new Tone.Player(buffer.current).toDestination().sync()
    // And force a transport start (if this was in pause)
    Tone.Transport.start()
    // Start the player
    // Same bug as before now < 0
    if (Tone.Transport.seconds <= 0) {
      // Force 0
      player.current.start(0)
    } else {
      player.current.start()
    }
  }

  const stop = () => {
    Tone.Transport.pause()
    Tone.Transport.seconds = 0
  }

  return { loop, stop }
}

export default function Home() {
  const video = useVideoController()
  const [display, setDisplay] = useState(false)
  const [toolMode, setToolMode] = useState<ToolMode>("select")

  const player = useTonePlayer()

  const onWordSelection = (start: WordType, end: WordType) => {
    //video.seek(start)
    // video.play()
    // video.loop(start.start, end.end)
    player.loop(start.start, end.end)
  }

  const clearWordSelection = () => {
    player.stop()
  }

  return (
    <div className="mt-2 flex flex-row space-x-4 pl-4">
      <div className="flex h-screen max-w-lg flex-col items-center space-y-1">
        <Toolbar toolMode={toolMode} onModeChange={setToolMode} orientation="horizontal" />
        <Words
          onWordSelection={onWordSelection}
          clearWordSelection={clearWordSelection}
          toolMode={toolMode}
        />
      </div>
      <div className="h-screen overflow-hidden">
        <div className="">{video.element}</div>
        <div className="">
          <div>CurrentTime : {video.currentTime}</div>
          <div>Duration : {video.duration}</div>
          <div>Loop : {JSON.stringify(video._loop)}</div>
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
              Video Play
            </button>
            <button
              onClick={video.pause}
              className="rounded-md border border-sky-900 px-4 py-2 text-sky-900"
            >
              Video Pause
            </button>
            <button
              onClick={player.stop}
              className="rounded-md border border-sky-900 px-4 py-2 text-sky-900"
            >
              Player Stop
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

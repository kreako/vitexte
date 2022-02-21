import { ReactNode } from "react"
import RoundCompareArrows from "~icons/ic/round-compare-arrows"
import RoundNotInterested from "~icons/ic/round-not-interested"
import RoundBackHand from "~icons/ic/round-back-hand"

type SquareProps = {
  children: ReactNode
  onClick: () => void
  selected: boolean
}

function Square({ children, onClick, selected }: SquareProps) {
  const selectedClass = selected ? "text-sky-400" : "text-sky-50"
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex h-12 w-12 items-center justify-center rounded-md bg-sky-900   hover:bg-sky-500 ${selectedClass}`}
    >
      {children}
    </button>
  )
}

type ContainerProps = {
  children: ReactNode
}

function HorizontalContainer({ children }: ContainerProps) {
  return <div className="flex flex-row space-x-1">{children}</div>
}

function VerticalContainer({ children }: ContainerProps) {
  return <div className="flex flex-col space-y-1">{children}</div>
}

export type ToolMode = "select" | "select-2points" | "delete"
type ToolbarContentProps = {
  onModeChange: (toolMode: ToolMode) => void
  toolMode: ToolMode
}

function ToolbarContent({ onModeChange, toolMode }: ToolbarContentProps) {
  return (
    <>
      <Square onClick={() => onModeChange("select")} selected={toolMode === "select"}>
        <RoundBackHand width={"2em"} height={"2em"} />
      </Square>
      <Square
        onClick={() => onModeChange("select-2points")}
        selected={toolMode === "select-2points"}
      >
        <RoundCompareArrows width={"2em"} height={"2em"} />
      </Square>
      <Square onClick={() => onModeChange("delete")} selected={toolMode === "delete"}>
        <RoundNotInterested width={"2em"} height={"2em"} />
      </Square>
    </>
  )
}

type ToolbarProps = {
  orientation: "horizontal" | "vertical"
  toolMode: ToolMode
  onModeChange: (toolMode: ToolMode) => void
}

export default function Toolbar({ orientation, onModeChange, toolMode }: ToolbarProps) {
  if (orientation === "horizontal") {
    return (
      <HorizontalContainer>
        <ToolbarContent onModeChange={onModeChange} toolMode={toolMode} />
      </HorizontalContainer>
    )
  } else {
    return (
      <VerticalContainer>
        <ToolbarContent onModeChange={onModeChange} toolMode={toolMode} />
      </VerticalContainer>
    )
  }
}

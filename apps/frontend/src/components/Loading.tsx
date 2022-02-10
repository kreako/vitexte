import CloudSync from "~icons/ic/round-cloud-sync"

type LoadingProps = {
  size: number
  reverseColor?: boolean
}

export default function Loading(props: LoadingProps) {
  const size = `${props.size}em`
  const textColorClassName = props.reverseColor ? "text-sky-50" : "text-sky-600"

  return <CloudSync className={`${textColorClassName} animate-pulse`} width={size} height={size} />
}

import * as React from "react"

// Hook: tracks an element's size via ResizeObserver
export function useSize(ref) {
  const [size, setSize] = React.useState(null)

  React.useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect
      setSize({ width, height })
    })

    observer.observe(element)
    return () => observer.disconnect()
  }, [ref])

  return size
}

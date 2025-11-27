import { useCallback, useRef } from 'react'

export const useScrollIntoView = <T extends HTMLElement>() => {
  const ref = useRef<T | null>(null)

  const scrollIntoView = useCallback((options?: ScrollIntoViewOptions) => {
    if (!ref.current) {
      return
    }

    ref.current.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'nearest',
      ...options,
    })
  }, [])

  return { ref, scrollIntoView }
}

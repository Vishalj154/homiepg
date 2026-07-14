import { useEffect, useRef, useState, useCallback } from 'react'

/**
 * Custom hook to detect when an element scrolls into view.
 * Returns [ref, isVisible] — attach ref to the element.
 */
export function useInView(options = {}) {
  const ref = useRef(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(el)
        }
      },
      { threshold: 0.15, ...options }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return [ref, isVisible]
}

/**
 * Animated counter hook – counts from 0 to target when visible.
 */
export function useCounter(target, duration = 2000, startCounting = false) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!startCounting) return
    let start = 0
    const increment = target / (duration / 16)
    const timer = setInterval(() => {
      start += increment
      if (start >= target) {
        setCount(target)
        clearInterval(timer)
      } else {
        setCount(Math.floor(start))
      }
    }, 16)
    return () => clearInterval(timer)
  }, [target, duration, startCounting])

  return count
}

/**
 * Sets up IntersectionObserver for all elements matching a selector.
 * Call once on mount to animate staggered children.
 */
export function useScrollReveal(containerRef) {
  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const children = el.querySelectorAll('.scroll-hidden, .scroll-hidden-left, .scroll-hidden-right, .scroll-hidden-scale')

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('scroll-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1 }
    )

    children.forEach((child) => observer.observe(child))
    return () => observer.disconnect()
  }, [])
}

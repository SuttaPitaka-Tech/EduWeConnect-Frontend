import { useState } from 'react'

const STORAGE_KEY = 'eduweconnect_sidebar_locked'

export function useCollapsibleSidebar() {
  // Read locked state from localStorage (default: false / unlocked)
  const [isLocked, setIsLocked] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored === 'true'
    } catch {
      return false
    }
  })

  const [isHovered, setIsHovered] = useState(false)

  // Toggle lock state & persist to localStorage
  const toggleLock = (e?: React.MouseEvent) => {
    e?.stopPropagation()
    setIsLocked((prev) => {
      const next = !prev
      try {
        localStorage.setItem(STORAGE_KEY, String(next))
      } catch {
        // Ignore localStorage errors
      }
      return next
    })
  }

  // Sidebar is open if locked or currently hovered
  const isExpanded = isLocked || isHovered

  const handleMouseEnter = () => {
    if (!isLocked) {
      setIsHovered(true)
    }
  }

  const handleMouseLeave = () => {
    if (!isLocked) {
      setIsHovered(false)
    }
  }

  return {
    isLocked,
    isHovered,
    isExpanded,
    toggleLock,
    handleMouseEnter,
    handleMouseLeave,
  }
}

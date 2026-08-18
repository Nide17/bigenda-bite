'use client'

import { forwardRef } from 'react'

interface CardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
  onClick?: () => void
}

const Card = forwardRef<HTMLDivElement, CardProps>(({ children, className = '', hover = false, onClick }: CardProps, ref) => {
  const baseClasses = 'bg-white border border-neutral-200 rounded-xl shadow-sm'
  const hoverClasses = hover ? 'transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 cursor-pointer' : ''
  const clickClasses = onClick ? 'cursor-pointer' : ''

  return (
    <div
      ref={ref}
      className={`${baseClasses} ${hoverClasses} ${clickClasses} ${className}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick() } } : undefined}
    >
      {children}
    </div>
  )
})
Card.displayName = 'Card'

export default Card



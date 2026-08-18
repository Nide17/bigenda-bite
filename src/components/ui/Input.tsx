'use client'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
}

export default function Input({ label, error, helperText, className = '', id, ...props }: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-neutral-700">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`
          w-full px-3 py-2.5 border rounded-lg text-base
          bg-white text-neutral-900 placeholder:text-neutral-400
          transition-all duration-150
          focus:outline-none focus:ring-2 focus:ring-[#1e1b4b]/20 focus:border-[#1e1b4b]
          ${error ? 'border-[#dc2626] focus:ring-[#dc2626]/20 focus:border-[#dc2626]' : 'border-neutral-300'}
          ${className}
        `}
        {...props}
      />
      {error && <p className="text-sm text-[#dc2626]">{error}</p>}
      {helperText && !error && <p className="text-sm text-neutral-500">{helperText}</p>}
    </div>
  )
}



const Spinner = ({ fullscreen = false, size = 'md' }) => {
  const sizes = { sm: 'h-5 w-5', md: 'h-8 w-8', lg: 'h-12 w-12' }

  const spinner = (
    <div className={`${sizes[size]} relative`}>
      <div className="absolute inset-0 rounded-full border-2 border-ink-600" />
      <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-amber-500 animate-spin" />
    </div>
  )

  if (fullscreen) {
    return (
      <div className="fixed inset-0 bg-ink-950 flex items-center justify-center z-50">
        <div className="flex flex-col items-center gap-4">
          {spinner}
          <p className="font-mono text-xs text-ink-600 tracking-widest uppercase animate-pulse">
            Loading...
          </p>
        </div>
      </div>
    )
  }

  return spinner
}

export default Spinner

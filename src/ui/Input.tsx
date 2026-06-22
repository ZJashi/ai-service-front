type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string
  error?: string
}

export default function Input({ label, error, id, ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
      >
        {label}
      </label>
      <input
        id={id}
        className={[
          'h-10 rounded-lg border px-3 text-sm outline-none transition-colors',
          'bg-white dark:bg-zinc-900',
          'text-zinc-900 dark:text-zinc-100',
          'placeholder:text-zinc-400 dark:placeholder:text-zinc-500',
          error
            ? 'border-red-500 focus:ring-2 focus:ring-red-500'
            : 'border-zinc-300 dark:border-zinc-700 focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 focus:border-transparent',
        ].join(' ')}
        {...props}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}
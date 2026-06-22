type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  pending?: boolean
}

export default function Button({ children, pending, disabled, ...props }: ButtonProps) {
  return (
    <button
      disabled={pending || disabled}
      className="h-10 w-full rounded-lg bg-zinc-900 px-4 text-sm font-medium text-white transition-colors hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
      {...props}
    >
      {pending ? 'Loading…' : children}
    </button>
  )
}
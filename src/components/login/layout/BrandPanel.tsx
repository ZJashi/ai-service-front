export default function BrandPanel() {
  return (
    <div className="hidden md:flex md:w-1/2 flex-col bg-primary p-12 text-white">
      <div className="flex flex-col items-center">
        <img src="/logo.png" alt="CIDSAI logo" width={200} height={200} className="mb-20" />
        <div>
          <h2 className="text-4xl font-semibold leading-tight">
            Center of Interdisciplinary
<br />Data Science and AI
          </h2>
          <p className="mt-4 text-zinc-400">
            Sign in to access internal workspace
          </p>
        </div>
      </div>
      <p className="mt-auto text-sm text-zinc-500">© 2026 CIDSAI</p>
    </div>
  )
}
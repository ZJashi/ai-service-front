import NavLinks from './NavLinks'
import NavActions from './NavActions'

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-primary">
      <div className="mx-auto flex h-14 max-w-screen-xl items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <span className="text-sm font-semibold tracking-tight text-white">
            CIDSAI
          </span>
          <NavLinks />
        </div>
        <NavActions />
      </div>
    </header>
  )
}
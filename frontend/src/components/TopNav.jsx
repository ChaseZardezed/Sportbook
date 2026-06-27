import { Link, useLocation } from 'react-router-dom'
import { useBetSlip } from '../store/betSlip'
import { useBalance } from '../store/balance'
import { useTheme } from '../store/theme'
import BoltIcon from './icons/BoltIcon'

const NAV_LINKS = [
  { label: 'Home', path: '/' },
  { label: 'Sports', path: '/' },
  { label: 'TCG', path: '/tcg' },
  { label: 'Casino', path: null },
  { label: 'Promos', path: null },
]

export default function TopNav() {
  const isOpen = useBetSlip((state) => state.isOpen)
  const toggleOpen = useBetSlip((state) => state.toggleOpen)
  const selectionCount = useBetSlip((state) => Object.keys(state.selections).length)
  const balance = useBalance((state) => state.balance)
  const theme = useTheme((state) => state.theme)
  const toggleTheme = useTheme((state) => state.toggleTheme)
  const location = useLocation()

  return (
    <header className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-3 dark:border-gray-800 dark:bg-gray-950">
      <div className="flex items-center gap-8">
        <span className="flex items-center gap-1 text-lg font-bold">
          <BoltIcon className="h-5 w-5 text-purple-500" />
          <span className="text-gray-900 dark:text-white">Strike</span>
          <span className="text-purple-500">Bets</span>
        </span>
        <nav className="flex items-center gap-6">
          {NAV_LINKS.map((link) =>
            link.path ? (
              <Link
                key={link.label}
                to={link.path}
                className={`text-sm font-medium ${
                  location.pathname === link.path
                    ? 'text-gray-900 dark:text-white'
                    : 'text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            ) : (
              <button
                key={link.label}
                type="button"
                className="text-sm font-medium text-gray-400 hover:text-gray-900 dark:hover:text-white"
              >
                {link.label}
              </button>
            ),
          )}
        </nav>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-[10px] uppercase text-gray-500">Balance</p>
          <p className="text-sm font-semibold text-gray-900 dark:text-white">${balance.toFixed(2)}</p>
        </div>
        <button
          type="button"
          className="rounded bg-purple-600 px-4 py-1.5 text-sm font-semibold text-white hover:bg-purple-500"
        >
          Deposit
        </button>
        <button
          type="button"
          aria-label="Toggle light/dark mode"
          onClick={toggleTheme}
          className="h-8 w-8 rounded-full border border-gray-300 text-gray-400 hover:text-gray-900 dark:border-gray-700 dark:hover:text-white"
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
        <button
          type="button"
          aria-label="Notifications"
          className="h-8 w-8 rounded-full border border-gray-300 text-gray-400 hover:text-gray-900 dark:border-gray-700 dark:hover:text-white"
        >
          🔔
        </button>
        <button
          type="button"
          aria-label="Account"
          className="h-8 w-8 rounded-full bg-gray-100 text-sm font-semibold text-gray-900 dark:bg-gray-800 dark:text-white"
        >
          JD
        </button>
        <button
          type="button"
          onClick={toggleOpen}
          className={`flex items-center gap-2 rounded border px-4 py-1.5 text-sm font-semibold ${
            isOpen
              ? 'border-purple-500 bg-purple-600/20 text-gray-900 dark:text-white'
              : 'border-gray-300 text-gray-600 hover:border-purple-500 dark:border-gray-700 dark:text-gray-300'
          }`}
        >
          {isOpen ? 'Close' : 'Bet Slip'}
          {selectionCount > 0 && (
            <span className="rounded-full bg-purple-600 px-1.5 text-xs text-white">{selectionCount}</span>
          )}
        </button>
      </div>
    </header>
  )
}

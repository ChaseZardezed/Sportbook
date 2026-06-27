import { Link, useLocation } from 'react-router-dom'
import { useBetSlip } from '../store/betSlip'
import { useBalance } from '../store/balance'

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
  const location = useLocation()

  return (
    <header className="flex items-center justify-between border-b border-gray-800 bg-gray-950 px-6 py-3">
      <div className="flex items-center gap-8">
        <span className="flex items-center gap-1 text-lg font-bold">
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-5 w-5 text-purple-500"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M14.615 1.595a.75.75 0 01.359.852l-1.99 7.302h7.27a.75.75 0 01.548 1.262l-10.5 11.25a.75.75 0 01-1.272-.71l1.992-7.302H3.75a.75.75 0 01-.548-1.262l10.5-11.25a.75.75 0 01.913-.143z"
            />
          </svg>
          <span className="text-white">Strike</span>
          <span className="text-purple-500">Bets</span>
        </span>
        <nav className="flex items-center gap-6">
          {NAV_LINKS.map((link) =>
            link.path ? (
              <Link
                key={link.label}
                to={link.path}
                className={`text-sm font-medium ${
                  location.pathname === link.path ? 'text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            ) : (
              <button
                key={link.label}
                type="button"
                className="text-sm font-medium text-gray-400 hover:text-white"
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
          <p className="text-sm font-semibold text-white">${balance.toFixed(2)}</p>
        </div>
        <button
          type="button"
          className="rounded bg-purple-600 px-4 py-1.5 text-sm font-semibold text-white hover:bg-purple-500"
        >
          Deposit
        </button>
        <button
          type="button"
          aria-label="Notifications"
          className="h-8 w-8 rounded-full border border-gray-700 text-gray-400 hover:text-white"
        >
          🔔
        </button>
        <button
          type="button"
          aria-label="Account"
          className="h-8 w-8 rounded-full bg-gray-800 text-sm font-semibold text-white"
        >
          JD
        </button>
        <button
          type="button"
          onClick={toggleOpen}
          className={`flex items-center gap-2 rounded border px-4 py-1.5 text-sm font-semibold ${
            isOpen
              ? 'border-purple-500 bg-purple-600/20 text-white'
              : 'border-gray-700 text-gray-300 hover:border-purple-500'
          }`}
        >
          {isOpen ? 'Close' : 'Bet Slip'}
          {selectionCount > 0 && (
            <span className="rounded-full bg-purple-600 px-1.5 text-xs">{selectionCount}</span>
          )}
        </button>
      </div>
    </header>
  )
}

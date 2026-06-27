import { useBetSlip } from '../store/betSlip'

const NAV_LINKS = ['Home', 'Live', 'Sports', 'Casino', 'Promos', 'Futures']

export default function TopNav() {
  const isOpen = useBetSlip((state) => state.isOpen)
  const toggleOpen = useBetSlip((state) => state.toggleOpen)
  const selectionCount = useBetSlip((state) => Object.keys(state.selections).length)

  return (
    <header className="flex items-center justify-between border-b border-gray-800 bg-gray-950 px-6 py-3">
      <div className="flex items-center gap-8">
        <span className="text-lg font-bold text-white">Sportsbook</span>
        <nav className="flex items-center gap-6">
          {NAV_LINKS.map((link, index) => (
            <button
              key={link}
              type="button"
              className={`text-sm font-medium ${
                index === 0 ? 'text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              {link}
            </button>
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-[10px] uppercase text-gray-500">Balance</p>
          <p className="text-sm font-semibold text-white">$0.00</p>
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

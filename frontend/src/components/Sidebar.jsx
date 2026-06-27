import { useMatches } from '../hooks/useMatches'
import { useSportFilter } from '../store/sportFilter'

function buildSportCounts(matches) {
  const counts = new Map()
  for (const match of matches) {
    const entry = counts.get(match.sport) || { total: 0, live: 0 }
    entry.total += 1
    if (match.is_live) entry.live += 1
    counts.set(match.sport, entry)
  }
  return counts
}

function SidebarItem({ label, total, live, isSelected, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center justify-between rounded px-3 py-2 text-sm font-medium ${
        isSelected ? 'bg-purple-600/20 text-white' : 'text-gray-300 hover:bg-gray-900'
      }`}
    >
      <span>{label}</span>
      <span className="flex items-center gap-1 text-xs text-gray-500">
        {live > 0 && <span className="text-purple-400">{live}</span>}
        {total}
      </span>
    </button>
  )
}

export default function Sidebar() {
  const { data: matches, isLoading } = useMatches()
  const selectedSport = useSportFilter((state) => state.selectedSport)
  const selectSport = useSportFilter((state) => state.selectSport)

  if (isLoading) return <div className="w-56 p-3 text-gray-500">Loading…</div>

  const sportCounts = buildSportCounts(matches)
  const totalLive = matches.filter((match) => match.is_live).length

  return (
    <div className="w-56 rounded-lg border border-gray-800 bg-gray-950 p-3">
      {totalLive > 0 && (
        <div className="mb-3 flex items-center justify-between rounded bg-purple-600/10 px-3 py-2 text-xs font-semibold uppercase text-purple-400">
          <span>Live Now</span>
          <span>{totalLive}</span>
        </div>
      )}

      <p className="mb-1 px-3 text-xs font-semibold uppercase text-gray-500">Sports</p>
      <SidebarItem
        label="All Sports"
        total={matches.length}
        live={totalLive}
        isSelected={selectedSport === null}
        onClick={() => selectSport(null)}
      />
      {[...sportCounts.entries()].map(([sport, { total, live }]) => (
        <SidebarItem
          key={sport}
          label={sport}
          total={total}
          live={live}
          isSelected={selectedSport === sport}
          onClick={() => selectSport(sport)}
        />
      ))}
    </div>
  )
}

function PeriodRow({ team, values }) {
  const total = values.reduce((sum, value) => sum + (value ?? 0), 0)

  return (
    <tr>
      <td className="py-1 pr-3 text-left font-semibold text-gray-900 dark:text-white">{team}</td>
      {values.map((value, index) => (
        <td key={index} className="px-2 py-1 text-center text-gray-600 dark:text-gray-300">
          {value ?? '-'}
        </td>
      ))}
      <td className="px-2 py-1 text-center font-bold text-gray-900 dark:text-white">{total}</td>
    </tr>
  )
}

export default function Scoreboard({ match }) {
  const { periods } = match
  if (!periods) return null

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-3 dark:border-gray-800 dark:bg-gray-950">
      <table className="text-sm">
        <thead>
          <tr className="text-xs uppercase text-gray-500">
            <th className="pr-3 text-left"></th>
            {periods.labels.map((label) => (
              <th key={label} className="px-2 font-medium">
                {label}
              </th>
            ))}
            <th className="px-2 font-medium">T</th>
          </tr>
        </thead>
        <tbody>
          <PeriodRow team={match.away_team} values={periods.away} />
          <PeriodRow team={match.home_team} values={periods.home} />
        </tbody>
      </table>
    </div>
  )
}

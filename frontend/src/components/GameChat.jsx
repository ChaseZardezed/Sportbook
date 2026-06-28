import { useGameChat } from '../store/gameChat'

const MOCK_MESSAGES = [
  { user: 'gridiron_greg', time: '7:42 PM', text: "Bills' o-line is finally holding up tonight" },
  { user: 'chiefskingdom', time: '7:43 PM', text: 'Mahomes about to cook them on this drive' },
  { user: 'sharp_bettor', time: '7:44 PM', text: 'Live spread moved to -2.5, grabbing Bills now' },
  { user: 'parlay_pete', time: '7:45 PM', text: 'anyone else on the over 48.5?' },
  { user: 'gridiron_greg', time: '7:46 PM', text: 'yeah this pace is hitting that easy' },
]

export default function GameChat() {
  const openMatch = useGameChat((state) => state.openMatch)
  const closeChat = useGameChat((state) => state.closeChat)

  if (!openMatch) return null

  return (
    <div className="flex flex-col rounded-lg border border-gray-300 bg-white dark:border-gray-800 dark:bg-gray-950">
      <div className="flex items-center justify-between border-b border-gray-300 px-4 py-3 dark:border-gray-800">
        <div>
          <p className="text-xs text-gray-500">Game Chat</p>
          <h2 className="font-bold text-gray-900 dark:text-white">{openMatch.matchup}</h2>
        </div>
        <button type="button" onClick={closeChat} className="text-gray-500 hover:text-gray-900 dark:hover:text-white">
          ✕
        </button>
      </div>

      <div className="max-h-80 space-y-3 overflow-y-auto p-3">
        {MOCK_MESSAGES.map((message, index) => (
          <div key={index} className="flex gap-2">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-200 text-xs font-semibold text-gray-700 dark:bg-gray-800 dark:text-gray-300">
              {message.user[0].toUpperCase()}
            </div>
            <div>
              <p className="text-xs">
                <span className="font-semibold text-gray-900 dark:text-white">{message.user}</span>{' '}
                <span className="text-gray-500">{message.time}</span>
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">{message.text}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-gray-300 p-3 dark:border-gray-800">
        <input
          type="text"
          disabled
          placeholder="Chat preview — sending disabled"
          className="w-full rounded border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-500 placeholder:text-gray-600 dark:border-gray-800 dark:bg-gray-900"
        />
      </div>
    </div>
  )
}

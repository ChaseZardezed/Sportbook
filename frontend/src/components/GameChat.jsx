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
    <div className="flex h-full flex-col rounded-lg border border-gray-800 bg-gray-950">
      <div className="flex items-center justify-between border-b border-gray-800 px-4 py-3">
        <div>
          <p className="text-xs text-gray-500">Game Chat</p>
          <h2 className="font-bold text-white">{openMatch.matchup}</h2>
        </div>
        <button type="button" onClick={closeChat} className="text-gray-500 hover:text-white">
          ✕
        </button>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto p-3">
        {MOCK_MESSAGES.map((message, index) => (
          <div key={index} className="flex gap-2">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-800 text-xs font-semibold text-gray-300">
              {message.user[0].toUpperCase()}
            </div>
            <div>
              <p className="text-xs">
                <span className="font-semibold text-white">{message.user}</span>{' '}
                <span className="text-gray-500">{message.time}</span>
              </p>
              <p className="text-sm text-gray-300">{message.text}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-gray-800 p-3">
        <input
          type="text"
          disabled
          placeholder="Chat preview — sending disabled"
          className="w-full rounded border border-gray-800 bg-gray-900 px-3 py-2 text-sm text-gray-500 placeholder:text-gray-600"
        />
      </div>
    </div>
  )
}

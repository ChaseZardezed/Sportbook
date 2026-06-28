import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCurrentUser } from '../store/currentUser'

const MENU_ITEMS = [
  { icon: '💰', label: 'Account Overview' },
  { icon: '🧾', label: 'Transaction History' },
  { icon: '🎁', label: 'Promos' },
  { icon: '⚙️', label: 'Settings' },
  { icon: '❓', label: 'Help' },
]

export default function ProfileDropdown() {
  const [isOpen, setIsOpen] = useState(false)
  const user = useCurrentUser((state) => state.user)
  const logout = useCurrentUser((state) => state.logout)
  const navigate = useNavigate()

  const initials = user ? `${user.first_name[0]}${user.last_name[0]}`.toUpperCase() : '?'

  const handleLogout = () => {
    setIsOpen(false)
    logout()
    navigate('/login')
  }

  return (
    <div className="relative">
      <button
        type="button"
        aria-label="Account"
        onClick={() => setIsOpen((open) => !open)}
        className="group flex items-center gap-1 rounded-full px-1 text-gray-400 transition-colors hover:text-gray-900 dark:hover:text-white"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-sm font-semibold text-gray-900 transition-colors group-hover:bg-gray-200 dark:bg-gray-800 dark:text-white dark:group-hover:bg-gray-700">
          {initials}
        </span>
        <span className="inline-block rotate-90 text-xs">{'>'}</span>
      </button>

      {isOpen && (
        <>
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-10 cursor-default"
          />
          <div className="absolute right-0 z-20 mt-2 w-56 rounded-lg border border-gray-300 bg-white py-1 shadow-lg dark:border-gray-800 dark:bg-gray-900">
            {user && (
              <div className="border-b border-gray-300 px-4 py-2 dark:border-gray-800">
                <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">
                  {user.first_name} {user.last_name}
                </p>
                <p className="truncate text-xs text-gray-500">{user.email}</p>
              </div>
            )}
            {MENU_ITEMS.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => setIsOpen(false)}
                className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
              >
                <span>{item.icon}</span>
                {item.label}
              </button>
            ))}
            <div className="my-1 border-t border-gray-300 dark:border-gray-800" />
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-red-500 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <span>🚪</span>
              Logout
            </button>
          </div>
        </>
      )}
    </div>
  )
}

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { loginUser } from '../api/client'
import { useCurrentUser } from '../store/currentUser'
import BoltIcon from '../components/icons/BoltIcon'

const FEATURES = [
  { icon: '📈', text: 'Live odds — NFL, NBA, MLB, Soccer & more' },
  { icon: '💎', text: 'TCG Raw Card Packs — pull PSA-graded cards' },
  { icon: '🛡️', text: 'Licensed platform — instant withdrawals' },
]

export default function LandingPage() {
  const navigate = useNavigate()
  const login = useCurrentUser((state) => state.login)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      const user = await loginUser({ email, password })
      login(user)
      navigate('/')
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <header className="flex items-center gap-2 px-6 py-4">
        <BoltIcon className="h-5 w-5 text-purple-500" />
        <span className="text-lg font-bold text-gray-900 dark:text-white">Strike</span>
        <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-gray-500 dark:bg-gray-800">
          Beta
        </span>
      </header>

      <div className="mx-auto flex max-w-5xl flex-col items-center justify-center gap-12 px-6 py-16 lg:flex-row lg:items-center">
        <div className="max-w-md">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            Your edge. <span className="text-purple-500">Your winnings.</span>
          </h1>
          <p className="mt-4 text-gray-500">
            Live sports odds, instant payouts, and the only book with a graded TCG raw card pack-opening
            game.
          </p>
          <ul className="mt-6 space-y-2">
            {FEATURES.map((feature) => (
              <li key={feature.text} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                <span>{feature.icon}</span>
                {feature.text}
              </li>
            ))}
          </ul>
        </div>

        <form
          onSubmit={handleSubmit}
          className="w-full max-w-sm rounded-lg border border-gray-200 bg-gray-50 p-6 dark:border-gray-800 dark:bg-gray-900"
        >
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Sign in</h2>
          <p className="mb-4 text-sm text-gray-500">Welcome back. Enter your details to continue.</p>

          <label className="mb-1 block text-xs font-semibold uppercase text-gray-500">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            className="mb-3 w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-purple-500 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
          />

          <label className="mb-1 block text-xs font-semibold uppercase text-gray-500">Password</label>
          <div className="relative mb-4">
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••"
              className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-purple-500 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
            />
            <button
              type="button"
              onClick={() => setShowPassword((show) => !show)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>

          {error && <p className="mb-3 text-sm text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded bg-purple-600 py-2 font-semibold text-white transition-colors hover:bg-purple-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? 'Signing in…' : 'Sign In →'}
          </button>

          <p className="mt-4 text-center text-sm text-gray-500">
            Don't have an account?{' '}
            <Link to="/signup" className="font-semibold text-purple-500 hover:text-purple-400">
              Create one
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}

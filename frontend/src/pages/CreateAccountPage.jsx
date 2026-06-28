import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { registerUser } from '../api/client'
import { useCurrentUser } from '../store/currentUser'
import BoltIcon from '../components/icons/BoltIcon'

export default function CreateAccountPage() {
  const navigate = useNavigate()
  const login = useCurrentUser((state) => state.login)

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [dateOfBirth, setDateOfBirth] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [agreed, setAgreed] = useState(false)
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError(null)

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }
    if (!agreed) {
      setError('You must confirm you are 18+ and agree to the terms')
      return
    }

    setSubmitting(true)
    try {
      const user = await registerUser({
        first_name: firstName,
        last_name: lastName,
        email,
        date_of_birth: dateOfBirth,
        password,
      })
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

      <div className="mx-auto flex max-w-md flex-col justify-center px-6 py-12">
        <form
          onSubmit={handleSubmit}
          className="rounded-lg border border-gray-200 bg-gray-50 p-6 dark:border-gray-800 dark:bg-gray-900"
        >
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Create your account</h2>
          <p className="mb-4 text-sm text-gray-500">Join Strike and start betting in minutes.</p>

          <div className="mb-3 grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase text-gray-500">First Name</label>
              <input
                type="text"
                required
                value={firstName}
                onChange={(event) => setFirstName(event.target.value)}
                placeholder="John"
                className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-purple-500 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase text-gray-500">Last Name</label>
              <input
                type="text"
                required
                value={lastName}
                onChange={(event) => setLastName(event.target.value)}
                placeholder="Smith"
                className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-purple-500 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
              />
            </div>
          </div>

          <label className="mb-1 block text-xs font-semibold uppercase text-gray-500">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            className="mb-3 w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-purple-500 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
          />

          <label className="mb-1 block text-xs font-semibold uppercase text-gray-500">Date of Birth</label>
          <input
            type="date"
            required
            value={dateOfBirth}
            onChange={(event) => setDateOfBirth(event.target.value)}
            className="mb-3 w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-purple-500 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
          />

          <label className="mb-1 block text-xs font-semibold uppercase text-gray-500">Password</label>
          <input
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Min. 8 characters"
            className="mb-3 w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-purple-500 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
          />

          <label className="mb-1 block text-xs font-semibold uppercase text-gray-500">Confirm Password</label>
          <input
            type="password"
            required
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            placeholder="Repeat password"
            className="mb-3 w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-purple-500 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
          />

          <label className="mb-4 flex items-start gap-2 text-xs text-gray-500">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(event) => setAgreed(event.target.checked)}
              className="mt-0.5"
            />
            <span>
              I am 18+ and agree to the <span className="text-purple-500">Terms of Service</span> and{' '}
              <span className="text-purple-500">Privacy Policy</span>. This is a simulated entertainment
              platform.
            </span>
          </label>

          {error && <p className="mb-3 text-sm text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded bg-purple-600 py-2 font-semibold text-white transition-colors hover:bg-purple-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? 'Creating account…' : 'Create Account →'}
          </button>

          <p className="mt-4 text-center text-sm text-gray-500">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-purple-500 hover:text-purple-400">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}

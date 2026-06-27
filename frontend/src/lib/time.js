export function formatStartTime(isoString) {
  return new Date(isoString).toLocaleString(undefined, {
    weekday: 'short',
    hour: 'numeric',
    minute: '2-digit',
  })
}

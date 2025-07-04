
export function createInstance(_kwargs) {
  return {
    async getItem(key) {
      const res = await fetch(`/api/db/${encodeURIComponent(key)}`)
      if (!res.ok) return null
      return await res.text()
    },

    async setItem(key, value) {
      const res = await fetch(`/api/db/${encodeURIComponent(key)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: value
      })
      return res.ok
    }
  }
}

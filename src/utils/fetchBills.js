import axios from 'axios'

export async function fetchBills({
  token,
  page,
  pageSize,
  search = '',
  status = 'all',
  paid = 'all',
  dateRange = null,
}) {
  const res = await axios.get('http://localhost:3001/bills', {
    headers: { Authorization: `Bearer ${token}` },
  })

  let filtered = res.data

  if (search) {
    const q = search.toLowerCase()
    filtered = filtered.filter(
      (b) => b.billNumber?.toLowerCase().includes(q) || b.receiver?.toLowerCase().includes(q),
    )
  }

  if (paid !== 'all') {
    filtered = filtered.filter((b) => b.isPaid === (paid === 'true'))
  }

  if (status !== 'all') {
    filtered = filtered.filter((b) => b.status === status)
  }

  if (dateRange?.start && dateRange?.end) {
    const { start, end } = dateRange
    filtered = filtered.filter((b) => {
      const exec = b.executionDate?.slice(0, 10)
      return exec && exec >= start && exec <= end
    })
  }

  filtered = filtered.sort((a, b) => b.id - a.id)

  const startIndex = (page - 1) * pageSize
  const endIndex = startIndex + pageSize
  const paginated = filtered.slice(startIndex, endIndex)

  const stats = {
    total: res.data.length,
    paidAmount: res.data.filter((b) => b.isPaid).reduce((sum, b) => sum + b.amount, 0),
    unpaidAmount: res.data.filter((b) => !b.isPaid).reduce((sum, b) => sum + b.amount, 0),
    executed: res.data.filter((b) => b.status === 'executed').length,
    pending: res.data.filter((b) => b.status === 'pending').length,
  }

  return { paginated, totalPages: Math.ceil(filtered.length / pageSize), stats }
}

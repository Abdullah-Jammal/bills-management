import { h } from 'vue'
import { Button } from '@/components/ui/button' // Make sure this is your actual Button path
import axios from 'axios'

function handleUpdate(bill) {
  console.log('Update bill:', bill)
  // Show modal or populate form for editing
}

async function handleDelete(id) {
  try {
    await axios.delete(`http://localhost:3001/bills/${id}`)
    data.value = await getData()
  } catch (err) {
    console.error('Delete failed:', err)
  }
}

export const columns = [
  {
    accessorKey: 'title',
    header: () => h('div', { class: 'text-left' }, 'Title'),
    cell: ({ row }) => h('div', { class: 'text-left' }, row.getValue('title')),
  },
  {
    accessorKey: 'amount',
    header: () => h('div', { class: 'text-right' }, 'Amount'),
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue('amount'))
      const formatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(amount)
      return h('div', { class: 'text-right font-medium' }, formatted)
    },
  },
  {
    accessorKey: 'dueDate',
    header: () => h('div', { class: 'text-center' }, 'Due Date'),
    cell: ({ row }) => {
      const date = new Date(row.getValue('dueDate')).toLocaleDateString()
      return h('div', { class: 'text-center' }, date)
    },
  },
  {
    id: 'actions',
    header: () => h('div', { class: 'text-center' }, 'Actions'),
    cell: ({ row }) =>
      h('div', { class: 'flex justify-center gap-2' }, [
        h(
          Button,
          {
            class: 'bg-blue-100 text-blue-500 h-7 text-xs rounded cursor-pointer hover:bg-blue-300',
            onClick: () => handleUpdate(row.original),
          },
          { default: () => 'Update' },
        ),
        h(
          Button,
          {
            class: 'bg-red-100 text-red-500 h-7 text-xs rounded cursor-pointer hover:bg-red-300',
            onClick: () => handleDelete(row.original.id),
          },
          { default: () => 'Delete' },
        ),
      ]),
  },
]

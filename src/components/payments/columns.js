import { h } from 'vue'
import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-vue-next'

export function createColumns(UpdateBillDialog, handleDelete, handleSave) {
  return [
    {
      accessorKey: 'billNumber',
      header: () => h('div', { class: 'text-center' }, 'Bill Number'),
      cell: ({ row }) => h('div', { class: 'text-center' }, row.getValue('billNumber')),
    },
    {
      accessorKey: 'receiver',
      header: () => h('div', { class: 'text-center' }, 'Receiver'),
      cell: ({ row }) => h('div', { class: 'text-center' }, row.getValue('receiver')),
    },
    {
      accessorKey: 'isPaid',
      header: () => h('div', { class: 'text-center' }, 'Paid Status'),
      cell: ({ row }) => {
        const isPaid = row.getValue('isPaid')
        return h(
          'div',
          {
            class: [
              'text-center font-medium py-1 rounded-xs',
              isPaid
                ? 'bg-green-100 text-green-500 border border-green-200'
                : 'bg-red-100 text-red-500 border border-red-200',
            ],
          },
          isPaid ? 'Paid' : 'Unpaid',
        )
      },
    },
    {
      accessorKey: 'amount',
      header: () => h('div', { class: 'text-center' }, 'Amount'),
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue('amount'))
        const formatted = new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
        }).format(amount)
        return h('div', { class: 'text-center font-medium' }, formatted)
      },
    },
    {
      accessorKey: 'station',
      header: () => h('div', { class: 'text-center' }, 'Station'),
      cell: ({ row }) => h('div', { class: 'text-center' }, row.getValue('station')),
    },
    {
      accessorKey: 'issuedDate',
      header: () => h('div', { class: 'text-center' }, 'Issued Date'),
      cell: ({ row }) => {
        const date = new Date(row.getValue('issuedDate')).toLocaleDateString()
        return h('div', { class: 'text-center' }, date)
      },
    },
    {
      accessorKey: 'status',
      header: () => h('div', { class: 'text-center' }, 'Bill Status'),
      cell: ({ row }) => {
        const status = row.getValue('status')
        return h(
          'div',
          {
            class: [
              'text-center font-medium py-1 rounded-xs px-2',
              status === 'pending'
                ? 'bg-yellow-100 text-yellow-600 border border-yellow-300'
                : 'bg-blue-100 text-blue-600 border border-blue-300',
            ],
          },
          status === 'pending' ? 'Pending' : 'Executed',
        )
      },
    },
    {
      accessorKey: 'executionDate',
      header: () => h('div', { class: 'text-center' }, 'Execution Date'),
      cell: ({ row }) => {
        const date = new Date(row.getValue('executionDate')).toLocaleDateString()
        return h('div', { class: 'text-center' }, date)
      },
    },
    {
      id: 'actions',
      header: () => h('div', { class: 'text-center' }, 'Actions'),
      cell: ({ row }) => {
        const bill = row.original
        return h('div', { class: 'flex justify-center gap-2' }, [
          h(UpdateBillDialog, {
            bill,
            onSave: async (updated) => await handleSave(bill.id, updated),
          }),
          h(
            Button,
            {
              class: 'bg-red-100 text-red-500 h-7 cursor-pointer text-xs rounded hover:bg-red-300',
              onClick: () => handleDelete(bill.id),
            },
            {
              default: () => h(Trash2),
            },
          ),
        ])
      },
    },
  ]
}

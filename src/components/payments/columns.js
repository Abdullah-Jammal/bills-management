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
      accessorKey: 'paid',
      header: () => h('div', { class: 'text-center' }, 'Paid Status'),
      cell: ({ row }) => h('div', { class: 'text-center' }, row.getValue('paid')),
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
      accessorKey: 'status',
      header: () => h('div', { class: 'text-center' }, 'Bill Status'),
      cell: ({ row }) => h('div', { class: 'text-center' }, row.getValue('status')),
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

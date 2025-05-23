import { h } from 'vue'
import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-vue-next'

export function createColumns(UpdateBillDialog, handleDelete, handleSave) {
  return [
    {
      accessorKey: 'receiver',
      header: () => h('div', { class: 'text-center' }, 'Receiver'),
      cell: ({ row }) => h('div', { class: 'text-center' }, row.getValue('receiver')),
    },
    {
      accessorKey: 'station',
      header: () => h('div', { class: 'text-center' }, 'Station'),
      cell: ({ row }) => h('div', { class: 'text-center' }, row.getValue('station')),
    },
    {
      accessorKey: 'paymentDate',
      header: () => h('div', { class: 'text-center' }, 'Payment Date'),
      cell: ({ row }) => h('div', { class: 'text-center' }, row.getValue('paymentDate')),
    },
    {
      accessorKey: 'amount',
      header: () => h('div', { class: 'text-center' }, 'Amount'),
      cell: ({ row }) => h('div', { class: 'text-center' }, row.getValue('amount')),
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

import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'

interface ReclaimOnShareDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  workspaceName: string
  allocatedAmount: number
  onConfirm: () => void
  packageCount?: number // Number of packages (for pluralization)
}

export function ReclaimOnShareDialog({
  open,
  onOpenChange,
  workspaceName,
  allocatedAmount,
  onConfirm,
  packageCount = 1,
}: ReclaimOnShareDialogProps) {
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(num)
  }

  const handleConfirm = () => {
    onConfirm()
    onOpenChange(false)
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-lg p-6 w-full max-w-md z-50">
          <div className="flex items-center justify-between mb-4">
            <Dialog.Title className="text-xl font-semibold text-[var(--sc-text)]">
              Reclaim Allocated Smartwords
            </Dialog.Title>
            <Dialog.Close asChild>
              <button
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </Dialog.Close>
          </div>

          <div className="space-y-4">
            <p className="text-sm text-gray-700">
              The workspace <strong>{workspaceName}</strong> has {packageCount > 1 ? `${packageCount} packages with a total of ` : ''}{formatNumber(allocatedAmount)} Smartwords allocated.
            </p>
            <p className="text-sm text-gray-700">
              Do you want to reclaim {packageCount > 1 ? 'all allocated packages' : 'the allocated Smartwords'} to the organization-level balance and switch sharing on?
            </p>
            <p className="text-sm text-gray-600">
              After enabling sharing, used Smartwords will be consumed from the organization-level balance.
            </p>

            <div className="flex gap-3 justify-end pt-4">
              <Dialog.Close asChild>
                <button
                  type="button"
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </Dialog.Close>
              <button
                type="button"
                onClick={handleConfirm}
                className="px-4 py-2 text-sm font-medium text-white bg-[var(--sc-primary)] rounded-lg hover:opacity-90 transition-opacity"
              >
                Reclaim and Enable Sharing
              </button>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}


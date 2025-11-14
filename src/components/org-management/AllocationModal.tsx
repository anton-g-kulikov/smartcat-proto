import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as Dialog from '@radix-ui/react-dialog'
import { z } from 'zod'
import { X, Plus, Minus } from 'lucide-react'
import { toast } from '@/components/ui/sonner'

interface AllocationModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  workspaceName: string
  currentWorkspaceBalance: number | null
  currentOrgBalance: number
  mode: 'allocate' | 'reclaim'
  onConfirm: (amount: number) => void
  workspaceSpent?: number // Amount already spent from the workspace package
}

const createSchema = (maxAmount: number) =>
  z.object({
    amount: z
      .number()
      .positive('Amount must be positive')
      .min(1, 'Minimum amount is 1')
      .max(maxAmount, `Cannot exceed available balance of ${new Intl.NumberFormat().format(maxAmount)}`),
  })

export function AllocationModal({
  open,
  onOpenChange,
  workspaceName,
  currentWorkspaceBalance,
  currentOrgBalance,
  mode,
  onConfirm,
  workspaceSpent = 0,
}: AllocationModalProps) {
  // For reclaim mode, max amount is the remaining balance (allocated - spent)
  // For allocate mode, max amount is the org balance
  const maxAmount = mode === 'allocate' 
    ? currentOrgBalance 
    : Math.max(0, (currentWorkspaceBalance ?? 0) - workspaceSpent)
  const schema = createSchema(maxAmount)
  
  // Prepopulate with max amount when reclaiming
  const defaultAmount = mode === 'reclaim' ? maxAmount : 0
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm<{ amount: number }>({
    resolver: zodResolver(schema),
    defaultValues: { amount: defaultAmount },
    mode: 'onChange', // Validate on change
  })
  
  // Update form value when modal opens in reclaim mode
  React.useEffect(() => {
    if (open && mode === 'reclaim') {
      setValue('amount', maxAmount, { shouldValidate: true })
    } else if (open && mode === 'allocate') {
      setValue('amount', 0, { shouldValidate: true })
    }
  }, [open, mode, maxAmount, setValue])

  const amount = watch('amount')
  // For reclaim mode: if reclaiming all remaining, balance becomes 0
  // Otherwise, it's allocated - amount reclaimed
  const projectedWorkspaceBalance =
    mode === 'allocate'
      ? (currentWorkspaceBalance ?? 0) + amount
      : Math.max(0, maxAmount - amount) // Remaining reclaimable - amount being reclaimed
  const projectedOrgBalance =
    mode === 'allocate' ? currentOrgBalance - amount : currentOrgBalance + amount

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(num)
  }

  const handleIncrement = () => {
    const newValue = Math.min(amount + 1000, maxAmount)
    setValue('amount', newValue, { shouldValidate: true })
  }

  const handleDecrement = () => {
    const newValue = Math.max(amount - 1000, 0)
    setValue('amount', newValue, { shouldValidate: true })
  }

  const onSubmit = (data: { amount: number }) => {
    if (mode === 'reclaim') {
      // For reclaim mode, just send a request to support instead of processing
      console.log('Reclaim request sent to support:', {
        workspace: workspaceName,
        amount: data.amount,
        allocatedPackage: currentWorkspaceBalance,
        remaining: maxAmount,
      })
      // TODO: Implement actual support request API call
      toast.success('Reclaim request has been sent to Support team')
    } else {
      // For allocate mode, process normally
      onConfirm(data.amount)
    }
    reset()
    onOpenChange(false)
  }

  const handleClose = () => {
    reset()
    onOpenChange(false)
  }

  return (
    <Dialog.Root open={open} onOpenChange={handleClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-lg p-6 w-full max-w-md z-50">
          <div className="flex items-center justify-between mb-4">
            <Dialog.Title className="text-xl font-semibold text-[var(--sc-text)]">
              {mode === 'allocate' ? 'Allocate Smartwords' : 'Request Reclaim Smartwords'}
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

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Workspace: {workspaceName}
              </label>
              <div className="bg-gray-50 rounded-lg p-3 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    {mode === 'reclaim' ? 'Allocated package:' : 'Current workspace allocation:'}
                  </span>
                  <span className="font-medium">
                    {currentWorkspaceBalance === null
                      ? 'Not set'
                      : formatNumber(currentWorkspaceBalance)}
                  </span>
                </div>
                {mode === 'reclaim' && currentWorkspaceBalance !== null && workspaceSpent > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Used:</span>
                    <span className="font-medium">{formatNumber(workspaceSpent)}</span>
                  </div>
                )}
                {mode === 'reclaim' && currentWorkspaceBalance !== null && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Remaining (reclaimable):</span>
                    <span className="font-medium">{formatNumber(maxAmount)}</span>
                  </div>
                )}
              </div>
            </div>

            {mode === 'reclaim' && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                <p className="text-sm text-yellow-800">
                  Reclaiming Smartwords operations are done by our Support team.
                </p>
              </div>
            )}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Amount to {mode === 'allocate' ? 'allocate' : 'request reclaim for'}
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleDecrement}
                  disabled={amount <= 0}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <input
                  type="number"
                  {...register('amount', { 
                    valueAsNumber: true,
                  })}
                  onChange={(e) => {
                    const value = e.target.value
                    // Handle empty input
                    if (value === '') {
                      setValue('amount', 0, { shouldValidate: true })
                      return
                    }
                    // Convert to number and validate
                    const numValue = Number(value)
                    if (!isNaN(numValue)) {
                      setValue('amount', numValue, { shouldValidate: true })
                    }
                  }}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--sc-primary)]"
                  min={0}
                  max={maxAmount}
                />
                <button
                  type="button"
                  onClick={handleIncrement}
                  disabled={amount >= maxAmount}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              {errors.amount && (
                <p className="text-sm text-red-600">{errors.amount.message}</p>
              )}
            </div>

            {mode === 'allocate' && (
              <div className="bg-blue-50 rounded-lg p-3 space-y-2 text-sm">
                <div className="font-medium text-blue-900 mb-2">Result</div>
                <div className="flex justify-between text-blue-700">
                  <span>Workspace allocation:</span>
                  <span className="font-medium">
                    {projectedWorkspaceBalance < 0
                      ? '0'
                      : formatNumber(projectedWorkspaceBalance)}
                  </span>
                </div>
                <div className="flex justify-between text-blue-700">
                  <span>Organization balance:</span>
                  <span className="font-medium">{formatNumber(projectedOrgBalance)}</span>
                </div>
              </div>
            )}

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
                type="submit"
                disabled={amount <= 0 || !!errors.amount}
                className="px-4 py-2 text-sm font-medium text-white bg-[var(--sc-primary)] rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
              >
                {mode === 'reclaim' ? 'Send Request' : 'Confirm'}
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}


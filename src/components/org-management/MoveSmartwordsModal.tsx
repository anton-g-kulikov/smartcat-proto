import { useState, useRef, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as Dialog from '@radix-ui/react-dialog'
import { z } from 'zod'
import { X, Plus, Minus, ChevronsUpDown, Check } from 'lucide-react'
import { Avatar } from '@/components/navigation/Avatar'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface OrganizationOption {
  id: string
  name: string
  initial: string
  avatarColor: string
  currentBalance: number
}

interface MoveSmartwordsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentOrgName: string
  currentOrgId: string
  currentOrgBalance: number
  organizations: OrganizationOption[]
  onConfirm: (targetOrgId: string, amount: number) => void
}

const createSchema = (maxAmount: number) =>
  z.object({
    targetOrgId: z.string().min(1, 'Please select an organization'),
    amount: z
      .number()
      .positive('Amount must be positive')
      .min(1, 'Minimum amount is 1')
      .max(maxAmount, `Cannot exceed available balance of ${new Intl.NumberFormat().format(maxAmount)}`),
  })

export function MoveSmartwordsModal({
  open,
  onOpenChange,
  currentOrgName,
  currentOrgId,
  currentOrgBalance,
  organizations,
  onConfirm,
}: MoveSmartwordsModalProps) {
  const availableOrgs = organizations.filter(org => org.id !== currentOrgId)
  const maxAmount = currentOrgBalance
  const schema = createSchema(maxAmount)
  const [comboboxOpen, setComboboxOpen] = useState(false)
  const [triggerWidth, setTriggerWidth] = useState<number | undefined>(undefined)
  const [searchQuery, setSearchQuery] = useState('')
  const triggerRef = useRef<HTMLButtonElement>(null)
  
  useEffect(() => {
    if (triggerRef.current) {
      setTriggerWidth(triggerRef.current.offsetWidth)
    }
  }, [comboboxOpen])

  // Filter organizations based on search query
  const filteredOrgs = availableOrgs.filter((org) => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return org.name.toLowerCase().includes(query) || org.id.toLowerCase().includes(query)
  })
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm<{ targetOrgId: string; amount: number }>({
    resolver: zodResolver(schema),
    defaultValues: { targetOrgId: '', amount: 0 },
  })

  const targetOrgId = watch('targetOrgId')
  const amount = watch('amount')
  const selectedOrg = availableOrgs.find(org => org.id === targetOrgId)

  const projectedCurrentOrgBalance = currentOrgBalance - amount
  const projectedTargetOrgBalance = selectedOrg ? selectedOrg.currentBalance + amount : 0

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

  const onSubmit = (data: { targetOrgId: string; amount: number }) => {
    onConfirm(data.targetOrgId, data.amount)
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
              Move Smartwords
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
                From organization: {currentOrgName}
              </label>
              <div className="bg-gray-50 rounded-lg p-3 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Current balance:</span>
                  <span className="font-medium">{formatNumber(currentOrgBalance)}</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                To organization
              </label>
              <Popover open={comboboxOpen} onOpenChange={setComboboxOpen}>
                <PopoverTrigger asChild>
                  <Button
                    ref={triggerRef}
                    variant="outline"
                    role="combobox"
                    aria-expanded={comboboxOpen}
                    className={cn(
                      "w-full justify-between px-3 py-2 h-auto border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--sc-primary)] bg-white",
                      !targetOrgId && "text-gray-500"
                    )}
                  >
                    <div className="flex items-center gap-2 flex-1 text-left">
                      {selectedOrg ? (
                        <>
                          <Avatar
                            initial={selectedOrg.initial}
                            color={selectedOrg.avatarColor}
                            size="sm"
                          />
                          <span className="text-gray-900">{selectedOrg.name}</span>
                        </>
                      ) : (
                        <span>Select an organization</span>
                      )}
                    </div>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent 
                  className="p-0" 
                  align="start"
                  style={{ width: triggerWidth ? `${triggerWidth}px` : 'auto' }}
                >
                  <Command 
                    shouldFilter={false} 
                    className="rounded-lg border-0"
                    style={{ overflow: 'visible' }}
                  >
                    <CommandInput 
                      placeholder="Search organizations..." 
                      value={searchQuery}
                      onValueChange={setSearchQuery}
                    />
                    <div 
                      className="max-h-[300px] overflow-y-auto overflow-x-hidden"
                      style={{ 
                        overscrollBehavior: 'contain',
                        WebkitOverflowScrolling: 'touch'
                      }}
                      onWheel={(e) => {
                        // Ensure wheel events work
                        const target = e.currentTarget
                        if (target.scrollHeight > target.clientHeight) {
                          e.stopPropagation()
                        }
                      }}
                    >
                      <CommandList className="overflow-visible max-h-none">
                        <CommandEmpty>No organization found.</CommandEmpty>
                        <CommandGroup>
                          {filteredOrgs.map((org) => (
                            <CommandItem
                              key={org.id}
                              value={`${org.name} ${org.id}`}
                              onSelect={() => {
                                setValue('targetOrgId', org.id, { shouldValidate: true })
                                setComboboxOpen(false)
                              }}
                              className="flex items-center gap-2 px-3 py-2 cursor-pointer"
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  targetOrgId === org.id ? "opacity-100" : "opacity-0"
                                )}
                              />
                              <Avatar
                                initial={org.initial}
                                color={org.avatarColor}
                                size="sm"
                              />
                              <div className="flex flex-col flex-1">
                                <span>{org.name}</span>
                                <span className="text-xs text-gray-500">
                                  Balance: {formatNumber(org.currentBalance)}
                                </span>
                              </div>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </div>
                  </Command>
                </PopoverContent>
              </Popover>
              {errors.targetOrgId && (
                <p className="text-sm text-red-600 mt-1">{errors.targetOrgId.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Amount to move
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
                  {...register('amount', { valueAsNumber: true })}
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

            {selectedOrg && amount > 0 && (
              <div className="bg-blue-50 rounded-lg p-3 space-y-2 text-sm">
                <div className="font-medium text-blue-900">Projected balances:</div>
                <div className="flex justify-between text-blue-700">
                  <span>{currentOrgName}:</span>
                  <span className="font-medium">
                    {projectedCurrentOrgBalance < 0
                      ? '0'
                      : formatNumber(projectedCurrentOrgBalance)}
                  </span>
                </div>
                <div className="flex justify-between text-blue-700">
                  <span>{selectedOrg.name}:</span>
                  <span className="font-medium">{formatNumber(projectedTargetOrgBalance)}</span>
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
                disabled={!targetOrgId || amount <= 0 || !!errors.amount || !!errors.targetOrgId}
                className="px-4 py-2 text-sm font-medium text-white bg-[var(--sc-primary)] rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
              >
                Confirm
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}


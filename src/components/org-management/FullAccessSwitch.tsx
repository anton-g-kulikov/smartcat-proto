import * as Switch from '@radix-ui/react-switch'
import * as Tooltip from '@radix-ui/react-tooltip'
import { Info } from 'lucide-react'

interface FullAccessSwitchProps {
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  disabled?: boolean
}

export function FullAccessSwitch({ checked, onCheckedChange, disabled }: FullAccessSwitchProps) {
  return (
    <div className="flex items-center gap-2">
      <Switch.Root
        checked={checked}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
          checked ? 'bg-[var(--sc-primary)]' : 'bg-gray-300'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      >
        <Switch.Thumb
          className={`block h-4 w-4 transform rounded-full bg-white transition-transform ${
            checked ? 'translate-x-5' : 'translate-x-0.5'
          }`}
        />
      </Switch.Root>
      <Tooltip.Provider>
        <Tooltip.Root>
          <Tooltip.Trigger asChild>
            <button
              type="button"
              className="text-gray-400 hover:text-gray-600"
              aria-label="Information about Full SW Access"
            >
              <Info className="w-4 h-4" />
            </button>
          </Tooltip.Trigger>
          <Tooltip.Portal>
            <Tooltip.Content
              className="bg-gray-900 text-white text-xs rounded px-2 py-1 max-w-xs z-50"
              sideOffset={5}
            >
              Allow this workspace to use the shared organization Smartwords pool without allocation limits
              <Tooltip.Arrow className="fill-gray-900" />
            </Tooltip.Content>
          </Tooltip.Portal>
        </Tooltip.Root>
      </Tooltip.Provider>
    </div>
  )
}


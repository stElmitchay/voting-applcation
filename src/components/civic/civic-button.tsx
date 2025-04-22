'use client'

import { useCivic } from './civic-provider'
import { Button } from '../ui/ui-layout'
import { toast } from 'react-hot-toast'

export function CivicVerificationButton() {
  const { hasValidPass, isLoading, error, refreshPass } = useCivic()

  const handleVerify = async () => {
    try {
      await refreshPass()
      if (!hasValidPass) {
        toast.error('Failed to verify Civic Pass. Please try again.')
      } else {
        toast.success('Successfully verified your identity!')
      }
    } catch (err) {
      console.error('Verification error:', err)
      toast.error(err instanceof Error ? err.message : 'Failed to verify Civic Pass. Please try again.')
    }
  }

  if (isLoading) {
    return (
      <Button 
        className="px-4 py-2 bg-[#2c5446] text-white rounded-lg hover:bg-[#1a3a2d] transition-colors disabled:opacity-50" 
        disabled
      >
        Verifying...
      </Button>
    )
  }

  if (hasValidPass) {
    return (
      <Button 
        className="px-4 py-2 bg-[#2c5446] text-white rounded-lg hover:bg-[#1a3a2d] transition-colors disabled:opacity-50" 
        disabled
      >
        Verified
      </Button>
    )
  }

  return (
    <Button 
      className="px-4 py-2 bg-[#2c5446] text-white rounded-lg hover:bg-[#1a3a2d] transition-colors" 
      onClick={handleVerify}
    >
      Verify Identity
    </Button>
  )
} 
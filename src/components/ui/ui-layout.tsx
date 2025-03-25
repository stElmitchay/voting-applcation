'use client'

import Link from 'next/link'
import {usePathname} from 'next/navigation'
import * as React from 'react'
import {ReactNode, Suspense, useEffect, useRef} from 'react'
import toast, {Toaster} from 'react-hot-toast'

import {AccountChecker} from '../account/account-ui'
import {ClusterChecker, ClusterUiSelect, ExplorerLink} from '../cluster/cluster-ui'
import {WalletButton} from '../solana/solana-provider'

export function UiLayout({ children, links }: { children: ReactNode; links: { label: string; path: string }[] }) {
  const pathname = usePathname()

  return (
    <div className="h-full flex flex-col bg-gray-50">
      <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <Link className="flex items-center text-gray-900" href="/">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white mr-3">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="font-semibold text-xl bg-gradient-to-r from-blue-600 to-blue-700 text-transparent bg-clip-text">Utopia</span>
              </Link>
              <div className="hidden sm:ml-8 sm:flex sm:space-x-4">
                {links.map(({ label, path }) => (
                  <Link 
                    key={path}
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                      pathname.startsWith(path) 
                        ? 'border-blue-500 text-gray-900' 
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                    href={path}
                  >
                    {label}
                  </Link>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <WalletButton />
              <div className="hidden sm:block">
                <ClusterUiSelect />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="hidden">
        <ClusterChecker>
          <AccountChecker />
        </ClusterChecker>
      </div>
      <div className="flex-grow">
        <Suspense
          fallback={
            <div className="text-center my-32">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          }
        >
          {children}
        </Suspense>
        <Toaster position="bottom-right" />
      </div>
      <footer className="bg-white border-t border-gray-100 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">
            Utopia - Decentralized Voting Platform - Built with{' '}
            <a
              className="text-blue-600 hover:text-blue-800"
              href="https://solana.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              Solana
            </a>
          </p>
        </div>
      </footer>
    </div>
  )
}

export function AppModal({
  children,
  title,
  hide,
  show,
  submit,
  submitDisabled,
  submitLabel,
}: {
  children: ReactNode
  title: string
  hide: () => void
  show: boolean
  submit?: () => void
  submitDisabled?: boolean
  submitLabel?: string
}) {
  const dialogRef = useRef<HTMLDialogElement | null>(null)

  useEffect(() => {
    if (!dialogRef.current) return
    if (show) {
      dialogRef.current.showModal()
    } else {
      dialogRef.current.close()
    }
  }, [show, dialogRef])

  return (
    <dialog className="modal" ref={dialogRef}>
      <div className="modal-box space-y-5 bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto">
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        {children}
        <div className="flex justify-end space-x-2">
          {submit ? (
            <button 
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2" 
              onClick={submit} 
              disabled={submitDisabled}
            >
              {submitLabel || 'Save'}
            </button>
          ) : null}
          <button 
            onClick={hide} 
            className="px-4 py-2 bg-white text-gray-700 text-sm font-medium rounded-md border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Close
          </button>
        </div>
      </div>
    </dialog>
  )
}

export function AppHero({
  children,
  title,
  subtitle,
}: {
  children?: ReactNode
  title: ReactNode
  subtitle: ReactNode
}) {
  return (
    <div className="bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {typeof title === 'string' ? <h1 className="text-3xl font-bold text-gray-900">{title}</h1> : title}
          {typeof subtitle === 'string' ? <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500">{subtitle}</p> : subtitle}
          {children}
        </div>
      </div>
    </div>
  )
}

export function ellipsify(str = '', len = 4) {
  if (str.length > 30) {
    return str.substring(0, len) + '..' + str.substring(str.length - len, str.length)
  }
  return str
}

export function useTransactionToast() {
  return (signature: string) => {
    toast.success(
      <div className="text-center">
        <div className="text-sm font-medium">Transaction sent</div>
        <ExplorerLink path={`tx/${signature}`} label="View Transaction" className="text-xs text-blue-600 hover:text-blue-800" />
      </div>
    )
  }
}

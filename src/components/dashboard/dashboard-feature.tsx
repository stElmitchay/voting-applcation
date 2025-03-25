'use client'

import Link from 'next/link'
import { AppHero } from '../ui/ui-layout'

const externalLinks: { label: string; href: string }[] = [
  { label: 'Solana Docs', href: 'https://docs.solana.com/' },
  { label: 'Solana Faucet', href: 'https://faucet.solana.com/' },
  { label: 'Solana Cookbook', href: 'https://solanacookbook.com/' },
  { label: 'Solana Stack Overflow', href: 'https://solana.stackexchange.com/' },
  { label: 'Solana Developers GitHub', href: 'https://github.com/solana-developers/' },
]

const appLinks: { label: string; href: string; description: string }[] = [
  { 
    label: 'Voting Application', 
    href: '/voting', 
    description: 'Create polls, add candidates and vote securely on Solana blockchain.'
  },
  { 
    label: 'Counter App (Template)', 
    href: '/votingapplication', 
    description: 'Example app from the template. Create and manage counters.'
  },
]

export default function DashboardFeature() {
  return (
    <div>
      <AppHero title="Solana dApp" subtitle="Welcome to your Solana decentralized applications." />
      
      <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold mb-6">Your Applications</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {appLinks.map((link, index) => (
            <Link href={link.href} key={index} className="no-underline">
              <div className="card bg-base-200 hover:bg-base-300 transition-colors cursor-pointer h-full">
                <div className="card-body">
                  <h3 className="card-title">{link.label}</h3>
                  <p>{link.description}</p>
                  <div className="card-actions justify-end mt-2">
                    <button className="btn btn-primary btn-sm">Open</button>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
        
        <h2 className="text-xl font-bold mb-4">Helpful Resources</h2>
        <div className="flex flex-wrap gap-2 justify-center">
          {externalLinks.map((link, index) => (
            <a 
              key={index} 
              href={link.href} 
              className="btn btn-outline btn-sm" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}

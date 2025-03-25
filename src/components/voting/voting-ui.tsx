'use client'

import { useWallet } from '@solana/wallet-adapter-react'
import { useState, useEffect } from 'react'
import { PublicKey } from '@solana/web3.js'
import { useVotingProgram } from './voting-data-access'
import { ExplorerLink } from '../cluster/cluster-ui'
import { ellipsify } from '../ui/ui-layout'

// Component to create a new poll
export function CreatePollForm({ onPollCreated }: { onPollCreated?: (details: any) => void }) {
  const { initializePoll } = useVotingProgram()
  const [pollId, setPollId] = useState('')
  const [description, setDescription] = useState('')
  const [pollStart, setPollStart] = useState('')
  const [pollEnd, setPollEnd] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    
    if (!pollId || !description || !pollStart || !pollEnd) {
      setError('All fields are required')
      return
    }

    // Validate dates
    const startDate = new Date(pollStart)
    const endDate = new Date(pollEnd)
    const now = new Date()
    
    if (startDate < now) {
      setError('Start date cannot be in the past')
      return
    }
    
    if (endDate <= startDate) {
      setError('End date must be after start date')
      return
    }

    // Convert dates to Unix timestamps (seconds)
    const startTimestamp = Math.floor(startDate.getTime() / 1000)
    const endTimestamp = Math.floor(endDate.getTime() / 1000)

    const pollDetails = {
      pollId: parseInt(pollId),
      description,
      pollStart: startTimestamp,
      pollEnd: endTimestamp,
    }

    if (onPollCreated) {
      onPollCreated(pollDetails)
    } else {
      initializePoll.mutate(pollDetails)
      
      // Reset form
      setPollId('')
      setDescription('')
      setPollStart('')
      setPollEnd('')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}
      
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-600">Poll ID</label>
        <input
          type="number"
          placeholder="Enter a unique identifier for your poll"
          className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-gray-700 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
          value={pollId}
          onChange={(e) => setPollId(e.target.value)}
          required
        />
      </div>
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-600">Description</label>
        <textarea
          placeholder="Describe what your poll is about"
          className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-gray-700 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-600">Start Date</label>
          <input
            type="datetime-local"
            className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-gray-700 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            value={pollStart}
            onChange={(e) => setPollStart(e.target.value)}
            required
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-600">End Date</label>
          <input
            type="datetime-local"
            className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-gray-700 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            value={pollEnd}
            onChange={(e) => setPollEnd(e.target.value)}
            required
          />
        </div>
      </div>
      <div className="pt-2">
        <button
          type="submit"
          className="w-full px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          disabled={initializePoll.isPending}
        >
          {initializePoll.isPending ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin h-4 w-4 mr-2 border-b-2 border-white rounded-full"></div>
              <span>Creating...</span>
            </div>
          ) : (
            'Create Poll'
          )}
        </button>
      </div>
    </form>
  )
}

// Component to add a candidate to a poll
export function AddCandidateForm({ pollId, onUpdate }: { pollId: number; onUpdate?: () => void }) {
  const { initializeCandidate } = useVotingProgram()
  const [candidateName, setCandidateName] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!candidateName) return

    await initializeCandidate.mutateAsync({
      pollId,
      candidateName,
    })

    setCandidateName('')
    if (onUpdate) onUpdate()
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 items-end mb-4">
      <div className="form-control flex-grow space-y-1">
        <label className="text-sm font-medium text-gray-600">Candidate Name</label>
        <input
          type="text"
          placeholder="Enter candidate name"
          className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
          value={candidateName}
          onChange={(e) => setCandidateName(e.target.value)}
          required
        />
      </div>
      <button
        type="submit"
        className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        disabled={initializeCandidate.isPending}
      >
        {initializeCandidate.isPending ? (
          <div className="flex items-center">
            <div className="animate-spin h-3 w-3 mr-2 border-b-2 border-white rounded-full"></div>
            <span>Adding...</span>
          </div>
        ) : (
          'Add Candidate'
        )}
      </button>
    </form>
  )
}

// Component to vote for a candidate
export function VotingSection({ 
  pollId, 
  candidates, 
  isActive, 
  onUpdate 
}: { 
  pollId: number; 
  candidates: any[]; 
  isActive: boolean;
  onUpdate?: () => void;
}) {
  const { vote } = useVotingProgram()
  const [selectedCandidate, setSelectedCandidate] = useState<string | null>(null)

  const handleVote = async () => {
    if (!selectedCandidate) return
    
    await vote.mutateAsync({
      pollId,
      candidateName: selectedCandidate,
    })
    
    if (onUpdate) onUpdate()
  }

  // Calculate the total votes
  const totalVotes = candidates.reduce((sum, c) => sum + Number(c.account.candidateVotes), 0)

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <h3 className="text-lg font-medium mb-4">Cast your vote</h3>
      
      <div className="space-y-3 mb-5">
        {candidates.map((candidate, index) => {
          const candidateName = candidate.account.candidateName
          const votePercentage = totalVotes > 0 
            ? Math.round((Number(candidate.account.candidateVotes) / totalVotes) * 100) 
            : 0
            
          return (
            <div key={index} className="mb-3">
              <label className="inline-flex items-center w-full cursor-pointer">
                <input
                  type="radio"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  name="candidate"
                  value={candidateName}
                  checked={selectedCandidate === candidateName}
                  onChange={() => setSelectedCandidate(candidateName)}
                  disabled={!isActive || vote.isPending}
                />
                <span className="ml-2 text-gray-700">{candidateName}</span>
              </label>
              <div className="mt-1.5 h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500"
                  style={{ width: `${votePercentage}%` }}
                ></div>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {votePercentage}% ({candidate.account.candidateVotes.toString()} votes)
              </div>
            </div>
          )
        })}
      </div>
      
      <button
        onClick={handleVote}
        className="w-full py-2.5 bg-blue-600 text-white text-center font-medium rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        disabled={!selectedCandidate || !isActive || vote.isPending}
      >
        {vote.isPending ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin h-4 w-4 mr-2 border-b-2 border-white rounded-full"></div>
            <span>Voting...</span>
          </div>
        ) : (
          'Vote'
        )}
      </button>
      
      <div className="mt-5">
        <div className="text-sm flex justify-between font-medium text-gray-700">
          <span>Current Votes</span>
          <span>Quorum</span>
        </div>
        <div className="mt-1.5 h-2 w-full bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full bg-blue-500" style={{ width: `${totalVotes > 0 ? 50 : 0}%` }}></div>
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>Total: {totalVotes} votes</span>
          <span>50% ✓</span>
        </div>
      </div>
    </div>
  )
}

// Component to display a poll with its candidates
export function PollCard({ poll, publicKey, onUpdate }: { poll: any; publicKey: PublicKey; onUpdate: () => void }) {
  const { getPollCandidates } = useVotingProgram()
  const [candidates, setCandidates] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState(false)

  const fetchCandidates = async () => {
    setLoading(true)
    try {
      const result = await getPollCandidates(poll.pollId.toNumber())
      setCandidates(result)
    } catch (error) {
      console.error('Error fetching candidates:', error)
    } finally {
      setLoading(false)
    }
  }

  // Function to handle updates from child components
  const handleUpdate = () => {
    fetchCandidates()
    if (onUpdate) onUpdate()
  }

  useEffect(() => {
    if (expanded) {
      fetchCandidates()
    }
  }, [expanded])

  // Format dates nicely
  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString()
  }

  // Calculate time remaining
  const getTimeRemaining = (endTime: number) => {
    const now = Math.floor(Date.now() / 1000)
    const timeRemaining = endTime - now
    
    if (timeRemaining <= 0) return "Ended"
    
    const days = Math.floor(timeRemaining / (24 * 60 * 60))
    const hours = Math.floor((timeRemaining % (24 * 60 * 60)) / (60 * 60))
    const minutes = Math.floor((timeRemaining % (60 * 60)) / 60)
    
    return `${days}d ${hours}h ${minutes}m`
  }

  // Check if poll is active
  const now = Math.floor(Date.now() / 1000)
  const isActive = now >= poll.pollStart.toNumber() && now <= poll.pollEnd.toNumber()
  const status = isActive ? 'Active' : now < poll.pollStart.toNumber() ? 'Not started' : 'Ended'
  const statusColor = isActive ? 'bg-green-100 text-green-800' : now < poll.pollStart.toNumber() ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'

  return (
    <div className="bg-white rounded-lg border border-gray-200 mb-4 overflow-hidden">
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <span className={`${statusColor} text-xs font-medium px-2.5 py-0.5 rounded-full`}>
            {status}
          </span>
          {isActive && (
            <span className="text-xs text-gray-500">
              Ends in {getTimeRemaining(poll.pollEnd.toNumber())}
            </span>
          )}
        </div>
        
        <h3 className="text-lg font-bold text-gray-900 mb-2 hover:text-blue-600 cursor-pointer" onClick={() => setExpanded(!expanded)}>
          Poll #{poll.pollId.toString()}
        </h3>
        
        <p className="text-gray-700 text-sm mb-3">{poll.description}</p>
        
        <div className="text-xs text-gray-500 mb-3">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="block mb-1">Start:</span>
              {formatDate(poll.pollStart.toNumber())}
            </div>
            <div>
              <span className="block mb-1">End:</span>
              {formatDate(poll.pollEnd.toNumber())}
            </div>
          </div>
        </div>
        
        <button 
          className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? 'Hide Details' : 'Show Details'}
          <svg 
            className={`ml-1 w-4 h-4 transition-transform ${expanded ? 'rotate-180' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {expanded && (
          <div className="mt-4 border-t border-gray-200 pt-4">
            <div className="mb-3">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Poll Details</h4>
              <p className="text-xs text-gray-600 mb-1">
                <span className="font-medium">Address:</span>{' '}
                <ExplorerLink path={`account/${publicKey}`} label={ellipsify(publicKey.toString())} />
              </p>
              <p className="text-xs text-gray-600">
                <span className="font-medium">Candidates:</span> {poll.candidateAmount.toString()}
              </p>
            </div>

            {loading ? (
              <div className="flex justify-center my-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              </div>
            ) : candidates.length > 0 ? (
              <>
                <VotingSection pollId={poll.pollId.toNumber()} candidates={candidates} isActive={isActive} onUpdate={handleUpdate} />
                
                {isActive && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Add New Candidate</h4>
                    <AddCandidateForm pollId={poll.pollId.toNumber()} onUpdate={handleUpdate} />
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-4">
                <p className="text-gray-500">No candidates found for this poll.</p>
                {isActive && <AddCandidateForm pollId={poll.pollId.toNumber()} onUpdate={handleUpdate} />}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// Component to list all polls
export function PollsList() {
  const { polls } = useVotingProgram()
  
  // Debug polls data
  useEffect(() => {
    if (polls.data) {
      console.log('Polls data:', polls.data)
    }
  }, [polls.data])

  if (polls.isLoading) {
    return (
      <div className="flex justify-center py-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (polls.error) {
    console.error('Error loading polls:', polls.error)
    return (
      <div className="bg-red-50 text-red-800 rounded-lg p-4 text-sm">
        Error loading polls. Please try again.
      </div>
    )
  }

  if (!polls.data || polls.data.length === 0) {
    return (
      <div className="bg-blue-50 text-blue-800 rounded-lg p-4 text-sm">
        No polls found. Create one to get started!
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {polls.data.map((pollAccount) => (
        <PollCard
          key={pollAccount.publicKey.toString()}
          poll={pollAccount.account}
          publicKey={pollAccount.publicKey}
          onUpdate={() => polls.refetch()}
        />
      ))}
    </div>
  )
} 
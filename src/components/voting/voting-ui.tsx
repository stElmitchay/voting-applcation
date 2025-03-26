'use client'

import { useWallet } from '@solana/wallet-adapter-react'
import { useState, useEffect, useCallback } from 'react'
import { PublicKey } from '@solana/web3.js'
import { useVotingProgram } from './voting-data-access'
import { ExplorerLink } from '../cluster/cluster-ui'
import { ellipsify } from '../ui/ui-layout'
import { toast } from 'react-hot-toast'

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
  const { vote, deleteCandidate, REQUIRED_SOL_AMOUNT, checkSolBalance } = useVotingProgram()
  const { publicKey } = useWallet()
  const [isChecking, setIsChecking] = useState(false)
  const [solBalance, setSolBalance] = useState<number | null>(null)
  const [voteError, setVoteError] = useState<string | null>(null)

  // Use useCallback to memoize the function
  const checkUserSolBalance = useCallback(async () => {
    if (!publicKey) return
    
    setIsChecking(true)
    setVoteError(null)
    try {
      const { balance } = await checkSolBalance(publicKey)
      setSolBalance(balance)
    } catch (error) {
      console.error('Error checking SOL balance:', error)
      setVoteError('Failed to check SOL balance')
    } finally {
      setIsChecking(false)
    }
  }, [publicKey, checkSolBalance, setIsChecking, setSolBalance, setVoteError])

  // Check SOL balance when wallet connects
  useEffect(() => {
    if (publicKey) {
      checkUserSolBalance()
    } else {
      setSolBalance(null)
    }
  }, [publicKey, checkUserSolBalance])

  const handleVote = async (candidateName: string) => {
    if (!publicKey) {
      toast.error('Please connect your wallet to vote')
      return
    }

    try {
      setVoteError(null)
      await vote.mutateAsync({
        pollId,
        candidateName,
      })
      
      if (onUpdate) onUpdate()
    } catch (error: any) {
      console.error('Error voting:', error)
      setVoteError(error.message || 'Failed to cast vote')
    }
  }

  const handleDeleteCandidate = async (candidateName: string) => {
    if (window.confirm(`Are you sure you want to delete candidate "${candidateName}"? This action cannot be undone.`)) {
      try {
        await deleteCandidate.mutateAsync({
          pollId,
          candidateName,
        })
        
        if (onUpdate) onUpdate()
      } catch (error) {
        console.error('Error deleting candidate:', error)
      }
    }
  }

  // Calculate the total votes
  const totalVotes = candidates.reduce((sum, c) => sum + Number(c.account.candidateVotes), 0)

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Cast your vote</h3>
        <div className="text-sm text-gray-600">
          <span className="inline-flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Requires {REQUIRED_SOL_AMOUNT} SOL to vote
          </span>
        </div>
      </div>
      
      {publicKey && (
        <div className="mb-4">
          {solBalance !== null && (
            <div className={`p-3 rounded-lg text-sm ${solBalance >= REQUIRED_SOL_AMOUNT ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'} flex justify-between items-center`}>
              <div className="flex items-center">
                {solBalance >= REQUIRED_SOL_AMOUNT ? (
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                )}
                <span>
                  {solBalance >= REQUIRED_SOL_AMOUNT 
                    ? `You have ${solBalance.toFixed(4)} SOL. You can vote!` 
                    : `You have ${solBalance.toFixed(4)} SOL. You need at least ${REQUIRED_SOL_AMOUNT} SOL to vote.`}
                </span>
              </div>
              <button 
                onClick={checkUserSolBalance} 
                className="text-sm px-2 py-1 rounded hover:bg-opacity-80 focus:outline-none"
                disabled={isChecking}
                title="Refresh SOL balance"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            </div>
          )}
          
          {isChecking && (
            <div className="flex justify-center items-center my-2 p-3 bg-blue-50 rounded-lg">
              <div className="animate-spin h-4 w-4 mr-2 border-b-2 border-blue-600 rounded-full"></div>
              <span className="text-sm text-blue-700">Checking SOL balance...</span>
            </div>
          )}
          
          {voteError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mt-2">
              {voteError}
            </div>
          )}
        </div>
      )}
      
      <div className="grid grid-cols-1 gap-4">
        {candidates.map((candidate, index) => {
          const candidateName = candidate.account.candidateName
          const voteCount = Number(candidate.account.candidateVotes)
          const votePercentage = totalVotes > 0 
            ? Math.round((voteCount / totalVotes) * 100) 
            : 0
            
          const canVote = isActive && publicKey && (!isChecking) && (solBalance !== null && solBalance >= REQUIRED_SOL_AMOUNT)
            
          return (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-lg font-medium">{candidateName}</h4>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleVote(candidateName)}
                    className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!canVote || vote.isPending}
                    title={!publicKey 
                      ? 'Connect your wallet to vote' 
                      : !isActive 
                      ? 'Poll is not active' 
                      : isChecking
                      ? 'Checking SOL balance...'
                      : solBalance !== null && solBalance < REQUIRED_SOL_AMOUNT
                      ? `You need at least ${REQUIRED_SOL_AMOUNT} SOL to vote`
                      : ''}
                  >
                    {vote.isPending ? 'Voting...' : 'Vote'}
                  </button>
                  {isActive && (
                    <button
                      onClick={() => handleDeleteCandidate(candidateName)}
                      className="p-2 text-gray-600 hover:text-red-600 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                      title="Delete candidate"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 transition-all duration-300"
                    style={{ width: `${votePercentage}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>{voteCount} votes</span>
                  <span>{votePercentage}%</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
      
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex justify-between text-sm font-medium text-gray-700 mb-2">
          <span>Total Votes</span>
          <span>{totalVotes}</span>
        </div>
      </div>
    </div>
  )
}

// Component to display a poll with its candidates
export function PollCard({ poll, publicKey, onUpdate }: { poll: any; publicKey: PublicKey; onUpdate: () => void }) {
  const { getPollCandidates, hidePoll } = useVotingProgram()
  const [candidates, setCandidates] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editedDescription, setEditedDescription] = useState(poll.description)
  const [error, setError] = useState<string | null>(null)

  // Check if poll has started
  const now = Math.floor(Date.now() / 1000)
  const hasStarted = now >= poll.pollStart.toNumber()
  const isActive = now >= poll.pollStart.toNumber() && now <= poll.pollEnd.toNumber()
  const status = isActive ? 'Active' : now < poll.pollStart.toNumber() ? 'Not started' : 'Ended'
  const statusColor = isActive ? 'bg-green-100 text-green-800' : now < poll.pollStart.toNumber() ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'

  // Use useCallback to memoize the function
  const fetchCandidates = useCallback(async () => {
    setLoading(true)
    try {
      const result = await getPollCandidates(poll.pollId.toNumber())
      setCandidates(result)
    } catch (error) {
      console.error('Error fetching candidates:', error)
    } finally {
      setLoading(false)
    }
  }, [getPollCandidates, poll.pollId, setCandidates, setLoading])

  // Function to handle updates from child components
  const handleUpdate = useCallback(() => {
    fetchCandidates()
    if (onUpdate) onUpdate()
  }, [fetchCandidates, onUpdate])

  useEffect(() => {
    if (expanded) {
      fetchCandidates()
    }
  }, [expanded, fetchCandidates])

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

  const handleEdit = async () => {
    setError(null)
    
    if (!editedDescription.trim()) {
      setError('Description is required')
      return
    }

    // Update only in the UI
    poll.description = editedDescription
    setIsEditing(false)
    onUpdate()
  }

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to hide this poll? This action will remove it from your view but the poll will still exist on the blockchain.')) {
      hidePoll(poll.pollId.toNumber())
      onUpdate()
    }
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 mb-4 overflow-hidden">
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center gap-2">
            <span className={`${statusColor} text-xs font-medium px-2.5 py-0.5 rounded-full`}>
              {status}
            </span>
            {isActive && (
              <span className="text-xs text-gray-500">
                Ends in {getTimeRemaining(poll.pollEnd.toNumber())}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="text-gray-600 hover:text-blue-600"
              title="Edit description"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              onClick={handleDelete}
              className="text-gray-600 hover:text-red-600"
              title="Hide poll"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
        
        <h3 className="text-lg font-bold text-gray-900 mb-2 hover:text-blue-600 cursor-pointer" onClick={() => setExpanded(!expanded)}>
          Poll #{poll.pollId.toString()}
        </h3>
        
        {isEditing ? (
          <div className="space-y-4 mb-3">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-600">Description</label>
              <textarea
                value={editedDescription}
                onChange={(e) => setEditedDescription(e.target.value)}
                placeholder="Describe what your poll is about"
                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-gray-700 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-600">Start Date</label>
                <input
                  type="datetime-local"
                  value={new Date(poll.pollStart.toNumber() * 1000).toISOString().slice(0, 16)}
                  className="w-full px-4 py-2.5 bg-gray-100 border border-gray-200 rounded-lg text-gray-700 text-sm"
                  disabled
                  title="Start date cannot be modified after poll creation"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-600">End Date</label>
                <input
                  type="datetime-local"
                  value={new Date(poll.pollEnd.toNumber() * 1000).toISOString().slice(0, 16)}
                  className="w-full px-4 py-2.5 bg-gray-100 border border-gray-200 rounded-lg text-gray-700 text-sm"
                  disabled
                  title="End date cannot be modified after poll creation"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setIsEditing(false)
                  setEditedDescription(poll.description)
                  setError(null)
                }}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleEdit}
                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        ) : (
          <>
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
          </>
        )}
        
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
                
                {!hasStarted && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Add New Candidate</h4>
                    <AddCandidateForm pollId={poll.pollId.toNumber()} onUpdate={handleUpdate} />
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-4">
                <p className="text-gray-500">No candidates found for this poll.</p>
                {!hasStarted ? (
                  <AddCandidateForm pollId={poll.pollId.toNumber()} onUpdate={handleUpdate} />
                ) : (
                  <p className="text-sm text-red-600 mt-2">
                    Cannot add candidates after poll has started.
                  </p>
                )}
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
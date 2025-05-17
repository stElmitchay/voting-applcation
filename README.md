# 🗳️ utopia

Utopia is a no-code, decentralized voting platform built on the Solana blockchain that solves the widespread distrust, complexity, and high cost of traditional voting systems. In a country like Sierra Leone—where even student elections or reality show votes can trigger conflict—Utopia empowers universities, organizations, and event managers to launch transparent, tamper-proof elections without technical barriers. With features like self-serve poll creation, configurable voting rules, pay-to-vote options, and real-time on-chain results, Utopia makes every vote count—instantly, anonymously, and verifiably. More than just a product, it’s a movement toward restoring trust in democratic processes.


## 🚀 Features

- Create Polls: Launch a poll with a unique ID, description, start and end time (requires 1 SOL).
- Add Candidates: Add candidate names to specific polls.
- Vote On-chain: Cast votes for your preferred candidates in real-time.
- View Results: See live vote counts for each candidate in a poll.
- Built with Anchor v0.30.1
- Frontend powered by React & TypeScript
- Authentication with Privy: Email, social login and wallet connections

## 🛠️ Prerequisites

Make sure the following tools are installed globally on your machine:

- [Node.js](https://nodejs.org/) v18.18.0 or higher
- [Rust](https://www.rust-lang.org/tools/install) v1.77.2 or higher
- [Solana CLI](https://docs.solana.com/cli/install-solana-cli-tools) v1.18.17 or higher
- [Anchor CLI](https://book.anchor-lang.com/getting_started/installation.html) v0.30.1 or higher

You can use any Node package manager (npm, yarn, pnpm). All examples below use `npm`.

## 📦 Installation

```bash
git clone https://github.com/stElmitchay/voting-applcation.git
cd voting-applcation
npm install
```

## 🔐 Privy Authentication Setup

1. Create a `.env.local` file in the root directory with the following variables:

```
NEXT_PUBLIC_PRIVY_APP_ID=your_privy_app_id
NEXT_PUBLIC_SOLANA_ENDPOINT=https://api.devnet.solana.com
```

2. Sign up for a Privy account at [privy.io](https://privy.io) and obtain your app ID
3. Replace `your_privy_app_id` with your actual Privy App ID

## 🧪 Run Locally

### Build and Deploy to Devnet
```bash
cd anchor
anchor build
anchor deploy --provider.cluster devnet
```
### Run Frontend
```bash
cd src
npm run dev
```

## 📋 Solana Program Overview

The voting logic is written in the Anchor. It uses derived accounts with deterministic seeds:

- `poll_id` → Stores metadata about the poll
- `poll_id + candidate_name` → Stores candidate information and vote counts

Available instructions:

- `create_poll`: Initialize a poll with ID, description, start time, end time (costs 1 SOL).
- `add_candidate`: Add a candidate to the poll.
- `vote`: Vote for a candidate in a specific poll.
- `get_results`: View candidate vote counts.

The logic resides in `anchor/src/lib.rs`.

## 🧩 Customization

This project is modular and customizable:

- Replace or rebuild the frontend
- Extend the Solana program with new instructions (e.g., private voting, rewards).
- Integrate DAO tooling, Discord bots, analytics dashboards, or token-based gating.

## 🔒 Authentication with Privy

This project uses Privy for authentication, providing:

- Email-based login with automatic wallet creation
- Social authentication (Google, Twitter, Discord)
- Traditional wallet connection support (Phantom, Solflare)
- Session management and persistence
- Secure user management

For more information, see the [Privy documentation](https://docs.privy.io/).

## 🤝 Contributing

Pull requests and forks are welcome! Open an issue if you'd like to propose changes, improvements, or report a bug.

## 📄 License

MIT License. Free to use, modify, and distribute.

---
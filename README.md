
# 🗳️ Solana Voting Application

A simple and extensible on-chain voting application built on the [Solana](https://solana.com/) blockchain using the [Anchor](https://book.anchor-lang.com/) framework. This open-source project allows users to create polls, add candidates, vote, and view results—entirely on-chain.

 **Note:**  🧱 This project extends the **original voting app built during the Solana Foundation Developer Bootcamp 2024**. Watch the bootcamp session [here](https://youtu.be/amAq-WHAFs8?si=gCsQf4M7dSL66uw3) and explore the original repo [here](https://github.com/solana-developers/developer-bootcamp-2024).


## 🚀 Features

- Create Polls: Launch a poll with a unique ID, description, start and end time (requires 1 SOL).
- Add Candidates: Add candidate names to specific polls.
- Vote On-chain: Cast votes for your preferred candidates in real-time.
- View Results: See live vote counts for each candidate in a poll.
- Built with Anchor v0.30.1
- Frontend powered by React & TypeScript

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

## 🤝 Contributing

Pull requests and forks are welcome! Open an issue if you’d like to propose changes, improvements, or report a bug.

## 📄 License

MIT License. Free to use, modify, and distribute.

---
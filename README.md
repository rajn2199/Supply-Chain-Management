# Block Project

A blockchain-based supply chain tracking application built with:

- Hardhat + Solidity smart contracts
- Next.js frontend (App Router)
- Ethers/Wagmi for wallet and contract interaction

## Features

- Role-based supply chain access control (admin/manufacturer/distributor/retailer)
- Product creation and batch creation
- Ownership transfer and shipment history tracking
- Product status updates and recall flow
- Product verification endpoint logic
- Dashboard and tracking pages in the frontend

## Project Structure

```
block_project/
  contracts/              # Solidity contracts
  scripts/                # Deployment/seed scripts
  test/                   # Hardhat tests
  frontend/               # Next.js frontend
  hardhat.config.ts
```

## Prerequisites

- Node.js 18+ (recommended LTS)
- npm
- MetaMask (for frontend wallet interaction)

## Installation

From the project root:

```bash
npm install
cd frontend
npm install
cd ..
```

## Run The Frontend

From root:

```bash
npm run dev
```

This starts the Next.js app in `frontend/` (usually at `http://localhost:3000`).

## Smart Contract Commands

From root:

```bash
npx hardhat compile
npx hardhat test
```

Deploy using your scripts (examples):

```bash
node scripts/deploy.js
# or
npx hardhat run scripts/deploy.ts
```

## Notes

- The current root `npm test` script is a placeholder. Use `npx hardhat test` for contract tests.
- If you add network RPC URLs/private keys later, store them in `.env` and never commit secrets.

## License

ISC

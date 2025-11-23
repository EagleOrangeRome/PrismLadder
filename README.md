# PrismLadder

A privacy-preserving compensation transparency platform built on FHEVM (Fully Homomorphic Encryption Virtual Machine) by Zama. PrismLadder enables organizations to collect and analyze salary data while maintaining complete privacy through homomorphic encryption.

## 🌟 Features

- **Privacy-Preserving Data Collection**: Submit compensation data in encrypted form using FHEVM
- **Homomorphic Analytics**: Perform aggregate analysis (mean, median, percentiles) on encrypted data without decryption
- **Role & Level Grouping**: Analyze compensation by job role and seniority level
- **Transparent Insights**: View aggregate statistics while keeping individual data private
- **Web3 Integration**: Built with Ethereum and FHEVM for decentralized privacy

## 🏗️ Project Structure

```
zama_PrismLadder/
├── fhevm-hardhat-template/    # Smart contracts and deployment
│   ├── contracts/             # Solidity contracts
│   │   ├── PrismLadderCompensation.sol  # Main compensation contract
│   │   └── FHECounter.sol      # Example FHE counter
│   ├── deploy/                # Deployment scripts
│   ├── tasks/                 # Hardhat custom tasks
│   ├── test/                  # Contract tests
│   └── hardhat.config.ts      # Hardhat configuration
│
└── prismladder-frontend/      # Next.js frontend application
    ├── app/                   # Next.js app directory
    │   ├── page.tsx           # Home page
    │   ├── submit/            # Compensation submission page
    │   ├── dashboard/         # Analytics dashboard
    │   ├── analytics/         # Detailed analytics
    │   └── profile/           # User profile
    ├── components/            # React components
    ├── hooks/                 # Custom React hooks
    ├── fhevm/                 # FHEVM integration utilities
    └── scripts/               # Build and dev scripts
```

## 🚀 Quick Start

### Prerequisites

- **Node.js**: Version 20 or higher
- **npm**: Version 7.0.0 or higher
- **MetaMask** or compatible Web3 wallet
- **Hardhat node** (for local development with mock mode)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/EagleOrangeRome/zama_PrismLadder.git
   cd zama_PrismLadder
   ```

2. **Install contract dependencies**

   ```bash
   cd fhevm-hardhat-template
   npm install
   ```

3. **Install frontend dependencies**

   ```bash
   cd ../prismladder-frontend
   npm install
   ```

### Development Setup

#### Smart Contracts

1. **Set up environment variables**

   ```bash
   cd fhevm-hardhat-template
   npx hardhat vars set MNEMONIC
   npx hardhat vars set INFURA_API_KEY
   ```

2. **Compile contracts**

   ```bash
   npm run compile
   ```

3. **Run tests**

   ```bash
   npm run test
   ```

4. **Deploy to local network**

   ```bash
   # Start local Hardhat node
   npx hardhat node

   # In another terminal, deploy contracts
   npx hardhat deploy --network localhost
   ```

5. **Deploy to Sepolia Testnet**

   ```bash
   npx hardhat deploy --network sepolia
   ```

#### Frontend

1. **Development with Mock Mode** (for local Hardhat node)

   ```bash
   cd prismladder-frontend
   npm run dev:mock
   ```

   This will:
   - Check if Hardhat node is running
   - Generate contract ABIs and addresses
   - Start Next.js dev server with mock FHEVM utilities

2. **Development with Real Relayer** (for testnet/mainnet)

   ```bash
   npm run dev
   ```

   This will:
   - Generate contract ABIs and addresses
   - Start Next.js dev server with real Zama Relayer SDK

3. **Build for production**

   ```bash
   npm run build
   ```

   The static export will be available in the `out/` directory.

## 📖 Usage

### Submitting Compensation Data

1. Connect your Web3 wallet
2. Navigate to the Submit page
3. Fill in your compensation details:
   - Role (Software Engineer, Product Manager, etc.)
   - Level (Junior, Mid, Senior, etc.)
   - Encrypted compensation amount
4. Submit the encrypted data to the blockchain

### Viewing Analytics

1. Navigate to the Dashboard or Analytics page
2. View aggregate statistics:
   - Mean compensation by role/level
   - Median compensation
   - Percentile distributions
3. All analysis is performed on encrypted data without decryption

## 🔐 Privacy & Security

- **Fully Homomorphic Encryption**: All compensation data is encrypted using FHEVM
- **No Decryption Required**: Aggregate analysis works directly on encrypted data
- **Individual Privacy**: Individual submissions remain private and cannot be decrypted by anyone
- **On-Chain Storage**: Encrypted data is stored on-chain for transparency and auditability

## 🛠️ Technology Stack

### Smart Contracts
- **Solidity**: ^0.8.24
- **FHEVM**: @fhevm/solidity ^0.9.1 (latest stable)
- **Hardhat**: Development and testing framework
- **Ethers.js**: Ethereum interaction library

### Frontend
- **Next.js**: ^14.1.0 (with static export)
- **React**: ^18.2.0
- **TypeScript**: ^5.3.3
- **Tailwind CSS**: Styling
- **Radix UI**: Component library
- **FHEVM Integration**: @zama-fhe/relayer-sdk ^0.3.0-7 and @fhevm/mock-utils ^0.3.0-2 (updated to latest versions)

## 📜 Available Scripts

### Smart Contracts (`fhevm-hardhat-template/`)

| Script | Description |
|--------|-------------|
| `npm run compile` | Compile all contracts |
| `npm run test` | Run all tests |
| `npm run test:sepolia` | Run tests on Sepolia testnet |
| `npm run coverage` | Generate coverage report |
| `npm run lint` | Run linting checks |
| `npm run clean` | Clean build artifacts |

### Frontend (`prismladder-frontend/`)

| Script | Description |
|--------|-------------|
| `npm run dev` | Start dev server with real relayer |
| `npm run dev:mock` | Start dev server with mock FHEVM (for local node) |
| `npm run build` | Build for production (static export) |
| `npm run check:static` | Verify static export compatibility |
| `npm run lint` | Run ESLint |

## 🧪 Testing

### Contract Tests

```bash
cd fhevm-hardhat-template
npm run test
```

Tests include:
- Local Hardhat network tests
- Sepolia testnet integration tests
- FHEVM encryption/decryption flow
- Homomorphic operations validation

### Frontend Testing

The frontend uses static export and is designed to work in browser-only mode. Test by:
1. Running `npm run build`
2. Serving the `out/` directory
3. Testing wallet connection and contract interaction

## 📚 Documentation

- [FHEVM Documentation](https://docs.zama.ai/fhevm)
- [FHEVM Hardhat Setup Guide](https://docs.zama.ai/protocol/solidity-guides/getting-started/setup)
- [FHEVM Testing Guide](https://docs.zama.ai/protocol/solidity-guides/development-guide/hardhat/write_test)
- [Zama Relayer SDK](https://docs.zama.ai/fhevm/relayer)

## 🤝 Contributing

This project follows a feature branch workflow:

1. Create a feature branch from `main`
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## 📄 License

This project is licensed under the BSD-3-Clause-Clear License. See the [LICENSE](fhevm-hardhat-template/LICENSE) file for details.

## 🆘 Support

- **GitHub Issues**: [Report bugs or request features](https://github.com/EagleOrangeRome/zama_PrismLadder/issues)
- **FHEVM Documentation**: [docs.zama.ai](https://docs.zama.ai)
- **Zama Community**: [Discord](https://discord.gg/zama)

## 🙏 Acknowledgments

- Built with [FHEVM](https://github.com/zama-ai/fhevm) by Zama
- Inspired by the need for privacy-preserving compensation transparency

---

**Built with ❤️ using FHEVM**



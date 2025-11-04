// Auto-generated from Hardhat artifacts
export const PrismLadderCompensationABI = [
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "submitter",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "enum PrismLadderCompensation.Role",
        "name": "role",
        "type": "uint8"
      },
      {
        "indexed": false,
        "internalType": "enum PrismLadderCompensation.Level",
        "name": "level",
        "type": "uint8"
      },
      {
        "indexed": false,
        "internalType": "enum PrismLadderCompensation.Geography",
        "name": "geography",
        "type": "uint8"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      }
    ],
    "name": "CompensationSubmitted",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "groupPairId",
        "type": "bytes32"
      },
      {
        "indexed": false,
        "internalType": "bool",
        "name": "isSignificantGap",
        "type": "bool"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      }
    ],
    "name": "FairnessChecked",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "groupId",
        "type": "bytes32"
      },
      {
        "indexed": false,
        "internalType": "uint32",
        "name": "count",
        "type": "uint32"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      }
    ],
    "name": "GroupStatsUpdated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "user",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "metric",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      }
    ],
    "name": "PersonalInsightRequested",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "FAIRNESS_THRESHOLD_PERCENT",
    "outputs": [
      {
        "internalType": "uint64",
        "name": "",
        "type": "uint64"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "MIN_GROUP_SIZE",
    "outputs": [
      {
        "internalType": "uint64",
        "name": "",
        "type": "uint64"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "enum PrismLadderCompensation.Role",
        "name": "roleA",
        "type": "uint8"
      },
      {
        "internalType": "enum PrismLadderCompensation.Level",
        "name": "levelA",
        "type": "uint8"
      },
      {
        "internalType": "enum PrismLadderCompensation.Geography",
        "name": "geoA",
        "type": "uint8"
      },
      {
        "internalType": "enum PrismLadderCompensation.Role",
        "name": "roleB",
        "type": "uint8"
      },
      {
        "internalType": "enum PrismLadderCompensation.Level",
        "name": "levelB",
        "type": "uint8"
      },
      {
        "internalType": "enum PrismLadderCompensation.Geography",
        "name": "geoB",
        "type": "uint8"
      }
    ],
    "name": "checkFairnessGap",
    "outputs": [
      {
        "internalType": "ebool",
        "name": "",
        "type": "bytes32"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "deleteSubmission",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "name": "fairnessIndicators",
    "outputs": [
      {
        "internalType": "ebool",
        "name": "",
        "type": "bytes32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "enum PrismLadderCompensation.Role",
        "name": "role",
        "type": "uint8"
      },
      {
        "internalType": "enum PrismLadderCompensation.Level",
        "name": "level",
        "type": "uint8"
      },
      {
        "internalType": "enum PrismLadderCompensation.Geography",
        "name": "geography",
        "type": "uint8"
      }
    ],
    "name": "getGroupCount",
    "outputs": [
      {
        "internalType": "uint32",
        "name": "",
        "type": "uint32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "enum PrismLadderCompensation.Role",
        "name": "role",
        "type": "uint8"
      },
      {
        "internalType": "enum PrismLadderCompensation.Level",
        "name": "level",
        "type": "uint8"
      },
      {
        "internalType": "enum PrismLadderCompensation.Geography",
        "name": "geography",
        "type": "uint8"
      }
    ],
    "name": "getGroupTotal",
    "outputs": [
      {
        "internalType": "euint64",
        "name": "",
        "type": "bytes32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getTotalSubmissions",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "user",
        "type": "address"
      }
    ],
    "name": "getUserMetadata",
    "outputs": [
      {
        "internalType": "enum PrismLadderCompensation.Role",
        "name": "role",
        "type": "uint8"
      },
      {
        "internalType": "enum PrismLadderCompensation.Level",
        "name": "level",
        "type": "uint8"
      },
      {
        "internalType": "enum PrismLadderCompensation.Geography",
        "name": "geography",
        "type": "uint8"
      },
      {
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "isActive",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "name": "groupStats",
    "outputs": [
      {
        "internalType": "euint64",
        "name": "totalSalary",
        "type": "bytes32"
      },
      {
        "internalType": "uint32",
        "name": "count",
        "type": "uint32"
      },
      {
        "internalType": "uint256",
        "name": "lastUpdated",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "name": "personalInsights",
    "outputs": [
      {
        "internalType": "euint64",
        "name": "",
        "type": "bytes32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "protocolId",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "pure",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "metric",
        "type": "string"
      }
    ],
    "name": "requestPersonalInsight",
    "outputs": [
      {
        "internalType": "euint64",
        "name": "",
        "type": "bytes32"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "submissions",
    "outputs": [
      {
        "internalType": "euint64",
        "name": "baseSalary",
        "type": "bytes32"
      },
      {
        "internalType": "euint64",
        "name": "bonus",
        "type": "bytes32"
      },
      {
        "internalType": "euint64",
        "name": "equity",
        "type": "bytes32"
      },
      {
        "internalType": "enum PrismLadderCompensation.Role",
        "name": "role",
        "type": "uint8"
      },
      {
        "internalType": "enum PrismLadderCompensation.Level",
        "name": "level",
        "type": "uint8"
      },
      {
        "internalType": "enum PrismLadderCompensation.Geography",
        "name": "geography",
        "type": "uint8"
      },
      {
        "internalType": "address",
        "name": "submitter",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "isActive",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "externalEuint64",
        "name": "encryptedBase",
        "type": "bytes32"
      },
      {
        "internalType": "externalEuint64",
        "name": "encryptedBonus",
        "type": "bytes32"
      },
      {
        "internalType": "externalEuint64",
        "name": "encryptedEquity",
        "type": "bytes32"
      },
      {
        "internalType": "bytes",
        "name": "inputProofBase",
        "type": "bytes"
      },
      {
        "internalType": "bytes",
        "name": "inputProofBonus",
        "type": "bytes"
      },
      {
        "internalType": "bytes",
        "name": "inputProofEquity",
        "type": "bytes"
      },
      {
        "internalType": "enum PrismLadderCompensation.Role",
        "name": "role",
        "type": "uint8"
      },
      {
        "internalType": "enum PrismLadderCompensation.Level",
        "name": "level",
        "type": "uint8"
      },
      {
        "internalType": "enum PrismLadderCompensation.Geography",
        "name": "geography",
        "type": "uint8"
      }
    ],
    "name": "submitCompensation",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
] as const;

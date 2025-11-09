// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {FHE, euint64, externalEuint64, ebool} from "@fhevm/solidity/lib/FHE.sol";
import {ZamaEthereumConfig} from "@fhevm/solidity/config/ZamaConfig.sol";

/**
 * @title PrismLadderCompensation
 * @notice Privacy-preserving salary transparency platform using FHEVM
 * @dev Allows encrypted compensation submission and homomorphic aggregate analysis
 * @author PrismLadder Team
 */
contract PrismLadderCompensation is ZamaEthereumConfig {
    // Role enumeration (plaintext for grouping)
    enum Role {
        SoftwareEngineer,    // 0
        ProductManager,      // 1
        Designer,            // 2
        Sales,               // 3
        HR,                  // 4
        Executive,           // 5
        Other                // 6
    }

    // Level enumeration (plaintext for grouping)
    enum Level {
        Junior,       // 0: L1-L2
        Mid,          // 1: L3-L4
        Senior,       // 2: L5-L6
        StaffPlus,    // 3: L7+
        Manager,      // 4
        Director,     // 5
        VPExecutive   // 6
    }

    // Geography enumeration (plaintext for grouping)
    enum Geography {
        NorthAmerica,    // 0
        Europe,          // 1
        AsiaPacific,     // 2
        LatinAmerica,    // 3
        MiddleEastAfrica // 4
    }

    // Compensation record structure
    struct CompensationRecord {
        euint64 baseSalary;   // Encrypted base salary
        euint64 bonus;        // Encrypted annual bonus
        euint64 equity;       // Encrypted annual equity vesting
        Role role;            // Plaintext role for grouping
        Level level;          // Plaintext level for grouping
        Geography geography;  // Plaintext geography for grouping
        address submitter;    // Wallet address of submitter
        uint256 timestamp;    // Submission timestamp
        bool isActive;        // Flag for soft deletion (GDPR)
    }

    // Group statistics structure
    struct GroupStats {
        euint64 totalSalary;    // Sum of all salaries in group
        uint32 count;           // Number of submissions in group
        uint256 lastUpdated;    // Last update timestamp
    }

    // Storage
    mapping(address => CompensationRecord) public submissions;
    mapping(bytes32 => GroupStats) public groupStats; // groupId => stats
    mapping(bytes32 => ebool) public fairnessIndicators; // groupPairId => isUnfair
    
    // Personal insights cache (user => metric => encrypted result)
    mapping(address => mapping(string => euint64)) public personalInsights;

    // Events
    event CompensationSubmitted(
        address indexed submitter,
        Role role,
        Level level,
        Geography geography,
        uint256 timestamp
    );

    event GroupStatsUpdated(
        bytes32 indexed groupId,
        uint32 count,
        uint256 timestamp
    );

    event FairnessChecked(
        bytes32 indexed groupPairId,
        bool isSignificantGap,
        uint256 timestamp
    );

    event PersonalInsightRequested(
        address indexed user,
        string metric,
        uint256 timestamp
    );

    // Constants
    uint64 public constant MIN_GROUP_SIZE = 1;
    uint64 public constant FAIRNESS_THRESHOLD_PERCENT = 10; // 10% gap threshold
    
    // Global submission counter
    uint256 public totalSubmissions;

    /**
     * @notice Submit encrypted compensation data
     * @param encryptedBase Encrypted base salary (externalEuint64)
     * @param encryptedBonus Encrypted annual bonus (externalEuint64)
     * @param encryptedEquity Encrypted annual equity vesting (externalEuint64)
     * @param inputProofBase Input proof for base salary
     * @param inputProofBonus Input proof for bonus
     * @param inputProofEquity Input proof for equity
     * @param role Role enumeration
     * @param level Level enumeration
     * @param geography Geography enumeration
     */
    function submitCompensation(
        externalEuint64 encryptedBase,
        externalEuint64 encryptedBonus,
        externalEuint64 encryptedEquity,
        bytes calldata inputProofBase,
        bytes calldata inputProofBonus,
        bytes calldata inputProofEquity,
        Role role,
        Level level,
        Geography geography
    ) external {
        // Convert encrypted inputs to euint64
        euint64 base = FHE.fromExternal(encryptedBase, inputProofBase);
        euint64 bonus = FHE.fromExternal(encryptedBonus, inputProofBonus);
        euint64 equity = FHE.fromExternal(encryptedEquity, inputProofEquity);

        // Check if this is a new submission or an update
        bool isNewUser = !submissions[msg.sender].isActive;
        bytes32 newGroupId = _getGroupId(role, level, geography);
        bool isNewToGroup = isNewUser;
        
        // If updating, check if group changed
        if (!isNewUser) {
            CompensationRecord storage oldRecord = submissions[msg.sender];
            bytes32 oldGroupId = _getGroupId(oldRecord.role, oldRecord.level, oldRecord.geography);
            
            // If group changed, remove from old group and treat as new to current group
            if (oldGroupId != newGroupId) {
                GroupStats storage oldStats = groupStats[oldGroupId];
                if (oldStats.count > 0) {
                    oldStats.count--;
                    oldStats.lastUpdated = block.timestamp;
                }
                isNewToGroup = true; // Moving to a different group
            }
            // If same group, don't update statistics (can't subtract encrypted values)
        }
        
        // Store the new compensation record
        submissions[msg.sender] = CompensationRecord({
            baseSalary: base,
            bonus: bonus,
            equity: equity,
            role: role,
            level: level,
            geography: geography,
            submitter: msg.sender,
            timestamp: block.timestamp,
            isActive: true
        });
        
        // Update global counter for new users
        if (isNewUser) {
            totalSubmissions++;
        }

        // Grant ACL permissions for the submitter to decrypt their own data
        FHE.allow(base, msg.sender);
        FHE.allow(bonus, msg.sender);
        FHE.allow(equity, msg.sender);

        // Allow contract to use these values for computation
        FHE.allowThis(base);
        FHE.allowThis(bonus);
        FHE.allowThis(equity);

        // Update group statistics with TOTAL compensation (base + bonus + equity)
        euint64 totalCompensation = FHE.add(FHE.add(base, bonus), equity);
        FHE.allowThis(totalCompensation); // Allow contract to use total compensation
        
        _updateGroupStats(newGroupId, totalCompensation, isNewToGroup);

        emit CompensationSubmitted(msg.sender, role, level, geography, block.timestamp);
    }

    /**
     * @notice Get group ID hash for role/level/geography combination
     */
    function _getGroupId(Role role, Level level, Geography geography) private pure returns (bytes32) {
        return keccak256(abi.encodePacked(uint8(role), uint8(level), uint8(geography)));
    }

    /**
     * @notice Update group statistics with new member
     * @param groupId The group identifier
     * @param totalCompensation The total compensation (base + bonus + equity) for this submission
     * @param isNewToGroup Whether this is a new member to the group
     * @dev Only updates statistics if isNewToGroup is true
     *      For updates within the same group, statistics are not modified to avoid double-counting
     *      (we cannot subtract encrypted values in FHE)
     */
    function _updateGroupStats(bytes32 groupId, euint64 totalCompensation, bool isNewToGroup) private {
        if (isNewToGroup) {
            GroupStats storage stats = groupStats[groupId];
            
            // Add to total and increment count
            if (stats.count == 0) {
                stats.totalSalary = totalCompensation;
                stats.count = 1;
            } else {
                stats.totalSalary = FHE.add(stats.totalSalary, totalCompensation);
                stats.count += 1;
            }
            
            // Allow contract to use the updated total salary for future calculations
            FHE.allowThis(stats.totalSalary);
            
            stats.lastUpdated = block.timestamp;
            emit GroupStatsUpdated(groupId, stats.count, block.timestamp);
        }
        // If not new to group, statistics remain unchanged
    }

    /**
     * @notice Check fairness gap between two groups and store encrypted result
     * @param roleA First group role
     * @param levelA First group level
     * @param geoA First group geography
     * @param roleB Second group role
     * @param levelB Second group level
     * @param geoB Second group geography
     * @return Encrypted boolean indicating if gap exceeds threshold
     */
    function checkFairnessGap(
        Role roleA,
        Level levelA,
        Geography geoA,
        Role roleB,
        Level levelB,
        Geography geoB
    ) external returns (ebool) {
        bytes32 groupIdA = _getGroupId(roleA, levelA, geoA);
        bytes32 groupIdB = _getGroupId(roleB, levelB, geoB);

        GroupStats storage statsA = groupStats[groupIdA];
        GroupStats storage statsB = groupStats[groupIdB];

        // Require minimum group size for privacy
        require(statsA.count >= MIN_GROUP_SIZE, "Group A too small");
        require(statsB.count >= MIN_GROUP_SIZE, "Group B too small");

        // Calculate average manually using plaintext count
        // avgA = totalA / countA (using plaintext division)
        euint64 avgA = FHE.div(statsA.totalSalary, uint64(statsA.count));
        FHE.allowThis(avgA);
        
        euint64 avgB = FHE.div(statsB.totalSalary, uint64(statsB.count));
        FHE.allowThis(avgB);
        
        // Compute gap: |avgA - avgB|
        ebool aGreater = FHE.gt(avgA, avgB);
        FHE.allowThis(aGreater);
        
        euint64 diffAB = FHE.sub(avgA, avgB);
        FHE.allowThis(diffAB);
        
        euint64 diffBA = FHE.sub(avgB, avgA);
        FHE.allowThis(diffBA);
        
        euint64 gap = FHE.select(aGreater, diffAB, diffBA);
        FHE.allowThis(gap);

        // Compute threshold: 10% of higher average
        euint64 higherAvg = FHE.select(aGreater, avgA, avgB);
        FHE.allowThis(higherAvg);
        
        euint64 mulResult = FHE.mul(higherAvg, FHE.asEuint64(FAIRNESS_THRESHOLD_PERCENT));
        FHE.allowThis(mulResult);
        
        euint64 threshold = FHE.div(mulResult, 100);
        FHE.allowThis(threshold);

        // Check if gap exceeds threshold
        ebool isSignificant = FHE.gt(gap, threshold);

        // Store indicator
        bytes32 pairId = keccak256(abi.encodePacked(groupIdA, groupIdB));
        fairnessIndicators[pairId] = isSignificant;

        // Allow contract to use this for future operations
        FHE.allowThis(isSignificant);

        emit FairnessChecked(pairId, false, block.timestamp); // placeholder false as we can't decrypt inline

        return isSignificant;
    }

    /**
     * @notice Request personal insight - compute user's position vs group
     * @param metric Metric identifier (e.g., "percentile", "vs_median")
     * @return Encrypted result (user must decrypt with their key)
     */
    function requestPersonalInsight(string calldata metric) external returns (euint64) {
        CompensationRecord storage userRecord = submissions[msg.sender];
        require(userRecord.isActive, "No active submission found");

        bytes32 groupId = _getGroupId(userRecord.role, userRecord.level, userRecord.geography);
        GroupStats storage stats = groupStats[groupId];

        require(stats.count >= MIN_GROUP_SIZE, "Insufficient group data");

        euint64 result;

        if (keccak256(abi.encodePacked(metric)) == keccak256(abi.encodePacked("vs_median"))) {
            // Compare user salary to group average
            // Result: (userSalary - avgSalary) as signed value
            // We use a simple comparison for MVP
            euint64 userTotal = FHE.add(FHE.add(userRecord.baseSalary, userRecord.bonus), userRecord.equity);
            FHE.allowThis(userTotal);
            
            euint64 groupAvg = FHE.div(stats.totalSalary, uint64(stats.count));
            FHE.allowThis(groupAvg);
            
            // If user > avg, result = user - avg; else result = 0 (simplified for euint)
            ebool userGreater = FHE.gt(userTotal, groupAvg);
            FHE.allowThis(userGreater);
            
            euint64 diff = FHE.sub(userTotal, groupAvg);
            FHE.allowThis(diff);
            
            result = FHE.select(userGreater, diff, FHE.asEuint64(0));
        } else {
            // Default: return user's total compensation
            result = FHE.add(FHE.add(userRecord.baseSalary, userRecord.bonus), userRecord.equity);
        }

        // Store result and grant permission to user and contract
        personalInsights[msg.sender][metric] = result;
        FHE.allowThis(result);
        FHE.allow(result, msg.sender);

        emit PersonalInsightRequested(msg.sender, metric, block.timestamp);

        return result;
    }

    /**
     * @notice Get encrypted group total salary (for authorized decryption and calculation)
     * @param role Role enumeration
     * @param level Level enumeration
     * @param geography Geography enumeration
     * @return Encrypted total salary
     */
    function getGroupTotal(
        Role role,
        Level level,
        Geography geography
    ) external view returns (euint64) {
        bytes32 groupId = _getGroupId(role, level, geography);
        return groupStats[groupId].totalSalary;
    }

    /**
     * @notice Get group count (plaintext, not sensitive)
     * @param role Role enumeration
     * @param level Level enumeration
     * @param geography Geography enumeration
     * @return Number of submissions in group
     */
    function getGroupCount(
        Role role,
        Level level,
        Geography geography
    ) external view returns (uint32) {
        bytes32 groupId = _getGroupId(role, level, geography);
        return groupStats[groupId].count;
    }

    /**
     * @notice Get user's submission metadata (plaintext parts only)
     * @param user User address
     * @return role Role of the user
     * @return level Level of the user
     * @return geography Geography of the user
     * @return timestamp Submission timestamp
     * @return isActive Whether submission is active
     */
    function getUserMetadata(address user) external view returns (
        Role role,
        Level level,
        Geography geography,
        uint256 timestamp,
        bool isActive
    ) {
        CompensationRecord storage record = submissions[user];
        return (record.role, record.level, record.geography, record.timestamp, record.isActive);
    }

    /**
     * @notice Soft delete user's submission (GDPR right to erasure)
     */
    function deleteSubmission() external {
        CompensationRecord storage record = submissions[msg.sender];
        require(record.isActive, "No active submission");
        
        record.isActive = false;
        
        // Decrement global counter
        if (totalSubmissions > 0) {
            totalSubmissions--;
        }
        
        // Note: Cannot remove from on-chain storage or group stats due to blockchain immutability
        // Mark as inactive to exclude from future analytics
    }

    /**
     * @notice Get total number of active submissions (across all groups)
     * @return Total count
     */
    function getTotalSubmissions() external view returns (uint256) {
        return totalSubmissions;
    }
}


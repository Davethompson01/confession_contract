
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

contract ConfessionContract {
    struct Confession {
        string content;
        uint256 timestamp;
        address submitter;
        bool isAnonymous;
        uint256 id;
    }
    
    mapping(uint256 => Confession) public confessions;
    uint256 public confessionCount;

    // Add nonce mapping for meta-transactions
    mapping(address => uint256) public nonces;
    
    event ConfessionSubmitted(
        uint256 indexed id,
        string content,
        uint256 timestamp,
        bool isAnonymous
    );
    
    modifier onlyValidConfession(string memory _content) {
        require(bytes(_content).length > 0, "Confession cannot be empty");
        require(bytes(_content).length <= 1000, "Confession too long");
        _;
    }
    
    function submitConfession(
        string memory _content,
        bool _isAnonymous
    ) external onlyValidConfession(_content) {
        confessionCount++;
        
        confessions[confessionCount] = Confession({
            content: _content,
            timestamp: block.timestamp,
            submitter: msg.sender,
            isAnonymous: _isAnonymous,
            id: confessionCount
        });
        
        emit ConfessionSubmitted(
            confessionCount,
            _content,
            block.timestamp,
            _isAnonymous
        );
    }

    // Meta-transaction confession submission
    function submitConfessionMeta(
        address user,
        string memory _content,
        bool _isAnonymous,
        uint256 nonce,
        bytes memory signature
    ) external onlyValidConfession(_content) {
        require(nonce == nonces[user], "Invalid nonce");
        // Recreate the message hash
        bytes32 messageHash = keccak256(abi.encodePacked(user, _content, _isAnonymous, nonce, address(this)));
        bytes32 ethSignedMessageHash = ECDSA.toEthSignedMessageHash(messageHash);
        // Recover signer
        address signer = ECDSA.recover(ethSignedMessageHash, signature);
        require(signer == user, "Invalid signature");
        // Increment nonce
        nonces[user]++;
        // Use user as submitter
        confessionCount++;
        confessions[confessionCount] = Confession({
            content: _content,
            timestamp: block.timestamp,
            submitter: user,
            isAnonymous: _isAnonymous,
            id: confessionCount
        });
        emit ConfessionSubmitted(
            confessionCount,
            _content,
            block.timestamp,
            _isAnonymous
        );
    }
    
    function getConfession(uint256 _id) external view returns (
        string memory content,
        uint256 timestamp,
        address submitter,
        bool isAnonymous,
        uint256 id
    ) {
        require(_id > 0 && _id <= confessionCount, "Invalid confession ID");
        Confession memory confession = confessions[_id];
        return (
            confession.content,
            confession.timestamp,
            confession.submitter,
            confession.isAnonymous,
            confession.id
        );
    }
    
    function getLatestConfessions(uint256 _count) external view returns (
        uint256[] memory ids,
        string[] memory contents,
        uint256[] memory timestamps,
        bool[] memory isAnonymousArray
    ) {
        uint256 count = _count > confessionCount ? confessionCount : _count;
        ids = new uint256[](count);
        contents = new string[](count);
        timestamps = new uint256[](count);
        isAnonymousArray = new bool[](count);
        for (uint256 i = 0; i < count; i++) {
            uint256 confessionId = confessionCount - i;
            Confession memory confession = confessions[confessionId];
            ids[i] = confession.id;
            contents[i] = confession.content;
            timestamps[i] = confession.timestamp;
            isAnonymousArray[i] = confession.isAnonymous;
        }
        return (ids, contents, timestamps, isAnonymousArray);
    }
}

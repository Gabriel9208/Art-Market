// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IArtworkRegistry {
    struct Artwork {
        uint256 tokenId; // points to the metadata JSON file for your NFT
        address owner;
        string tokenURI;

        // Metadata
        string name;
        string description;
        string imageURI;
        string artist;
        string year;
        string isPhysical;

        // Sale
        bool onSale;
    }

    function updateArtworkOwner(uint256 tokenId, address newOwner) external;

    function getTokenIds() external view returns (uint256[] memory);
    function getTokenIdLength() external view returns (uint256);
    function getArtworksByOwner(address owner) external view returns (uint256[] memory);
    function getArtworkOwner(uint256 tokenId) external view returns (address);
    function getArtworkURI(uint256 tokenId) external view returns(string memory);
    function getArtworkName(uint256 tokenId) external view returns(string memory);
    function getArtworkDescription(uint256 tokenId) external view returns(string memory);
    function getArtworkImageURI(uint256 tokenId) external view returns(string memory);
    function getArtworkArtist(uint256 tokenId) external view returns(string memory);
    function getArtworkYear(uint256 tokenId) external view returns(string memory);
    function getArtworkIsPhysical(uint256 tokenId) external view returns(string memory);
    function getArtworkOnSale(uint256 tokenId) external view returns(bool);
}

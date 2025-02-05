// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "./interfaces/IArtworkRegistry.sol";

/**
 * @title ArtworkRegistry
 * @author Gabrieee
 * @notice A registry for artwork
 */
contract ArtworkRegistry is ERC721URIStorage, Ownable(msg.sender), IArtworkRegistry {
    uint256[] private _tokenIds;

    struct Artwork {
        uint256 tokenId; // points to the metadata JSON file for your NFT
        address owner;
        string tokenURI;

        // Metadata
        string name;
        string description;
        string artist;
        string year;
        string isPhysical;
    }

    mapping(uint256 tokenId => Artwork) private _artworks;
    mapping(address owner => uint256[] artworks) private _artworksByOwner;
    
    event ArtworkMinted(uint256 tokenId, string tokenURI);
    
    // Ownable contract can be initialized in the inheritance list(more gas efficient) because its parameters require value, not reference.
    constructor() ERC721("ArtworkRegistry", "ART") {}

    /**
     * @notice Mint a new artwork
     * @param to The address to mint the artwork to
     * @param tokenId The ID of the artwork
     * @param tokenURI The URI of the artwork
     * @param name The name of the artwork
     * @param description The description of the artwork
     * @param artist The artist of the artwork
     * @param year The year of the artwork
     * @param isPhysical Whether the artwork is physical (otherwise it is digital)
     * @dev future: add requirements to users accessing mint function
     */ 
    function mint(address to, uint256 tokenId, string memory tokenURI, string memory name, string memory description, string memory artist, string memory year, string memory isPhysical) public {
        _mint(to, tokenId);
        _setTokenURI(tokenId, tokenURI);
        _artworks[tokenId] = Artwork(tokenId, to, tokenURI, name, description, artist, year, isPhysical);
        _artworksByOwner[to].push(tokenId);
        _tokenIds.push(tokenId);
        emit ArtworkMinted(tokenId, tokenURI);
    }

    function getTokenIds() public view returns (uint256[] memory) {
        return _tokenIds;
    }

    function getTokenIdLength() public view returns (uint256) {
        return _tokenIds.length;
    }

    // Artwork functions
    function getArtworksByOwner(address owner) public view returns (uint256[] memory) {
        return _artworksByOwner[owner];
    }


    function getArtwork(uint256 tokenId) public view returns(Artwork memory) {
        return _artworks[tokenId];
    }

    function getArtworkURI(uint256 tokenId) public view returns(string memory) {
        return _artworks[tokenId].tokenURI;
    }

    function getArtworkName(uint256 tokenId) public view returns(string memory) {
        return _artworks[tokenId].name;
    }

    function getArtworkDescription(uint256 tokenId) public view returns(string memory) {
        return _artworks[tokenId].description;
    }

    function getArtworkArtist(uint256 tokenId) public view returns(string memory) {
        return _artworks[tokenId].artist;
    }

    function getArtworkYear(uint256 tokenId) public view returns(string memory) {
        return _artworks[tokenId].year;
    }

    function getArtworkIsPhysical(uint256 tokenId) public view returns(string memory) {
        return _artworks[tokenId].isPhysical;
    }
}

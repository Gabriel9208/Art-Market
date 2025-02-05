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
    uint256[] private _tokenIds; // array of token ids

    mapping(uint256 tokenId => Artwork) private _artworks;
    mapping(address owner => uint256[] artworks) private _artworksByOwner;
    
    event ArtworkMinted(uint256 tokenId, string tokenURI, address owner);
    event ArtworkBurned(uint256 tokenId, address owner);


    modifier onlyOwnerOf(uint256 tokenId) {
        address owner = _artworks[tokenId].owner;
        require(msg.sender == owner, "Only minter can call this function");
        _;
    }
    
    // Ownable contract can be initialized in the inheritance list(more gas efficient) because its parameters require value, not reference.
    constructor() ERC721("ArtworkRegistry", "ART") {}

    /**
     * @notice Mint a new artwork
     * @param to The address to mint the artwork to
     * @param tokenId The ID of the artwork
     * @param tokenURI The URI of the artwork
     * @param name The name of the artwork
     * @param description The description of the artwork
     * @param imageURI The image URI of the artwork
     * @param artist The artist of the artwork
     * @param year The year of the artwork
     * @param isPhysical Whether the artwork is physical (otherwise it is digital)
     * @dev future: add requirements to users accessing mint function
     */ 
    function mint(
        address to,
        uint256 tokenId,
        string memory tokenURI,
        string memory name,
        string memory description,
        string memory imageURI,
        string memory artist,
        string memory year,
        string memory isPhysical,
        bool onSale
    ) public returns (uint256) {
        _mint(to, tokenId);
        _setTokenURI(tokenId, tokenURI);
        _artworks[tokenId] = Artwork(
            tokenId,
            to,
            tokenURI,
            name,
            description,
            imageURI,
            artist,
            year,
            isPhysical,
            onSale
        );

        _artworksByOwner[to].push(tokenId);
        _tokenIds.push(tokenId);
        emit ArtworkMinted(tokenId, tokenURI, to);
        return tokenId;
    }

    function burn(uint256 tokenId) public onlyOwnerOf(tokenId) returns (uint256) {
        _burn(tokenId);
        emit ArtworkBurned(tokenId, _getArtworkOwner(tokenId));
        return tokenId;
    }


    function getTokenIds() external view returns (uint256[] memory) {
        return _getTokenIds();
    }

    function getTokenIdLength() external view returns (uint256) {
        return _getTokenIdLength();
    }


    // Artwork functions
    function getArtworksByOwner(address owner) external view returns (uint256[] memory) {
        return _getArtworksByOwner(owner);
    }

    function getArtworkOwner(uint256 tokenId) external view returns (address) {
        return _getArtworkOwner(tokenId);
    }

    function getArtworkURI(uint256 tokenId) external view returns(string memory) {
        return _getArtworkURI(tokenId);
    }


    function getArtworkName(uint256 tokenId) external view returns(string memory) {
        return _getArtworkName(tokenId);
    }


    function getArtworkDescription(uint256 tokenId) external view returns(string memory) {
        return _getArtworkDescription(tokenId);
    }


    function getArtworkImageURI(uint256 tokenId) external view returns(string memory) {
        return _getArtworkImageURI(tokenId);
    }


    function getArtworkArtist(uint256 tokenId) external view returns(string memory) {
        return _getArtworkArtist(tokenId);
    }


    function getArtworkYear(uint256 tokenId) external view returns(string memory) {
        return _getArtworkYear(tokenId);
    }


    function getArtworkIsPhysical(uint256 tokenId) external view returns(string memory) {
        return _getArtworkIsPhysical(tokenId);
    }


    function getArtworkOnSale(uint256 tokenId) external view returns(bool) {
        return _getArtworkOnSale(tokenId);
    }



    // Internal functions
    function _getTokenIds() internal view returns (uint256[] memory) {
        return _tokenIds;
    }


    function _getTokenIdLength() internal view returns (uint256) {
        return _tokenIds.length;
    }


    // Artwork functions
    function _getArtworksByOwner(address owner) internal view returns (uint256[] memory) {
        return _artworksByOwner[owner];
    }

    function _getArtworkOwner(uint256 tokenId) internal view returns (address) {
        return _artworks[tokenId].owner;
    }

    function _getArtworkURI(uint256 tokenId) internal view returns(string memory) {
        return _artworks[tokenId].tokenURI;
    }



    function _getArtworkName(uint256 tokenId) internal view returns(string memory) {
        return _artworks[tokenId].name;
    }


    function _getArtworkDescription(uint256 tokenId) internal view returns(string memory) {
        return _artworks[tokenId].description;
    }


    function _getArtworkImageURI(uint256 tokenId) internal view returns(string memory) {
        return _artworks[tokenId].imageURI;
    }


    function _getArtworkArtist(uint256 tokenId) internal view returns(string memory) {
        return _artworks[tokenId].artist;
    }


    function _getArtworkYear(uint256 tokenId) internal view returns(string memory) {
        return _artworks[tokenId].year;
    }


    function _getArtworkIsPhysical(uint256 tokenId) internal view returns(string memory) {
        return _artworks[tokenId].isPhysical;
    }


    function _getArtworkOnSale(uint256 tokenId) internal view returns(bool) {
        return _artworks[tokenId].onSale;
    }

}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./interfaces/IArtworkRegistry.sol";

/**
 * @title ArtMarketplace
 * @author Gabrieee
 * @notice A marketplace for buying and selling art
 */
contract ArtMarketplace is Ownable(msg.sender), ReentrancyGuard {
    IArtworkRegistry private _artworkRegistry;

    struct Listing {
        uint256 price;
        address seller;
        bool onSale;
    }

    mapping(uint256 tokenId => Listing) private _listings;

    event ArtWorkBought(address buyer, uint256 tokenId);

    constructor(address artworkRegistryAddress) {
        _artworkRegistry = IArtworkRegistry(artworkRegistryAddress);
    }

    function buyArtwork(uint256 tokenId) public {
        
    }

    function getListing(uint256 tokenId) public view returns (Listing memory) {
        return _listings[tokenId];
    }

    function getListings() public view returns (Listing[] memory) {
        uint256[] memory tokenIds = _artworkRegistry.getTokenIds();
        uint256 tokenIdLength = _artworkRegistry.getTokenIdLength();

        Listing[] memory listings = new Listing[](tokenIdLength);

        for (uint256 i = 0; i < tokenIdLength; i++) {
            listings[i] = _listings[tokenIds[i]];   
        }

        return listings;
    }   
}
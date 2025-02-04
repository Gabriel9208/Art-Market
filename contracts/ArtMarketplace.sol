// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./ArtworkRegistry.sol";

/**
 * @title ArtMarketplace
 * @author Gabrieee
 * @notice A marketplace for buying and selling art
 */
contract ArtMarketplace is Ownable(msg.sender), ReentrancyGuard {
    struct Listing {
        uint256 price;
        address seller;
        bool onSale;
    }

    mapping(uint256 tokenId => Listing) private _listings;

    event ArtWorkBought(address buyer, uint256 tokenId);

    constructor() {}

    function buyArtwork(uint256 tokenId) public {

    }


    function getListing(uint256 tokenId) public view returns (Listing memory) {
        return _listings[tokenId];
    }

    function getListings(ArtworkRegistry artworkRegistry) public view returns (Listing[] memory) {
        uint256[] memory tokenIds = artworkRegistry.getTokenIds();
        uint256 tokenIdLength = artworkRegistry.getTokenIdLength();



        Listing[] memory listings = new Listing[](tokenIdLength);

        for (uint256 i = 0; i < tokenIdLength; i++) {
            listings[i] = _listings[tokenIds[i]];   
        }

        return listings;
    }   
}
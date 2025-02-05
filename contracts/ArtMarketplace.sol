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
    struct ListingItem {
        uint256 tokenId;
        uint256 price;
        address owner;
    }

    IArtworkRegistry private _artworkRegistry;
    ListingItem[] private _listings;
    mapping(uint256 tokenId => ListingItem) private _listingItemById;

    event ArtWorkBought(address buyer, uint256 tokenId);
    event ListingsUpdatedBy(address updater);

    modifier onlyOwnerOf(uint256 tokenId) {
        address owner = _listingItemById[tokenId].owner;
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    constructor(address artworkRegistryAddress) {
        _artworkRegistry = IArtworkRegistry(artworkRegistryAddress);
    }

    function _setPrice(uint256 _tokenId, uint256 _price) internal onlyOwnerOf(_tokenId){
        require(_listingItemById[_tokenId].owner != address(0), "Item does not exist");
        ListingItem memory listingItem = _listingItemById[_tokenId];
        listingItem.price = _price;
        _listingItemById[_tokenId] = listingItem;
    }


    function buyArtwork(uint256 tokenId) public payable {
        
    }



    /**
     * @notice Triggers the update of all listings
     * @dev This function is only callable by the owner
     */
    function triggerUpdateListings() public onlyOwner {
        require(_updateListings(), "Failed to update listings.");
    }


    function getListing(uint256 tokenId) public view returns (ListingItem memory) {
        return _listingItemById[tokenId];
    }

    function getListings() public view returns (ListingItem[] memory) {
        uint256[] memory tokenIds = _artworkRegistry.getTokenIds();
        uint256 tokenIdLength = _artworkRegistry.getTokenIdLength();

        ListingItem[] memory listings = new ListingItem[](tokenIdLength);

        for (uint256 i = 0; i < tokenIdLength; i++) {
            listings[i] = _listingItemById[tokenIds[i]];   
        }

        return listings;
    } 

    /**
     * @notice Updates the listings
     * @dev This function is only callable by the owner
     * @dev TODO: add logic to update listings
     * @return bool True if the listings were updated successfully, false otherwise
     */
    function _updateListings() private returns (bool) {
        emit ListingsUpdatedBy(msg.sender);


        return true;
    }  
}
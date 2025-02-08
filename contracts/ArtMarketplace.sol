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

    uint256 private MARKET_FEE_BASIS_POINTS = 50; // 0.5%
    uint256 private BIPS_DIVISOR = 10000;
    uint256 private MIN_PRICE = 200 wei;

    event ArtWorkBought(address indexed buyer, uint256 indexed tokenId);
    event ArtworkListed(uint256 indexed tokenId, uint256 price, address indexed owner);
    event ArtworkUnlisted(uint256 indexed tokenId, address indexed owner);

    modifier onlyOwnerOf(uint256 tokenId) {
        address owner = _listingItemById[tokenId].owner;
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    constructor(address artworkRegistryAddress) {
        _artworkRegistry = IArtworkRegistry(artworkRegistryAddress);
    }

    /**
     * @notice Buy an artwork
     * @param tokenId The ID of the artwork
     * @dev This function is only callable by the owner
     */
    function buyArtwork(uint256 tokenId) external payable nonReentrant{
        // Security checks
        require(_listingItemById[tokenId].owner != address(0), "Item does not exist");
        require(msg.sender != _listingItemById[tokenId].owner, "Buyer already own this artwork");
        require(msg.value == _listingItemById[tokenId].price, "Payment amount incorrect");
        require(_listingItemById[tokenId].price >= MIN_PRICE, "Price is too low");

        address seller = _listingItemById[tokenId].owner;

        // Ownership transfer
        _artworkRegistry.updateArtworkOwner(tokenId, msg.sender);

        // Transfer of funds
        uint256 marketFee = msg.value * MARKET_FEE_BASIS_POINTS / BIPS_DIVISOR;
        uint256 sellerAmount = msg.value - marketFee;

        payable(seller).transfer(sellerAmount);
        payable(owner()).transfer(marketFee);

        // Event
        emit ArtWorkBought(msg.sender, tokenId);
    }


    /**
     * @notice Get a listing item by tokenId
     * @param tokenId The ID of the artwork
     * @return ListingItem 
     */
    function getListing(uint256 tokenId) external view returns (ListingItem memory) {
        return _listingItemById[tokenId];
    }

    /**
     * @notice Get all listings
     * @return ListingItem[]
     */
    function getListings() external view returns (ListingItem[] memory) {
        uint256[] memory tokenIds = _artworkRegistry.getTokenIds();
        uint256 tokenIdLength = _artworkRegistry.getTokenIdLength();

        ListingItem[] memory listings = new ListingItem[](tokenIdLength);

        for (uint256 i = 0; i < tokenIdLength; i++) {
            listings[i] = _listingItemById[tokenIds[i]];   
        }

        return listings;
    } 

    /**
     * @notice Set the price of an artwork
     * @param tokenId The ID of the artwork
     * @param price The price of the artwork
     * @dev This function is only callable by the owner
     */
    function setPrice(uint256 tokenId, uint256 price) external onlyOwnerOf(tokenId){
        require(_listingItemById[tokenId].owner != address(0), "Item does not exist");

        ListingItem memory listingItem = _listingItemById[tokenId];
        listingItem.price = price;
        _listingItemById[tokenId] = listingItem;
    }

    function listArtwork(uint256 tokenId, uint256 price) external onlyOwnerOf(tokenId){
        require(_listingItemById[tokenId].owner != address(0), "Item does not exist");
        require(price >= MIN_PRICE, "Price is too low");

        _listings.push(ListingItem(tokenId, price, msg.sender));
        _listingItemById[tokenId] = ListingItem(tokenId, price, msg.sender);

        emit ArtworkListed(tokenId, price, msg.sender);
    }

    function unlistArtwork(uint256 tokenId) external onlyOwnerOf(tokenId){
        require(_listingItemById[tokenId].owner != address(0), "Item does not exist");

        bool removeFlag = false;

        for (uint i = 0 ; i < _listings.length - 1 ; i++){
            if(_listings[i].tokenId == tokenId || removeFlag){
                if(!removeFlag){
                    removeFlag = true;
                }
                _listings[i] = _listings[i + 1];
            }

        }

        _listings.pop();
        delete _listingItemById[tokenId];

        emit ArtworkUnlisted(tokenId, msg.sender);
    }
}
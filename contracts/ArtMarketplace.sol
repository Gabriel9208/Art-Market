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
    uint256[] private _listings;
    mapping(uint256 tokenId => ListingItem) private _listingItemById;

    uint256 private MARKET_FEE_BASIS_POINTS = 50; // 0.5%
    uint256 private BIPS_DIVISOR = 10000;
    uint256 private MIN_PRICE = 0.01 ether;

    event ArtWorkBought(address indexed buyer, uint256 indexed tokenId);
    event ArtworkListed(uint256 indexed tokenId, uint256 price, address indexed owner);
    event ArtworkUnlisted(uint256 indexed tokenId, address indexed owner);

    modifier onlyOwnerOf(uint256 tokenId) {
        if(_listingItemById[tokenId].owner != address(0)){
            address owner = _listingItemById[tokenId].owner;
            require(msg.sender == owner, "Only owner can call this function");
        }
        else{
            require(_artworkRegistry.getArtworkOwner(tokenId) == msg.sender, "Only owner can call this function");
        }
        _;
    }

    constructor(address artworkRegistryAddress) {
        require(artworkRegistryAddress != address(0), "Artwork registry address cannot be 0");
        _artworkRegistry = IArtworkRegistry(artworkRegistryAddress);
    }

    receive() external payable {}

    fallback() external payable {}

    /**
     * @notice Buy an artwork
     * @param tokenId The ID of the artwork
     * @dev This function is only callable by the owner
     * @dev Using non-reentrant modifier from ReentrancyGuard so that I ignore the warning from Sither analysis
     */
    function buyArtwork(uint256 tokenId) external payable nonReentrant{
        // Security checks
        require(_listingItemById[tokenId].owner != address(0), "Item does not exist");
        require(msg.sender != _listingItemById[tokenId].owner, "Buyer already own this artwork");
        require(msg.value == _listingItemById[tokenId].price, "Payment amount incorrect");
        require(_listingItemById[tokenId].price >= MIN_PRICE, "Price is too low");

        address seller = _listingItemById[tokenId].owner;
        
        for(uint256 i = 0 ; i < _listings.length ; i++){
            if(_listings[i] == tokenId){
                ListingItem memory listingItem = _listingItemById[_listings[i]];
                _listingItemById[_listings[i]] = ListingItem(listingItem.tokenId, listingItem.price, msg.sender);
                break;
            }
        }

        // unlist
        _unlistArtwork(tokenId);

        // Transfer of funds
        uint256 marketFee = msg.value * MARKET_FEE_BASIS_POINTS / BIPS_DIVISOR;
        uint256 sellerAmount = msg.value - marketFee;

        // Ownership transfer (external calls)
        _artworkRegistry.updateArtworkOwner(tokenId, msg.sender);

        (bool success, ) = payable(seller).call{value: sellerAmount}("");
        require(success, "Transfer payment to seller failed");

        (success, ) = payable(owner()).call{value: marketFee}("");
        require(success, "Transfer market fee failed");


        // Event
        emit ArtWorkBought(msg.sender, tokenId);
    }

    function getListingOwner(uint256 tokenId) external view returns (address) {
        return _listingItemById[tokenId].owner;
    }

    function getListingPrice(uint256 tokenId) external view returns (uint256) {
        return _listingItemById[tokenId].price;
    }

    function getListingLength() external view returns (uint256) {
        return _listings.length;
    }

    /**
     * @notice Get a listing item by tokenId
     * @param tokenId The ID of the artwork
     * @return ListingItem 
     */
    function getListing(uint256 tokenId) external view returns (ListingItem memory) {
        require(_listingItemById[tokenId].owner != address(0), "Item does not exist");
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
        require(price >= MIN_PRICE, "Price is too low");

        ListingItem memory listingItem = _listingItemById[tokenId];
        listingItem.price = price;
        _listingItemById[tokenId] = listingItem;
    }

    function listArtwork(uint256 tokenId, uint256 price) external onlyOwnerOf(tokenId){
        require(_listingItemById[tokenId].owner == address(0), "Item already listed");
        require(price >= MIN_PRICE, "Price is too low");

        _listings.push(tokenId); 
        _listingItemById[tokenId] = ListingItem(tokenId, price, msg.sender);

        emit ArtworkListed(tokenId, price, msg.sender);
    }

    function unlistArtwork(uint256 tokenId) external onlyOwnerOf(tokenId){
        _unlistArtwork(tokenId);
    }

    function _unlistArtwork(uint256 _tokenId) internal onlyOwnerOf(_tokenId){
        require(_listingItemById[_tokenId].owner != address(0), "Item does not exist");

        bool removeFlag = false;

        for (uint i = 0 ; i < _listings.length - 1 ; i++){
            if(_listings[i] == _tokenId || removeFlag){
                if(!removeFlag){
                    removeFlag = true;
                }
                _listings[i] = _listings[i + 1];
            }

        }

        _listings.pop();
        delete _listingItemById[_tokenId];

        emit ArtworkUnlisted(_tokenId, msg.sender);
    }
}
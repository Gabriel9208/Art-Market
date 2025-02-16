const { expect } = require("chai");
const { loadFixture } = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { ethers } = require("hardhat");

/*
    Fixture deployArtworkRegistryFixture is used to deploy the ArtworkRegistry contract.
*/
async function deployArtworkRegistryFixture() {
    const [contractOwner, artist1, artist2, buyer1, buyer2, marketplace] = await ethers.getSigners();
    const ArtworkRegistry = await ethers.getContractFactory("ArtworkRegistry");
    const artworkRegistry = await ArtworkRegistry.deploy();
    return { artworkRegistry, contractOwner, artist1, artist2, buyer1, buyer2, marketplace };
}

describe("ArtworkRegistry", function () {
    it("Should deploy the contract", async function () {
        const { artworkRegistry, contractOwner, artist1, artist2, buyer1, buyer2 } = await loadFixture(deployArtworkRegistryFixture);

        expect(artworkRegistry.target).to.not.equal(0);
        expect(contractOwner.address).to.not.equal(0);
        expect(artist1.address).to.not.equal(0);
        expect(artist2.address).to.not.equal(0);
        expect(buyer1.address).to.not.equal(0);
        expect(buyer2.address).to.not.equal(0);
    });

    it("Should mint an artwork", async function () {
        const { artworkRegistry, artist1 } = await loadFixture(deployArtworkRegistryFixture);
        await artworkRegistry.mint(artist1.address, 1, "URITest1", "NameTest1", "DescriptionTest1", "ImageURITest1", "ArtistTest1", "2021", "PhysicalTest1", true);

        expect(await artworkRegistry.getTokenIdLength()).to.equal(1);
    });

    it("Should get the artwork owner", async function () {
        const { artworkRegistry, artist1 } = await loadFixture(deployArtworkRegistryFixture);
        await artworkRegistry.mint(artist1.address, 1, "URITest1", "NameTest1", "DescriptionTest1", "ImageURITest1", "ArtistTest1", "2021", "PhysicalTest1", true);

        const owner = await artworkRegistry.getArtworkOwner(1);
        expect(owner).to.equal(artist1.address);
    });

    it("Should get the artwork URI", async function () {
        const { artworkRegistry, artist1 } = await loadFixture(deployArtworkRegistryFixture);
        await artworkRegistry.mint(artist1.address, 1, "URITest1", "NameTest1", "DescriptionTest1", "ImageURITest1", "ArtistTest1", "2021", "PhysicalTest1", true);

        const uri = await artworkRegistry.getArtworkURI(1);
        expect(uri).to.equal("URITest1");
    });

    it("Should get the artwork name", async function () {
        const { artworkRegistry, artist1 } = await loadFixture(deployArtworkRegistryFixture);
        await artworkRegistry.mint(artist1.address, 1, "URITest1", "NameTest1", "DescriptionTest1", "ImageURITest1", "ArtistTest1", "2021", "PhysicalTest1", true);

        const name = await artworkRegistry.getArtworkName(1);
        expect(name).to.equal("NameTest1");
    });

    it("Should get the artwork description", async function () {
        const { artworkRegistry, artist1 } = await loadFixture(deployArtworkRegistryFixture);
        await artworkRegistry.mint(artist1.address, 1, "URITest1", "NameTest1", "DescriptionTest1", "ImageURITest1", "ArtistTest1", "2021", "PhysicalTest1", true);

        const description = await artworkRegistry.getArtworkDescription(1);
        expect(description).to.equal("DescriptionTest1");
    });

    it("Should get the artwork image URI", async function () {
        const { artworkRegistry, artist1 } = await loadFixture(deployArtworkRegistryFixture);
        await artworkRegistry.mint(artist1.address, 1, "URITest1", "NameTest1", "DescriptionTest1", "ImageURITest1", "ArtistTest1", "2021", "PhysicalTest1", true);

        const imageURI = await artworkRegistry.getArtworkImageURI(1);
        expect(imageURI).to.equal("ImageURITest1");
    });

    it("Should get the artwork artist", async function () {
        const { artworkRegistry, artist1 } = await loadFixture(deployArtworkRegistryFixture);
        await artworkRegistry.mint(artist1.address, 1, "URITest1", "NameTest1", "DescriptionTest1", "ImageURITest1", "ArtistTest1", "2021", "PhysicalTest1", true);

        const artist = await artworkRegistry.getArtworkArtist(1);
        expect(artist).to.equal("ArtistTest1");
    });

    it("Should get the artwork year", async function () {
        const { artworkRegistry, artist1 } = await loadFixture(deployArtworkRegistryFixture);
        await artworkRegistry.mint(artist1.address, 1, "URITest1", "NameTest1", "DescriptionTest1", "ImageURITest1", "ArtistTest1", "2021", "PhysicalTest1", true);

        const year = await artworkRegistry.getArtworkYear(1);
        expect(year).to.equal("2021");
    });

    it("Should get if artwork is physical", async function () {
        const { artworkRegistry, artist1 } = await loadFixture(deployArtworkRegistryFixture);
        await artworkRegistry.mint(artist1.address, 1, "URITest1", "NameTest1", "DescriptionTest1", "ImageURITest1", "ArtistTest1", "2021", "PhysicalTest1", true);

        const isPhysical = await artworkRegistry.getArtworkIsPhysical(1);
        expect(isPhysical).to.equal("PhysicalTest1");
    });

    it("Should get if artwork is on sale", async function () {
        const { artworkRegistry, artist1 } = await loadFixture(deployArtworkRegistryFixture);
        await artworkRegistry.mint(artist1.address, 1, "URITest1", "NameTest1", "DescriptionTest1", "ImageURITest1", "ArtistTest1", "2021", "PhysicalTest1", true);

        const onSale = await artworkRegistry.getArtworkOnSale(1);
        expect(onSale).to.equal(true);
    });

    it("Should get all token IDs", async function () {
        const { artworkRegistry, artist1 } = await loadFixture(deployArtworkRegistryFixture);
        await artworkRegistry.mint(artist1.address, 1, "URITest1", "NameTest1", "DescriptionTest1", "ImageURITest1", "ArtistTest1", "2021", "PhysicalTest1", true);
        await artworkRegistry.mint(artist1.address, 2, "URITest2", "NameTest2", "DescriptionTest2", "ImageURITest2", "ArtistTest2", "2022", "PhysicalTest2", false);

        const tokenIds = await artworkRegistry.getTokenIds();
        expect(tokenIds.length).to.equal(2);
        expect(tokenIds[0]).to.equal(1);
        expect(tokenIds[1]).to.equal(2);
    });

    it("Should get token IDs length", async function () {
        const { artworkRegistry, artist1 } = await loadFixture(deployArtworkRegistryFixture);
        await artworkRegistry.mint(artist1.address, 1, "URITest1", "NameTest1", "DescriptionTest1", "ImageURITest1", "ArtistTest1", "2021", "PhysicalTest1", true);
        await artworkRegistry.mint(artist1.address, 2, "URITest2", "NameTest2", "DescriptionTest2", "ImageURITest2", "ArtistTest2", "2022", "PhysicalTest2", false);

        const length = await artworkRegistry.getTokenIdLength();
        expect(length).to.equal(2);
    });

    it("Should get artworks by owner", async function () {
        const { artworkRegistry, artist1 } = await loadFixture(deployArtworkRegistryFixture);
        await artworkRegistry.mint(artist1.address, 1, "URITest1", "NameTest1", "DescriptionTest1", "ImageURITest1", "ArtistTest1", "2021", "PhysicalTest1", true);
        await artworkRegistry.mint(artist1.address, 2, "URITest2", "NameTest2", "DescriptionTest2", "ImageURITest2", "ArtistTest2", "2022", "PhysicalTest2", false);

        const artworks = await artworkRegistry.getArtworksByOwner(artist1.address);
        expect(artworks.length).to.equal(2);
        expect(artworks[0]).to.equal(1);
        expect(artworks[1]).to.equal(2);
    });

    it("Should burn an artwork", async function () {
        const { artworkRegistry, artist1 } = await loadFixture(deployArtworkRegistryFixture);
        await artworkRegistry.mint(artist1.address, 1, "URITest1", "NameTest1", "DescriptionTest1", "ImageURITest1", "ArtistTest1", "2021", "PhysicalTest1", true);

        expect(await artworkRegistry.getArtworkOwner(1)).to.equal(artist1.address);
        expect(await artworkRegistry.getTokenIdLength()).to.equal(1);

        await artworkRegistry.connect(artist1).burn(1);

        expect(await artworkRegistry.getTokenIdLength()).to.equal(0);
    });

    it("Should update the artwork owner", async function () {
        const { artworkRegistry, artist1, marketplace, buyer1 } = await loadFixture(deployArtworkRegistryFixture);
        await artworkRegistry.setMarketplace(marketplace.address);
        await artworkRegistry.mint(artist1.address, 1, "URITest1", "NameTest1", "DescriptionTest1", "ImageURITest1", "ArtistTest1", "2021", "PhysicalTest1", true);

        expect(await artworkRegistry.getArtworkOwner(1)).to.equal(artist1.address);

        await artworkRegistry.connect(marketplace).updateArtworkOwner(1, buyer1.address);

        expect(await artworkRegistry.getArtworkOwner(1)).to.equal(buyer1.address);
    });

    it("Should set marketplace", async function () {
        const { artworkRegistry, marketplace } = await loadFixture(deployArtworkRegistryFixture);
        await artworkRegistry.setMarketplace(marketplace.address);

        expect(await artworkRegistry.getMarketplace()).to.equal(marketplace.address);
    });

    it("Should not be able to burn if not owner", async function () {
        const { artworkRegistry, artist1, artist2 } = await loadFixture(deployArtworkRegistryFixture);
        await artworkRegistry.mint(artist1.address, 1, "URITest1", "NameTest1", "DescriptionTest1", "ImageURITest1", "ArtistTest1", "2021", "PhysicalTest1", true);

        await expect(artworkRegistry.connect(artist2).burn(1)).to.be.reverted;
    });

    it("Should not be able to update artwork owner if not marketplace", async function () {
        const { artworkRegistry, artist1, artist2 } = await loadFixture(deployArtworkRegistryFixture);
        await artworkRegistry.setMarketplace(artist1.address);
        await artworkRegistry.mint(artist2.address, 1, "URITest1", "NameTest1", "DescriptionTest1", "ImageURITest1", "ArtistTest1", "2021", "PhysicalTest1", true);

        await expect(artworkRegistry.connect(artist2).updateArtworkOwner(1, artist2.address)).to.be.reverted;
    });

    it("Should not be able to set marketplace if not contract owner", async function () {
        const { artworkRegistry, artist1, marketplace } = await loadFixture(deployArtworkRegistryFixture);

        await expect(artworkRegistry.connect(artist1).setMarketplace(marketplace.address)).to.be.reverted;
    });

    it("Should not be able to mint if token already exists", async function () {
        const { artworkRegistry, artist1 } = await loadFixture(deployArtworkRegistryFixture);
        await artworkRegistry.mint(artist1.address, 1, "URITest1", "NameTest1", "DescriptionTest1", "ImageURITest1", "ArtistTest1", "2021", "PhysicalTest1", true);

        await expect(artworkRegistry.mint(artist1.address, 1, "URITest1", "NameTest1", "DescriptionTest1", "ImageURITest1", "ArtistTest1", "2021", "PhysicalTest1", true)).to.be.reverted;
    });

    it("Should not be able to burn if token does not exist", async function () {
        const { artworkRegistry, artist1 } = await loadFixture(deployArtworkRegistryFixture);

        await expect(artworkRegistry.connect(artist1).burn(1)).to.be.reverted;
    });

    it("Should not be able to update artwork owner if token does not exist", async function () {
        const { artworkRegistry, artist2 } = await loadFixture(deployArtworkRegistryFixture);

        await expect(artworkRegistry.connect(artist2).updateArtworkOwner(1, artist2.address)).to.be.reverted;
    });

    it("Event ArtworkMinted should be emitted", async function () {
        const { artworkRegistry, artist1 } = await loadFixture(deployArtworkRegistryFixture);

        await expect(artworkRegistry.mint(artist1.address, 1, "URITest1", "NameTest1", "DescriptionTest1", "ImageURITest1", "ArtistTest1", "2021", "PhysicalTest1", true)).to.emit(artworkRegistry, "ArtworkMinted").withArgs(1, "URITest1", artist1.address);
    });

    it("Event ArtworkBurned should be emitted", async function () {
        const { artworkRegistry, artist1 } = await loadFixture(deployArtworkRegistryFixture);
        await artworkRegistry.mint(artist1.address, 1, "URITest1", "NameTest1", "DescriptionTest1", "ImageURITest1", "ArtistTest1", "2021", "PhysicalTest1", true);

        await expect(artworkRegistry.connect(artist1).burn(1))
            .to.emit(artworkRegistry, "ArtworkBurned")
            .withArgs(1, artist1.address);
    });

    it("Event ArtworkOwnerUpdated should be emitted", async function () {
        const { artworkRegistry, artist1, artist2, marketplace } = await loadFixture(deployArtworkRegistryFixture);
        await artworkRegistry.setMarketplace(marketplace.address);
        await artworkRegistry.mint(artist1.address, 1, "URITest1", "NameTest1", "DescriptionTest1", "ImageURITest1", "ArtistTest1", "2021", "PhysicalTest1", true);

        await expect(artworkRegistry.connect(marketplace).updateArtworkOwner(1, artist2.address))
            .to.emit(artworkRegistry, "ArtworkOwnerUpdated")
            .withArgs(1, artist1.address, artist2.address);
    });

    it("Event MarketplaceUpdated should be emitted", async function () {
        const { artworkRegistry, marketplace } = await loadFixture(deployArtworkRegistryFixture);

        await expect(artworkRegistry.setMarketplace(marketplace.address))
            .to.emit(artworkRegistry, "MarketplaceUpdated")
            .withArgs("0x0000000000000000000000000000000000000000", marketplace.address);
    });
});

module.exports = {
    deployArtworkRegistryFixture
};
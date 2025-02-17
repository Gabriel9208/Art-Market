const { expect } = require("chai");
const { ethers } = require("hardhat");
const { loadFixture } = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { deployArtworkRegistryFixture } = require("./ArtworkRegistry.test");

/*
    Fixture deployArtMarketplaceFixture is used to deploy the ArtMarketplace contract.
*/
async function deployArtMarketplaceFixture() {
    const { artworkRegistry, contractOwner, artist1, artist2, buyer1, buyer2 }
        = await loadFixture(deployArtworkRegistryFixture);

    const ArtMarketplace = await ethers.getContractFactory("ArtMarketplace");
    const artMarketplace = await ArtMarketplace.deploy(artworkRegistry.target);

    await artworkRegistry.connect(contractOwner).setMarketplace(artMarketplace.target);

    return { artMarketplace, artworkRegistry, contractOwner, artist1, artist2, buyer1, buyer2 };
}

describe("ArtMarketplace", function () {
    it("Should deploy the contract", async function () {
        const { artMarketplace, artworkRegistry, artist1, artist2, buyer1, buyer2 }
            = await loadFixture(deployArtMarketplaceFixture);

        expect(artMarketplace.target).to.not.equal(0);
        expect(artworkRegistry.target).to.not.equal(0);
        expect(artist1.address).to.not.equal(0);
        expect(artist2.address).to.not.equal(0);
        expect(buyer1.address).to.not.equal(0);
        expect(buyer2.address).to.not.equal(0);
    });

    it("Should set the marketplace address", async function () {
        const { artMarketplace, artworkRegistry }
            = await loadFixture(deployArtMarketplaceFixture);

        expect(await artworkRegistry.getMarketplace()).to.equal(artMarketplace.target);
    });

    it("Should list an artwork", async function () {
        const { artMarketplace, artworkRegistry, artist1 }
            = await loadFixture(deployArtMarketplaceFixture);
        const ARTWORK_ID = 1;
        const PRICE = ethers.parseEther("0.01");

        await artworkRegistry.mint(artist1.address, ARTWORK_ID, "URITest1", "NameTest1", "DescriptionTest1", "ImageURITest1", "ArtistTest1", "2021", "PhysicalTest1", true);

        await artMarketplace.connect(artist1).listArtwork(ARTWORK_ID, PRICE);
        expect(await artMarketplace.getListingLength()).to.equal(1);
        expect((await artMarketplace.getListing(ARTWORK_ID)).price).to.equal(PRICE);
    });

    it("Should get listings", async function () {
        const { artMarketplace, artworkRegistry, artist1 }
            = await loadFixture(deployArtMarketplaceFixture);
        const ARTWORK_ID_1 = 1;
        const ARTWORK_ID_2 = 2;
        const PRICE = ethers.parseEther("0.01");

        await artworkRegistry.mint(artist1.address, ARTWORK_ID_1, "URITest1", "NameTest1", "DescriptionTest1", "ImageURITest1", "ArtistTest1", "2021", "PhysicalTest1", true);
        await artMarketplace.connect(artist1).listArtwork(ARTWORK_ID_1, PRICE);
        await artworkRegistry.mint(artist1.address, ARTWORK_ID_2, "URITest2", "NameTest2", "DescriptionTest2", "ImageURITest2", "ArtistTest2", "2022", "PhysicalTest2", true);
        await artMarketplace.connect(artist1).listArtwork(ARTWORK_ID_2, PRICE);

        const listings = await artMarketplace.getListings();
        expect(listings).to.have.lengthOf(2);
        expect(listings[0].tokenId).to.equal(ARTWORK_ID_1);
        expect(listings[1].tokenId).to.equal(ARTWORK_ID_2);
    });

    it("Should unlist an artwork", async function () {
        const { artMarketplace, artworkRegistry, artist1 }
            = await loadFixture(deployArtMarketplaceFixture);
        const ARTWORK_ID = 1;
        const PRICE = ethers.parseEther("0.01");

        await artworkRegistry.mint(artist1.address, ARTWORK_ID, "URITest1", "NameTest1", "DescriptionTest1", "ImageURITest1", "ArtistTest1", "2021", "PhysicalTest1", true);
        await artMarketplace.connect(artist1).listArtwork(ARTWORK_ID, PRICE);
        expect(await artMarketplace.getListingLength()).to.equal(1)

        await artMarketplace.connect(artist1).unlistArtwork(ARTWORK_ID);
        expect(await artMarketplace.getListingLength()).to.equal(0);
    });

    it("Should set the price of an artwork", async function () {
        const { artMarketplace, artworkRegistry, artist1 }
            = await loadFixture(deployArtMarketplaceFixture);
        const ARTWORK_ID = 1;
        const PRICE = ethers.parseEther("0.01");
        const NEW_PRICE = ethers.parseEther("0.02");

        await artworkRegistry.mint(artist1.address, ARTWORK_ID, "URITest1", "NameTest1", "DescriptionTest1", "ImageURITest1", "ArtistTest1", "2021", "PhysicalTest1", true);
        await artMarketplace.connect(artist1).listArtwork(ARTWORK_ID, PRICE);
        expect(await artMarketplace.getListingLength()).to.equal(1);
        expect((await artMarketplace.getListing(ARTWORK_ID)).price).to.equal(PRICE);

        await artMarketplace.connect(artist1).setPrice(ARTWORK_ID, NEW_PRICE);
        expect((await artMarketplace.getListing(ARTWORK_ID)).price).to.equal(NEW_PRICE);
    });

    it("Should buy an artwork", async function () {
        const { artMarketplace, artworkRegistry, artist1, buyer1 }
            = await loadFixture(deployArtMarketplaceFixture);
        const ARTWORK_ID = 1;
        const PRICE = ethers.parseEther("0.01");

        await artworkRegistry.mint(artist1.address, ARTWORK_ID, "URITest1", "NameTest1", "DescriptionTest1", "ImageURITest1", "ArtistTest1", "2021", "PhysicalTest1", true);
        await artMarketplace.connect(artist1).listArtwork(ARTWORK_ID, PRICE);

        await artMarketplace.connect(buyer1).buyArtwork(ARTWORK_ID, { value: PRICE });
        await expect(artMarketplace.getListing(ARTWORK_ID)).to.be.reverted;
    });

    it("Should get listing owner", async function () {
        const { artMarketplace, artworkRegistry, artist1 }
            = await loadFixture(deployArtMarketplaceFixture);
        const ARTWORK_ID = 1;
        const PRICE = ethers.parseEther("0.01");

        await artworkRegistry.mint(artist1.address, ARTWORK_ID, "URITest1", "NameTest1", "DescriptionTest1", "ImageURITest1", "ArtistTest1", "2021", "PhysicalTest1", true);
        await artMarketplace.connect(artist1).listArtwork(ARTWORK_ID, PRICE);

        expect(await artMarketplace.getListingOwner(ARTWORK_ID)).to.equal(artist1.address);
    });

    it("Should get listing price", async function () {
        const { artMarketplace, artworkRegistry, artist1 }
            = await loadFixture(deployArtMarketplaceFixture);
        const ARTWORK_ID = 1;
        const PRICE = ethers.parseEther("0.01");

        await artworkRegistry.mint(artist1.address, ARTWORK_ID, "URITest1", "NameTest1", "DescriptionTest1", "ImageURITest1", "ArtistTest1", "2021", "PhysicalTest1", true);
        await artMarketplace.connect(artist1).listArtwork(ARTWORK_ID, PRICE);

        expect(await artMarketplace.getListingPrice(ARTWORK_ID)).to.equal(PRICE);
    });

    it("Should get listing length", async function () {
        const { artMarketplace, artworkRegistry, artist1 }
            = await loadFixture(deployArtMarketplaceFixture);
        const ARTWORK_ID = 1;
        const PRICE = ethers.parseEther("0.01");

        await artworkRegistry.mint(artist1.address, ARTWORK_ID, "URITest1", "NameTest1", "DescriptionTest1", "ImageURITest1", "ArtistTest1", "2021", "PhysicalTest1", true);
        await artMarketplace.connect(artist1).listArtwork(ARTWORK_ID, PRICE);

        expect(await artMarketplace.getListingLength()).to.equal(1);
    });

    it("Should not be able to buy an artwork if the item does not exist", async function () {
        const { artMarketplace, artist1 }
            = await loadFixture(deployArtMarketplaceFixture);
        const ARTWORK_ID = 1;
        const PRICE = ethers.parseEther("0.01");

        await expect(artMarketplace.connect(artist1).buyArtwork(ARTWORK_ID, { value: PRICE }))
            .to.be.revertedWith("Item does not exist");
    });

    it("Should not be able to buy an artwork if the buyer is the owner", async function () {
        const { artMarketplace, artworkRegistry, artist1 }
            = await loadFixture(deployArtMarketplaceFixture);
        const ARTWORK_ID = 1;
        const PRICE = ethers.parseEther("0.01");

        await artworkRegistry.mint(artist1.address, ARTWORK_ID, "URITest1", "NameTest1", "DescriptionTest1", "ImageURITest1", "ArtistTest1", "2021", "PhysicalTest1", true);
        await artMarketplace.connect(artist1).listArtwork(ARTWORK_ID, PRICE);

        await expect(artMarketplace.connect(artist1).buyArtwork(ARTWORK_ID, { value: PRICE }))
            .to.be.revertedWith("Buyer already own this artwork");
    });

    it("Should not be able to buy an artwork if the payment amount is incorrect", async function () {
        const { artMarketplace, artworkRegistry, artist1, buyer1 }
            = await loadFixture(deployArtMarketplaceFixture);
        const ARTWORK_ID = 1;
        const PRICE = ethers.parseEther("0.01");
        const INCORRECT_PRICE = ethers.parseEther("0.02");

        await artworkRegistry.mint(artist1.address, ARTWORK_ID, "URITest1", "NameTest1", "DescriptionTest1", "ImageURITest1", "ArtistTest1", "2021", "PhysicalTest1", true);
        await artMarketplace.connect(artist1).listArtwork(ARTWORK_ID, PRICE);

        await expect(artMarketplace.connect(buyer1).buyArtwork(ARTWORK_ID, { value: INCORRECT_PRICE }))
            .to.be.revertedWith("Payment amount incorrect");
    });

    it("Should not list an artwork if the price is too low", async function () {
        const { artMarketplace, artworkRegistry, artist1 }
            = await loadFixture(deployArtMarketplaceFixture);
        const ARTWORK_ID = 1;
        const PRICE = ethers.parseEther("0.001");

        await artworkRegistry.mint(artist1.address, ARTWORK_ID, "URITest1", "NameTest1", "DescriptionTest1", "ImageURITest1", "ArtistTest1", "2021", "PhysicalTest1", true);

        await expect(artMarketplace.connect(artist1).listArtwork(ARTWORK_ID, PRICE))
            .to.be.revertedWith("Price is too low");
    });

    it("Should not be able to list an artwork if the artwork does not exist", async function () {
        const { artMarketplace, artist1 }
            = await loadFixture(deployArtMarketplaceFixture);
        const ARTWORK_ID = 1;
        const PRICE = ethers.parseEther("0.01");

        await expect(artMarketplace.connect(artist1).listArtwork(ARTWORK_ID, PRICE)).to.be.reverted;
    });

    it("Should not be able to list an artwork if the artwork is not owned by the artist", async function () {
        const { artMarketplace, artworkRegistry, artist1, artist2 }
            = await loadFixture(deployArtMarketplaceFixture);
        const ARTWORK_ID = 1;
        const PRICE = ethers.parseEther("0.01");

        await artworkRegistry.mint(artist1.address, ARTWORK_ID, "URITest1", "NameTest1", "DescriptionTest1", "ImageURITest1", "ArtistTest1", "2021", "PhysicalTest1", true);

        await expect(artMarketplace.connect(artist2).listArtwork(ARTWORK_ID, PRICE))
            .to.be.revertedWith("Only owner can call this function");
    });

    it("Should not be able to list an artwork if the artwork is already listed", async function () {
        const { artMarketplace, artworkRegistry, artist1 }
            = await loadFixture(deployArtMarketplaceFixture);
        const ARTWORK_ID = 1;
        const PRICE = ethers.parseEther("0.01");

        await artworkRegistry.mint(artist1.address, ARTWORK_ID, "URITest1", "NameTest1", "DescriptionTest1", "ImageURITest1", "ArtistTest1", "2021", "PhysicalTest1", true);
        await artMarketplace.connect(artist1).listArtwork(ARTWORK_ID, PRICE);

        await expect(artMarketplace.connect(artist1).listArtwork(ARTWORK_ID, PRICE))
            .to.be.revertedWith("Item already listed");
    });

    it("Should not be able to unlist an artwork if the artwork is not owned by the artist", async function () {
        const { artMarketplace, artworkRegistry, artist1, artist2 }
            = await loadFixture(deployArtMarketplaceFixture);
        const ARTWORK_ID = 1;
        const PRICE = ethers.parseEther("0.01");

        await artworkRegistry.mint(artist1.address, ARTWORK_ID, "URITest1", "NameTest1", "DescriptionTest1", "ImageURITest1", "ArtistTest1", "2021", "PhysicalTest1", true);

        await artMarketplace.connect(artist1).listArtwork(ARTWORK_ID, PRICE);

        await expect(artMarketplace.connect(artist2).unlistArtwork(ARTWORK_ID))
            .to.be.revertedWith("Only owner can call this function");
    });

    it("Should not be able to unlist an artwork if the artwork does not exist", async function () {
        const { artMarketplace, artist1 }
            = await loadFixture(deployArtMarketplaceFixture);
        const ARTWORK_ID = 1;

        await expect(artMarketplace.connect(artist1).unlistArtwork(ARTWORK_ID)).to.be.reverted;
    });

    it("Should not be able to set the price of an artwork if the artwork does not exist", async function () {
        const { artMarketplace, artist1 }
            = await loadFixture(deployArtMarketplaceFixture);
        const ARTWORK_ID = 1;
        const PRICE = ethers.parseEther("0.01");

        await expect(artMarketplace.connect(artist1).setPrice(ARTWORK_ID, PRICE)).to.be.reverted;
    });

    it("Should not be able to set the price of an artwork if the price is too low", async function () {
        const { artMarketplace, artworkRegistry, artist1 }
            = await loadFixture(deployArtMarketplaceFixture);
        const ARTWORK_ID = 1;
        const PRICE = ethers.parseEther("0.01");
        const LOW_PRICE = ethers.parseEther("0.001");

        await artworkRegistry.mint(artist1.address, ARTWORK_ID, "URITest1", "NameTest1", "DescriptionTest1", "ImageURITest1", "ArtistTest1", "2021", "PhysicalTest1", true);
        await artMarketplace.connect(artist1).listArtwork(ARTWORK_ID, PRICE);

        await expect(artMarketplace.connect(artist1).setPrice(ARTWORK_ID, LOW_PRICE))
            .to.be.revertedWith("Price is too low");
    });

    it("Should not be able to set the price of an artwork if the artwork is not owned by the artist", async function () {
        const { artMarketplace, artworkRegistry, artist1, artist2 }
            = await loadFixture(deployArtMarketplaceFixture);
        const ARTWORK_ID = 1;
        const PRICE = ethers.parseEther("0.01");

        await artworkRegistry.mint(artist1.address, ARTWORK_ID, "URITest1", "NameTest1", "DescriptionTest1", "ImageURITest1", "ArtistTest1", "2021", "PhysicalTest1", true);
        await artMarketplace.connect(artist1).listArtwork(ARTWORK_ID, PRICE);

        await expect(artMarketplace.connect(artist2).setPrice(ARTWORK_ID, PRICE))
            .to.be.revertedWith("Only owner can call this function");
    });

    it("Should not able to buy an artwork if the artwork is not listed", async function () {
        const { artMarketplace, artworkRegistry, artist1, buyer1 }
            = await loadFixture(deployArtMarketplaceFixture);
        const ARTWORK_ID = 1;
        const PRICE = ethers.parseEther("0.01");

        await artworkRegistry.mint(artist1.address, ARTWORK_ID, "URITest1", "NameTest1", "DescriptionTest1", "ImageURITest1", "ArtistTest1", "2021", "PhysicalTest1", true);

        await expect(artMarketplace.connect(buyer1).buyArtwork(ARTWORK_ID, { value: PRICE }))
            .to.be.revertedWith("Item does not exist");
    });

    it("Event ArtWorkBought should be emitted", async function () {
        const { artMarketplace, artworkRegistry, artist1, buyer1 }
            = await loadFixture(deployArtMarketplaceFixture);
        const ARTWORK_ID = 1;
        const PRICE = ethers.parseEther("0.01");

        await artworkRegistry.mint(artist1.address, ARTWORK_ID, "URITest1", "NameTest1", "DescriptionTest1", "ImageURITest1", "ArtistTest1", "2021", "PhysicalTest1", true);
        await artMarketplace.connect(artist1).listArtwork(ARTWORK_ID, PRICE);

        await expect(artMarketplace.connect(buyer1).buyArtwork(ARTWORK_ID, { value: PRICE }))
            .to.emit(artMarketplace, "ArtWorkBought")
            .withArgs(buyer1.address, ARTWORK_ID);
    });

    it("Event ArtworkListed should be emitted", async function () {
        const { artMarketplace, artworkRegistry, artist1 }
            = await loadFixture(deployArtMarketplaceFixture);
        const ARTWORK_ID = 1;
        const PRICE = ethers.parseEther("0.01");

        await artworkRegistry.mint(artist1.address, ARTWORK_ID, "URITest1", "NameTest1", "DescriptionTest1", "ImageURITest1", "ArtistTest1", "2021", "PhysicalTest1", true);

        await expect(artMarketplace.connect(artist1).listArtwork(ARTWORK_ID, PRICE))
            .to.emit(artMarketplace, "ArtworkListed")
            .withArgs(ARTWORK_ID, PRICE, artist1.address);
    }); 

    it("Event ArtworkUnlisted should be emitted", async function () {
        const { artMarketplace, artworkRegistry, artist1 }
            = await loadFixture(deployArtMarketplaceFixture);
        const ARTWORK_ID = 1;
        const PRICE = ethers.parseEther("0.01");

        await artworkRegistry.mint(artist1.address, ARTWORK_ID, "URITest1", "NameTest1", "DescriptionTest1", "ImageURITest1", "ArtistTest1", "2021", "PhysicalTest1", true);
        await artMarketplace.connect(artist1).listArtwork(ARTWORK_ID, PRICE);

        await expect(artMarketplace.connect(artist1).unlistArtwork(ARTWORK_ID))
            .to.emit(artMarketplace, "ArtworkUnlisted")
            .withArgs(ARTWORK_ID, artist1.address);
    });
});

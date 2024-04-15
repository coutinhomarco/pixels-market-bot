(function() {
    'use strict';

    let loop;
    const minimumPrice = 39;
    const moneyInBank = 3000;
    let totalSpent = 0;
    let numberOfPurchases = 0;

    function findPopberryItem(items) {
        return Array.from(items).find(item => item.children[1].innerText === 'Popberry');
    }

    function clickItem(item) {
        item.click();
    }

    function extractPrice(text) {
        const pricePart = text.split('@')[1];
        return pricePart ? parseFloat(pricePart.trim()) : null;
    }

    function attemptPurchase(btnText) {
        const price = extractPrice(btnText.innerText);
        if (price < minimumPrice) {
            console.log(`Price below ${minimumPrice}: `, price);
            btnText.click();
            completePurchase(price);
        } else {
            console.log(`Price above ${minimumPrice}, not purchasing.`);
            closePopups();
        }
    }

    function completePurchase(price) {
        setTimeout(() => {
            const buyButton = document.querySelector('.MarketplaceItemListings_buyListing__jYwuF');
            buyButton.click();
            setTimeout(() => {
                const purchasedText = document.querySelector('.Marketplace_prop__fTsfy');
                if (purchasedText) {
                    totalSpent += price;
                    numberOfPurchases++;
                    console.log('Purchase successful');
                } else {
                    console.log('Purchase failed');
                }
            }, 500);
            closePopups();
        }, 400);
    }

    function closePopups() {
        const firstOne = document.querySelectorAll('.commons_closeBtn__UobaL')[1];
        const secondOne = document.querySelector('.Marketplace_button__x_SGP');
        firstOne && firstOne.click();
        secondOne && secondOne.click();
    }

    function automationTask() {
        let items = document.querySelectorAll('.Marketplace_item__l__LM');
        if (!items.length) {
            items = document.querySelectorAll('.Marketplace_item_l_LM');
        }
        const popberryItem = findPopberryItem(items);
        if (popberryItem) {
            clickItem(popberryItem.children[2]);
            setTimeout(() => {
                const btnText = document.querySelector('.MarketplaceItemListings_buyListing__jYwuF');
                attemptPurchase(btnText);
            }, 800);
        }
        if (numberOfPurchases > 0) {
            const averagePrice = totalSpent / numberOfPurchases;
            console.log(`Average price of purchases: ${averagePrice.toFixed(2)}`);
        }
    }

    function startAutomation() {
        loop = setInterval(automationTask, 2500);
    }

    function stopAutomation() {
        clearInterval(loop);
        console.log('Automation stopped.');
    }

    document.addEventListener('keydown', function(e) {
        if (e.key === 'q' || e.key === 'Q') {
            stopAutomation();
        }
    });

    window.stopAutomation = stopAutomation;
    startAutomation();
})();

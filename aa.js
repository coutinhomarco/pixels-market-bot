(function() {
    'use strict';

    let loop;
    const minimumPrice = 39;
    const minimumBalance = 1000
    // const itemToBuy = 'Bluzzleberry Swirl Cotton Candy'
    const itemToBuy = 'Popberry'
    const sleep = false;

    let totalSpent = 0;
    let numberOfPurchases = 0;
    let averagePrice
    let currentBalance

    function findPopberryItem(items) {
        return Array.from(items).find(item => item.children[1].innerText === itemToBuy);
    }

    function clickItem(item) {
        item.click();
    }

    function extractPrice(text) {
        const quantityPart = text && text.split('@')[0]?.split(':')[1]?.trim();
        const pricePart = text && text.split('@')[1];
        return {price:  pricePart ? parseFloat(pricePart.trim()) : null, quantity: quantityPart};
    }
    function getBalance() {
        const balanceElement = document.querySelector('.commons_coinBalance__d9sah');
        const balanceText = balanceElement.innerText;
        const balance = parseFloat(balanceText.split('.').join("").replace(/[^0-9.-]+/g, ""));
        return balance;
    }
    function closeGame() {
        const button = document.querySelector('img[aria-label="Log Out"]');
        button.closest('button').click()
    }
    function checkBalance() {
        currentBalance = getBalance();
        if (currentBalance < minimumBalance) {
            //console.log('Balance too low, stopping automation.');
            sendNotification('Your balance is too low, automation has been stopped.');
            stopAutomation();
            if (sleep) {
                closeGame();
            }
            return false;
        }
        return true;
    }
    function sendNotification(message) {
        if (numberOfPurchases > 0) {
            averagePrice = Number(totalSpent) / Number(numberOfPurchases);
            message += `\nAverage price: ${Number(averagePrice).toFixed(2)}\nBalance: ${currentBalance}\nItem Purchased: ${itemToBuy}`;
        }
        console.log(message);
    }
    
    function attemptPurchase(btnText) {
        if (!checkBalance()) return;
    
        const { price, quantity } = extractPrice(btnText && btnText.innerText);
        if (price < minimumPrice) {
            console.log(`Price below ${minimumPrice}: `, price);
            btnText?.click();
            completePurchase(price, quantity); // Passa a quantidade que pode ser comprada
        } else {
            //console.log(`Price above ${minimumPrice}, not purchasing.`);
            closePopups();
        }
    }
    
    function completePurchase(price, quantity) {
        setTimeout(() => {
            const buyButton = document.querySelector('.MarketplaceItemListings_buyListing__jYwuF');
            buyButton?.click();
            setTimeout(() => {
                const purchasedText = document.querySelector('.Marketplace_prop__fTsfy');
                if (purchasedText) {
                    totalSpent += price * quantity;
                    numberOfPurchases += quantity;
                    sendNotification(`Purchase made, price paid: ${price}, quantity: ${quantity}`);
                    console.log(`Purchase successful\nPrice paid ${price}`);
                    setTimeout(() => {
                        console.log('waiting cooldown');
                    }, 3000)
                }
            }, 400);
            closePopups();
        }, 300);
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
            }, 1100);
        }
        if (Number(numberOfPurchases) > 0) {
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

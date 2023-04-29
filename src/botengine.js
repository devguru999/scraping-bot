const nightmare = require('nightmare')({show: true})

const scrollToBottom = async () => {
    let pageHeight, success = false;
    while (!success) {
        try {
            pageHeight = await nightmare.evaluate(() => {
                return document.body.scrollHeight;
            });

            success = true;
        } catch (e) {
            console.error(`Error in evaluate: ${e}`);
            await nightmare.wait(1000);
        }
    }

    await nightmare.scrollTo(pageHeight, 0);
}

const getProductCodes = async () => {
    let result, success = false;
    while (!success || result.length < 40) {
        try {
            result = await nightmare.evaluate(() => {
                return Array.from(document.querySelectorAll('ul#sw_maindata_asyncload>li.sm-offerShopwindow3.high')).map((element) => {
                    let ret = {};
        
                    ret.product_code = element.getAttribute('offerid');
        
                    return ret;
                })
            });

            success = true;
        } catch (e) {
            console.error(`Error in evaluate: ${e}`);
            await nightmare.wait(1000);
        }
    }    

    result = result.filter(item => item.product_code != null);

    return result;
}

const getPureInfo = async (res) => {
    let result, success = false;
    while (!success || result.length < 40) {
        try {
            result = await nightmare.evaluate((res) => {
                return Array.from(res).map(item => {            
                    item.product_name = document.querySelector(`li[offerid="${item.product_code}"] .sm-offerShopwindow-title>a`).getAttribute('title');
                    item.product_description = "";
                    item.product_pictures = document.querySelector(`li[offerid="${item.product_code}"] .sm-offerShopwindow-photo img`).getAttribute('src');
                    item.product_price = document.querySelector(`li[offerid="${item.product_code}"] .sm-offerShopwindow-price .su-price`).innerText;
                    item.product_review = "";
                    item.product_evaluation = "";
                    item.product_url = document.querySelector(`li[offerid="${item.product_code}"] .sm-offerShopwindow-photo a`).getAttribute('href');
                    item.seller_review = "";
                    item.manufacturer_rating = "";
        
                    return item;
                })
            }, res);

            success = true;
        } catch (e) {
            console.error(`Error in evaluate: ${e}`);
            await nightmare.wait(1000);
        }
    }     

    return result;
}

const getDetails = async (item) => {
    
    console.log(item.product_url.includes('https')?item.product_url:'https:'+item.product_url);
    await nightmare.goto(item.product_url.includes('https')?item.product_url:'https:'+item.product_url);
    await nightmare.wait('.content-detail');
    
    let success = false;
    while (!success) {
        try {
            result = await nightmare.evaluate((item) => {
                try {item.product_description = document.querySelector('.content-detail').innerText;}
                catch (e) {item.product_description = ''}
                item.product_pictures = Array.from(document.querySelectorAll('img.detail-gallery-img')).map(el => el.getAttribute('src')).join(',');
                try {item.product_review = document.querySelector('.title-info-number').innerText;}
                catch (e) {item.product_review = ''}
                try {item.product_evaluation = document.querySelector('.offer-attr').innerText;}
                catch (e) {item.product_evaluation = ''}
                item.seller_review = "";
                item.manufacturer_rating = "";
    
                return item;
            }, item);

            success = true;
        } catch (e) {
            console.error(`Error in evaluate: ${e}`);
            await nightmare.wait(1000);
        }
    }

    console.warn(result);

    return result;
}

module.exports = async (url) => {

    await nightmare.goto(url);    
    await nightmare.wait('ul#sw_maindata_asyncload');
    
    let result = [];

    await scrollToBottom();
    
    await nightmare.wait('ul#sw_maindata_asyncload li[rank="40"]');

    result = await getProductCodes();
    result = await getPureInfo(result);

    for (i in result) {
        result[i] = await getDetails(result[i]);
    }
    
    console.log(result);
    await nightmare.end();

    return result;
    
}
const puppeteer = require('puppeteer');

const autoScroll = async (page) => {
    await page.evaluate(async () => {
        await new Promise((resolve) => {
            var totalHeight = 0;
            var distance = 100;
            var timer = setInterval(() => {
                var scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;

                if(totalHeight >= scrollHeight - window.innerHeight){
                    clearInterval(timer);
                    resolve();
                }
            }, 100);
        });
    });
}

const getProductCodes = async (page) => {
    let result;
    while ((!result || result.length < 40)) {
        try {
            result = await page.evaluate(() => {
                return Array.from(document.querySelectorAll('ul#sw_maindata_asyncload>li.sm-offerShopwindow3.high')).map((element) => {
                    let ret = {};

                    ret.product_code = element.getAttribute('offerid');

                    return ret;
                })
            });

        } catch (e) {
            console.error(`Error in evaluate: ${e}`);
            await page.waitForTimeout(1000);
        }
    }

    result = result.filter(item => item.product_code != null);

    return result;
}

const getPureInfo = async (page, res) => {
    let result;
    while (!result || result.length < 40) {
        try {
            result = await page.evaluate((res) => {
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

        } catch (e) {
            console.error(`Error in evaluate: ${e}`);
            await page.waitForTimeout(1000);
        }
    }

    return result;
}

const getDetails = async (page, item) => {

    console.log(item.product_url.includes('https') ? item.product_url : 'https:' + item.product_url);
    await page.goto(item.product_url.includes('https') ? item.product_url : 'https:' + item.product_url);
    
    await autoScroll(page);
    
    await page.waitForSelector('.content-detail');

    let result;
    while (!result) {
        try {
            result = await page.evaluate((item) => {
                try { item.product_description = document.querySelector('.content-detail').innerText; }
                catch (e) { item.product_description = '' }
                item.product_description.replace('\n', '');
                item.product_pictures = Array.from(document.querySelectorAll('img.detail-gallery-img')).map(el => el.getAttribute('src')).join(',');
                try { item.product_review = document.querySelector('.title-info-number').innerText; }
                catch (e) { item.product_review = '' }
                try { item.product_evaluation = document.querySelector('.offer-attr').innerText; }
                catch (e) { item.product_evaluation = '' }
                item.product_evaluation.replace('\n', '');
                item.seller_review = "";
                item.manufacturer_rating = "";

                return item;
            }, item);

        } catch (e) {
            console.error(`Error in evaluate: ${e}`);
            await page.waitForTimeout(1000);
        }
    }

    console.warn(result);

    return result;
}

module.exports = async (url) => {

    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    page.setDefaultTimeout(1800000);

    await page.goto(url);
    await page.waitForSelector('ul#sw_maindata_asyncload');

    await autoScroll(page);

    let result = [];

    result = await getProductCodes(page);

    result = await getPureInfo(page, result);

    for (i in result) {
        result[i] = await getDetails(page, result[i]);
    }

    console.log(result);
    await browser.close();

    return result;
}

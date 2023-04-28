const nightmare = require('nightmare')({show: true})

module.exports = async (url) => {
    await nightmare.goto(url);
    
    const pageHeight = await nightmare.evaluate(() => {
        return document.body.scrollHeight;
    });

    await nightmare.scrollTo(pageHeight, 0);
    await nightmare.wait('ul#sw_maindata_asyncload');

    let result = await nightmare.evaluate(() => {
        return Array.from(document.querySelectorAll('ul#sw_maindata_asyncload>li.sm-offerShopwindow3.high')).map((element) => {
            let ret = {};

            ret.product_code = element.getAttribute('offerid');

            return ret;
        })
    });

    result = result.filter(item => item.code != null);
    result = await nightmare.evaluate((result) => {
        return Array.from(result).map(item => {            
            item.product_name = document.querySelector(`li[offerid="${item.product_code}"] .sm-offerShopwindow-title>a`).getAttribute('title');
            item.product_description = "";
            item.product_pictures = document.querySelector(`li[offerid="${item.product_code}"] .sm-offerShopwindow-photo img`).getAttribute('src');
            item.product_price = document.querySelector(`li[offerid="${item.product_code}"] .sm-offerShopwindow-price .su-price`).innerText;
            item.product_review = "";
            item.product_evaluation = "";
            item.product_url = document.querySelector(`li[offerid="${item.product_code}"] .sm-offerShopwindow-photo a`).getAttribute('href');
            item.seller_review = "";
            item.manufacturer_name = document.querySelector(`li[offerid="${item.product_code}"] .sm-offerShopwindow-company .sm-previewCompany`).innerText;
            item.manufacturer_url = document.querySelector(`li[offerid="${item.product_code}"] .sm-offerShopwindow-company .sm-previewCompany`).getAttribute('href');
            item.manufacturer_rating = "";

            return item;
        })
    }, result);

    console.log (result);

    await nightmare.end();

    return result;
    
}
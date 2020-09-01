const puppeteer = require('puppeteer-extra');
const fs = require('fs');
const yargs = require('yargs');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');

let URL_PATH, MAIL_ID, PASSWORD, INSITUTE_MAIL_ID;

//Change the waiting time depending on your network connection
//Waiting time is in milliseconds, ie. 15000 = 15 seconds
//Change the students left if you want to leave the classroom when some other number of students are present
const WAITING_TIME = 15000;
const STUDENTS_LEFT = 20;

//importing mail and pwd
//Create a credentials file in json format in the scraper folder and paste your personal and insitute email ids
fs.readFile('./scraper/credentials.json', (err, data) => {
    if (err) {
        console.log(err);
    } else {
        var json = JSON.parse(data);
        MAIL_ID = json.mail;
        PASSWORD = json.password;
        INSTITUTE_MAIL_ID = json.institute_mail;
    }
});


//parse arguments in cmd node
//Comment out this piece of code till the next comment
//And put URL_PATH as the link for google classroom subject to scrape
//Meet link from. OR FOLLOW THE README
const argv = yargs.command('url', 'Gets the url of meeting', {
    link: {
        description: 'the link for the meeting',
        type: 'string',
    }
}).argv;

if (!argv.url) {
    console.log('Give a valid url');
} else {
    URL_PATH = argv.url;
}

//add stealth plugin
puppeteer.use(StealthPlugin());

//the whole functionality
puppeteer.launch({ headless: false, defaultViewport: null, args:[ '--use-fake-ui-for-media-stream'] }).then(async browser => {
    const page = await browser.newPage();
    await page.goto(URL_PATH, { waitUntil: 'load' });
    //await page.waitForNavigation();

    //providing mail-id and password
    await page.waitForSelector('#identifierId');
    await page.click('#identifierId');
    await page.type('#identifierId', MAIL_ID, { delay: 120 });

    await page.waitForSelector('#identifierNext');
    await page.click('#identifierNext', { button: 'left', delay: '300' });


    await page.waitFor(WAITING_TIME);

    await page.waitForSelector('input[type=password]');
    await page.click('input[type=password]');
    await page.type('input[type=password]', PASSWORD, { delay: '100' });

    await page.click('#passwordNext>div>button', { button: 'left', delay: '200' });

    await page.waitFor(WAITING_TIME);
    await page.waitFor(WAITING_TIME);

    //getting page content to search for the most recent classroom link
    let html = await page.content();
    let link = html.substr(html.search('meet.google.com/') + 16, 12);
    //fs.writeFileSync(__dirname + '/../link.txt', link);


    //going to the landing page for the new account to be added for meet, i.e., the insitute email id which apparently
    // everyone accepts nowadays
    await page.waitFor(1000);
    await page.goto("https://accounts.google.com/AddSession?continue=https://meet.google.com/landing");

    await page.waitFor(WAITING_TIME);

    await page.waitForSelector('#identifierId');
    await page.click('#identifierId');

    await page.type('#identifierId', INSTITUTE_MAIL_ID, { delay: 120 });

    await page.click('#identifierNext', { button: 'left', delay: '300' });


    await page.waitFor(WAITING_TIME);

    await page.waitForSelector('input[type=password]');
    await page.click('input[type=password]');
    await page.type('input[type=password]', PASSWORD, { delay: '100' });

    await page.click('#passwordNext>div>button', { button: 'left', delay: '200' });

    await page.waitForSelector('div.ox9SMb');
    await page.click('div.ox9SMb');

    await page.waitForSelector('input[type="text"]');
    await page.click('input[type="text"]');
    await page.type('input[type="text"]', link, {delay: '100'});

    await page.waitForSelector('div.Jsqtqc');
    await page.click('div.Jsqtqc');

    await page.waitFor(WAITING_TIME);
    await page.waitForSelector('div[data-capture-type="sI3MNd"]');
    await page.keyboard.down('Control');
    await page.keyboard.press('KeyD');
    await page.keyboard.press('KeyE');
    await page.keyboard.up('Control');


    await page.waitForSelector('div.Y5sE8d');
    await page.click('div.Y5sE8d');


    await page.waitFor(WAITING_TIME);

    let flag = false;
    await page.waitForSelector('span.wnPUne');
    while(true) {
        const students = await page.$eval('span.wnPUne', e => e.innerText);
        
        //Code to listen to attendance calls and chat messages


        if(students == STUDENTS_LEFT) {
            flag = true;
            break;
        }
    }
    

    if(flag) {
        await page.waitForSelector('span.FbBiwc');
        await page.click('span.FbBiwc');
        await browser.close();
        console.log('Done!');
        
    }
});

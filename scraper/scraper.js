const puppeteer = require('puppeteer-extra');
const fs = require('fs');
const yargs = require('yargs');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');


//Constants you can change if you feel like
const WAITING_TIME = 15000;
const STUDENTS_LEFT = 40;

//variables to store stuff
let URL_PATH,
    MAIL_ID,
    PASSWORD,
    INSTITUTE_MAIL_ID,
    MEET_URL = "https://accounts.google.com/AddSession?continue=https://meet.google.com/landing";


//importing mail and pwd
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


//Function for login
async function login(page, mail, password) {

    //providing mail-id and password
    await page.waitForSelector('#identifierId');
    await page.click('#identifierId');
    await page.type('#identifierId', mail, { delay: '120' });

    await page.waitFor(1000);

    await page.waitForSelector('#identifierNext');
    await page.click('#identifierNext>div>button', { button: 'left', delay: '100' });


    await page.waitFor(WAITING_TIME);

    await page.waitForSelector('input[type=password]');
    await page.click('input[type=password]');
    await page.type('input[type=password]', password, { delay: '100' });

    await page.click('#passwordNext>div>button', { button: 'left', delay: '200' });

}

//Function to join meet
async function joinMeet(page, link) {

    await page.waitFor(1000);

    await page.waitForSelector('div.ox9SMb');
    await page.click('div.ox9SMb');

    await page.waitForSelector('input[type="text"]');
    await page.click('input[type="text"]');
    await page.type('input[type="text"]', link, { delay: '100' });

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

}

//function to fill attendance lmao
async function fillAttendanceForm(page) {
    await page.waitFor(5000);

    await page.waitForSelector('div.freebirdFormviewerViewItemList');
    let formElements = await page.$$('div.freebirdFormviewerViewNumberedItemContainer');
    if (formElements) {
        for (const formElement of formElements) {
            let formElementInner = await formElement.$('div.m2>div.freebirdFormviewerComponentsQuestionBaseRoot');
            let questionText = await formElementInner.$eval('div.freebirdFormviewerComponentsQuestionBaseHeader>div.freebirdFormviewerComponentsQuestionBaseTitleDescContainer>div.freebirdFormviewerComponentsQuestionBaseTitle',
                element => element.innerText);
            questionText = questionText.toLowerCase();
            let answerInput = await formElementInner.$('div.freebirdFormviewerComponentsQuestionTextRoot>div.modeLight>div.quantumWizTextinputPaperinputMainContent>div.quantumWizTextinputPaperinputContentArea>div.quantumWizTextinputPaperinputInputArea>input');

            if (questionText.includes('name')) {
                await answerInput.click();
                await answerInput.type('Soujanyo Biswas', { delay: '100' });
            }

            if (questionText.includes('email')) {
                await answerInput.click();
                await answerInput.type('biswassoujanyo@gmail.com', { delay: '100' });
            }

            if (questionText.includes('phone')) {
                await answerInput.click();
                await answerInput.type('8250849524', { delay: '100' });
            }
        }
    }

    await page.waitForSelector('span.quantumWizButtonPaperbuttonLabel');
    await page.click('span.quantumWizButtonPaperbuttonLabel');

    await page.waitFor(1000);
}


//function to close meet
async function closeMeet(page) {
    await page.waitForSelector('span.FbBiwc');
    await page.click('span.FbBiwc');
}

//function to end the process and kill the browser
async function endProcess(page, browser) {
    await page.close();
    await browser.close();
}

//the whole functionality
puppeteer.launch({ headless: false, defaultViewport: null, args: ['--use-fake-ui-for-media-stream'] }).then(async browser => {
    const page = await browser.newPage();
    await page.goto(URL_PATH, { waitUntil: 'load' });

    await login(page, MAIL_ID, PASSWORD);

    await page.waitFor(WAITING_TIME);
    await page.waitFor(WAITING_TIME);


    //getting page content to search for the most recent classroom link
    let html = await page.content();
    let link = html.substr(html.search('meet.google.com/') + 16, 12);


    //going to the landing page for the new account to be added for meet, i.e., the insitute email id which apparently
    // everyone accepts nowadays
    await page.waitFor(1000);
    await page.goto(MEET_URL, { waitUntil: 'load' });

    await login(page, INSTITUTE_MAIL_ID, PASSWORD);

    await joinMeet(page, link);


    await page.waitFor(WAITING_TIME);

    let flag = false, checkAttendance = true, noAttendanceLink = true, attendanceLink = undefined;
    await page.waitForSelector('span.KdraA');
    await page.click('span.KdraA');

    await page.waitFor(1000);

    //selector for number of people online in meet
    await page.waitForSelector('div.sUgV6e>span>div>span.rua5Nb');

    //the chat container which holds chats
    await page.waitForSelector('div.z38b6');
    let chatContainer = await page.$('div.z38b6');

    //this counters the problem if i connect when there are students less than students left
    //then it runs till attendance becomes less than students left
    while (true) {
        let students = await page.$eval('div.sUgV6e>span>div>span.rua5Nb', e => e.innerText);
        students = parseInt(students.replace(/[()]/g, ''));


        //this code checks for any Google form for attendance sheets to fillup!
        if (chatContainer && noAttendanceLink) {
            let chatElements = await chatContainer.$$('div.GDhqjd');
            for (const chatElement of chatElements) {
                const messageDivHolder = await chatElement.$('div.Zmm6We');
                const messageHolders = await messageDivHolder.$$('div.oIy2qc');

                for (const messageHolder of messageHolders) {
                    const message = await page.evaluate(message => message.innerText, messageHolder);
                    if (message.includes('https://docs.google.com/forms') || message.includes('https://forms.gle/')) {
                        attendanceLink = message;
                        noAttendanceLink = false;
                    }
                }
            }
        }


        //Code to listen to attendance calls and chat messages
        if (checkAttendance && (students > 80)) {
            checkAttendance = false;
        }



        if (!checkAttendance && (students <= STUDENTS_LEFT)) {
            flag = true;
            break;
        }
    }


    //Todooo!!!!!!!!!!
    if (flag && attendanceLink) {
        // await page.waitForSelector('span.FbBiwc');
        // await page.click('span.FbBiwc');
        await closeMeet(page);
        await page.goto(attendanceLink);

        await fillAttendanceForm(page);

        await endProcess(page, browser);
        console.log('Done!');

    }


    if (flag && !attendanceLink) {
        await closeMeet(page);
        await endProcess(page, browser);
        console.log('Done!');
    }
});

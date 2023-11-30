const express = require('express');
const puppeteer = require('puppeteer');
const path = require('path');

const app = express();
const port = 3000;

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', async (req, res) => {
    try {
        const url = req.query.url;
        const inputPrompt = req.query.inputPrompt;

        if (!url || !inputPrompt) {
            return res.status(400).send('URL and inputPrompt parameters are required.');
        }

        const output = await runScript(url, inputPrompt);

        // Send the script output as part of the HTML response
        res.send(`<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Script Output</title>
        </head>
        <body>
            <h1>Script Output</h1>
            <pre id="output">${output}</pre>
        </body>
        </html>`);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

async function runScript(url, inputPrompt) {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    // Your existing script code here
    await page.goto(url);
    await page.waitForSelector("#component-6 > label > textarea", { visible: true, timeout: 20000 });
    await page.type("#component-6 > label > textarea", inputPrompt);
    await page.click('#submit');
    await page.waitForTimeout(35000);

    const elementsToCopy = [];
        const elementSelector = `#component-4 > div.wrapper.svelte-nab2ao > div.bubble-wrap.svelte-1pjfiar > div > div.message-row.bubble.bot-row.svelte-1pjfiar > div > button > span`;

        const elementText = await page.evaluate((selector) => {
            const element = document.querySelector(selector);
            return element ? element.textContent.trim() : null;
        }, elementSelector);
        elementsToCopy.push(elementText);
    

    // Close the browser
    await browser.close();

    // Return the script output
    return `Copied Text: ${elementsToCopy.join(', \n***************************************\n***************************************\n')}`;
}

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

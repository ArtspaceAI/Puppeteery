const puppeteer = require('puppeteer');

(async () => {
    // Launch a headless browser
    // const browser = await puppeteer.launch();
    const browser = await puppeteer.launch({ headless: "new" });


    // Open a new page
    const page = await browser.newPage();

    // Navigate to the website
    await page.goto('https://gpt.h2o.ai/');

    // // Input text "hello" into the prompt field
    // await page.type('#prompt-form > label > textarea', 'what is the capital os Norway?');
    // Input text "hello" into the prompt field
    
    
    // Wait for the element to be visible for up to 10 seconds
    await page.waitForSelector("#prompt-form > label > textarea", {visible: true, timeout: 10000});
    // Then type the text
    // await page.type("#prompt-form > label > textarea", "What is the capital of Norway?");
    await page.type("#prompt-form > label > textarea", "write a tweet about latest AI news ?");


    // Click the submit button
    await page.click('#submit');

    // Wait for the page to load
    await page.waitForTimeout(35000);

    // Copy text from multiple elements with given selectors
    const elementsToCopy = [];
    for (let i = 87; i <= 100; i++) {
        const elementSelector = `#component-${i} > div.wrapper.svelte-nab2ao > div > div > div.message-row.bubble.bot-row.svelte-1pjfiar > div.message.bot.svelte-1pjfiar.message-bubble-border > button > span`;

        const elementText = await page.evaluate((selector) => {
            const element = document.querySelector(selector);
            return element ? element.textContent.trim() : null;
        }, elementSelector);
        elementsToCopy.push(elementText);
    }

    // Output the copied text
    console.log('Copied Text:', elementsToCopy);

    // Close the browser
    await browser.close();
})();
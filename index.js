const express = require('express');
const puppeteer = require('puppeteer');

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/scrape', async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).send('Please provide a URL parameter. Example: /scrape?url=https://example.com');
  }

  let browser = null;
  try {
    // These arguments are crucial for running Puppeteer on Render
    browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--single-process'
      ]
    });

    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });

    // Example: Scrape the page title
    const pageTitle = await page.title();
    
    res.status(200).json({ title: pageTitle });

  } catch (error) {
    console.error(error);
    res.status(500).send('Something went wrong while scraping.');
  } finally {
    if (browser) {
      await browser.close();
    }
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
import * as express from 'express';
import { controller, request, httpPost } from 'inversify-express-utils';

const puppeteer = require('puppeteer');

@controller('/')
class PuppeteerController {
  @httpPost('/')
  public async index(
    @request() req: express.Request
  ) {
    const browser = await puppeteer.launch({
      executablePath: process.env.CHROME_BIN || null,
      args: ['--no-sandbox','--headless','--disable-gpu'],
      ignoreHTTPSErrors: true,
    });
    const page = await browser.newPage();
    page.setExtraHTTPHeaders({'pdf-parser-token': process.env.PDF_PARSER_TOKEN});

    const url = req.body.url

    console.log( 'Requested page ' + url );

    await page.goto(url, { waitUntil: 'networkidle2' });
    const ret = await page.pdf({
      format: 'A4',
      scale: 0.8,
    });

    await browser.close();

    console.log( 'Served PDF from ' + url + ' with length ' + ret.length );

    return ret;
  }
}
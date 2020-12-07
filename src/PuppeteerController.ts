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

    const { url, callback, headers, waitForId, waitForFunction, waitSeconds } = req.body;

    if ( headers && Object.keys(headers).length > 0 ) {
      Object.entries(headers).map(([key,value]) => {
        const obj = {};
        obj[key] = value;

        page.setExtraHTTPHeaders(obj);
      });
    }

    console.log( 'Requested page ' + url );

    await page.goto(url, { waitUntil: 'networkidle2' });

    if ( callback ) {
      await page.evaluate( callback => {
        eval(callback);
      }, callback );
    }

    if ( waitForId ) {
      await page.waitForFunction( `document.getElementById("${waitForId}").innerText.length > 0` );
    }

    if ( waitForFunction ) {
      await page.waitForFunction( waitForFunction );
    }

    if ( waitSeconds ) {
      await page.waitFor( waitSeconds * 1000 );
    }

    const ret = await page.pdf({
      format: 'A4',
      scale: 0.8,
    });

    await browser.close();

    console.log( 'Served PDF with parameters ' + JSON.stringify( req.body ) );

    return ret;
  }
}
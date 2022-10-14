import express from 'express';
import fetch from 'node-fetch';
import parser from 'node-html-parser';
import * as fs from 'node:fs/promises';
var router = express.Router();

/* GET users listing. */
router.get('/v1', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/urls/preview', async function(req, res, next) {
    const url = req.query.url;
    try {
        const webPageData = await fetch(url);
        const webPageString = await webPageData.text();
        const webPageHTML = parser.parse(webPageString);
        const ogURL = webPageHTML.querySelector('meta[property="og:url"]');
        let ogSiteName= webPageHTML.querySelector('meta[property="og:sitename"]');
        const ogIMG = webPageHTML.querySelector('meta[property="og:image"]');
        let ogTitle = webPageHTML.querySelector('meta[property="og:title"]');
        const ogDesc = webPageHTML.querySelector('meta[property="og:description"]');
        const anchor = (ogURL ? `<a href="${ogURL.attributes.content}">`:`<a href="${url}">`)
        const img = (ogIMG ? `<img src="${ogIMG.attributes.content}" style="max-height: 200px; max-width: 270px;">`:``)
        const desc = (ogDesc ? `<p>${ogDesc.attributes.content}</p>`:``)
        if (!ogTitle) {
            ogTitle = webPageHTML.querySelector('title');
            ogTitle = `<p><strong>${ogTitle.innerText}</strong></p>`
            if (!ogTitle) {
                ogTitle = url;
            }
        } else {
            ogTitle = `<p><strong>${ogTitle.attributes.content}</strong></p>`
        }
        if (!ogSiteName) {
            ogSiteName = webPageHTML.querySelector('meta[name="Author"]');
            if (!ogSiteName) {
                ogSiteName = undefined;
            } 
        }
        const SiteName = (ogSiteName ? `<h2>${ogSiteName.attributes.content}</h2>`: ``)
        
        const htmlRes = `
        <div style='max-width: 300px; border: solid 1px; padding: 3px; text-align: center;'>
            ${anchor}${SiteName}${ogTitle}${img}${desc}</a>
        </div>`
        res.type('txt');
        res.send(htmlRes);
    } catch (err) {
        res.type('txt');
        res.send(err);
    }

  });


export default router;
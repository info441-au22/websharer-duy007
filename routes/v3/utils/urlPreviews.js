
import fetch from 'node-fetch';
import * as cheerio from 'cheerio';
import parser from 'node-html-parser';

const escapeHTML = str => str.replace(/[&<>'"]/g, 
  tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag]));

async function getURLPreview(url){
  // TODO: Copy from your code for making url previews in A2 to make this 
  // a function that takes a url and returns an html string with a preview of that html
  try {
        const webPageData = await fetch(url);
        const webPageString = await webPageData.text();
        const webPageHTML = parser.parse(webPageString);
        // const ogURL = webPageHTML.querySelector('meta[property="og:url"]');
        // let ogSiteName= webPageHTML.querySelector('meta[property="og:sitename"]');
        // const ogIMG = webPageHTML.querySelector('meta[property="og:image"]');
        // let ogTitle = webPageHTML.querySelector('meta[property="og:title"]');
        // const ogDesc = webPageHTML.querySelector('meta[property="og:description"]');
        const og = webPageHTML.querySelectorAll('meta[property^="og:"]');
        const ogURL = og.filter(meta => meta.attributes.property.includes("url")).pop();
        const ogIMG = og.filter(meta => meta.attributes.property.match(/image$/)).pop();
        let ogSiteName = og.filter(meta => meta.attributes.property.includes("sitename")).pop();
        let ogTitle = og.filter(meta => meta.attributes.property.includes("title")).pop();
        const ogDesc = og.filter(meta => meta.attributes.property.includes("description")).pop();
        // const anchor = (ogURL ? `<a href="${ogURL.attributes.content}" >` : `<a href="${url}" >`);
        // let achor = {};
        const htmlString = `
        <div style='max-width: 300px; border: solid 1px; padding: 3px; text-align: center;'>
            <h2 class="siteName"></h2>
            <a class="siteURL" href="">
                <p class="siteTitle"><strong></strong></p>
            </a>
            <img class="siteIMG" src="" style="max-height: 200px; max-width: 270px;>
            <p class="siteDesc"></p>
        </div>`
        let parsedHTML = cheerio.load(htmlString)
        if (ogURL) {
            parsedHTML("a.siteURL").attr('href', escapeHTML(ogURL.attributes.content));
        } else {
            parsedHTML("a.siteURL").attr('href', url);
        }
        if (ogIMG) {
            parsedHTML("img.siteIMG").attr('src', escapeHTML(ogIMG.attributes.content));
        } else {
            parsedHTML("img.siteIMG").remove();
        }
        if (ogDesc) {
            parsedHTML("p.siteDesc").text(ogDesc.attributes.content)
        } else {
            parsedHTML("p.siteDesc").remove();
        }
        // const img = (ogIMG ? `<img src="${ogIMG.attributes.content}" style="max-height: 200px; max-width: 270px;">` : ``);
        // const desc = (ogDesc ? `<p>${ogDesc.attributes.content}</p>` : ``);
        if (!ogTitle) {
            ogTitle = webPageHTML.querySelector('title');
            if (!ogTitle) {
                ogTitle = url;
            } else {
                ogTitle = ogTitle.innerText;
            }
        } else {
            ogTitle = ogTitle.attributes.content;
        }
        parsedHTML("p.siteTitle > strong").text(ogTitle)
        if (!ogSiteName) {
            ogSiteName = webPageHTML.querySelector('meta[name="Author"]');
        } 
        if (!ogSiteName) {
            parsedHTML("h2.siteName").remove();
        } else {
            parsedHTML("h2.siteName").text(ogSiteName.attributes.content)
        }
        // const SiteName = (ogSiteName ? `<h2>${ogSiteName.attributes.content}</h2>` : ``);

        // const htmlRes = `
        // <div style='max-width: 300px; border: solid 1px; padding: 3px; text-align: center;'>
        //     ${anchor}${SiteName}${ogTitle}</a>
        // </div>`;
        return parsedHTML.html();;
  } catch (err) {
        return err.message;
  }

}

export default getURLPreview;


import axios from 'axios';
import cheerio from 'cheerio';
import url from 'url';

async function getTextFromURL(targetUrl: string): Promise<string> {
    const { data } = await axios.get(targetUrl);
    const $ = cheerio.load(data);
    let text = $('body').text();
    text = text.replace(/\s\s+/g, ' ');
    text = text.trim();
    return text;
}

async function getLinksFromURL(targetUrl: string, baseUrl: string): Promise<string[]> {
    const { data } = await axios.get(targetUrl);
    const $ = cheerio.load(data);
    const links: string[] = [];
    $('a').each((i, link) => {
        const href = $(link).attr('href');
        if (href) {
            // Resolve relative links
            links.push(url.resolve(baseUrl, href));
        }
    });
    return links;
}

export async function crawlWebsite(startUrl: string, baseUrl: string): Promise<{ url: string, text: string }[]> {
    const visitedLinks: Set<string> = new Set();
    const texts: { url: string, text: string }[] = [];

    async function crawlPage(pageUrl: string) {
        if (visitedLinks.has(pageUrl)) {
            return;
        }

        console.log(`Crawling ${pageUrl}`);
        visitedLinks.add(pageUrl);

        // Extract and store text
        const text = await getTextFromURL(pageUrl);
        texts.push({ url: pageUrl, text });

        // Extract links and crawl each one
        const links = await getLinksFromURL(pageUrl, baseUrl);
        for (const link of links) {
            await crawlPage(link);
        }
    }

    await crawlPage(startUrl);
    return texts;
}

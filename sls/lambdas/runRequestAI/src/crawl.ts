import axios from 'axios';
import cheerio from 'cheerio';

export async function crawl(url: string): Promise<string> {
  const { data } = await axios.get(url);
  const $ = cheerio.load(data);
  let text = $('body').text();
  // Replace anything within angled brackets, which should remove residual HTML tags
  text = text.replace(/<[^>]*>/g, '');
  // Replace multiple whitespaces, line breaks, and tabs with a single space
  text = text.replace(/\s\s+/g, ' ');
  // Trim leading and trailing spaces
  text = text.trim();
  return text;
}

// Define the initial URL to start crawling
// const initialUrl = 'https://noaa.gov';

// Set of visited URLs to avoid revisiting the same page
// const visitedUrls: Set<string> = new Set();

// Function to crawl a URL and extract plain text
// export async function crawl(url: string): Promise<string> {
//   return new Promise<string>(async (resolve, reject) => {
//     // Avoid revisiting the same page
//     if (visitedUrls.has(url)) {
//       resolve('');
//       return;
//     }

//     // Mark the URL as visited
//     visitedUrls.add(url);

//     try {
//       const response = await axios.get(url);
//       const html = response.data;
//       const $ = cheerio.load(html);

//       // Extract plain text from the page
//       const plainText = $('body').text();

//       // Extract URLs from the page and crawl them recursively
//       const links = $('a');
//       const crawlPromises: Promise<string>[] = [];
//       links.each((index, element) => {
//         const linkUrl = $(element).attr('href');
//         if (linkUrl) {
//           // Resolve relative URLs
//           const absoluteUrl = new URL(linkUrl, url).href;
//           // Recursively crawl the discovered URL and collect the promises
//           crawlPromises.push(crawl(absoluteUrl));
//         }
//       });

//       // Wait for all the recursive crawl promises to resolve
//       const results = await Promise.all(crawlPromises);

//       // Concatenate all the plain text results and resolve the promise
//       const allPlainText = [plainText, ...results].join(' ');
//       resolve(allPlainText);
//     } catch (error) {
//       reject(error);
//     }
//   });
// }

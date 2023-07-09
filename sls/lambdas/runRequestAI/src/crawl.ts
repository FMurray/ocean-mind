// import axios from 'axios';
// import cheerio from 'cheerio';

// Define the initial URL to start crawling
const initialUrl = 'https://noaa.gov';
console.log(initialUrl)

// Set of visited URLs to avoid revisiting the same page
// const visitedUrls: Set<string> = new Set();

// // Function to crawl a URL
// async function crawl(url: string): Promise<void> {
//   // Avoid revisiting the same page
//   if (visitedUrls.has(url)) {
//     return;
//   }

//   // Mark the URL as visited
//   visitedUrls.add(url);

//   try {
//     const response = await axios.get(url);
//     const html = response.data;
//     const $ = cheerio.load(html);

//     // Extract the desired information from the page using Cheerio selectors
//     const title = $('h1').text();
//     console.log('Title:', title);

//     // Extract URLs from the page and crawl them recursively
//     const links = $('a');
//     links.each((index, element) => {
//       const linkUrl = $(element).attr('href');
//       if (linkUrl) {
//         // Resolve relative URLs
//         const absoluteUrl = new URL(linkUrl, url).href;
//         // Recursively crawl the discovered URL
//         crawl(absoluteUrl);
//       }
//     });
//   } catch (error) {
//     console.error('Error:', error);
//   }
// }

// // Start crawling from the initial URL
// crawl(initialUrl)
//   .then(() => {
//     console.log('Crawling completed.');
//   })
//   .catch((error) => {
//     console.error('Error:', error);
//   });

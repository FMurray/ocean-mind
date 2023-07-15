# Working Backwards 

## Who is the customer and what insights do we have about them? 

Our primary customers are NOAA and NOAA-affiliated data producers and consumers, including researchers, policy makers, and the public. These customers are looking for a more efficient and user-friendly way to extract insights from the vast amount of data available.

Our insights reveal that these customers often struggle with the discoverability of data due to its complex nature and the technical expertise required to navigate and interpret it. The data is spread across various organizational hierarchies (Department, Agency, Bureau) and across different formats, making it even more challenging to access and understand.

Furthermore, we've identified that existing technologies like ElasticSearch, while powerful, may not be the most suitable for a government setting due to the need for dedicated engineers and maintainers. This presents an opportunity for us to leverage emerging technologies like AI/LLMs and Data Lakes to provide a more accessible and cost-effective solution.

In particular, we've learned from our stakeholder interviews that there is a need for a tool that can provide customized information based on the user's comprehension level. This insight is particularly valuable as it highlights the need for a solution that can cater to a wide range of users, from experts to the general public.

## What is the prevailing customer problem or opportunity? 

Discoverability of data on NOAA is very difficult. 

Existing technologies like ElasticSearch are fundamentally designed for organizations with a dedicated engineers and maintainers, and may not be the appropriate choices for a government setting. There is an opportunity to leverage emerging technologies, including AI/LLMs and Data Lakes to provide next-generation capabilities while decreasing total operating cost (TOC) with less need dedicated technical resources.

Two emerging technological solutions in particular can make this a solvable problem at scale: 

### Data Lake Architecture

Data lakes provide a single repository for all types of data/metadata including Structured (Databases, integrated provider data like NCEI), Semi-Structured (CSV, JSON, XML), and Unstructured (Text, Image) data. 

### Vector Stores / Retrieval Augmented Generation 

Due to the nature of LLMs like GPT-4 which are trained on a finite corpus of data, specific datasets like NOAA data, or organization specific data don't exist in the LLM's knowledge base. The emerging method of Retrieval Augmented Generation allows us to vectorize our data sources (convert them into numeric values), and search them based on semantic similarity. For example if a research organization like [NANOOS](https://www.nanoos.org/) vectorizes their research papers, metadata, website content, etc. a question like "who is producing data about waves in the Pacific Northwest?" can be used to fetch some number of relevant documents from the vector store. Those documents then an be used in the construction of an LLM prompt to have the LLM provide answers specific to the previously unknown data. 

## What is the solution and what is the most important customer benefit? 

The solution is an AI-powered Language Model (LLM) that can understand and interpret the vast amount of data NOAA has. This LLM will be able to answer queries in natural language, making it easier for both researchers and the public to access and understand the data.

The most important customer benefit is the ease of access and understanding of the data. Currently, the data is difficult to navigate and understand, especially for non-experts. With the LLM, anyone can ask a question and get an answer in a language they understand. This will democratize access to the data and make it easier for researchers to perform their analysis.

## How do we describe the solution/experience to the customer?

We are developing an AI-powered tool that will revolutionize the way you interact with NOAA's data. Imagine being able to ask a question like "What is the average sea surface temperature in the Pacific Ocean for the last 10 years?" and getting an immediate, accurate answer in plain English. No more navigating through complex databases or trying to interpret scientific jargon. Our tool will do the heavy lifting for you, making it easier for you to get the information you need. 

## How do we test the solution with customers and measure success? 

We will start by testing the solution with a small group of users, including researchers and members of the public. We will collect feedback on the accuracy of the answers, the ease of use of the tool, and the overall user experience.

Success can be measured in several ways:

1. User Satisfaction: Through surveys and interviews, we can measure how satisfied users are with the tool.
2. Usage Metrics: We can track how often the tool is used and for what types of queries.
3. Impact on Research: By interviewing researchers, we can understand how the tool has impacted their work. Has it made it easier for them to perform their analysis? Has it saved them time?
4. Public Engagement: We can measure how the tool has increased public engagement with NOAA's data. Are more people accessing the data? Are they asking more questions?
5. Compliance: Ensure the solution complies with all relevant rules and policies in a government setting.


By measuring these metrics, we can understand how successful the tool is and where improvements need to be made.
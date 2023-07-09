import * as dotenv from "dotenv";
import { OpenAI } from "langchain";
import { PromptTemplate, LLMChain } from "langchain";
import { BufferMemory } from "langchain/memory";
import { ConversationChain } from "langchain/chains";
import { DynamoDBChatMessageHistory } from "langchain/stores/message/dynamodb";
import { crawl } from "./crawl.ts";
const allowOrigin = "https://ocean-mind.ai";

dotenv.config();

export const handler: any = async (
  event: any): Promise<any> => {
  console.log(event);

  let payload: { agency: string; message: string } = { agency: '', message: '' };

  if (typeof event.body === 'string') {
    try {
      payload = JSON.parse(event.body);
    } catch (error) {
      // Handle parsing error
      console.error('Error parsing event body:', error);
      const response = {
        statusCode: 400,
        body: 'Invalid request body',
        "Access-Control-Allow-Origin": allowOrigin,
      };
      return response;
    }
  } else {
    payload = event.body;
  }

  // Ensure payload has the expected structure
  const { agency, message } = payload;
  console.log(`inputs ${agency}, ${message}`);

  const model = new OpenAI({
    modelName: "gpt-3.5-turbo",
    openAIApiKey: process.env.OPENAI_API_KEY,
    temperature: 0.6
  });

  const date = new Date();
  const year = date.getFullYear().toString();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');

  const formattedDate = `${year}-${month}-${day}`;
  console.log(formattedDate);

  const memory = new BufferMemory({
    chatHistory: new DynamoDBChatMessageHistory({
      tableName: "langchain",
      partitionKey: "id",
      sessionId: new Date().toISOString(),
      // sessionId: formattedDate, // Or some other unique identifier for the conversation
      config: {
        region: "us-east-1"
      },
    }),
  });

  /**
   * Template prompt chain
   */
  // const template = "Tell me something about this agency {agency}?";
  // const prompt = new PromptTemplate({
  //   template: template,
  //   inputVariables: ["agency"],
  // });
  // const chain = new LLMChain({ llm: model, prompt: prompt, memory: memory });
  // const resChain = await chain.call({ agency });
  // console.log(resChain);

  /**
   * Call input from message 
   */
  // const chain = new ConversationChain({ llm: model, memory });
  // const conversationChain = await chain.call({ input: message });
  // console.log({ conversationChain });


  const getSitesMessage = 'What are 3 different impactful environmental agency websites. Please return a valid json with an array called environmentalAgencies of name, urls, and descriptions';
  const chain = new ConversationChain({ llm: model, memory });
  const conversationChain = await chain.call({ input: getSitesMessage });
  console.log(`conversation response ${conversationChain.response}`)

  const parsedArray = parseArrayFromText(conversationChain.response);
  console.log(parsedArray);

  console.log('About to crawl this url', parsedArray[0].url)

  // Start crawling from the initial URL
  let plainText = ''
  try {
    // const plainText = await crawl(parsedArray[0].url);
    plainText = await crawl(parsedArray[0].url);
    console.log(`plainText: ${plainText}`)
  } catch (err) {
    console.log('error crawling...')
    console.error(err);
  }

  const template = `From this site ${parsedArray[0].url} I've scraped this info \"\"{text}\"\". Please write 5 captivating tweets that include the url in the response`;
  const prompt = new PromptTemplate({
    template: template,
    inputVariables: ["text"],
  });

  const chain2 = new LLMChain({ llm: model, prompt: prompt, memory: memory });
  const tempChain = await chain2.call({ text: plainText });

  console.log(tempChain);

  console.log('returning back')
  const response = {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": allowOrigin,
    },
    body: JSON.stringify(tempChain),
  };

  return response;
};


function parseArrayFromText(textBody: string) {
  // Regular expression pattern to match the array within the text
  const arrayPattern = /\[([\s\S]*?)\]/;

  // Extract the array from the text using the regular expression
  const arrayMatch = textBody.match(arrayPattern);

  if (arrayMatch) {
    // Get the matched array string
    const arrayString = arrayMatch[0];
    console.log(`arrayString ${arrayString}`)

    // Check the type of arrayString
    if (typeof arrayString === 'string') {
      console.log('Is type string!')
      const isValid = isValidJSON(arrayString);
      console.log('Is Valid JSON:', isValid);
      // Parse the array string into a JavaScript object
      const parsedArray = JSON.parse(arrayString);

      return parsedArray;
    } else if (Array.isArray(arrayString)) {
      console.log('Is type any array!')

      // Return the array as is since it's already parsed
      return arrayString;
    }
  } else {
    return null; // Return null if no array is found in the text
  }
}

function isValidJSON(jsonString: string) {
  try {
    JSON.parse(jsonString);
    return true;
  } catch (error) {
    return false;
  }
}
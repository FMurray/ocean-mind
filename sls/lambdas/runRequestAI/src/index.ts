import * as dotenv from "dotenv";
import { OpenAI  } from "langchain";
// import { OpenAI, PromptTemplate, LLMChain } from "langchain";
import { BufferMemory } from "langchain/memory";
import { ConversationChain } from "langchain/chains";
import { DynamoDBChatMessageHistory } from "langchain/stores/message/dynamodb";
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

  const memory = new BufferMemory({
    chatHistory: new DynamoDBChatMessageHistory({
      tableName: "langchain",
      partitionKey: "id",
      sessionId: formattedDate, // Or some other unique identifier for the conversation
      config: {
        region: "us-east-1"
      },
    }),
  });

  // Template prompt chain
  // const template = "Tell me something about this agency {agency}?";
  // const prompt = new PromptTemplate({
  //   template: template,
  //   inputVariables: ["agency"],
  // });
  // const chain = new LLMChain({ llm: model, prompt: prompt, memory: memory });
  // const resChain = await chain.call({ agency });
  // console.log(resChain);

  const chain = new ConversationChain({ llm: model, memory });
  const conversationChain = await chain.call({ input: message });
  console.log({ conversationChain });

  console.log('returning back')

  const response = {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": allowOrigin,
    },
    body: JSON.stringify(conversationChain),
  };

  return response;
};

import * as dotenv from "dotenv";
import { OpenAI, PromptTemplate, LLMChain } from "langchain";
const allowOrigin = "https://ocean-mind.ai";

dotenv.config();

export const handler: any = async (
  event: any): Promise<any> => {
  console.log(event);

  let payload: { agency: string } = {agency: ''};

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
  const { agency } = payload;

  const model = new OpenAI({
    modelName: "gpt-3.5-turbo",
    openAIApiKey: process.env.OPENAI_API_KEY,
    temperature: 0.9
  });

  const template = "Tell me something about this agency {agency}?";

  const prompt = new PromptTemplate({
    template: template,
    inputVariables: ["agency"],
  });

  const chain = new LLMChain({ llm: model, prompt: prompt });

  const resChain = await chain.call({ agency });

  console.log(resChain);

  console.log('returning back')

  const response = {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": allowOrigin,
    },
    body: JSON.stringify(resChain),
  };
  
  return response;
};

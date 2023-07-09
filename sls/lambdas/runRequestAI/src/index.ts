import * as dotenv from "dotenv";
import { OpenAI } from "langchain";
const allowOrigin = "https://ocean-mind.ai";


dotenv.config();

export const handler: any = async (
  event: any,
  context: any,
  callback: any
): Promise<void> => {
  console.log(event);
  console.log(context);

  const payload: { message: string } = event.body;

  if (payload && !payload.message) {
    const error = new Error("email, name");

    const response = {
      statusCode: 400,
      body: event.body,
      "Access-Control-Allow-Origin": allowOrigin,
    };
    callback(null, response);
    throw error;
  }

  const model = new OpenAI({
    modelName: "gpt-3.5-turbo",
    openAIApiKey: process.env.OPENAI_API_KEY,
  });

  console.log(`payload.message: ${payload.message}`)

  const res = await model.call(
    "Tell me something about NOAA?"
  );
  console.log(res);

  event.body = {
    ...event.body,
    res,
  };

  const response = {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": allowOrigin,
    },
    body: event.body,
  };
  callback(null, response);
};

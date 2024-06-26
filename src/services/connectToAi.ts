//const { GoogleGenerativeAI } = require("@google/generative-ai");
import {GoogleGenerativeAI} from '@google/generative-ai'
import { UserFitnessData } from '../components/activity/allActivities';

// Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_API_KEY ?? '');

export const connectToAi = async (userFitnessData: UserFitnessData) => {
    console.log(import.meta.env.VITE_API_KEY, 'process.env.VITE_API_KEY')
  // The Gemini 1.5 models are versatile and work with both text-only and multimodal prompts
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});

  // TODO: get running goal from user, pass it to this function and insert the data to the query below.
  // TODO: determine user's fitness level based on moveMinuets ans heartPoints and insert the data to the query below.
  const prompt = `Help me make a running training plan. my goal is to run 6 km in under 24 minutes in a race 3
  months from now. Im a ${userFitnessData.gender}, beginner runner, my weight is ${userFitnessData.weight} kg, and my height is ${userFitnessData.height} cm. please format the
  response to json with a full array of training days`

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  return text;
}

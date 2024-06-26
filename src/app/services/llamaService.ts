import { ChatOllama } from '@langchain/community/chat_models/ollama';
import { InMemoryChatMessageHistory } from "@langchain/core/chat_history";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { RunnableWithMessageHistory } from "@langchain/core/runnables";
import { AdhdEvent, eventType } from '../types/types';


export class LlamaService {
    private model: ChatOllama;
    // @ts-ignore
    private withMessageHistory: RunnableWithMessageHistory;

    constructor(baseUrl: string) {
        this.model = new ChatOllama({
            baseUrl: baseUrl,
            model: 'llama2',
        });

        const prompt = ChatPromptTemplate.fromMessages([
            [
                "system",
                `You are generating a notification for a child with ADHD playing
                 a video game. The notifications should only be one short 
                 sentence long (maximum of 10 words) and should be playful
                  and can include emojis. They are intended to increase the 
                  child's motivation and engagement with the game. Use the 
                  information provided to tailor the message appropriately.`,
            ],
            ["human", "Current Game played: {game}, State of the child: {event}"],
        ]);

        const chain = prompt.pipe(this.model);

        const messageHistories: Record<string, InMemoryChatMessageHistory> = {};

        this.withMessageHistory = new RunnableWithMessageHistory({
            runnable: chain,
            getMessageHistory: async (sessionId) => {
                if (!messageHistories[sessionId]) {
                    messageHistories[sessionId] = new InMemoryChatMessageHistory();
                }
                return messageHistories[sessionId];
            },
            inputMessagesKey: "input",
            historyMessagesKey: "chat_history",
        });
    }

    async generateResponse(event: string, game: string, sessionId: string): Promise<string> {
        const config = {
            configurable: {
                sessionId: sessionId,
            },
        };

        try {
            const stream = await this.withMessageHistory.stream(
                {
                    game: game,
                    event: eventType[Number(event)],
                },
                config
            );

            let response = '';
            for await (const chunk of stream) {
                response += chunk.content;
            }

            // Truncate response to one sentence with a maximum of 20 words
            response = this.truncateToOneSentence(response);

            console.log('Streaming response finished.');
            console.log('Response:', response);
            return response;
        } catch (error) {
            console.error('Error generating response:', error);
            throw new Error('Failed to generate response');
        }
    }
    private truncateToOneSentence(response: string): string {
        const sentences = response.match(/[^.!?]*[.!?]/g) || [response];
        let truncatedResponse = sentences[0].trim();

        const words = truncatedResponse.split(' ');
        if (words.length > 20) {
            truncatedResponse = words.slice(0, 15).join(' ') + '...';
        }

        return truncatedResponse;
    }
}

export default LlamaService;

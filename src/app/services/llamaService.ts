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
                `You are generating a notification for a child with ADHD playing a video game. The notifications should only be one sentence long and should be playful and can include emojis. They are intended to increase the child's motivation and engagement with the game. Use the information provided to tailor the message appropriately.`,
            ],
            ["human", "Game played: {game}, Reason for notification: player is {event}"],
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

    async generateResponse(adhdEvent: AdhdEvent): Promise<string> {
        const config = {
            configurable: {
                sessionId: adhdEvent.sessionId,
            },
        };

        try {
            const stream = await this.withMessageHistory.stream(
                {
                    game: adhdEvent.game,
                    event: adhdEvent.eventType.toString(),
                },
                config
            );

            let response = '';
            for await (const chunk of stream) {
                response += chunk.content;
            }

            console.log('Streaming response finished.');
            console.log('Response:', response);
            return response;
        } catch (error) {
            console.error('Error generating response:', error);
            throw new Error('Failed to generate response');
        }
    }
}

export default LlamaService;

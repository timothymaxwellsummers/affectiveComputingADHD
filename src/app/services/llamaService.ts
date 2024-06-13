import { ChatOllama } from '@langchain/community/chat_models/ollama';
import { InMemoryChatMessageHistory } from "@langchain/core/chat_history";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { RunnableWithMessageHistory } from "@langchain/core/runnables";

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
                `You are genrating a notification for a child with ADHD playing a video game. The notifications should only be one sentence. They are intended to increase the child's motivation and engagement with the game.`,
            ],
            ["human", "Game: {game}, Emotion: {emotion}, EmotionScore: {emotionScore}"],
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

    async generateResponse(sessionId: string, game: string, emotion: string, emotionScore: number): Promise<string> {
        const config = {
            configurable: {
                sessionId,
            },
        };

        try {
            const stream = await this.withMessageHistory.stream(
                {
                    game: game,
                    emotion: emotion,
                    emotionScore: emotionScore,
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

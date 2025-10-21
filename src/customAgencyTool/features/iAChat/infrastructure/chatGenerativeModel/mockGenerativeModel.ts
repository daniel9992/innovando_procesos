import type { GenerateContentStreamResult, GenerativeModel } from 'firebase/ai';

interface MockStreamConfig {
    delay?: number;
    chunkSize?: number;
    shouldFail?: boolean;
    errorMessage?: string;
}

export class MockGenerativeModel implements Partial<GenerativeModel> {
    private defaultConfig: MockStreamConfig = {
        delay: 200,
        chunkSize: 3,
        shouldFail: false,
        errorMessage: 'Mock stream error'
    };

    constructor(private config: MockStreamConfig = {}) {
        this.config = { ...this.defaultConfig, ...config };
    }

    async generateContentStream(
        prompt: string | string[]
    ): Promise<GenerateContentStreamResult> {
        if (this.config.shouldFail) {
            throw new Error(this.config.errorMessage);
        }

        // Simular un stream de respuesta
        const justPrompt = Array.isArray(prompt) ? prompt[0] : prompt;
        const mockResponse = this.createMockResponse(justPrompt);
        const stream = this.createMockStream(mockResponse);

        // inlineDataParts: () => InlineDataPart[] | undefined;
        // export declare interface InlineDataPart {
        //     text?: never;
        //     inlineData: GenerativeContentBlob;
        //     functionCall?: never;
        //     functionResponse?: never;
        //     /**
        //      * Applicable if `inlineData` is a video.
        //      */
        //     videoMetadata?: VideoMetadata;
        // }

        // functionCalls: () => FunctionCall[] | undefined;
        // export declare interface FunctionCall {
        //     name: string;
        //     args: object;
        // }
        return {
            response: Promise.resolve({
                text: () => mockResponse,
                inlineDataParts: () => [],
                functionCalls: () => []
            }),
            stream
        };
    }

    private async *createMockStream(text: string): AsyncGenerator<any> {
        const chunks = this.splitIntoChunks(text, this.config.chunkSize || 3);

        for (const chunk of chunks) {
            await this.delay(this.config.delay || 100);
            yield {
                text: () => chunk,
                role: 'model',
                parts: [{ text: chunk }]
            };
        }
    }

    private splitIntoChunks(text: string, size: number): string[] {
        const chunks: string[] = [];
        for (let i = 0; i < text.length; i += size) {
            chunks.push(text.slice(i, i + size));
        }
        return chunks;
    }

    private delay(ms: number): Promise<void> {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    private createMockResponse(prompt: string): string {
        console.log('createMockResponse', prompt);

        if (prompt === 'error') {
            throw new Error(this.config.errorMessage);
        }

        // Puedes personalizar las respuestas según el prompt
        const responses: { [key: string]: string } = {
            hello: 'Hello! How can I help you today?',
            test: 'This is a test response from the mock model.',
            error: 'Error simulation',
            default: `Mock response for: ${prompt}`,
            longtext: `
Officia aute sunt id velit ullamco Lorem cupidatat sunt. Magna aute id laborum magna ea amet. Exercitation aliquip quis enim minim id dolore officia veniam dolor aliquip cupidatat. Adipisicing amet nisi voluptate dolor nostrud eu duis. Voluptate dolore voluptate deserunt incididunt irure fugiat aute. Reprehenderit sit nisi labore nisi eu ipsum mollit aute duis sit elit incididunt. Duis pariatur labore deserunt commodo officia aliquip mollit.

Consectetur eu consequat culpa magna Lorem ut consectetur Lorem tempor adipisicing sunt. Nisi minim elit aute veniam. Proident id fugiat aute quis fugiat occaecat. Quis reprehenderit quis anim duis magna deserunt irure nisi sunt non enim in consequat ea. Commodo nisi adipisicing eu cillum velit aliquip fugiat commodo eu ullamco. Lorem quis velit dolor anim et. Nisi eiusmod nulla nostrud eu qui voluptate ad aliquip mollit aute pariatur ad.

Officia cillum ad dolore cillum veniam reprehenderit eiusmod do veniam qui. Dolore nisi incididunt Lorem duis aliquip sit labore eu cupidatat ex. Ullamco quis aute consectetur laboris veniam non ut sunt officia id id veniam Lorem duis. Sit est anim sunt velit laborum voluptate non eu incididunt.

Lorem eu quis adipisicing adipisicing esse fugiat mollit deserunt ad. Aute adipisicing veniam incididunt eiusmod laboris amet velit nostrud magna culpa. Elit et anim incididunt Lorem nisi magna irure ea Lorem.

Esse aliqua eu aliquip reprehenderit ad ad minim exercitation est ipsum cupidatat minim. Ipsum dolor qui laborum tempor magna. Dolor tempor et commodo eiusmod id quis incididunt adipisicing. Laboris ut laboris duis magna fugiat reprehenderit cillum. Ullamco ex minim sint ullamco laboris tempor eu. Officia quis veniam mollit duis quis exercitation proident quis nostrud.

Aute labore nulla sit elit elit fugiat ea quis aute laboris proident eiusmod ex. Do excepteur irure laborum culpa Lorem laboris labore. In excepteur velit ipsum sunt enim occaecat reprehenderit consequat laborum anim elit amet reprehenderit. Tempor adipisicing enim Lorem in eu ea duis consectetur consectetur consectetur. Incididunt aliquip irure dolore adipisicing aliquip pariatur ut.

Occaecat anim voluptate officia dolore culpa Lorem cupidatat. Laboris duis fugiat ipsum culpa dolore aute esse proident incididunt quis veniam sit. Ad commodo duis incididunt occaecat aliquip ullamco exercitation ad aliquip voluptate magna elit occaecat. Sint duis quis ea veniam ea dolor. Dolore amet consectetur sunt minim Lorem occaecat in deserunt anim mollit. Veniam exercitation duis dolore dolor. Cillum amet aliqua consectetur enim enim duis duis do minim irure cillum eu veniam amet.

Est voluptate occaecat laboris id incididunt laboris adipisicing laborum. Ad deserunt non non commodo velit cupidatat aute esse consequat et id incididunt aute. Irure reprehenderit aliquip ut aute ipsum laboris nulla irure et Lorem quis anim excepteur magna. Ex ex pariatur ex cupidatat voluptate sunt ea mollit tempor Lorem. Veniam adipisicing labore quis Lorem labore. Non pariatur proident sit sunt deserunt.

Minim Lorem nulla ad esse dolor fugiat nostrud excepteur labore laborum enim labore. Exercitation non non elit officia dolor velit esse fugiat consequat commodo elit eiusmod magna. Tempor laboris adipisicing do ullamco incididunt nisi in nostrud. Id irure ut amet non duis nostrud sunt. Lorem occaecat eiusmod velit enim adipisicing ut laboris Lorem ad anim in pariatur eu laboris.

Eiusmod enim aliqua do ad exercitation occaecat proident adipisicing in dolor sunt ipsum. Qui aute aute ullamco qui labore ex tempor voluptate incididunt culpa dolore labore eiusmod. Consectetur mollit tempor consequat ut nostrud dolor sunt do. Qui anim mollit tempor cupidatat pariatur labore aliquip mollit fugiat. Est nostrud consequat adipisicing laborum nostrud mollit magna do et non duis commodo aliqua in. Pariatur tempor incididunt sunt magna cillum cupidatat laborum ad elit. Culpa aute eu culpa deserunt voluptate incididunt.`,
            markdown: `## Watch this video

https://youtu.be/enTFE2c68FQ

https://www.youtube.com/watch?v=enTFE2c68FQ

These links showcase a video about React basics. You can click on either link to watch the video.`
        };

        return responses[prompt.toLowerCase()] || responses.default;
    }
}

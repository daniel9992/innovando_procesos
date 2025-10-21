import type {
    IAIStreamService,
    IStartStream
} from './IChatGenerativeModelRepository';

export interface IStreamUseCase {
    execute(pargs: IStartStream): Promise<void>;
}

export class StartStreamUseCase implements IStreamUseCase {
    constructor(private service: IAIStreamService) {}

    async execute(args: IStartStream): Promise<void> {
        await this.service.startStream(args);
    }
}

export class StopStreamUseCase {
    constructor(private service: IAIStreamService) {}

    execute(): void {
        this.service.stopStream();
    }
}

export class RefreshStreamUseCase implements IStreamUseCase {
    constructor(private service: IAIStreamService) {}

    async execute(): Promise<void> {
        await this.service.refreshStream();
    }
}

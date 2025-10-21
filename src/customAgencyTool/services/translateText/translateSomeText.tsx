import { ReduxStatus } from '@src/customAgencyTool/constants/reduxConstants';
import { htmlNumberToSymbol } from '@src/customAgencyTool/utils/stringUtils/htmlNumberToSymbol';
import axios, { AxiosError } from 'axios';

// Constants
const TRANSLATION_CONFIG = {
    API_URL: 'https://translation.googleapis.com/language/translate/v2',
    MAX_BATCH_SIZE: 50,
    MAX_REQUEST_SIZE: 1000
} as const;

// Types
export interface TranslationRequest {
    text: string[];
    targetLanguage: string;
}

export interface TranslationResponse {
    notyStatus: ReduxStatus;
    message: string;
    result?:
        | Record<string, unknown>
        | (Record<string, unknown> | string)[]
        | string
        | number;
}

interface TranslationResult {
    detectedSourceLanguage: string;
    model: string;
    translatedText: string;
}

// Error classes
class TranslationError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'TranslationError';
    }
}

// Helper functions
const validateInput = ({ text, targetLanguage }: TranslationRequest): void => {
    if (!text?.length || !targetLanguage) {
        throw new TranslationError('Missing required translation parameters');
    }
    if (text.length > TRANSLATION_CONFIG.MAX_REQUEST_SIZE) {
        throw new TranslationError('Text exceeds maximum length limit');
    }
};

const createTranslationService = (apiKey: string, targetLanguage: string) => {
    const translateBatch = async (batch: string[]): Promise<string[]> => {
        try {
            const response = await axios.post(
                `${TRANSLATION_CONFIG.API_URL}?key=${apiKey}`,
                {
                    q: batch,
                    target: targetLanguage
                }
            );

            return response.data.data.translations.map(
                (item: TranslationResult) => item.translatedText
            );
        } catch (error) {
            throw new TranslationError(
                error instanceof AxiosError
                    ? `API request failed: ${error.message}`
                    : 'Translation service error'
            );
        }
    };

    return { translateBatch };
};

/**
 * Translates an array of text strings to the target language
 * @param params Translation request parameters
 * @returns Translation response with status and results
 */
export const translateText = async ({
    text,
    targetLanguage
}: TranslationRequest): Promise<TranslationResponse> => {
    try {
        validateInput({ text, targetLanguage });

        const apiKey = import.meta.env.VITE_REACT_API_GOOGLE_TRANSLATE;
        const translationService = createTranslationService(
            apiKey,
            targetLanguage
        );

        // Split text into batches and translate
        const batches = Array.from(
            {
                length: Math.ceil(
                    text.length / TRANSLATION_CONFIG.MAX_BATCH_SIZE
                )
            },
            (_, i) =>
                text.slice(
                    i * TRANSLATION_CONFIG.MAX_BATCH_SIZE,
                    (i + 1) * TRANSLATION_CONFIG.MAX_BATCH_SIZE
                )
        );

        const translationResults = await Promise.all(
            batches.map((batch) => translationService.translateBatch(batch))
        );

        const translatedText = translationResults
            .flat()
            .map(htmlNumberToSymbol);

        return {
            notyStatus: ReduxStatus.SUCCESS,
            message: 'Translation completed successfully',
            result: translatedText
        };
    } catch (error) {
        console.error('Translation failed:', error);

        return {
            notyStatus: ReduxStatus.ERROR,
            message:
                error instanceof TranslationError
                    ? error.message
                    : 'An unexpected error occurred during translation'
        };
    }
};

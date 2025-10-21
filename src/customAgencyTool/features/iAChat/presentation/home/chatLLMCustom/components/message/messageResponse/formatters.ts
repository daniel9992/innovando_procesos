import hljs from 'highlight.js';
import MarkdownIt from 'markdown-it';

export interface FormatOptions {
    code?: boolean;
    links?: boolean;
    markdown?: boolean;
    tables?: boolean;
    images?: boolean;
    latex?: boolean;
    syntax?: {
        theme?: 'github' | 'monokai' | 'dracula';
        language?: string;
    };
}

const md = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: true,
    highlight: function (str, lang) {
        if (lang && hljs.getLanguage(lang)) {
            try {
                return hljs.highlight(str, { language: lang }).value;
            } catch (e) {
                console.error('Error MarkdownIt code:', e);
            }
        }
        return ''; // use external default escaping
    }
});

export const formatResponse = (
    text: string,
    options: FormatOptions
): string => {
    let formattedText = text;

    if (options.markdown) {
        formattedText = md.render(formattedText);
    } else {
        if (options.code) {
            formattedText = formatCode(formattedText, options.syntax);
        }
        if (options.tables) {
            formattedText = formatTables(formattedText);
        }
        if (options.images) {
            formattedText = formatImages(formattedText);
        }
        if (options.latex) {
            formattedText = formatLatex(formattedText);
        }
    }

    return formattedText;
};

const formatCode = (text: string, syntax?: FormatOptions['syntax']): string => {
    return text.replace(/```(\w+)?\n([\s\S]+?)\n```/g, (_, lang, code) => {
        const language = lang || syntax?.language || 'plaintext';
        try {
            const highlighted = hljs.highlight(code, { language }).value;
            return `
                    <div class="code-block ${syntax?.theme || 'github'}">
                        <div class="code-header">
                            <span>${language}</span>
                            <button class="copy-button">Copy</button>
                        </div>
                        <pre><code>${highlighted}</code></pre>
                    </div>
                `;
        } catch (e) {
            console.error('Error highlighting code:', e);
            return `<pre><code>${code}</code></pre>`;
        }
    });
};

const formatTables = (text: string): string => {
    return text.replace(
        /\|(.+)\|/g,
        (match) => `<div class="table-container">${match}</div>`
    );
};

const formatImages = (text: string): string => {
    return text.replace(
        /!\[(.*?)\]\((.*?)\)/g,
        '<div class="image-container"><img src="$2" alt="$1" /><caption>$1</caption></div>'
    );
};

const formatLatex = (text: string): string => {
    // Implementar formateo LaTeX si es necesario
    return text;
};

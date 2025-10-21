export const RemoveQuill = (text: string) => {
	// const regex = /<[^>]*>/g;
	// return text.replace(regex, ' ').trim();
	// Remove all HTML tags using a regex
	const textWithBreaks = text
		.replace(/<\/p>|<\/li>/g, '. ') // Replace closing p and li tags with a period
		.replace(/<\/?[^>]+(>|$)/g, ''); // Remove remaining HTML tags

	// Trim extra spaces and normalize spaces
	const cleanText = textWithBreaks
		.replace(/\s+/g, ' ') // Replace multiple spaces with a single space
		.replace(/\.{2,}/g, '.') // Replace multiple periods with a single period
		.trim();

	return cleanText;
};

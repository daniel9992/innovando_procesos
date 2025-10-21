/**
 * Calculates the size of a file in bytes
 * @param {number} bytes - The size of the file in bytes
 * @returns {string} - The size of the file in a human-readable format
 */
export const CalculateFileSize = (bytes: number): string => {
	const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
	if (bytes === 0) return '0 Byte';
	const i = Math.floor(Math.log(bytes) / Math.log(1024));
	if (i === 0) return `${bytes} ${sizes[i]}`;
	return `${(bytes / 1024 ** i).toFixed(1)} ${sizes[i]}`;
};

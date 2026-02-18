export const normalizeAnswer = (text: string): string => {
    return text
        .toLocaleLowerCase('tr-TR')
        .trim()
        .replace(/[.,\/#!$%^&*;:{}=\-_`~()]/g, "")
        .replace(/\s{2,}/g, " ");
};

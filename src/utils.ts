export function extractId(url: string) {
    const id = Number.parseInt(url.split('/').at(-1) ?? 'a');
    if (Number.isNaN(id)) {
        return undefined;
    }
    return id;
}
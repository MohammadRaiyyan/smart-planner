export function parseDurationToMs(input: string): number {
    const trimmed = input.trim();
    const msMatch = /^([0-9]+)\s*(ms)$/.exec(trimmed);
    if (msMatch) return Number(msMatch[1]);

    const match = /^([0-9]+)\s*(s|m|h|d)$/.exec(trimmed);
    if (!match) {
        const asNumber = Number(trimmed);
        if (!Number.isNaN(asNumber)) return asNumber;
        throw new Error(`Invalid duration format: ${input}`);
    }

    const value = Number(match[1]);
    const unit = match[2];

    switch (unit) {
        case "s":
            return value * 1000;
        case "m":
            return value * 60 * 1000;
        case "h":
            return value * 60 * 60 * 1000;
        case "d":
            return value * 24 * 60 * 60 * 1000;
        default:
            throw new Error(`Unsupported duration unit: ${unit}`);
    }
}
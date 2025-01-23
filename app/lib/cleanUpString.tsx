export default function cleanUpStringForDB(data: string): string {
    var cleanUp: string = "";
    if (data.charAt(0) == "[") {
        cleanUp += data.substring(1);
    }
    if (data.charAt(data.length - 1) == "]") {
        cleanUp = cleanUp.slice(0, -1);
    }

    cleanUp = cleanUp.replaceAll('"', '\\"');

    return cleanUp;
}

export function cleanUpStringForView(data: string): string {
    var cleanUp: string = "";
    if (data.indexOf(`@type`) >= 0) {
        cleanUp = data.replaceAll(
            '{\\"@type\\":\\"HowToStep\\",\\"text\\":',
            ""
        );

        cleanUp = cleanUp.replaceAll('\\",\\"', " | ");
        cleanUp = cleanUp.replaceAll('\\"', "");
    } else {
        cleanUp = data.replaceAll('\\",\\"', " | ");
        cleanUp = cleanUp.replaceAll('\\"', "");
    }
    return cleanUp;
}

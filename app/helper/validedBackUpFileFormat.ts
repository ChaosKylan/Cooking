const isValidFormat = (data: any): boolean => {
    // Überprüfen Sie, ob das Datenformat korrekt ist
    if (!Array.isArray(data)) return false;

    for (const element of data) {
        if (
            typeof element !== "object" ||
            !element.schemaName ||
            !element.data
        ) {
            return false;
        }

        try {
            JSON.parse(element.data);
        } catch (e) {
            return false;
        }
    }

    return true;
};

export default isValidFormat;

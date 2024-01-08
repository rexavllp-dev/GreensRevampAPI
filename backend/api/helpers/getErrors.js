const getErrorsInArray = (errors) => {
    // Map through errors and make an array of error messages with key as context.key and value as messages
    const errorsArray = errors.map((error) => {
        const key = error.context.key;
        const message = error.message;
        return { [key]: message };
    });

    return errorsArray;
};


export default getErrorsInArray;

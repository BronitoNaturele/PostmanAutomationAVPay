
function generateRandom10Digit() {
    const min = 1000000000;   
    const max = 9999999999;   
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function sendAndCheck(payload, testName, expectedStatuses = [400]) {
    try {
        const response = await pm.sendRequest({
            url: config.BASE_URL + config.ENDPOINT,
            method: "POST",
            header: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": `Bearer ${config.AUTH_TOKEN}`
            },
            body: JSON.stringify(payload)
        });

        pm.expect(response.code).to.be.oneOf(expectedStatuses);
        console.log(`✅ ${testName} → код: ${response.code}`);

        
        if (!expectedStatuses.includes(response.code) && response.json) {
            console.log("→ Ответ сервера:", response.json());
        }

        return response;
    } catch (error) {
        console.error(`❌ Ошибка в тесте "${testName}":`, error.message);
        throw error;
    }
}


function validateErrorResponse(responseBody, expectedErrorCode, expectedErrorMessage, expectedTypeError) {
    pm.expect(responseBody.error_code).to.equal(expectedErrorCode);
    pm.expect(responseBody.error_message).to.equal(expectedErrorMessage);
    pm.expect(responseBody.type_error).to.equal(expectedTypeError);
    pm.expect(responseBody.errors).to.be.an('object');
}


function validateFieldErrors(fieldErrors, expectedMessage) {
    pm.expect(fieldErrors).to.be.an('array').that.is.not.empty;
    fieldErrors.forEach(msg => pm.expect(msg).to.equal(expectedMessage));
}


async function parseResponseJson(response) {
    try {
        return response.json();
    } catch (err) {
        console.error("❌ Ошибка парсинга JSON:", err.message);
        console.error("→ Сырой ответ:", response.text());
        throw new Error("Не удалось декодировать JSON");
    }
}

module.exports = {
    generateRandom10Digit,
    sendAndCheck,
    validateErrorResponse,
    validateFieldErrors,
    parseResponseJson
};
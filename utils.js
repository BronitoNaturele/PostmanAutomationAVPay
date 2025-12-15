// Генератор случайного 10ти значного числа(применимо, например, к генерации номера заказа)
function generateRandom10Digit() {
    const min = 1000000000;   // наименьшее 10‑значное число
    const max = 9999999999;   // наибольшее 10‑значное число
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Отправляет POST-запрос и проверяет статус
// @param {Object} payload - тело запроса
// @param {String} testName - название теста для лога
// @param {Array} expectedStatuses - ожидаемые коды ответа (по умолчанию [400])
// @returns {Promise} - ответ сервера
async function sendAndCheck(payload, testName, expectedStatuses = [400]) {
    try {
        const response = await pm.sendRequest({
            url: BASE_URL + ENDPOINT,
            method: "POST",
            header: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": `Bearer ${AUTH_TOKEN}`
            },
            body: JSON.stringify(payload)
        });

        pm.expect(response.code).to.be.oneOf(expectedStatuses);
        console.log(`✅ ${testName} → код: ${response.code}`);

        // Вывод тела ответа при ошибке
        if (!expectedStatuses.includes(response.code) && response.json) {
            console.log("→ Ответ сервера:", response.json());
        }

        return response;
    } catch (error) {
        console.error(`❌ Ошибка в тесте "${testName}":`, error.message);
        throw error;
    }
}

// Проверка полей ответа. 400
function validateErrorResponse(responseBody, expectedErrorCode, expectedErrorMessage, expectedTypeError) {
    pm.expect(responseBody.error_code).to.equal(expectedErrorCode);
    pm.expect(responseBody.error_message).to.equal(expectedErrorMessage);
    pm.expect(responseBody.type_error).to.equal(expectedTypeError);
    pm.expect(responseBody.errors).to.be.an('object');
}

// Валидации ошибки
function validateFieldErrors(fieldErrors, expectedMessage) {
    pm.expect(fieldErrors).to.be.an('array').that.is.not.empty;
    fieldErrors.forEach(msg => pm.expect(msg).to.equal(expectedMessage));
}

// Функция парсинга ответа
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
    parseResponseJson
};
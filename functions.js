console.log(`Скрипты тут`);

const axios = require('axios'); /* Установите через npm install axios*/

/*Генератор случайного 10ти значного числа(применимо, например, к генерации номера заказа)*/
function generateRandom10Digit() {
    const min = 1000000000;   // наименьшее 10‑значное число
    const max = 9999999999;   // наибольшее 10‑значное число
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/*Отправляет POST-запрос и проверяет статус
@param {Object} payload - тело запроса
@param {String} testName - название теста для лога
@param {Array} expectedStatuses - ожидаемые коды ответа (по умолчанию [400])
@returns {Promise} - ответ сервера*/

async function sendAndCheck(config, payload, testName, expectedStatuses = [400]) {
    try {
        const response = await axios.post(
            config.BASE_URL + config.ENDPOINT,
            payload,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${config.AUTH_TOKEN}`
                }
            }
        );

        /*Замена pm.expect на обычные проверки*/
        if (!expectedStatuses.includes(response.status)) {
            throw new Error(`Статус ${response.status} не входит в ожидаемые [${expectedStatuses}]`);
        }

        console.log(`✅ ${testName} → код: ${response.status}`);

        if (response.data && !expectedStatuses.includes(response.status)) {
            console.log("→ Ответ сервера:", response.data);
        }

        return response;
    } catch (error) {
        console.error(`❌ Ошибка в тесте "${testName}":`, error.message);
        throw error;
    }
}

/*Проверка полей ответа. 400*/
function validateErrorResponse(responseBody, expectedErrorCode, expectedErrorMessage, expectedTypeError) {
    if (responseBody.error_code !== expectedErrorCode) {
        throw new Error(`error_code: ${responseBody.error_code}, ожидался ${expectedErrorCode}`);
    }
    if (responseBody.error_message !== expectedErrorMessage) {
        throw new Error(`error_message: ${responseBody.error_message}, ожидался ${expectedErrorMessage}`);
    }
    if (responseBody.type_error !== expectedTypeError) {
        throw new Error(`type_error: ${responseBody.type_error}, ожидался ${expectedTypeError}`);
    }
    if (typeof responseBody.errors !== 'object') {
        throw new Error('errors должен быть объектом');
    }
}

/*Валидации ошибки*/
function validateFieldErrors(fieldErrors, expectedMessage) {
    if (!Array.isArray(fieldErrors) || fieldErrors.length === 0) {
        throw new Error('fieldErrors должен быть непустым массивом');
    }
    for (const msg of fieldErrors) {
        if (msg !== expectedMessage) {
            throw new Error(`Сообщение "${msg}" не совпадает с ожидаемым "${expectedMessage}"`);
        }
    }
}

/*Парсинг JSON-ответа*/
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
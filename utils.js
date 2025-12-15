
//Генератор случайного 10ти значного числа(применимо, например, к генерации номера заказа)
function generateRandom10Digit() {
    const min = 1000000000;   // наименьшее 10‑значное число
    const max = 9999999999;   // наибольшее 10‑значное число
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = {
    generateRandom10Digit 
};
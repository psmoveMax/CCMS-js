/* eslint-disable no-console */
// импорт стандартных библиотек Node.js
const { existsSync, readFileSync, writeFileSync } = require('fs');
const { createServer } = require('http');

// файл для базы данных
const DB_FILE = process.env.DB_FILE || './db.json';
// номер порта, на котором будет запущен сервер
const PORT = process.env.PORT || 3000;
// префикс URI для всех методов приложения
const URI_PREFIX = '/api/customers';

/**
 * Класс ошибки, используется для отправки ответа с определённым кодом и описанием ошибки
 */
class ApiError extends Error {
    constructor(statusCode, data) {
        super();
        this.statusCode = statusCode;
        this.data = data;
    }
}

/**
 * Асинхронно считывает тело запроса и разбирает его как JSON
 * @param {Object} req - Объект HTTP запроса
 * @throws {ApiError} Некорректные данные в аргументе
 * @returns {Object} Объект, созданный из тела запроса
 */
function drainJson(req) {
    return new Promise((resolve) => {
        let data = '';
        req.on('data', (chunk) => {
            data += chunk;
        });
        req.on('end', () => {
            resolve(JSON.parse(data));
        });
    });
}

/**
 * Проверяет входные данные и создаёт из них корректный объект клиента
 * @param {Object} data - Объект с входными данными
 * @throws {ApiError} Некорректные данные в аргументе (statusCode 422)
 * @returns {{ name: string, surname: string, lastname: string, contacts: array}} Объект клиента
 */
function makeCustomerFromData(data) {
    const errors = [];

    function asString(v) {
        return v && String(v).trim() || '';
    }

    // составляем объект, где есть только необходимые поля
    const customer = {
        name: asString(data.name),
        surname: asString(data.surname),
        lastname: asString(data.lastname),
        contacts: asString(data.contacts),
    }

    // проверяем, все ли данные корректные и заполняем объект ошибок, которые нужно отдать клиенту
    if (!customer.name) errors.push({ field: 'name', message: 'Не указано имя' });
    if (!customer.surname) errors.push({ field: 'surname', message: 'Не указана фамилия' });


    // если есть ошибки, то бросаем объект ошибки с их списком и 422 статусом
    if (errors.length) throw new ApiError(422, { errors });

    return customer;
}

/**
 * Возвращает список клиентов из базы данных
 * @param {{ search: string }} [params] - Поисковая строка
 * @returns {{ id: string, name: string, surname: string, lastname: string, contacts: array }[]} Массив студентов
 */
function getCustomerList(params = {}) {
    const customers = JSON.parse(readFileSync(DB_FILE) || '[]');
    if (params.search) {
        const search = params.search.trim().toLowerCase();
        return customers.filter(customer => [
            customer.name,
            customer.surname,
            customer.lastname,
            customer.contacts,
        ]
            .some(str => str.toLowerCase().includes(search))
        );
    }
    return customers;
}

/**
 * Создаёт и сохраняет клиента в базу данных
 * @throws {ApiError} Некорректные данные в аргументе, клиент не создан (statusCode 422)
 * @param {Object} data - Данные из тела запроса
 * @returns {{ id: string, name: string, surname: string, lastname: string, contacts: array, createdAt: string, updatedAt: string }} Объект клиента
 */
function createCustomer(data) {
    console.log(data);
    const newItem = makeCustomerFromData(data);
    console.log(newItem);
    newItem.id = `1${Date.now().toString().substr('7', '5')}`;
    newItem.createdAt = newItem.updatedAt = new Date().toISOString();
    writeFileSync(DB_FILE, JSON.stringify([...getCustomerList(), newItem]), { encoding: 'utf8' });
    return newItem;
}

/**
 * Возвращает объект клиента по его ID
 * @param {string} itemId - ID студента
 * @throws {ApiError} Клиент с таким ID не найден (statusCode 404)
 * @returns {{ id: string, name: string, surname: string, lastname: string, contacts: array createdAt: string, updatedAt: string }} Объект клиента
 */
function getCustomer(itemId) {
    const customer = getCustomerList().find(({ id }) => id === itemId);
    if (!customer) throw new ApiError(404, { message: 'Customer Not Found' });
    return customer;
}

/**
 * Изменяет клиента с указанным ID и сохраняет изменения в базу данных
 * @param {string} itemId - ID изменяемого студента
 * @param {{ name?: string, surname?: string, lastname?: string, contacts?: object }} data - Объект с изменяемыми данными
 * @throws {ApiError} клиент с таким ID не найден (statusCode 404)
 * @throws {ApiError} Некорректные данные в аргументе (statusCode 422)
 * @returns {{ id: string, name: string, surname: string, lastname: string, contacts: array, createdAt: string, updatedAt: string }} Объект клиента
 */
function updateCustomer(itemId, data) {
    const customers = getCustomerList();
    const itemIndex = customers.findIndex(({ id }) => id === itemId);
    if (itemIndex === -1) throw new ApiError(404, { message: 'Customer Not Found' });
    Object.assign(customers[itemIndex], makeCustomerFromData({ ...customers[itemIndex], ...data }));
    customers[itemIndex].updatedAt = new Date().toISOString();
    writeFileSync(DB_FILE, JSON.stringify(customers), { encoding: 'utf8' });
    return customers[itemIndex];
}

/**
 * Удаляет клеинта из базы данных
 * @param {string} itemId - ID клиента
 * @returns {{}}
 */
function deleteCustomer(itemId) {
    const customers = getCustomerList();
    const itemIndex = customers.findIndex(({ id }) => id === itemId);
    if (itemIndex === -1) throw new ApiError(404, { message: 'Customer Not Found' });
    customers.splice(itemIndex, 1);
    writeFileSync(DB_FILE, JSON.stringify(customers), { encoding: 'utf8' });
    return {};
}

// создаём новый файл с базой данных, если он не существует
if (!existsSync(DB_FILE)) writeFileSync(DB_FILE, '[]', { encoding: 'utf8' });

// создаём HTTP сервер, переданная функция будет реагировать на все запросы к нему
module.exports = createServer(async (req, res) => {
    // req - объект с информацией о запросе, res - объект для управления отправляемым ответом

    // этот заголовок ответа указывает, что тело ответа будет в JSON формате
    res.setHeader('Content-Type', 'application/json');

    // CORS заголовки ответа для поддержки кросс-доменных запросов из браузера
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // запрос с методом OPTIONS может отправлять браузер автоматически для проверки CORS заголовков
    // в этом случае достаточно ответить с пустым телом и этими заголовками
    if (req.method === 'OPTIONS') {
        // end = закончить формировать ответ и отправить его клиенту
        res.end();
        return;
    }

    // если URI не начинается с нужного префикса - можем сразу отдать 404
    if (!req.url || !req.url.startsWith(URI_PREFIX)) {
        res.statusCode = 404;
        res.end(JSON.stringify({ message: 'Not Found' }));
        return;
    }

    // убираем из запроса префикс URI, разбиваем его на путь и параметры
    const [uri, query] = req.url.substr(URI_PREFIX.length).split('?');
    const queryParams = {};

    // параметры могут отсутствовать вообще или иметь вид a=b&b=c
    // во втором случае наполняем объект queryParams { a: 'b', b: 'c' }
    if (query) {
        for (const piece of query.split('&')) {
            const [key, value] = piece.split('=');
            queryParams[key] = value ? decodeURIComponent(value) : '';
        }
    }

    try {
        // обрабатываем запрос и формируем тело ответа
        const body = await (async () => {
            if (uri === '' || uri === '/') {
                // /api/customers
                if (req.method === 'GET') return getCustomerList(queryParams);
                if (req.method === 'POST') {
                    const createdItem = createCustomer(await drainJson(req));
                    res.statusCode = 201;
                    res.setHeader('Access-Control-Expose-Headers', 'Location');
                    res.setHeader('Location', `${URI_PREFIX}/${createdItem.id}`);
                    return createdItem;
                }
            } else {
                // /api/customers/{id}
                // параметр {id} из URI запроса
                const itemId = uri.substr(1);
                if (req.method === 'GET') return getCustomer(itemId);
                if (req.method === 'PATCH') return updateCustomer(itemId, await drainJson(req));
                if (req.method === 'DELETE') return deleteCustomer(itemId);
            }
            return null;
        })();
        res.end(JSON.stringify(body));
    } catch (err) {
        // обрабатываем сгенерированную нами же ошибку
        if (err instanceof ApiError) {
            res.writeHead(err.statusCode);
            res.end(JSON.stringify(err.data));
        } else {
            // если что-то пошло не так - пишем об этом в консоль и возвращаем 500 ошибку сервера
            res.statusCode = 500;
            res.end(JSON.stringify({ message: 'Server Error' }));
            console.error(err);
        }
    }
})
    // выводим инструкцию, как только сервер запустился...
    .on('listening', () => {
        if (process.env.NODE_ENV !== 'test') {
            console.log(`Сервер Students запущен. Вы можете использовать его по адресу http://localhost:${PORT}`);
            console.log('Нажмите CTRL+C, чтобы остановить сервер');
            console.log('Доступные методы:');
            console.log(`GET ${URI_PREFIX} - получить список клиентов, в query параметр search можно передать поисковый запрос`);
            console.log(`POST ${URI_PREFIX} - создать клиента, в теле запроса нужно передать объект { name: string, surname: string, lastname: string, contacts: object}`);
            console.log(`GET ${URI_PREFIX}/{id} - получить клиента по его ID`);
            console.log(`PATCH ${URI_PREFIX}/{id} - изменить клиента с ID, в теле запроса нужно передать объект { name?: string, surname?: string, lastname?: string, contacts?: object}`);
            console.log(`DELETE ${URI_PREFIX}/{id} - удалить клиента по ID`);
        }
    })
    // ...и вызываем запуск сервера на указанном порту
    .listen(PORT);
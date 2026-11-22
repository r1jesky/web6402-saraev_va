const http = require('node:http');
const { readFile } = require('node:fs/promises');
const path = require('node:path');

const files = new Map([
    ['/index.html', 'text/html; charset=utf-8'],
    ['/sport.html', 'text/html; charset=utf-8'],
    ['/movies.html', 'text/html; charset=utf-8'],
    ['/games.html', 'text/html; charset=utf-8'],
    ['/scroll.html', 'text/html; charset=utf-8'],
    ['/plan.html', 'text/html; charset=utf-8'],
    ['/css/style.css', 'text/css; charset=utf-8'],
    ['/js/plan.js', 'text/javascript; charset=utf-8'],
    ['/img/ball.svg', 'image/svg+xml'],
    ['/img/book.svg', 'image/svg+xml'],
    ['/img/favicon.svg', 'image/svg+xml'],
    ['/img/film.svg', 'image/svg+xml'],
    ['/img/gamepad.svg', 'image/svg+xml'],
    ['/img/phone.svg', 'image/svg+xml']
]);

const activities = new Set(['Чтение', 'Спорт', 'Кино', 'Игры', 'Короткие видео']);

function reply(response, status, message, contentType = 'text/plain; charset=utf-8') {
    response.writeHead(status, { 'Content-Type': contentType });
    response.end(message);
}

async function acceptPlan(request, response) {
    const contentType = request.headers['content-type'] || '';

    if (!contentType.startsWith('application/x-www-form-urlencoded')) {
        return reply(response, 415, 'Неподдерживаемый формат данных.');
    }

    const limit = 8192;
    const chunks = [];
    let size = 0;

    for await (const chunk of request) {
        size += chunk.length;
        if (size <= limit) chunks.push(chunk);
    }

    if (size > limit) {
        return reply(response, 413, 'Данные формы слишком большие.');
    }

    const fields = new URLSearchParams(Buffer.concat(chunks).toString('utf8'));
    const nickname = (fields.get('nickname') || '').trim();
    const activity = fields.get('activity');
    const date = fields.get('date') || '';
    const note = fields.get('note') || '';
    const parsedDate = new Date(date);
    const validDate = /^\d{4}-\d{2}-\d{2}$/.test(date)
        && !Number.isNaN(parsedDate.getTime())
        && parsedDate.toISOString().slice(0, 10) === date;

    if (!nickname || nickname.length > 60 || !activities.has(activity) || !validDate || note.length > 500) {
        return reply(response, 400, 'Проверьте имя, занятие, дату и длину заметки.');
    }

    return reply(response, 200, 'Сервер принял план.');
}

const server = http.createServer(async (request, response) => {
    const pathname = new URL(request.url, 'http://127.0.0.1').pathname;

    try {
        if (request.method === 'POST' && pathname === '/plans') {
            return await acceptPlan(request, response);
        }

        const file = pathname === '/' ? '/index.html' : pathname;
        if (request.method === 'GET' && files.has(file)) {
            const contents = await readFile(path.join(__dirname, file.slice(1)));
            return reply(response, 200, contents, files.get(file));
        }

        reply(response, 404, 'Страница не найдена.');
    } catch (error) {
        console.error(error);
        reply(response, 500, 'Ошибка сервера.');
    }
});

const port = Number(process.env.PORT || 8000);
server.listen(port, '127.0.0.1', () => {
    console.log('Досуг: http://127.0.0.1:' + server.address().port);
});

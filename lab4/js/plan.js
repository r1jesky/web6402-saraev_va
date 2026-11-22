class EveningPlan {
    constructor(nickname, activity, date, note) {
        this.nickname = nickname;
        this.activity = activity;
        this.date = date;
        this.note = note;
    }

    printToConsole() {
        console.log([
            'План на вечер',
            'Имя: ' + this.nickname,
            'Занятие: ' + this.activity,
            'Дата: ' + this.date,
            'Заметка: ' + (this.note || '—')
        ].join('\n'));
    }
}

const planForm = document.querySelector('.plan-form');
const submitButton = planForm.querySelector('button[type="submit"]');
const statusMessage = planForm.querySelector('.plan-form__status');

planForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const fields = new FormData(planForm);
    const plan = new EveningPlan(
        fields.get('nickname').trim(),
        fields.get('activity'),
        fields.get('date'),
        fields.get('note').trim()
    );
    plan.printToConsole();

    submitButton.disabled = true;
    statusMessage.className = 'plan-form__status';
    statusMessage.textContent = 'Отправляем план…';

    try {
        const response = await fetch(planForm.action, {
            method: 'POST',
            body: new URLSearchParams(plan)
        });

        if (!response.ok) {
            throw new Error(await response.text());
        }

        statusMessage.classList.add('plan-form__status--success');
        statusMessage.textContent = 'Сервер принял план.';
        planForm.reset();
    } catch (error) {
        statusMessage.classList.add('plan-form__status--error');
        statusMessage.textContent = 'Не удалось отправить план. ' + error.message;
    } finally {
        submitButton.disabled = false;
    }
});

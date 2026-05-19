// @ts-nocheck
// Регистрация плагина Chart.js DataLabels
Chart.register(ChartDataLabels);

// Текущая роль пользователя
let currentRole = "intern";

// ID текущего сотрудника (статическое значение для прототипа)
const currentEmployeeId = 1;

// ID текущего практика (статическое значение для прототипа)
const currentInternId = 1;

// Данные текущего пользователя
const currentUser = {
  intern: {
    name: "Иван Петров",
    block: "Аналитика",
    interests: ["#маркетинг", "#продукт"],
    rating: 42.7,
    schedule: [
      { day: "Пн", status: "all_day" },
      { day: "Вт", status: "afternoon" },
      { day: "Ср", status: "morning" },
      { day: "Чт", status: "out" },
      { day: "Пт", status: "afternoon" },
    ],
  },
  employee: {
    name: "Алексей Петров",
    block: "Аналитика",
  },
  supervisor: {
    name: "Мария Иванова",
    block: "Маркетинг",
  },
};

// Массив активных приглашений (для завершения работы)
let activeInvitations = [];

// Массив уведомлений для колокольчика
const notifications = [
  {
    id: 1,
    type: "new-task",
    title: "Новая задача по интересам",
    text: 'Задача "Анализ данных продаж" (#127) соответствует вашим интересам #аналитика',
    time: "2025-05-12T09:30",
    unread: true,
  },
  {
    id: 2,
    type: "invitation",
    title: "Приглашение на задачу",
    text: 'Алексей Петров приглашает вас на задачу "Разработка модуля авторизации"',
    time: "2025-05-12T08:15",
    unread: true,
  },
  {
    id: 3,
    type: "approved",
    title: "Отклик одобрен",
    text: 'Ваш отклик на задачу "Настройка CI/CD пайплайна" был одобрен',
    time: "2025-05-11T16:45",
    unread: false,
  },
];

// Массив критических уведомлений (для руководителя)
const criticalNotifications = [
  {
    id: 1,
    type: "task-not-completed",
    title: "Задача не выполнена в срок",
    text: 'Задача "Собрать дашборд продаж" (блок Аналитика, сотрудник Олег Иванов) закрыта по причине "никто не откликнулся в срок". Свободные практиканты в этот период: Анна Смирнова (расписание: вторник, среда), Иван Петров (расписание: среда, четверг).',
    date: "2025-05-12T10:30",
    critical: true,
  },
  {
    id: 2,
    type: "inactive-intern",
    title: "Неактивный практикант",
    text: "Практикант Денис Михайлов (блок IT) не выполнил ни одной задачи за 14 дней. Расписание: понедельник, вторник, среда. Хост: Екатерина Соколова. Рекомендуется связаться с хостом.",
    date: "2025-05-12T09:15",
    critical: false,
  },
  {
    id: 3,
    type: "employee-violation",
    title: "Нарушение сотрудником",
    text: "Сотрудник Анна Ветрова (блок Маркетинг) трижды отменила подтверждённые задачи за последние 7 дней. Затронутые практиканты: Мария К., София Р. Рекомендуется провести беседу.",
    date: "2025-05-11T16:45",
    critical: true,
  },
  {
    id: 4,
    type: "low-response-rate",
    title: "Низкая скорость отклика в блоке",
    text: 'Блок Разработка: средняя скорость отклика на задачи — 8 часов (норма — 2 часа). Задачи: "Исправить баги в форме", "Протестировать API". Рекомендуется привлечь внимание хостов блока.',
    date: "2025-05-11T14:20",
    critical: false,
  },
  {
    id: 5,
    type: "intern-refusing",
    title: "Практикант систематически отказывается от задач",
    text: "Практикант Илья Соболев (блок Продукт) дважды отказался от подтверждённых задач за последние 7 дней. Штрафы начислены. Хост: Максим Кузнецов.",
    date: "2025-05-10T11:30",
    critical: false,
  },
  {
    id: 6,
    type: "host-overload",
    title: "Перегрузка хоста",
    text: "Хост Елена Морозова (блок Аналитика) имеет 8 активных задач на одного практиканта. Рекомендуется перераспределить нагрузку или привлечь дополнительных практикантов через ленту.",
    date: "2025-05-10T09:00",
    critical: false,
  },
  {
    id: 7,
    type: "goal-not-achieved",
    title: "Цель блока не достигается",
    text: 'Блок Маркетинг: цель "Запустить кампанию по сбору лидов" выполнена на 15% при плане к концу месяца 80%. Задач по этой цели создано всего 2. Рекомендуется стимулировать сотрудников к созданию задач.',
    date: "2025-05-09T17:00",
    critical: true,
  },
];

// Массив задач
const tasks = [
  {
    id: 1,
    title: "Разработка модуля авторизации",
    author: "Алексей Петров",
    authorId: 1,
    contribution: 1.6,
    deadline: "2025-05-15",
    effort: "16 часов",
    description:
      "Необходимо реализовать форму входа и регистрации с валидацией полей. Поддержка восстановления пароля через email.",
  },
  {
    id: 2,
    title: "Анализ требований к системе",
    author: "Мария Иванова",
    authorId: 2,
    contribution: 0.8,
    deadline: "2025-05-10",
    effort: "8 часов",
    description:
      "Сбор и документирование бизнес-требований от стейкхолдеров. Подготовка технического задания.",
  },
  {
    id: 3,
    title: "Настройка CI/CD пайплайна",
    author: "Дмитрий Сидоров",
    authorId: 3,
    contribution: 1.2,
    deadline: "2025-05-20",
    effort: "12 часов",
    description:
      "Конфигурация автоматического деплоя на тестовый сервер. Настройка тестов и уведомлений.",
  },
  {
    id: 4,
    title: "Дизайн пользовательского интерфейса",
    author: "Елена Козлова",
    authorId: 4,
    contribution: 2.4,
    deadline: "2025-05-18",
    effort: "24 часа",
    description:
      "Создание макетов основных экранов приложения. Прототипирование и тестирование на пользователях.",
  },
];

// Массив поднятых рук (для сотрудника)
const raisedHands = [
  {
    id: 1,
    name: "Иван Иванов",
    block: "Аналитика",
    helpBlocks: ["Маркетинг"],
    startTime: "2025-04-25T14:00",
    endTime: "2025-04-25T17:00",
    rating: 4.8,
  },
  {
    id: 2,
    name: "Мария Петрова",
    block: "IT",
    helpBlocks: ["Аналитика", "Маркетинг"],
    startTime: "2025-04-25T10:00",
    endTime: "2025-04-25T13:00",
    rating: 4.5,
  },
  {
    id: 3,
    name: "Алексей Смирнов",
    block: "Маркетинг",
    helpBlocks: [],
    startTime: "2025-04-26T15:00",
    endTime: "2025-04-26T18:00",
    rating: 4.9,
  },
];

// Массив всех сотрудников (включая хостов и руководителя)
const allEmployees = [
  {
    id: 101,
    name: "Алексей Петров",
    block: "Аналитика",
    role: "employee",
  },
  {
    id: 102,
    name: "Мария Иванова",
    block: "Маркетинг",
    role: "host",
  },
  {
    id: 103,
    name: "Дмитрий Сидоров",
    block: "IT",
    role: "employee",
  },
  {
    id: 104,
    name: "Елена Козлова",
    block: "Аналитика",
    role: "supervisor",
  },
  {
    id: 105,
    name: "Олег Иванов",
    block: "Маркетинг",
    role: "employee",
  },
];

// Получаем элементы
const roleSelector = document.getElementById("roleSelector");
const notifBtn = document.getElementById("notifBtn");
const feedScreen = document.getElementById("feed-screen");
const feedContent = document.getElementById("feed-content");
const myTasksScreen = document.getElementById("mytasks-screen");
const usersScreen = document.getElementById("users-screen");
const usersList = document.getElementById("users-list");

// Массив всех пользователей (практиканты)
const allUsers = [
  {
    id: 1,
    name: "Иван Иванов",
    block: "Аналитика",
    interests: ["#маркетинг", "#продукт"],
    rating: 4.8,
    schedule: [
      { day: "Пн", status: "all_day" },
      { day: "Вт", status: "afternoon" },
      { day: "Ср", status: "morning" },
      { day: "Чт", status: "out" },
      { day: "Пт", status: "afternoon" },
    ],
  },
  {
    id: 2,
    name: "Мария Петрова",
    block: "IT",
    interests: ["#разработка", "#frontend"],
    rating: 4.5,
    schedule: [
      { day: "Пн", status: "afternoon" },
      { day: "Вт", status: "morning" },
      { day: "Ср", status: "morning" },
      { day: "Чт", status: "all_day" },
      { day: "Пт", status: "out" },
    ],
  },
  {
    id: 3,
    name: "Алексей Смирнов",
    block: "Маркетинг",
    interests: ["#аналитика", "#дизайн"],
    rating: 4.9,
    schedule: [
      { day: "Пн", status: "morning" },
      { day: "Вт", status: "morning" },
      { day: "Ср", status: "afternoon" },
      { day: "Чт", status: "afternoon" },
      { day: "Пт", status: "all_day" },
    ],
  },
  {
    id: 4,
    name: "Елена Козлова",
    block: "Аналитика",
    interests: ["#данные", "#ml"],
    rating: 4.7,
    schedule: [
      { day: "Пн", status: "out" },
      { day: "Вт", status: "all_day" },
      { day: "Ср", status: "afternoon" },
      { day: "Чт", status: "morning" },
      { day: "Пт", status: "morning" },
    ],
  },
  // Практиканты из профиля хоста
  {
    id: 5,
    name: "Иван Петров",
    block: "Аналитика",
    interests: ["#аналитика", "#данные"],
    rating: 42.7,
    schedule: [
      { day: "Пн", status: "morning" },
      { day: "Вт", status: "afternoon" },
      { day: "Ср", status: "all_day" },
      { day: "Чт", status: "out" },
      { day: "Пт", status: "afternoon" },
    ],
  },
  {
    id: 6,
    name: "Мария Иванова",
    block: "Аналитика",
    interests: ["#маркетинг", "#аналитика"],
    rating: 38.5,
    schedule: [
      { day: "Пн", status: "afternoon" },
      { day: "Вт", status: "morning" },
      { day: "Ср", status: "afternoon" },
      { day: "Чт", status: "morning" },
      { day: "Пт", status: "all_day" },
    ],
  },
  // Практиканты из профиля куратора
  {
    id: 7,
    name: "Анна Смирнова",
    block: "Маркетинг",
    interests: ["#маркетинг", "#соцсети", "#контент"],
    rating: 41.5,
    schedule: [
      { day: "Пн", status: "all_day" },
      { day: "Вт", status: "morning" },
      { day: "Ср", status: "afternoon" },
      { day: "Чт", status: "afternoon" },
      { day: "Пт", status: "morning" },
    ],
  },
  {
    id: 8,
    name: "Денис Михайлов",
    block: "IT",
    interests: ["#разработка", "#backend", "#api"],
    rating: 40.8,
    schedule: [
      { day: "Пн", status: "afternoon" },
      { day: "Вт", status: "afternoon" },
      { day: "Ср", status: "all_day" },
      { day: "Чт", status: "morning" },
      { day: "Пт", status: "out" },
    ],
  },
];

// Массив задач хоста с чек-листами
const hostTasks = [
  {
    id: 1,
    internId: 1,
    internName: "Иван Иванов",
    title: "Онбординг в команду",
    description:
      "Познакомиться с командой, изучить документацию проекта и настроить рабочее окружение.",
    checklist: [
      { id: 1, text: "Познакомиться с командой", checked: false },
      { id: 2, text: "Изучить документацию проекта", checked: false },
      { id: 3, text: "Настроить рабочее окружение", checked: false },
      { id: 4, text: "Пройти вводный тренинг", checked: false },
    ],
    deadline: "2026-05-20",
    contribution: 0.4,
    operational: false,
  },
  {
    id: 2,
    internId: 2,
    internName: "Мария Петрова",
    title: "Подготовка отчёта по практике",
    description:
      "Собрать материалы за неделю, написать черновик отчёта и подготовить презентацию.",
    checklist: [
      { id: 1, text: "Собрать материалы за неделю", checked: true },
      { id: 2, text: "Написать черновик отчёта", checked: false },
      { id: 3, text: "Получить фидбек от ментора", checked: false },
      { id: 4, text: "Финализировать и отправить", checked: false },
      { id: 5, text: "Подготовить презентацию", checked: false },
    ],
    deadline: "2026-05-25",
    contribution: 0.5,
    operational: true,
  },
  {
    id: 3,
    internId: 1,
    internName: "Иван Иванов",
    title: "Разработка API для аналитики",
    description: "Создать REST API для получения аналитических данных.",
    checklist: [
      { id: 1, text: "Спроектировать структуру API", checked: true },
      { id: 2, text: "Реализовать эндпоинты", checked: true },
      { id: 3, text: "Добавить документацию", checked: true },
      { id: 4, text: "Написать тесты", checked: true },
      { id: 5, text: "Провести нагрузочное тестирование", checked: true },
    ],
    deadline: "2026-05-15",
    contribution: 1.2,
    operational: false,
  },
  {
    id: 4,
    internId: 1,
    internName: "Иван Иванов",
    title: "Дизайн дашборда",
    description: "Создать макеты для нового дашборда аналитики.",
    checklist: [
      { id: 1, text: "Исследование UI паттернов", checked: true },
      { id: 2, text: "Создать wireframes", checked: true },
      { id: 3, text: "Разработать визуальный стиль", checked: false },
      { id: 4, text: "Создать прототип", checked: false },
      { id: 5, text: "Провести юзабилити тест", checked: false },
      { id: 6, text: "Финализировать дизайн", checked: false },
    ],
    deadline: "2026-05-30",
    contribution: 1.5,
    operational: false,
  },
  {
    id: 5,
    internId: 1,
    internName: "Иван Иванов",
    title: "Оптимизация базы данных",
    description: "Проанализировать и оптимизировать медленные запросы.",
    checklist: [
      { id: 1, text: "Найти медленные запросы", checked: true },
      { id: 2, text: "Добавить индексы", checked: false },
      { id: 3, text: "Оптимизировать JOIN операции", checked: false },
      { id: 4, text: "Настроить кэширование", checked: false },
    ],
    deadline: "2026-05-18",
    contribution: 0.8,
    operational: true,
  },
  {
    id: 6,
    internId: 1,
    internName: "Иван Иванов",
    title: "Написание технической документации",
    description: "Документировать новые модули системы.",
    checklist: [
      { id: 1, text: "Изучить существующую документацию", checked: true },
      { id: 2, text: "Написать описание архитектуры", checked: false },
      { id: 3, text: "Документировать API", checked: false },
      { id: 4, text: "Создать гайд по установке", checked: false },
      { id: 5, text: "Добавить примеры использования", checked: false },
    ],
    deadline: "2025-05-22",
    contribution: 0.5,
    operational: false,
  },
];

// Массив черновиков задач для согласования
const draftTasks = [];

// Массив активных задач из ленты
const feedTasks = [
  {
    id: 201,
    internId: 1,
    internName: "Иван Иванов",
    title: "Анализ конкурентов",
    description: "Провести анализ конкурентов в сфере финтех.",
    checklist: [
      { id: 1, text: "Собрать данные о конкурентах", checked: true },
      { id: 2, text: "Проанализировать продукты", checked: true },
      { id: 3, text: "Подготовить отчёт", checked: false },
    ],
    deadline: "2025-05-18",
    contribution: 0.8,
    operational: false,
  },
  {
    id: 202,
    internId: 1,
    internName: "Иван Иванов",
    title: "Тестирование мобильного приложения",
    description: "Провести функциональное тестирование мобильного приложения.",
    checklist: [
      { id: 1, text: "Тестирование авторизации", checked: true },
      { id: 2, text: "Тестирование платежей", checked: false },
      { id: 3, text: "Тестирование уведомлений", checked: false },
      { id: 4, text: "Подготовить баг-репорт", checked: false },
    ],
    deadline: "2025-05-22",
    contribution: 0.6,
    operational: true,
  },
  {
    id: 203,
    internId: 2,
    internName: "Мария Петрова",
    title: "Написание статей для блога",
    description: "Подготовить 3 статьи для корпоративного блога.",
    checklist: [
      { id: 1, text: "Выбрать темы", checked: true },
      { id: 2, text: "Написать первую статью", checked: true },
      { id: 3, text: "Написать вторую статью", checked: false },
      { id: 4, text: "Написать третью статью", checked: false },
    ],
    deadline: "2025-05-25",
    contribution: 0.9,
    operational: false,
  },
];

// Массив истории рейтингов по неделям для аналитики
const ratingHistory = [
  { internId: 1, week: "Неделя 1", rating: 4.2 },
  { internId: 1, week: "Неделя 2", rating: 4.4 },
  { internId: 1, week: "Неделя 3", rating: 4.5 },
  { internId: 1, week: "Неделя 4", rating: 4.7 },
  { internId: 1, week: "Неделя 5", rating: 4.8 },
  { internId: 2, week: "Неделя 1", rating: 4.0 },
  { internId: 2, week: "Неделя 2", rating: 4.1 },
  { internId: 2, week: "Неделя 3", rating: 4.3 },
  { internId: 2, week: "Неделя 4", rating: 4.4 },
  { internId: 2, week: "Неделя 5", rating: 4.5 },
  { internId: 3, week: "Неделя 1", rating: 4.3 },
  { internId: 3, week: "Неделя 2", rating: 4.5 },
  { internId: 3, week: "Неделя 3", rating: 4.6 },
  { internId: 3, week: "Неделя 4", rating: 4.7 },
  { internId: 3, week: "Неделя 5", rating: 4.9 },
  { internId: 4, week: "Неделя 1", rating: 4.1 },
  { internId: 4, week: "Неделя 2", rating: 4.2 },
  { internId: 4, week: "Неделя 3", rating: 4.4 },
  { internId: 4, week: "Неделя 4", rating: 4.5 },
  { internId: 4, week: "Неделя 5", rating: 4.7 },
];

// Массив выполненных задач с типами (host - от хоста, feed - из ленты)
const completedTasks = [
  {
    internId: 1,
    taskId: 101,
    title: "Анализ данных",
    type: "host",
    completedAt: "2025-04-01",
    rating: 4.5,
  },
  {
    internId: 1,
    taskId: 102,
    title: "Отчёт по проекту",
    type: "feed",
    completedAt: "2025-04-03",
    rating: 4.8,
  },
  {
    internId: 1,
    taskId: 103,
    title: "Тестирование API",
    type: "host",
    completedAt: "2025-04-08",
    rating: 4.2,
  },
  {
    internId: 1,
    taskId: 104,
    title: "Документация",
    type: "feed",
    completedAt: "2025-04-10",
    rating: 4.6,
  },
  {
    internId: 1,
    taskId: 105,
    title: "Анализ требований",
    type: "host",
    completedAt: "2025-04-15",
    rating: 4.4,
  },
  {
    internId: 1,
    taskId: 106,
    title: "Отчёт по аналитике",
    type: "feed",
    completedAt: "2025-04-18",
    rating: 4.7,
  },
  {
    internId: 1,
    taskId: 107,
    title: "Тестирование UI",
    type: "host",
    completedAt: "2025-04-22",
    rating: 4.3,
  },
  {
    internId: 1,
    taskId: 108,
    title: "Документация API",
    type: "feed",
    completedAt: "2025-04-25",
    rating: 4.5,
  },
  {
    internId: 1,
    taskId: 109,
    title: "Анализ данных",
    type: "host",
    completedAt: "2025-05-01",
    rating: 4.5,
  },
  {
    internId: 1,
    taskId: 110,
    title: "Отчёт по проекту",
    type: "feed",
    completedAt: "2025-05-03",
    rating: 4.8,
  },
  {
    internId: 1,
    taskId: 111,
    title: "Тестирование API",
    type: "host",
    completedAt: "2025-05-05",
    rating: 4.2,
  },
  {
    internId: 1,
    taskId: 112,
    title: "Документация",
    type: "feed",
    completedAt: "2025-05-08",
    rating: 4.6,
  },
  {
    internId: 1,
    taskId: 113,
    title: "Анализ требований",
    type: "host",
    completedAt: "2025-05-12",
    rating: 4.4,
  },
  {
    internId: 1,
    taskId: 114,
    title: "Отчёт по аналитике",
    type: "feed",
    completedAt: "2025-05-15",
    rating: 4.7,
  },
  {
    internId: 2,
    taskId: 115,
    title: "Разработка модуля",
    type: "host",
    completedAt: "2025-04-02",
    rating: 4.3,
  },
  {
    internId: 2,
    taskId: 116,
    title: "Баг-фикс",
    type: "feed",
    completedAt: "2025-04-04",
    rating: 4.7,
  },
  {
    internId: 2,
    taskId: 117,
    title: "Оптимизация",
    type: "host",
    completedAt: "2025-04-07",
    rating: 4.5,
  },
  {
    internId: 2,
    taskId: 118,
    title: "Разработка фичи",
    type: "feed",
    completedAt: "2025-04-12",
    rating: 4.6,
  },
  {
    internId: 2,
    taskId: 119,
    title: "Баг-фикс",
    type: "host",
    completedAt: "2025-04-16",
    rating: 4.4,
  },
  {
    internId: 2,
    taskId: 120,
    title: "Оптимизация",
    type: "feed",
    completedAt: "2025-04-20",
    rating: 4.8,
  },
  {
    internId: 2,
    taskId: 121,
    title: "Разработка модуля",
    type: "host",
    completedAt: "2025-05-02",
    rating: 4.3,
  },
  {
    internId: 2,
    taskId: 122,
    title: "Баг-фикс",
    type: "feed",
    completedAt: "2025-05-04",
    rating: 4.7,
  },
  {
    internId: 2,
    taskId: 123,
    title: "Оптимизация",
    type: "host",
    completedAt: "2025-05-07",
    rating: 4.5,
  },
  {
    internId: 2,
    taskId: 124,
    title: "Разработка фичи",
    type: "feed",
    completedAt: "2025-05-11",
    rating: 4.6,
  },
  {
    internId: 3,
    taskId: 125,
    title: "Дизайн интерфейса",
    type: "host",
    completedAt: "2025-04-01",
    rating: 4.9,
  },
  {
    internId: 3,
    taskId: 126,
    title: "Прототипирование",
    type: "feed",
    completedAt: "2025-04-03",
    rating: 4.8,
  },
  {
    internId: 3,
    taskId: 127,
    title: "Юзабилити тесты",
    type: "host",
    completedAt: "2025-04-06",
    rating: 4.7,
  },
  {
    internId: 3,
    taskId: 128,
    title: "Дизайн компонентов",
    type: "feed",
    completedAt: "2025-04-10",
    rating: 4.9,
  },
  {
    internId: 3,
    taskId: 129,
    title: "Прототипирование",
    type: "host",
    completedAt: "2025-04-14",
    rating: 4.8,
  },
  {
    internId: 3,
    taskId: 130,
    title: "Юзабилити тесты",
    type: "feed",
    completedAt: "2025-04-18",
    rating: 4.7,
  },
  {
    internId: 3,
    taskId: 131,
    title: "Дизайн интерфейса",
    type: "host",
    completedAt: "2025-05-01",
    rating: 4.9,
  },
  {
    internId: 3,
    taskId: 132,
    title: "Прототипирование",
    type: "feed",
    completedAt: "2025-05-03",
    rating: 4.8,
  },
  {
    internId: 3,
    taskId: 133,
    title: "Юзабилити тесты",
    type: "host",
    completedAt: "2025-05-06",
    rating: 4.7,
  },
  {
    internId: 3,
    taskId: 134,
    title: "Дизайн компонентов",
    type: "feed",
    completedAt: "2025-05-10",
    rating: 4.9,
  },
  {
    internId: 4,
    taskId: 135,
    title: "ML модель",
    type: "host",
    completedAt: "2025-04-02",
    rating: 4.6,
  },
  {
    internId: 4,
    taskId: 136,
    title: "Предобработка данных",
    type: "feed",
    completedAt: "2025-04-05",
    rating: 4.8,
  },
  {
    internId: 4,
    taskId: 137,
    title: "Обучение модели",
    type: "host",
    completedAt: "2025-04-09",
    rating: 4.7,
  },
  {
    internId: 4,
    taskId: 138,
    title: "Оценка качества",
    type: "feed",
    completedAt: "2025-04-13",
    rating: 4.9,
  },
  {
    internId: 4,
    taskId: 139,
    title: "ML модель",
    type: "host",
    completedAt: "2025-04-17",
    rating: 4.6,
  },
  {
    internId: 4,
    taskId: 140,
    title: "Предобработка данных",
    type: "feed",
    completedAt: "2025-04-21",
    rating: 4.8,
  },
  {
    internId: 4,
    taskId: 141,
    title: "ML модель",
    type: "host",
    completedAt: "2025-05-02",
    rating: 4.6,
  },
  {
    internId: 4,
    taskId: 142,
    title: "Предобработка данных",
    type: "feed",
    completedAt: "2025-05-05",
    rating: 4.8,
  },
  {
    internId: 4,
    taskId: 143,
    title: "Обучение модели",
    type: "host",
    completedAt: "2025-05-09",
    rating: 4.7,
  },
  {
    internId: 4,
    taskId: 144,
    title: "Оценка качества",
    type: "feed",
    completedAt: "2025-05-13",
    rating: 4.9,
  },
];

// Массив отзывов о практикантах
const reviews = [
  {
    internId: 1,
    author: "Алексей Петров",
    text: "Отличная работа, быстро справился с задачей",
    rating: 5,
    date: "2025-05-08",
  },
  {
    internId: 1,
    author: "Мария Иванова",
    text: "Хорошее качество кода, но нужно улучшить документацию",
    rating: 4,
    date: "2025-05-05",
  },
  {
    internId: 2,
    author: "Дмитрий Сидоров",
    text: "Профессиональный подход, рекомендую",
    rating: 5,
    date: "2025-05-07",
  },
  {
    internId: 3,
    author: "Елена Козлова",
    text: "Творческий подход к дизайну",
    rating: 5,
    date: "2025-05-06",
  },
  {
    internId: 4,
    author: "Олег Иванов",
    text: "Хороший анализ данных",
    rating: 4,
    date: "2025-05-05",
  },
];

// Массив целей блоков
const blockGoals = [
  { block: "Аналитика", goal: "Улучшение процессов", progress: 75 },
  { block: "Аналитика", goal: "Автоматизация отчётов", progress: 60 },
  { block: "IT", goal: "Модернизация инфраструктуры", progress: 45 },
  { block: "IT", goal: "Внедрение CI/CD", progress: 80 },
  { block: "Маркетинг", goal: "Запуск кампании", progress: 30 },
  { block: "Маркетинг", goal: "Увеличение конверсии", progress: 55 },
];

// Еженедельная статистика (задачи и поднятые руки)
const weeklyStats = [
  { week: "Неделя 1", tasksCreated: 12, handsRaised: 8 },
  { week: "Неделя 2", tasksCreated: 15, handsRaised: 10 },
  { week: "Неделя 3", tasksCreated: 18, handsRaised: 12 },
  { week: "Неделя 4", tasksCreated: 14, handsRaised: 9 },
  { week: "Неделя 5", tasksCreated: 20, handsRaised: 15 },
  { week: "Неделя 6", tasksCreated: 16, handsRaised: 11 },
];

// Скорость отклика по блокам (в часах)
const responseTimeByBlock = [
  { block: "Аналитика", avgResponseTime: 1.5 },
  { block: "IT", avgResponseTime: 2.2 },
  { block: "Маркетинг", avgResponseTime: 1.8 },
  { block: "Продукт", avgResponseTime: 2.5 },
  { block: "Разработка", avgResponseTime: 1.2 },
];

// Средние оценки по блокам
const avgRatingByBlock = [
  { block: "Аналитика", avgRating: 4.6 },
  { block: "IT", avgRating: 4.4 },
  { block: "Маркетинг", avgRating: 4.7 },
  { block: "Продукт", avgRating: 4.5 },
  { block: "Разработка", avgRating: 4.8 },
];

// Активность блоков
const blockActivity = [
  {
    block: "Аналитика",
    tasksCreated: 45,
    tasksClosed: 38,
    responses: 42,
    overduePercent: 8,
  },
  {
    block: "IT",
    tasksCreated: 52,
    tasksClosed: 45,
    responses: 48,
    overduePercent: 12,
  },
  {
    block: "Маркетинг",
    tasksCreated: 38,
    tasksClosed: 32,
    responses: 35,
    overduePercent: 5,
  },
  {
    block: "Продукт",
    tasksCreated: 41,
    tasksClosed: 36,
    responses: 39,
    overduePercent: 10,
  },
  {
    block: "Разработка",
    tasksCreated: 58,
    tasksClosed: 52,
    responses: 55,
    overduePercent: 7,
  },
];

// Нагрузка на хостов
const hostLoad = [
  {
    hostId: 102,
    hostName: "Мария Иванова",
    block: "Маркетинг",
    activeTasks: 6,
    avgRating: 4.7,
  },
  {
    hostId: 104,
    hostName: "Елена Козлова",
    block: "Аналитика",
    activeTasks: 8,
    avgRating: 4.8,
  },
  {
    hostId: 105,
    hostName: "Олег Иванов",
    block: "Маркетинг",
    activeTasks: 4,
    avgRating: 4.5,
  },
];

// Функция для расчёта прогресса задачи с мемоизацией
const progressCache = new Map();

function calculateProgress(task) {
  // Create a cache key based on task ID and checklist state
  const cacheKey = `${task.id}_${task.checklist.map((item) => (item.checked ? "1" : "0")).join("")}`;

  // Return cached result if available
  if (progressCache.has(cacheKey)) {
    return progressCache.get(cacheKey);
  }

  const total = task.checklist.length;
  const checked = task.checklist.filter((item) => item.checked).length;
  const progress = Math.round((checked / total) * 100);

  // Cache the result
  progressCache.set(cacheKey, progress);

  return progress;
}

// Invalidate cache for a specific task when its checklist changes
function invalidateProgressCache(taskId) {
  for (const key of progressCache.keys()) {
    if (key.startsWith(taskId + "_")) {
      progressCache.delete(key);
    }
  }
}

// Функция для применения штрафа за отказ от задачи
function applyTaskRejectionPenalty(internId, penaltyAmount = -0.3) {
  const intern = allUsers.find((u) => u.id === internId);
  if (intern) {
    intern.rating = (parseFloat(intern.rating) + penaltyAmount).toFixed(1);
    // Перерисовываем список пользователей для обновления рейтинга
    renderUsersList();
    // Обновляем рейтинг в профиле, если это текущий пользователь
    if (currentRole === "intern" && internId === currentInternId) {
      const currentUserRating = document.getElementById("currentUserRating");
      if (currentUserRating) {
        currentUserRating.textContent = intern.rating;
      }
    }
    return intern.rating;
  }
  return null;
}

// Функция для рендеринга карточки задачи хоста
function renderHostTaskCard(task) {
  const card = document.createElement("div");
  card.className = "host-task-card";
  card.setAttribute("data-task-id", task.id);

  const progress = calculateProgress(task);

  let checklistHTML = "";
  task.checklist.forEach((item, index) => {
    const extraInfo =
      task.taskType === "complex" && item.deadline && item.effort
        ? `<span style="font-size: 12px; color: #666; margin-left: 8px;">до ${formatDate(item.deadline)}, ${item.effort}ч</span>`
        : "";

    checklistHTML += `
            <div class="checklist-item">
              <input type="checkbox" id="task-${task.id}-item-${item.id}"
                     data-task-id="${task.id}" data-item-id="${item.id}"
                     ${item.checked ? "checked" : ""}>
              <label for="task-${task.id}-item-${item.id}">${item.text}${extraInfo}</label>
            </div>
          `;
  });

  card.innerHTML = `
          <h3 class="host-task-title">${task.title}</h3>
          ${task.taskType === "complex" ? '<span style="font-size: 12px; color: #2cb5b4; background: #e8f5f5; padding: 2px 8px; border-radius: 4px;">Сложная задача</span>' : ""}
          <div class="checklist">
            ${checklistHTML}
          </div>
          <div class="progress-container">
            <div class="progress-bar-bg">
              <div class="progress-bar-fill" style="width: ${progress}%"></div>
            </div>
            <div class="progress-text">${progress}% выполнено</div>
          </div>
          <button class="notify-btn" data-task-id="${task.id}">Сообщить хосту</button>
        `;

  return card;
}

// Функция для рендеринга карточки черновика задачи
function renderDraftTaskCard(task) {
  const card = document.createElement("div");
  card.className = "host-task-card";
  card.setAttribute("data-draft-id", task.id);
  card.style.borderLeft = "4px solid #f59e0b";

  let checklistHTML = "";
  task.checklist.forEach((item, index) => {
    const extraInfo =
      task.taskType === "complex" && item.deadline && item.effort
        ? `<span style="font-size: 12px; color: #666; margin-left: 8px;">до ${formatDate(item.deadline)}, ${item.effort}ч</span>`
        : "";

    checklistHTML += `
            <div class="checklist-item">
              <input type="checkbox" disabled>
              <label>${item.text}${extraInfo}</label>
            </div>
          `;
  });

  card.innerHTML = `
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
            <h3 class="host-task-title">${task.title}</h3>
            <span style="font-size: 12px; color: #f59e0b; background: #fffbeb; padding: 4px 8px; border-radius: 4px;">На согласовании</span>
          </div>
          <div class="checklist">
            ${checklistHTML}
          </div>
          <div style="display: flex; gap: 8px; margin-top: 16px;">
            <button class="notify-btn" style="flex: 1; background-color: #f59e0b;" data-draft-id="${task.id}" data-action="send">Отправить хосту</button>
            <button class="notify-btn" style="flex: 1; background-color: #e5e7eb; color: #333;" data-draft-id="${task.id}" data-action="edit">Редактировать</button>
            <button class="notify-btn" style="flex: 1; background-color: #ef4444;" data-draft-id="${task.id}" data-action="delete">Удалить</button>
          </div>
        `;

  return card;
}

// Функция для рендеринга всех задач хоста
function renderHostTasks() {
  const myTasksContent = document.getElementById("my-tasks-content");
  const internTasksContent = document.getElementById("intern-tasks-content");
  const pendingApprovalContent = document.getElementById(
    "pending-approval-content",
  );

  // Очищаем контейнеры
  if (myTasksContent) myTasksContent.innerHTML = "";
  if (internTasksContent) internTasksContent.innerHTML = "";
  if (pendingApprovalContent) pendingApprovalContent.innerHTML = "";

  // Скрываем кнопку создания черновика для всех ролей, кроме практика
  const createDraftContainer = document.getElementById(
    "create-draft-task-container",
  );
  if (createDraftContainer) {
    createDraftContainer.style.display = "none";
  }

  if (currentRole === "intern") {
    // Показываем кнопку создания черновика для практики
    if (createDraftContainer) {
      createDraftContainer.style.display = "block";
    }

    // Скрываем вкладки для практики
    const hostTabs = document.getElementById("hostTabs");
    if (hostTabs) hostTabs.style.display = "none";

    // Скрываем все контенты вкладок и показываем только my-tasks-content
    document
      .querySelectorAll("#mytasks-screen .tab-content")
      .forEach((content) => {
        content.style.display = "none";
      });
    if (myTasksContent) myTasksContent.style.display = "block";

    // Для практики показываем его задачи с чек-листами (фильтруем по internId)
    const internTasks = hostTasks.filter((t) => t.internId === currentInternId);
    const internDraftTasks = draftTasks.filter(
      (t) => t.internId === currentInternId,
    );

    if (internTasks.length === 0 && internDraftTasks.length === 0) {
      myTasksContent.innerHTML = `
              <div class="feed-placeholder">
                <h2>Нет задач</h2>
                <p>У вас пока нет назначенных задач</p>
              </div>
            `;
    } else {
      // Сначала показываем черновики
      internDraftTasks.forEach((task) => {
        const card = renderDraftTaskCard(task);
        myTasksContent.appendChild(card);
      });

      // Затем активные задачи
      internTasks.forEach((task) => {
        const card = renderHostTaskCard(task);
        myTasksContent.appendChild(card);
      });
    }

    // Добавляем обработчики для чекбоксов
    const checkboxes = myTasksContent.querySelectorAll(
      'input[type="checkbox"]',
    );
    checkboxes.forEach((checkbox) => {
      checkbox.addEventListener("change", handleCheckboxChange);
    });

    // Named function for checkbox change handler (to avoid deprecated arguments.callee)
    function handleCheckboxChange() {
      const taskId = parseInt(this.getAttribute("data-task-id"));
      const itemId = parseInt(this.getAttribute("data-item-id"));

      // Обновляем состояние в массиве
      const task = hostTasks.find((t) => t.id === taskId);
      if (task) {
        const item = task.checklist.find((i) => i.id === itemId);
        if (item) {
          item.checked = this.checked;

          // Перерисовываем карточку для обновления прогресса
          const card = myTasksContent.querySelector(
            `[data-task-id="${taskId}"]`,
          );
          if (card) {
            const newCard = renderHostTaskCard(task);
            card.replaceWith(newCard);

            // Добавляем обработчики для новой карточки
            const newCheckboxes = newCard.querySelectorAll(
              'input[type="checkbox"]',
            );
            newCheckboxes.forEach((cb) => {
              cb.addEventListener("change", handleCheckboxChange);
            });

            const notifyBtn = newCard.querySelector(".notify-btn");
            if (notifyBtn) {
              notifyBtn.addEventListener("click", function () {
                alert("Уведомление отправлено хосту о задаче #" + taskId);
              });
            }
          }
        }
      }
    }
  } else if (currentRole === "host") {
    // Для хоста показываем вкладки с задачами
    // Вкладка "Мои задачи" - задачи сотрудника
    const employeeTasks = tasks.filter((t) => t.authorId === currentEmployeeId);

    if (myTasksContent) {
      if (employeeTasks.length === 0) {
        myTasksContent.innerHTML = `
                <div class="feed-placeholder">
                  <h2>Нет задач</h2>
                  <p>Вы ещё не создали ни одной задачи</p>
                </div>
              `;
      } else {
        employeeTasks.forEach((task) => {
          const card = renderEmployeeTaskCard(task);
          myTasksContent.appendChild(card);
        });
      }
    }

    // Вкладка "Задачи моих практикантов"
    if (internTasksContent) {
      if (hostTasks.length === 0) {
        internTasksContent.innerHTML = `
                <div class="feed-placeholder">
                  <h2>Нет задач практикантов</h2>
                  <p>Вы ещё не поставили ни одной задачи</p>
                </div>
              `;
      } else {
        hostTasks.forEach((task) => {
          const progress = calculateProgress(task);
          const card = document.createElement("div");
          card.className = "host-task-card";
          card.setAttribute("data-task-id", task.id);

          let checklistHTML = "";
          task.checklist.forEach((item) => {
            const extraInfo =
              task.taskType === "complex" && item.deadline && item.effort
                ? `<span style="font-size: 12px; color: #666; display: block; margin-top: 4px;">до ${formatDate(item.deadline)}, ${item.effort}ч</span>`
                : "";

            checklistHTML += `
                  <div class="checklist-item">
                    <input type="checkbox" disabled ${item.checked ? "checked" : ""}>
                    <span class="checklist-text">${item.text}${extraInfo}</span>
                  </div>
                `;
          });

          const taskTypeBadge =
            task.taskType === "complex"
              ? '<span style="font-size: 11px; color: #2cb5b4; background: #e8f5f5; padding: 2px 8px; border-radius: 4px; display: inline-block; margin-bottom: 8px;">Сложная задача</span>'
              : "";

          card.innerHTML = `
                <div class="task-header">
                  <h3 class="task-title">${task.title}</h3>
                  <span class="task-deadline">до ${formatDate(task.deadline)}</span>
                </div>
                ${taskTypeBadge}
                <div class="task-meta">
                  <div class="meta-item">
                    <span class="meta-label">Практикант:</span> ${task.internName}
                  </div>
                  <div class="meta-item">
                    <span class="meta-label">Вклад:</span> ${typeof task.contribution === "number" ? task.contribution.toFixed(1) : task.contribution}
                  </div>
                  <div class="meta-item">
                    <span class="meta-label">Трудозатраты:</span> ${task.effort || "Не указано"}
                  </div>
                </div>
                <p class="task-description">${task.description}</p>
                <div class="checklist-container">
                  ${checklistHTML}
                </div>
                <div class="progress-section">
                  <div class="progress-bar-bg">
                    <div class="progress-bar-fill" style="width: ${progress}%"></div>
                  </div>
                  <div class="progress-text">${progress}% выполнено</div>
                </div>
                <div style="display: flex; gap: 8px;">
                  <button class="edit-task-btn" data-task-id="${task.id}" style="flex: 1; background-color: #f5a623; color: white; border: none; padding: 10px 20px; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer;">Редактировать</button>
                  ${
                    progress === 100
                      ? `<button class="complete-task-btn" data-task-id="${task.id}" style="flex: 1;">Завершить задачу</button>`
                      : `<button class="complete-task-btn" data-task-id="${task.id}" disabled style="flex: 1; opacity: 0.5; cursor: not-allowed;">Завершить задачу</button>`
                  }
                </div>
              `;

          internTasksContent.appendChild(card);
        });
      }
    }

    // Вкладка "Задачи на согласовании"
    const pendingApprovalContent = document.getElementById(
      "pending-approval-content",
    );
    if (pendingApprovalContent) {
      // Для хоста показываем черновики задач, которые требуют согласования
      if (draftTasks.length === 0) {
        pendingApprovalContent.innerHTML = `
                <div class="feed-placeholder">
                  <h2>Нет задач на согласовании</h2>
                  <p>Нет черновиков, требующих вашего согласования</p>
                </div>
              `;
      } else {
        draftTasks.forEach((task) => {
          const card = renderDraftTaskCard(task);
          pendingApprovalContent.appendChild(card);
        });
      }
    }
  } else if (currentRole === "employee") {
    // Для сотрудника показываем созданные ими задачи
    const employeeTasks = tasks.filter((t) => t.authorId === currentEmployeeId);

    // Скрываем вкладки для сотрудника
    const hostTabs = document.getElementById("hostTabs");
    if (hostTabs) hostTabs.style.display = "none";

    // Скрываем все контенты вкладок и показываем только my-tasks-content
    document
      .querySelectorAll("#mytasks-screen .tab-content")
      .forEach((content) => {
        content.style.display = "none";
      });
    if (myTasksContent) myTasksContent.style.display = "block";

    if (employeeTasks.length === 0) {
      myTasksContent.innerHTML = `
            <div class="feed-placeholder">
              <h2>Нет задач</h2>
              <p>Вы ещё не создали ни одной задачи</p>
            </div>
          `;
    } else {
      employeeTasks.forEach((task) => {
        const card = renderEmployeeTaskCard(task);
        myTasksContent.appendChild(card);
      });
    }
  } else if (currentRole === "supervisor") {
    // Для куратора показываем вкладки с задачами
    // Вкладка "Созданные задачи" - задачи куратора
    const supervisorTasks = tasks.filter(
      (t) => t.authorId === currentEmployeeId,
    );

    if (myTasksContent) {
      if (supervisorTasks.length === 0) {
        myTasksContent.innerHTML = `
                <div class="feed-placeholder">
                  <h2>Нет задач</h2>
                  <p>Вы ещё не создали ни одной задачи</p>
                </div>
              `;
      } else {
        supervisorTasks.forEach((task) => {
          const card = renderEmployeeTaskCard(task);
          myTasksContent.appendChild(card);
        });
      }
    }

    // Вкладка "Задачи моих практикантов"
    if (internTasksContent) {
      if (hostTasks.length === 0) {
        internTasksContent.innerHTML = `
                <div class="feed-placeholder">
                  <h2>Нет задач практикантов</h2>
                  <p>У ваших практикантов пока нет задач</p>
                </div>
              `;
      } else {
        hostTasks.forEach((task) => {
          const progress = calculateProgress(task);
          const card = document.createElement("div");
          card.className = "host-task-card";
          card.setAttribute("data-task-id", task.id);

          let checklistHTML = "";
          task.checklist.forEach((item) => {
            const extraInfo =
              task.taskType === "complex" && item.deadline && item.effort
                ? `<span style="font-size: 12px; color: #666; display: block; margin-top: 4px;">до ${formatDate(item.deadline)}, ${item.effort}ч</span>`
                : "";

            checklistHTML += `
                  <div class="checklist-item">
                    <input type="checkbox" disabled ${item.checked ? "checked" : ""}>
                    <span class="checklist-text">${item.text}${extraInfo}</span>
                  </div>
                `;
          });

          const taskTypeBadge =
            task.taskType === "complex"
              ? '<span style="font-size: 11px; color: #2cb5b4; background: #e8f5f5; padding: 2px 8px; border-radius: 4px; display: inline-block; margin-bottom: 8px;">Сложная задача</span>'
              : "";

          card.innerHTML = `
                <div class="task-header">
                  <h3 class="task-title">${task.title}</h3>
                  <span class="task-deadline">до ${formatDate(task.deadline)}</span>
                </div>
                ${taskTypeBadge}
                <div class="task-meta">
                  <div class="meta-item">
                    <span class="meta-label">Практикант:</span> ${task.internName}
                  </div>
                  <div class="meta-item">
                    <span class="meta-label">Вклад:</span> ${typeof task.contribution === "number" ? task.contribution.toFixed(1) : task.contribution}
                  </div>
                  <div class="meta-item">
                    <span class="meta-label">Трудозатраты:</span> ${task.effort || "Не указано"}
                  </div>
                </div>
                <p class="task-description">${task.description}</p>
                <div class="checklist-container">
                  ${checklistHTML}
                </div>
                <div class="progress-section">
                  <div class="progress-bar-bg">
                    <div class="progress-bar-fill" style="width: ${progress}%"></div>
                  </div>
                  <div class="progress-text">${progress}% выполнено</div>
                </div>
              `;

          internTasksContent.appendChild(card);
        });
      }
    }

    // Вкладка "Задачи на согласовании"
    const pendingApprovalContent = document.getElementById(
      "pending-approval-content",
    );
    if (pendingApprovalContent) {
      // Для куратора показываем черновики задач, которые требуют согласования
      if (draftTasks.length === 0) {
        pendingApprovalContent.innerHTML = `
                <div class="feed-placeholder">
                  <h2>Нет задач на согласовании</h2>
                  <p>Нет черновиков, требующих вашего согласования</p>
                </div>
              `;
      } else {
        draftTasks.forEach((task) => {
          const card = renderDraftTaskCard(task);
          pendingApprovalContent.appendChild(card);
        });
      }
    }
  }
}

// Делегирование событий для кнопок в myTasksScreen
myTasksScreen.addEventListener("click", function (e) {
  const respondBtn = e.target.closest(".respond-btn");
  if (respondBtn) {
    const taskId = respondBtn.getAttribute("data-task-id");
    alert("Отклики на задачу #" + taskId);
    return;
  }

  const notifyBtn = e.target.closest(".notify-btn");
  if (notifyBtn) {
    const taskId = notifyBtn.getAttribute("data-task-id");
    alert("Уведомление отправлено хосту о задаче #" + taskId);
    return;
  }
});

// Делегирование событий для кнопок в internTasksContent (для хоста)
const internTasksContent = document.getElementById("intern-tasks-content");
if (internTasksContent) {
  internTasksContent.addEventListener("click", function (e) {
    const editBtn = e.target.closest(".edit-task-btn");
    if (editBtn) {
      const taskId = parseInt(editBtn.getAttribute("data-task-id"));
      const task = hostTasks.find((t) => t.id === taskId);
      if (task) {
        // Открываем модальное окно редактирования задачи
        const hostTaskModal = document.getElementById("hostTaskModal");

        // Cache DOM elements
        const hostTaskName = document.getElementById("hostTaskName");
        const hostTaskDescription = document.getElementById(
          "hostTaskDescription",
        );
        const hostTaskEffort = document.getElementById("hostTaskEffort");
        const hostTaskDeadline = document.getElementById("hostTaskDeadline");
        const hostTaskGoal = document.getElementById("hostTaskGoal");
        const hostTaskOperational = document.getElementById(
          "hostTaskOperational",
        );
        const checklistContainer = document.getElementById("hostTaskChecklist");

        // Заполняем поля формы данными задачи
        if (hostTaskName) hostTaskName.value = task.title;
        if (hostTaskDescription) hostTaskDescription.value = task.description;
        if (hostTaskEffort) hostTaskEffort.value = task.effort || "";
        if (hostTaskDeadline) hostTaskDeadline.value = task.deadline;
        if (hostTaskGoal)
          hostTaskGoal.value =
            typeof task.contribution === "number"
              ? task.contribution.toString()
              : task.contribution || "";
        if (hostTaskOperational)
          hostTaskOperational.checked = task.operational || false;

        // Заполняем чек-лист
        checklistContainer.innerHTML = "";
        task.checklist.forEach((item, index) => {
          const row = document.createElement("div");
          row.className = "checklist-row";
          row.innerHTML = `
                  <input type="text" class="modal-input checklist-input" value="${item.text}" placeholder="Элемент чек-листа" />
                  <button type="button" class="remove-checklist-btn" style="display: ${task.checklist.length > 1 ? "flex" : "none"};">×</button>
                `;
          checklistContainer.appendChild(row);
        });

        // Сохраняем данные для редактирования
        hostTaskModal.dataset.editMode = "true";
        hostTaskModal.dataset.taskId = taskId;
        hostTaskModal.dataset.internName = task.internName;

        // Меняем заголовок и кнопку
        hostTaskModal.querySelector(".modal-title").textContent =
          "Редактировать задачу";
        document.getElementById("hostTaskConfirm").textContent =
          "Сохранить изменения";

        hostTaskModal.classList.add("active");
      }
      return;
    }

    const completeBtn = e.target.closest(".complete-task-btn:not([disabled])");
    if (completeBtn) {
      const taskId = parseInt(completeBtn.getAttribute("data-task-id"));
      const task = hostTasks.find((t) => t.id === taskId);
      if (task) {
        // Открываем модальное окно завершения задачи
        const completeModal = document.getElementById("completeTaskModal");
        document.getElementById("completeTaskName").textContent = task.title;
        document.getElementById("completeWorkDescription").value = "";
        document.getElementById("completeRating").value = "";
        document.getElementById("completeReview").value = "";
        completeModal.dataset.taskId = taskId;
        completeModal.classList.add("active");
      }
      return;
    }
  });
}

// Функция для форматирования времени
function formatTimeSlot(startTime, endTime) {
  const start = new Date(startTime);
  const end = new Date(endTime);
  const options = {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  };
  const startStr = start.toLocaleDateString("ru-RU", options);
  const endOptions = { hour: "2-digit", minute: "2-digit" };
  const endStr = end.toLocaleDateString("ru-RU", endOptions);
  return `${startStr}–${endStr}`;
}

// Функция для рендеринга карточки практиканта (для сотрудника)
function renderInternCard(intern) {
  const card = document.createElement("div");
  card.className = "task-card";
  card.setAttribute("data-intern-id", intern.id);

  const timeSlot = formatTimeSlot(intern.startTime, intern.endTime);

  // Формируем блоки помощи
  let helpBlocksHTML = "";
  if (intern.helpBlocks && intern.helpBlocks.length > 0) {
    helpBlocksHTML = intern.helpBlocks
      .map((block) => `<span class="help-block">#${block}</span>`)
      .join(" ");
  } else {
    helpBlocksHTML = `<span class="help-block">Любой блок</span>`;
  }

  card.innerHTML = `
          <div class="task-header">
            <div class="author-avatar">${getInitials(intern.name)}</div>
            <div class="author-name">
              <div class="task-title">${intern.name}</div>
              <div class="task-title">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 14px; height: 14px; vertical-align: middle; margin-right: 2px;">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
                ${intern.rating}
              </div>
            </div>
          </div>
          <div class="task-meta">
            <div class="meta-item">
              <span class="meta-label">Блок практики:</span>${intern.block}
            </div>
            <div class="meta-item">
              <span class="meta-label">Хочет помочь:</span>${helpBlocksHTML}
            </div>
          </div>
          <p class="task-description">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 14px; height: 14px; vertical-align: middle; margin-right: 4px;">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            ${timeSlot}
          </p>
          <button class="respond-btn" data-intern-id="${intern.id}">Пригласить</button>
        `;

  return card;
}

// Функция для рендеринга ленты поднятых рук (для сотрудника)
function renderRaisedHands() {
  feedContent.innerHTML = "";
  if (raisedHands.length === 0) {
    feedContent.innerHTML = `
      <div class="feed-placeholder">
        <h2>Нет поднятых рук</h2>
        <p>В данный момент нет практикантов, готовых к работе</p>
      </div>
    `;
    return;
  }
  raisedHands.forEach((intern) => {
    const card = renderInternCard(intern);
    feedContent.appendChild(card);
  });
}

// Функция для переключения экранов
function switchScreen(screenId) {
  // Скрываем все экраны
  const screens = document.querySelectorAll(".screen");
  screens.forEach((screen) => {
    screen.classList.remove("active");
  });

  // Убираем активный класс со всех кнопок навигации
  const navItems = document.querySelectorAll(".nav-item");
  navItems.forEach((item) => {
    item.classList.remove("active");
  });

  // Показываем нужный экран
  const targetScreen = document.getElementById(screenId);
  if (targetScreen) {
    targetScreen.classList.add("active");
  }

  // Добавляем активный класс соответствующей кнопке
  const activeNav = document.querySelector(`.nav-item[data-nav="${screenId}"]`);
  if (activeNav) {
    activeNav.classList.add("active");
  }

  // Инициализируем аналитику при открытии экрана аналитики
  if (screenId === "analytics-screen") {
    initAnalytics();
  }

  // Инициализируем список пользователей при открытии экрана пользователей
  if (screenId === "users-screen") {
    // Показываем активную вкладку и скрываем остальные
    const activeTab = document.querySelector("#usersTabs .host-tab.active");
    if (activeTab) {
      const tabId = activeTab.getAttribute("data-tab");
      document
        .querySelectorAll("#users-screen .tab-content")
        .forEach((content) => {
          content.style.display = "none";
        });
      const selectedContent = document.getElementById(tabId + "-content");
      if (selectedContent) {
        selectedContent.style.display = "block";
      }
      // Рендерим соответствующий список
      if (tabId === "interns") {
        renderUsersList();
      } else if (tabId === "employees") {
        renderEmployeesList();
      }
    } else {
      // Если нет активной вкладки, показываем вкладку Практиканты по умолчанию
      renderUsersList();
    }
  }
}

// Функция для получения инициалов
function getInitials(name) {
  const parts = name.split(" ");
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
}

// Функция для форматирования даты
function formatDate(dateStr) {
  const date = new Date(dateStr);
  const options = { day: "numeric", month: "short" };
  return date.toLocaleDateString("ru-RU", options);
}

// Функция для рендеринга карточки задачи
function renderTaskCard(task) {
  const card = document.createElement("div");
  card.className = "task-card";

  let buttonHTML = "";
  if (currentRole === "intern") {
    // Практикант видит кнопку "Откликнуться"
    buttonHTML = `<button class="respond-btn" data-task-id="${task.id}">Откликнуться</button>`;
  } else if (currentRole === "employee") {
    // Сотрудник видит кнопку "Посмотреть отклики" только для своих задач
    if (task.authorId === currentEmployeeId) {
      buttonHTML = `<button class="respond-btn" data-task-id="${task.id}">Посмотреть отклики</button>`;
    } else {
      buttonHTML = `<button class="respond-btn" disabled style="opacity: 0.5; cursor: not-allowed;">Не ваша задача</button>`;
    }
  }

  card.innerHTML = `
          <div class="task-header">
            <h3 class="task-title">${task.title}</h3>
            <span class="task-deadline">до ${formatDate(task.deadline)}</span>
          </div>
          <div class="task-author">
            <div class="author-avatar">${getInitials(task.author)}</div>
            <span class="author-name">${task.author}</span>
          </div>
          <div class="task-meta">
            <div class="meta-item">
              <span class="meta-label">Вклад:</span> ${typeof task.contribution === "number" ? task.contribution.toFixed(1) : task.contribution}
            </div>
            <div class="meta-item">
              <span class="meta-label">Трудозатраты:</span> ${task.effort}
            </div>
          </div>
          <p class="task-description">${task.description}</p>
          ${buttonHTML}
        `;
  return card;
}

// Функция для рендеринга карточки задачи сотрудника (для "Мои задачи")
function renderEmployeeTaskCard(task) {
  const card = document.createElement("div");
  card.className = "task-card";

  card.innerHTML = `
            <div class="task-header">
              <h3 class="task-title">${task.title}</h3>
              <span class="task-deadline">до ${formatDate(task.deadline)}</span>
            </div>
            <div class="task-meta">
              <div class="meta-item">
                <span class="meta-label">Вклад:</span> ${typeof task.contribution === "number" ? task.contribution.toFixed(1) : task.contribution}
              </div>
              <div class="meta-item">
                <span class="meta-label">Трудозатраты:</span> ${task.effort}
              </div>
            </div>
            <p class="task-description">${task.description}</p>
            <button class="respond-btn" data-task-id="${task.id}">Посмотреть отклики</button>
          `;
  return card;
}

// Текущий режим ленты для куратора
let supervisorFeedMode = "raised-hands"; // "raised-hands" или "tasks"

// Функция для рендеринга всех задач
function renderTasks() {
  feedContent.innerHTML = "";

  // Показываем/скрываем переключатель для куратора
  const supervisorToggle = document.getElementById("supervisor-feed-toggle");
  if (supervisorToggle) {
    supervisorToggle.style.display =
      currentRole === "supervisor" ? "flex" : "none";
  }

  if (currentRole === "employee" || currentRole === "host") {
    // Для сотрудника и хоста показываем ленту поднятых рук
    renderRaisedHands();
  } else if (currentRole === "supervisor") {
    // Для куратора показываем в зависимости от режима
    if (supervisorFeedMode === "raised-hands") {
      renderRaisedHands();
    } else {
      // Показываем все задачи от всех сотрудников
      if (tasks.length === 0) {
        feedContent.innerHTML = `
          <div class="feed-placeholder">
            <h2>Нет задач</h2>
            <p>В данный момент нет доступных задач</p>
          </div>
        `;
        return;
      }
      tasks.forEach((task) => {
        const card = renderTaskCard(task);
        feedContent.appendChild(card);
      });
    }
  } else {
    // Для практиканта показываем задачи
    if (tasks.length === 0) {
      feedContent.innerHTML = `
        <div class="feed-placeholder">
          <h2>Нет задач</h2>
          <p>В данный момент нет доступных задач</p>
        </div>
      `;
      return;
    }
    tasks.forEach((task) => {
      const card = renderTaskCard(task);
      feedContent.appendChild(card);
    });
  }
}

// Делегирование событий для кнопок в feedContent (отклики и приглашения)
feedContent.addEventListener("click", function (e) {
  const respondBtn = e.target.closest(".respond-btn");
  if (respondBtn) {
    const taskId = respondBtn.getAttribute("data-task-id");
    const buttonText = respondBtn.textContent.trim();

    if (buttonText === "Откликнуться") {
      // Открываем модальное окно для ввода времени прихода
      const respondModal = document.getElementById("respondModal");
      const respondTimeInput = document.getElementById("respondTime");
      respondTimeInput.value = "";
      respondModal.classList.add("active");

      // Сохраняем ID задачи для последующей отправки
      respondModal.dataset.taskId = taskId;
    } else if (buttonText === "Посмотреть отклики") {
      // Для сотрудников показываем просто alert
      alert("Отклики на задачу #" + taskId);
    }
    return;
  }

  const inviteBtn = e.target.closest(".respond-btn[data-intern-id]");
  if (inviteBtn) {
    const internId = inviteBtn.getAttribute("data-intern-id");
    const intern = raisedHands.find((i) => i.id === parseInt(internId));
    if (intern) {
      openInviteModal(intern);
      alert(
        `Приглашение для практика ${intern.name} будет отправлено после выбора задачи`,
      );
    }
    return;
  }
});

// Обработчик для кнопки "Отмена" в модальном окне отклика
const respondCancel = document.getElementById("respondCancel");
if (respondCancel) {
  respondCancel.addEventListener("click", function () {
    const respondModal = document.getElementById("respondModal");
    if (respondModal) {
      respondModal.classList.remove("active");
    }
  });
}

// Обработчик для кнопки "Отправить отклик" в модальном окне
const respondConfirm = document.getElementById("respondConfirm");
if (respondConfirm) {
  respondConfirm.addEventListener("click", function () {
    const respondModal = document.getElementById("respondModal");
    const respondTimeInput = document.getElementById("respondTime");
    const taskId = respondModal ? respondModal.dataset.taskId : null;

    if (!respondTimeInput || !respondTimeInput.value) {
      alert("Пожалуйста, укажите время прихода");
      return;
    }

    // Здесь можно добавить логику отправки отклика на сервер
    alert("Отклик отправлен");

    // Закрываем модальное окно
    if (respondModal) {
      respondModal.classList.remove("active");
    }
  });
}

// Обработчики навигации
const navItems = document.querySelectorAll(".nav-item");
navItems.forEach((item) => {
  item.addEventListener("click", function () {
    const screenId = this.getAttribute("data-nav");
    switchScreen(screenId);

    // Если переключаемся на "Мои задачи", перерисовываем их
    if (screenId === "mytasks-screen") {
      renderHostTasks();
    }
  });
});

// Функция для рендеринга профиля в зависимости от роли
function renderProfile() {
  const internProfileContent = document.getElementById(
    "intern-profile-content",
  );
  const employeeProfileContent = document.getElementById(
    "employee-profile-content",
  );
  const hostProfileContent = document.getElementById("host-profile-content");
  const supervisorProfileContent = document.getElementById(
    "supervisor-profile-content",
  );
  const activeInvitationsSection = document.getElementById(
    "active-invitations-section",
  );

  // Hide all profile sections first
  if (internProfileContent) internProfileContent.style.display = "none";
  if (employeeProfileContent) employeeProfileContent.style.display = "none";
  if (hostProfileContent) hostProfileContent.style.display = "none";
  if (supervisorProfileContent) supervisorProfileContent.style.display = "none";
  if (activeInvitationsSection) activeInvitationsSection.style.display = "none";

  if (currentRole === "intern") {
    // Показываем профиль практиканта
    if (internProfileContent) internProfileContent.style.display = "block";

    // Заполняем данные практиканта
    const internData = currentUser.intern;

    // Update personal info block
    updateProfileField("personal-info-content", "name", internData.name);
    updateProfileField("personal-info-content", "block", internData.block);
    updateProfileField("personal-info-content", "email", "ivan.petrov@veb.ru");
    updateProfileField("personal-info-content", "phone", "+7 (999) 123-45-67");

    // Update interests and schedule block
    updateProfileInterests("interests-schedule-content", internData.interests);
    updateProfileSchedule("interests-schedule-content", internData.schedule);
  } else if (currentRole === "employee") {
    // Показываем профиль сотрудника
    if (employeeProfileContent) employeeProfileContent.style.display = "block";

    // Заполняем данные сотрудника
    const employeeData = currentUser.employee;

    // Update personal info block
    updateProfileField(
      "employee-personal-info-content",
      "name",
      employeeData.name,
    );
    updateProfileField(
      "employee-personal-info-content",
      "block",
      employeeData.block,
    );
    updateProfileField(
      "employee-personal-info-content",
      "position",
      "Аналитик",
    );
    updateProfileField(
      "employee-personal-info-content",
      "email",
      "alexey.petrov@veb.ru",
    );
    updateProfileField(
      "employee-personal-info-content",
      "phone",
      "+7 (999) 234-56-78",
    );
  } else if (currentRole === "host") {
    // Показываем профиль хоста
    if (hostProfileContent) hostProfileContent.style.display = "block";

    // Заполняем данные хоста
    const hostData = currentUser.employee;

    // Update personal info block
    updateProfileField("host-personal-info-content", "name", hostData.name);
    updateProfileField("host-personal-info-content", "block", hostData.block);
    updateProfileField(
      "host-personal-info-content",
      "position",
      "Старший аналитик",
    );
    updateProfileField(
      "host-personal-info-content",
      "email",
      "alexey.petrov@veb.ru",
    );
    updateProfileField(
      "host-personal-info-content",
      "phone",
      "+7 (999) 234-56-78",
    );
  } else if (currentRole === "supervisor") {
    // Показываем профиль куратора
    if (supervisorProfileContent)
      supervisorProfileContent.style.display = "block";

    // Заполняем данные куратора
    const supervisorData = currentUser.supervisor;

    // Update personal info block
    updateProfileField(
      "supervisor-personal-info-content",
      "name",
      supervisorData.name,
    );
    updateProfileField(
      "supervisor-personal-info-content",
      "block",
      supervisorData.block,
    );
    updateProfileField(
      "supervisor-personal-info-content",
      "position",
      "Куратор практики",
    );
    updateProfileField(
      "supervisor-personal-info-content",
      "email",
      "maria.ivanova@veb.ru",
    );
    updateProfileField(
      "supervisor-personal-info-content",
      "phone",
      "+7 (999) 345-67-89",
    );
  }

  // Re-initialize inline editing for the visible profile
  initProfileInlineEditing();
}

// Helper function to update profile field values in both view and edit modes
function updateProfileField(contentId, fieldName, value) {
  const content = document.getElementById(contentId);
  if (!content) return;

  // Update view mode
  const viewField = content.querySelector(
    `.view-mode .field-value[data-field="${fieldName}"]`,
  );
  if (viewField) {
    viewField.textContent = value;
  }

  // Update edit mode
  const editField = content.querySelector(
    `.edit-mode [data-field="${fieldName}"]`,
  );
  if (editField) {
    editField.value = value;
  }
}

// Helper function to update interests in both view and edit modes
function updateProfileInterests(contentId, interests) {
  const content = document.getElementById(contentId);
  if (!content) return;

  // Update view mode
  const interestsList = content.querySelector(".view-mode .interests-list");
  if (interestsList) {
    interestsList.innerHTML = interests
      .map((interest) => `<span class="interest-tag">${interest}</span>`)
      .join("");
  }

  // Update edit mode
  const interestsEdit = content.querySelector(".edit-mode .interests-edit");
  if (interestsEdit) {
    interestsEdit.innerHTML =
      interests
        .map(
          (interest) => `
      <div class="interests-inputs">
        <input type="text" class="interest-input" value="${interest}">
        <button class="remove-interest">×</button>
      </div>
    `,
        )
        .join("") +
      `
      <button class="add-interest-btn">+ Добавить интерес</button>
    `;

    // Re-add event listeners
    initInterestListeners(interestsEdit);
  }
}

// Helper function to update schedule in both view and edit modes
function updateProfileSchedule(contentId, schedule) {
  const content = document.getElementById(contentId);
  if (!content) return;

  const statusText = {
    morning: "до обеда",
    afternoon: "после обеда",
    out: "не в офисе",
    all_day: "целый день",
  };

  const dayMap = { Пн: "mon", Вт: "tue", Ср: "wed", Чт: "thu", Пт: "fri" };

  // Update view mode
  const scheduleDisplay = content.querySelector(".view-mode .schedule-display");
  if (scheduleDisplay) {
    scheduleDisplay.innerHTML = schedule
      .map(
        (day) => `
      <div class="schedule-row">
        <span class="day-label">${day.day}</span>
        <span class="schedule-status ${day.status}" data-status="${day.status}">${statusText[day.status]}</span>
      </div>
    `,
      )
      .join("");
  }

  // Update edit mode
  const scheduleEdit = content.querySelector(".edit-mode .schedule-edit");
  if (scheduleEdit) {
    scheduleEdit.innerHTML = schedule
      .map(
        (day) => `
      <div class="schedule-row">
        <span class="day-label">${day.day}</span>
        <select class="schedule-select" data-day="${dayMap[day.day]}">
          <option value="morning" ${day.status === "morning" ? "selected" : ""}>до обеда</option>
          <option value="afternoon" ${day.status === "afternoon" ? "selected" : ""}>после обеда</option>
          <option value="out" ${day.status === "out" ? "selected" : ""}>не в офисе</option>
        </select>
      </div>
    `,
      )
      .join("");
  }
}

// Функция для рендеринга активных приглашений
function renderActiveInvitations() {
  const activeInvitationsList = document.getElementById(
    "active-invitations-list",
  );
  activeInvitationsList.innerHTML = "";

  if (activeInvitations.length === 0) {
    activeInvitationsList.innerHTML =
      '<div style="padding: 16px; color: #999; text-align: center;">Нет активных приглашений</div>';
    return;
  }

  activeInvitations.forEach((invitation) => {
    const card = document.createElement("div");
    card.className = "task-card";
    card.innerHTML = `
            <div class="task-header">
              <div class="author-avatar">${getInitials(invitation.name)}</div>
              <div class="author-name">
                <div class="task-title">${invitation.name}</div>
                <div class="task-title">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 14px; height: 14px; vertical-align: middle; margin-right: 2px;">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                  </svg>
                  ${invitation.rating}
                </div>
              </div>
            </div>
            <div class="task-meta">
              <div class="meta-item">
                <span class="meta-label">Задача:</span>${invitation.taskName || "Будет создана"}
              </div>
              <div class="meta-item">
                <span class="meta-label">Блок:</span>${invitation.block}
              </div>
            </div>
            <button class="respond-btn complete-work-btn" data-invitation-id="${invitation.id}">Завершить работу</button>
          `;
    activeInvitationsList.appendChild(card);
  });
}

// Делегирование событий для кнопок "Завершить работу" в активных приглашениях
const activeInvitationsList = document.getElementById(
  "active-invitations-list",
);
if (activeInvitationsList) {
  activeInvitationsList.addEventListener("click", function (e) {
    const btn = e.target.closest(".complete-work-btn");
    if (!btn) return;

    const invitationId = btn.getAttribute("data-invitation-id");
    const invitation = activeInvitations.find(
      (inv) => inv.id === parseInt(invitationId),
    );
    if (invitation) {
      openCompleteWorkModal(invitation);
    }
  });
}

// Функция для открытия модалки завершения работы
function openCompleteWorkModal(invitation) {
  if (invitation.taskId === "no-task") {
    // Сценарий Б: задачи не было - открываем расширенную модалку
    const createAndCompleteTaskModal = document.getElementById(
      "createAndCompleteTaskModal",
    );
    createAndCompleteTaskModal.classList.add("active");
    createAndCompleteTaskModal.setAttribute(
      "data-invitation-id",
      invitation.id,
    );
  } else {
    // Сценарий А: задача существовала - открываем простую модалку
    const completeTaskModal = document.getElementById("completeTaskModal");
    const task = tasks.find((t) => t.id === invitation.taskId);
    if (task) {
      document.getElementById("completeTaskName").textContent = task.title;
    }
    completeTaskModal.classList.add("active");
    completeTaskModal.setAttribute("data-invitation-id", invitation.id);
  }
}

// Функция для рендеринга уведомлений в выпадающем списке
function renderNotifications() {
  const notificationsList = document.getElementById("notificationsList");
  const notificationsCount = document.getElementById("notificationsCount");
  notificationsList.innerHTML = "";

  // Обновляем счётчик непрочитанных
  const unreadCount = notifications.filter((n) => n.unread).length;
  notificationsCount.textContent = unreadCount;

  if (notifications.length === 0) {
    notificationsList.innerHTML =
      '<div class="notifications-empty">Нет уведомлений</div>';
    return;
  }

  notifications.forEach((notification) => {
    const item = document.createElement("li");
    item.className = `notification-item ${notification.unread ? "unread" : ""}`;
    item.setAttribute("data-notification-id", notification.id);

    const date = new Date(notification.time);
    const formattedTime = date.toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });

    const typeLabels = {
      "new-task": "Новая задача",
      invitation: "Приглашение",
      approved: "Одобрено",
      rated: "Оценка",
    };

    item.innerHTML = `
            <div class="notification-item-header">
              <span class="notification-item-title">${notification.title}</span>
              <span class="notification-item-time">${formattedTime}</span>
            </div>
            <p class="notification-item-text">${notification.text}</p>
            <span class="notification-item-type ${notification.type}">${typeLabels[notification.type] || notification.type}</span>
          `;

    notificationsList.appendChild(item);
  });
}

// Флаги для предотвращения дублирования обработчиков событий
let notificationEventListenersAttached = false;

// Функция для инициализации обработчиков событий уведомлений
function initNotificationEventListeners() {
  if (notificationEventListenersAttached) return;

  // Делегирование событий для элементов уведомлений в выпадающем списке
  const dropdownNotificationsList =
    document.getElementById("notificationsList");
  if (dropdownNotificationsList) {
    dropdownNotificationsList.addEventListener("click", function (e) {
      const item = e.target.closest(".notification-item");
      if (!item) return;

      const notificationId = item.getAttribute("data-notification-id");
      const notification = notifications.find(
        (n) => n.id === parseInt(notificationId),
      );
      if (notification) {
        // Помечаем как прочитанное
        notification.unread = false;
        renderNotifications();
        alert(`Переход к уведомлению: ${notification.title}`);
      }
    });
  }

  // Обработчик кнопки уведомлений
  const notificationsDropdown = document.getElementById(
    "notificationsDropdown",
  );
  notifBtn.addEventListener("click", function (e) {
    e.stopPropagation();
    notificationsDropdown.classList.toggle("active");
    if (notificationsDropdown.classList.contains("active")) {
      renderNotifications();
    }
  });

  // Закрытие выпадающего списка при клике вне его
  document.addEventListener("click", function (e) {
    if (
      !notificationsDropdown.contains(e.target) &&
      !notifBtn.contains(e.target)
    ) {
      notificationsDropdown.classList.remove("active");
    }
  });

  notificationEventListenersAttached = true;
}

// Инициализация обработчиков событий
initNotificationEventListeners();

// Обработчики модального окна "Поднять руку"
const raiseHandBtn = document.getElementById("raiseHandBtn");
const raiseHandModal = document.getElementById("raiseHandModal");
const raiseHandConfirm = document.getElementById("raiseHandConfirm");
const raiseHandCancel = document.getElementById("raiseHandCancel");
const raiseHandTime = document.getElementById("raiseHandTime");

// Открытие модального окна
if (raiseHandBtn && raiseHandModal && raiseHandTime) {
  raiseHandBtn.addEventListener("click", function () {
    raiseHandModal.classList.add("active");
    // Устанавливаем текущее время по умолчанию
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    raiseHandTime.value = now.toISOString().slice(0, 16);
    // Сбрасываем чекбоксы
    document
      .querySelectorAll(".help-block-checkbox")
      .forEach((cb) => (cb.checked = false));
  });
}

// Закрытие модального окна по кнопке "Отмена"
if (raiseHandCancel && raiseHandModal && raiseHandTime) {
  raiseHandCancel.addEventListener("click", function () {
    raiseHandModal.classList.remove("active");
    // Очищаем поля
    raiseHandTime.value = "";
    document
      .querySelectorAll(".help-block-checkbox")
      .forEach((cb) => (cb.checked = false));
  });
}

// Подтверждение поднятия руки
if (raiseHandConfirm && raiseHandModal && raiseHandTime) {
  raiseHandConfirm.addEventListener("click", function () {
    const time = raiseHandTime.value;

    // Собираем выбранные блоки
    const selectedBlocks = [];
    document.querySelectorAll(".help-block-checkbox:checked").forEach((cb) => {
      selectedBlocks.push(cb.value);
    });

    if (!time) {
      alert("Пожалуйста, выберите время");
      return;
    }

    let blockText =
      selectedBlocks.length > 0 ? selectedBlocks.join(", ") : "Любой блок";
    alert("Рука поднята\n\nВремя: " + time + "\nБлоки: " + blockText);
    raiseHandModal.classList.remove("active");
    // Очищаем поля
    raiseHandTime.value = "";
    document
      .querySelectorAll(".help-block-checkbox")
      .forEach((cb) => (cb.checked = false));
  });
}

// Закрытие модального окна при клике на оверлей
if (raiseHandModal && raiseHandTime) {
  raiseHandModal.addEventListener("click", function (e) {
    if (e.target === raiseHandModal) {
      raiseHandModal.classList.remove("active");
      // Очищаем поля
      raiseHandTime.value = "";
      document
        .querySelectorAll(".help-block-checkbox")
        .forEach((cb) => (cb.checked = false));
    }
  });
}

// Обработчик кнопки "Детали" в профиле
const detailsBtn = document.getElementById("detailsBtn");
if (detailsBtn) {
  detailsBtn.addEventListener("click", function () {
    alert(
      "Детали рейтинга:\n\nЗадача 1: +12.5 баллов\nЗадача 2: +8.3 балла\nЗадача 3: +15.0 баллов\nЗадача 4: +6.9 балла\n\nИтого: 42.7 баллов",
    );
  });
}

// Обработчик кнопки "Показать QR" в профиле
const qrBtn = document.getElementById("qrBtn");
if (qrBtn) {
  qrBtn.addEventListener("click", function () {
    alert(
      "QR-код для сканирования:\n\n████████████████\n████████████████\n████████████████\n████████████████\n████████████████\n████████████████\n████████████████\n████████████████",
    );
  });
}

// Обработчики модального окна "Пригласить"
const inviteModal = document.getElementById("inviteModal");
const inviteTask = document.getElementById("inviteTask");
const inviteComment = document.getElementById("inviteComment");
const inviteCancel = document.getElementById("inviteCancel");
const inviteConfirm = document.getElementById("inviteConfirm");

// Закрытие модального окна по кнопке "Отмена"
if (inviteCancel && inviteModal && inviteTask && inviteComment) {
  inviteCancel.addEventListener("click", function () {
    inviteModal.classList.remove("active");
    // Очищаем поля
    inviteTask.value = "";
    inviteComment.value = "";
  });
}

// Закрытие модального окна при клике на оверлей
if (inviteModal && inviteTask && inviteComment) {
  inviteModal.addEventListener("click", function (e) {
    if (e.target === inviteModal) {
      inviteModal.classList.remove("active");
      // Очищаем поля
      inviteTask.value = "";
      inviteComment.value = "";
    }
  });
}

// Обработчики модального окна "Создать задачу"
const createTaskBtn = document.getElementById("createTaskBtn");
const createTaskModal = document.getElementById("createTaskModal");
const createTaskCancel = document.getElementById("createTaskCancel");
const createTaskConfirm = document.getElementById("createTaskConfirm");
const taskName = document.getElementById("taskName");
const taskDescription = document.getElementById("taskDescription");
const taskEffort = document.getElementById("taskEffort");
const taskDeadline = document.getElementById("taskDeadline");
const taskOperational = document.getElementById("taskOperational");
const taskGoal = document.getElementById("taskGoal");
const taskContribution = document.getElementById("taskContribution");
const goalFields = document.getElementById("goalFields");
const contributionField = document.getElementById("contributionField");

// Открытие модального окна
if (createTaskBtn && createTaskModal && taskDeadline) {
  createTaskBtn.addEventListener("click", function () {
    createTaskModal.classList.add("active");
    // Устанавливаем дату по умолчанию (через неделю)
    const defaultDate = new Date();
    defaultDate.setDate(defaultDate.getDate() + 7);
    taskDeadline.value = defaultDate.toISOString().split("T")[0];
  });
}

// Закрытие модального окна по кнопке "Отмена"
if (
  createTaskCancel &&
  createTaskModal &&
  taskName &&
  taskDescription &&
  taskEffort &&
  taskDeadline &&
  taskOperational &&
  taskGoal &&
  taskContribution &&
  goalFields &&
  contributionField
) {
  createTaskCancel.addEventListener("click", function () {
    createTaskModal.classList.remove("active");
    // Очищаем поля
    taskName.value = "";
    taskDescription.value = "";
    taskEffort.value = "";
    taskDeadline.value = "";
    taskOperational.checked = false;
    taskGoal.value = "";
    taskContribution.value = "";
    // Показываем поля цели и вклада
    goalFields.classList.remove("hidden");
    contributionField.classList.remove("hidden");
  });
}

// Обработчик чекбокса "Операционная задача"
if (
  taskOperational &&
  goalFields &&
  contributionField &&
  taskEffort &&
  taskContribution
) {
  taskOperational.addEventListener("change", function () {
    if (this.checked) {
      // Скрываем поля цели и вклада
      goalFields.classList.add("hidden");
      contributionField.classList.add("hidden");
      // Автоматически вычисляем вклад
      const effort = parseFloat(taskEffort.value) || 0;
      const contribution = Math.max(0.1, effort * 0.1);
      taskContribution.value = contribution.toFixed(1);
    } else {
      // Показываем поля цели и вклада
      goalFields.classList.remove("hidden");
      contributionField.classList.remove("hidden");
      taskContribution.value = "";
    }
  });
}

// Обработчик изменения трудозатрат для операционной задачи
if (taskEffort && taskOperational && taskContribution) {
  taskEffort.addEventListener("input", function () {
    if (taskOperational.checked) {
      const effort = parseFloat(this.value) || 0;
      const contribution = Math.max(0.1, effort * 0.1);
      taskContribution.value = contribution.toFixed(1);
    }
  });
}

// Подтверждение создания задачи
if (
  createTaskConfirm &&
  createTaskModal &&
  taskName &&
  taskDescription &&
  taskEffort &&
  taskDeadline &&
  taskOperational &&
  taskGoal &&
  taskContribution &&
  goalFields &&
  contributionField
) {
  createTaskConfirm.addEventListener("click", function () {
    // Валидация полей
    if (!taskName.value.trim()) {
      alert("Пожалуйста, введите название задачи");
      return;
    }
    if (!taskDescription.value.trim()) {
      alert("Пожалуйста, введите описание задачи");
      return;
    }
    if (!taskEffort.value || parseFloat(taskEffort.value) <= 0) {
      alert("Пожалуйста, укажите трудозатраты");
      return;
    }
    if (!taskDeadline.value) {
      alert("Пожалуйста, укажите срок выполнения");
      return;
    }
    if (!taskOperational.checked && !taskGoal.value) {
      alert("Пожалуйста, выберите цель блока");
      return;
    }
    if (
      !taskOperational.checked &&
      (!taskContribution.value || parseFloat(taskContribution.value) <= 0)
    ) {
      alert("Пожалуйста, укажите вклад в цель");
      return;
    }

    alert("Задача создана");
    createTaskModal.classList.remove("active");
    // Очищаем поля
    taskName.value = "";
    taskDescription.value = "";
    taskEffort.value = "";
    taskDeadline.value = "";
    taskOperational.checked = false;
    taskGoal.value = "";
    taskContribution.value = "";
    // Показываем поля цели и вклада
    goalFields.classList.remove("hidden");
    contributionField.classList.remove("hidden");
  });
}

// Закрытие модального окна при клике на оверлей
if (
  createTaskModal &&
  taskName &&
  taskDescription &&
  taskEffort &&
  taskDeadline &&
  taskOperational &&
  taskGoal &&
  taskContribution &&
  goalFields &&
  contributionField
) {
  createTaskModal.addEventListener("click", function (e) {
    if (e.target === createTaskModal) {
      createTaskModal.classList.remove("active");
      // Очищаем поля
      taskName.value = "";
      taskDescription.value = "";
      taskEffort.value = "";
      taskDeadline.value = "";
      taskOperational.checked = false;
      taskGoal.value = "";
      taskContribution.value = "";
      // Показываем поля цели и вклада
      goalFields.classList.remove("hidden");
      contributionField.classList.remove("hidden");
    }
  });
}

// Функция для рендеринга списка пользователей (практиканты)
function renderUsersList(filterText = "") {
  const usersList = document.getElementById("users-list");
  usersList.innerHTML = "";

  // Сортируем практикантов по рейтингу (по убыванию)
  let sortedUsers = [...allUsers].sort((a, b) => b.rating - a.rating);

  // Применяем фильтр
  if (filterText) {
    const lowerFilter = filterText.toLowerCase();
    sortedUsers = sortedUsers.filter(
      (user) =>
        user.name.toLowerCase().includes(lowerFilter) ||
        user.block.toLowerCase().includes(lowerFilter),
    );
  }

  sortedUsers.forEach((user) => {
    const userItem = document.createElement("div");
    userItem.className = "user-list-item";
    userItem.setAttribute("data-user-id", user.id);
    userItem.innerHTML = `
            <div class="user-list-item-avatar">${getInitials(user.name)}</div>
            <div class="user-list-item-info">
              <div class="user-list-item-name">${user.name}</div>
              <div class="user-list-item-block">${user.block}</div>
            </div>
            <div class="user-list-item-rating">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 14px; height: 14px; vertical-align: middle; margin-right: 2px;">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
              </svg>
              ${user.rating}
            </div>
          `;
    usersList.appendChild(userItem);
  });
}

// Делегирование событий для списка пользователей (практиканты)
if (usersList) {
  usersList.addEventListener("click", function (e) {
    const item = e.target.closest(".user-list-item");
    if (!item) return;

    const userId = item.getAttribute("data-user-id");
    const user = allUsers.find((u) => u.id === parseInt(userId));
    if (user) {
      showInternProfile(user);
    }
  });
}

// Функция для рендеринга списка сотрудников
function renderEmployeesList(filterText = "") {
  const employeesList = document.getElementById("employees-list");
  employeesList.innerHTML = "";

  // Применяем фильтр
  let filteredEmployees = [...allEmployees];
  if (filterText) {
    const lowerFilter = filterText.toLowerCase();
    filteredEmployees = filteredEmployees.filter(
      (employee) =>
        employee.name.toLowerCase().includes(lowerFilter) ||
        employee.block.toLowerCase().includes(lowerFilter),
    );
  }

  filteredEmployees.forEach((employee) => {
    const employeeItem = document.createElement("div");
    employeeItem.className = "user-list-item";
    employeeItem.setAttribute("data-employee-id", employee.id);

    const roleLabels = {
      employee: "Сотрудник",
      host: "Хост",
      supervisor: "Куратор",
    };

    employeeItem.innerHTML = `
            <div class="user-list-item-avatar">${getInitials(employee.name)}</div>
            <div class="user-list-item-info">
              <div class="user-list-item-name">${employee.name}</div>
              <div class="user-list-item-block">${employee.block}</div>
            </div>
            <div class="user-list-item-rating" style="font-size: 12px; color: #666;">${roleLabels[employee.role]}</div>
          `;
    employeesList.appendChild(employeeItem);
  });
}

// Делегирование событий для списка сотрудников
const employeesList = document.getElementById("employees-list");
if (employeesList) {
  employeesList.addEventListener("click", function (e) {
    const item = e.target.closest(".user-list-item");
    if (!item) return;

    const employeeId = item.getAttribute("data-employee-id");
    const employee = allEmployees.find((e) => e.id === parseInt(employeeId));
    if (employee) {
      showEmployeeProfile(employee);
    }
  });
}

// Функция для показа профиля сотрудника (публичного)
function showEmployeeProfile(employee) {
  const employeePublicScreen = document.getElementById(
    "employee-public-profile-screen",
  );
  const employeePublicAvatar = document.getElementById("employeePublicAvatar");
  const employeePublicName = document.getElementById("employeePublicName");
  const employeePublicBlock = document.getElementById("employeePublicBlock");
  const employeePublicRole = document.getElementById("employeePublicRole");

  // Заполняем данные
  employeePublicAvatar.textContent = getInitials(employee.name);
  employeePublicName.textContent = employee.name;
  employeePublicBlock.textContent = employee.block;

  const roleLabels = {
    employee: "Сотрудник",
    host: "Хост",
    supervisor: "Куратор",
  };
  employeePublicRole.textContent = roleLabels[employee.role];

  // Переключаем экран
  switchScreen("employee-public-profile-screen");
}

// Функция для показа профиля практиканта
function showInternProfile(user) {
  const internProfileScreen = document.getElementById("intern-profile-screen");
  const internProfileAvatar = document.getElementById("internProfileAvatar");
  const internProfileName = document.getElementById("internProfileName");
  const internProfileBlock = document.getElementById("internProfileBlock");
  const internProfileInterests = document.getElementById(
    "internProfileInterests",
  );
  const internProfileSchedule = document.getElementById(
    "internProfileSchedule",
  );
  const internProfileRating = document.getElementById("internProfileRating");
  const internProfileButtons = document.getElementById("internProfileButtons");

  // Store the previous screen for back button navigation
  const activeScreen = document.querySelector(".screen.active");
  if (activeScreen) {
    internProfileScreen.setAttribute("data-previous-screen", activeScreen.id);
  }

  // Заполняем данные
  internProfileAvatar.textContent = getInitials(user.name);
  internProfileName.textContent = user.name;
  internProfileBlock.textContent = user.block;
  internProfileRating.textContent = user.rating.toFixed(1);

  // Заполняем интересы
  internProfileInterests.innerHTML = "";
  user.interests.forEach((interest) => {
    const tag = document.createElement("span");
    tag.className = "interest-tag";
    tag.textContent = interest;
    internProfileInterests.appendChild(tag);
  });

  // Заполняем расписание
  internProfileSchedule.innerHTML = "";
  user.schedule.forEach((day) => {
    const row = document.createElement("tr");
    const statusText = {
      morning: "до обеда",
      afternoon: "после обеда",
      out: "не в офисе",
      all_day: "целый день",
    };
    row.innerHTML = `
            <th>${day.day}</th>
            <td><span class="schedule-status ${day.status}">${statusText[day.status]}</span></td>
          `;
    internProfileSchedule.appendChild(row);
  });

  // Показываем/скрываем кнопку приглашения в зависимости от роли
  const internProfileEditButtons = document.getElementById(
    "internProfileEditButtons",
  );
  if (
    currentRole === "employee" ||
    currentRole === "host" ||
    currentRole === "supervisor"
  ) {
    internProfileButtons.style.display = "block";
    // Скрываем кнопку "Поставить задачу" для обычного сотрудника
    const assignTaskBtn = document.getElementById("assignTaskFromProfileBtn");
    if (assignTaskBtn) {
      assignTaskBtn.style.display =
        currentRole === "host" || currentRole === "supervisor"
          ? "inline-block"
          : "none";
    }
    // Скрываем кнопку редактирования профиля (сотрудник не может редактировать чужой профиль)
    internProfileEditButtons.style.display = "none";
  } else if (currentRole === "intern" && user.id === currentInternId) {
    // Практикант видит кнопку редактирования только на своём профиле
    internProfileButtons.style.display = "none";
    internProfileEditButtons.style.display = "block";
  } else {
    internProfileButtons.style.display = "none";
    internProfileEditButtons.style.display = "none";
  }

  // Скрываем форму редактирования при открытии профиля
  document.getElementById("internProfileEditForm").style.display = "none";

  // Сохраняем ID текущего просматриваемого практиканта
  internProfileScreen.setAttribute("data-intern-id", user.id);

  // Переключаем экран
  switchScreen("intern-profile-screen");
}

// Обработчик кнопки "Назад" в профиле практиканта
document
  .getElementById("backFromInternProfile")
  .addEventListener("click", function () {
    const internProfileScreen = document.getElementById(
      "intern-profile-screen",
    );
    const previousScreen = internProfileScreen.getAttribute(
      "data-previous-screen",
    );

    // Switch back to the previous screen, or default to profile-screen
    switchScreen(previousScreen || "profile-screen");
  });

// Обработчик кнопки "Пригласить" из профиля
document
  .getElementById("inviteFromProfileBtn")
  .addEventListener("click", function () {
    const internProfileScreen = document.getElementById(
      "intern-profile-screen",
    );
    const internId = internProfileScreen.getAttribute("data-intern-id");
    const intern = allUsers.find((u) => u.id === parseInt(internId));
    if (intern) {
      openInviteModal(intern);
    }
  });

// Обработчик кнопки "Сохранить настройки" в профиле сотрудника (устаревший код)
const saveSettingsBtn = document.getElementById("saveSettingsBtn");
if (saveSettingsBtn) {
  saveSettingsBtn.addEventListener("click", function () {
    const notifNewTasks = document.getElementById("notifNewTasks")?.checked;
    const notifResponses = document.getElementById("notifResponses")?.checked;
    const notifMessages = document.getElementById("notifMessages")?.checked;
    const notifRating = document.getElementById("notifRating")?.checked;

    alert(
      "Настройки уведомлений сохранены:\n\n" +
        "Новые задачи: " +
        (notifNewTasks ? "Вкл" : "Выкл") +
        "\n" +
        "Отклики на задачи: " +
        (notifResponses ? "Вкл" : "Выкл") +
        "\n" +
        "Сообщения: " +
        (notifMessages ? "Вкл" : "Выкл") +
        "\n" +
        "Изменение рейтинга: " +
        (notifRating ? "Вкл" : "Выкл"),
    );
  });
}

// Обновлённая функция открытия модалки приглашения
function openInviteModal(intern) {
  const inviteModal = document.getElementById("inviteModal");
  const inviteTask = document.getElementById("inviteTask");
  const inviteComment = document.getElementById("inviteComment");

  // Заполняем dropdown задачами текущего сотрудника + опцию "Нет задачи"
  inviteTask.innerHTML = '<option value="">-- Выберите задачу --</option>';
  const employeeTasks = tasks.filter((t) => t.authorId === currentEmployeeId);
  employeeTasks.forEach((task) => {
    inviteTask.innerHTML += `<option value="${task.id}">${task.title}</option>`;
  });
  // Добавляем опцию "Нет подходящей задачи"
  inviteTask.innerHTML +=
    '<option value="no-task">+ Нет подходящей задачи, создам при завершении</option>';

  // Сохраняем ID практиканта для отправки приглашения
  inviteModal.setAttribute("data-intern-id", intern.id);

  // Открываем модалку
  inviteModal.classList.add("active");
}

// Обновлённый обработчик отправки приглашения
inviteConfirm.addEventListener("click", function () {
  const taskId = inviteTask.value;
  const comment = inviteComment.value;
  const internId = inviteModal.getAttribute("data-intern-id");
  const intern = allUsers.find((i) => i.id === parseInt(internId));

  if (!taskId) {
    alert("Пожалуйста, выберите задачу");
    return;
  }

  if (intern) {
    let message = "Приглашение отправлено практиканту " + intern.name;
    let taskName = "";

    if (taskId === "no-task") {
      message += "\n\nЗадача будет создана при завершении работы";
      taskName = "Будет создана";
    } else {
      const task = tasks.find((t) => t.id === parseInt(taskId));
      if (task) {
        message += "\n\nЗадача: " + task.title;
        taskName = task.title;
      }
    }
    if (comment) {
      message += "\nКомментарий: " + comment;
    }
    alert(message);

    // Добавляем приглашение в список активных
    const invitationId = Date.now();
    activeInvitations.push({
      id: invitationId,
      internId: intern.id,
      name: intern.name,
      block: intern.block,
      rating: intern.rating,
      taskId: taskId === "no-task" ? "no-task" : parseInt(taskId),
      taskName: taskName,
      comment: comment,
    });

    // Перерисовываем активные приглашения в профиле
    renderActiveInvitations();

    inviteModal.classList.remove("active");
    // Очищаем поля
    inviteTask.value = "";
    inviteComment.value = "";
  }
});

// Обработчики модального окна "Завершить задачу" (Сценарий А)
const completeTaskModal = document.getElementById("completeTaskModal");
const completeTaskName = document.getElementById("completeTaskName");
const completeWorkDescription = document.getElementById(
  "completeWorkDescription",
);
const completeRating = document.getElementById("completeRating");
const completeReview = document.getElementById("completeReview");
const completeTaskCancel = document.getElementById("completeTaskCancel");
const completeTaskConfirm = document.getElementById("completeTaskConfirm");

// Обработчики модального окна "Создать задачу и завершить" (Сценарий Б)
const createAndCompleteTaskModal = document.getElementById(
  "createAndCompleteTaskModal",
);
const newCompleteTaskName = document.getElementById("newCompleteTaskName");
const newCompleteTaskDescription = document.getElementById(
  "newCompleteTaskDescription",
);
const newCompleteTaskEffort = document.getElementById("newCompleteTaskEffort");
const newCompleteTaskDeadline = document.getElementById(
  "newCompleteTaskDeadline",
);
const newCompleteTaskOperational = document.getElementById(
  "newCompleteTaskOperational",
);
const newCompleteTaskGoal = document.getElementById("newCompleteTaskGoal");
const newCompleteTaskContribution = document.getElementById(
  "newCompleteTaskContribution",
);
const newCompleteWorkDescription = document.getElementById(
  "newCompleteWorkDescription",
);
const newCompleteRating = document.getElementById("newCompleteRating");
const newCompleteReview = document.getElementById("newCompleteReview");
const newCompleteGoalFields = document.getElementById("newCompleteGoalFields");
const newCompleteContributionField = document.getElementById(
  "newCompleteContributionField",
);
const createAndCompleteCancel = document.getElementById(
  "createAndCompleteCancel",
);
const createAndCompleteConfirm = document.getElementById(
  "createAndCompleteConfirm",
);

// Обработчик чекбокса "Операционная задача" в модалке завершения
newCompleteTaskOperational.addEventListener("change", function () {
  if (this.checked) {
    newCompleteGoalFields.classList.add("hidden");
    newCompleteContributionField.classList.add("hidden");
    const effort = parseFloat(newCompleteTaskEffort.value) || 0;
    const contribution = Math.max(0.1, effort * 0.1);
    newCompleteTaskContribution.value = contribution.toFixed(1);
  } else {
    newCompleteGoalFields.classList.remove("hidden");
    newCompleteContributionField.classList.remove("hidden");
    newCompleteTaskContribution.value = "";
  }
});

// Обработчик изменения трудозатрат для операционной задачи в модалке завершения
newCompleteTaskEffort.addEventListener("input", function () {
  if (newCompleteTaskOperational.checked) {
    const effort = parseFloat(this.value) || 0;
    const contribution = Math.max(0.1, effort * 0.1);
    newCompleteTaskContribution.value = contribution.toFixed(1);
  }
});

// Закрытие модального окна завершения задачи (Сценарий А)
completeTaskCancel.addEventListener("click", function () {
  completeTaskModal.classList.remove("active");
  completeWorkDescription.value = "";
  completeRating.value = "";
  completeReview.value = "";
});

// Подтверждение завершения задачи
completeTaskConfirm.addEventListener("click", function () {
  if (!completeWorkDescription.value.trim()) {
    alert("Пожалуйста, опишите выполненную работу");
    return;
  }
  if (
    !completeRating.value ||
    parseFloat(completeRating.value) < 1 ||
    parseFloat(completeRating.value) > 5
  ) {
    alert("Пожалуйста, укажите оценку от 1 до 5");
    return;
  }

  // Проверяем, это завершение задачи хоста или приглашения
  const hostTaskId = completeTaskModal.dataset.taskId;
  if (hostTaskId) {
    // Завершение задачи хоста
    const taskId = parseInt(hostTaskId);
    const task = hostTasks.find((t) => t.id === taskId);

    if (task) {
      // Удаляем задачу из списка
      const taskIndex = hostTasks.findIndex((t) => t.id === taskId);
      if (taskIndex > -1) {
        hostTasks.splice(taskIndex, 1);
      }

      // Обновляем рейтинг практиканта
      const intern = allUsers.find((u) => u.id === task.internId);
      if (intern) {
        const rating = parseFloat(completeRating.value);
        // Простое обновление рейтинга (в реальном приложении было бы сложнее)
        intern.rating = ((intern.rating * 10 + rating) / 11).toFixed(1);
      }

      alert("Задача завершена! Рейтинг практиканта обновлён.");

      // Перерисовываем задачи хоста
      renderHostTasks();
      // Перерисовываем список пользователей для обновления рейтинга
      renderUsersList();
    }
  } else {
    // Сценарий А: завершение задачи по приглашению
    const invitationId = completeTaskModal.getAttribute("data-invitation-id");
    const invitation = activeInvitations.find(
      (inv) => inv.id === parseInt(invitationId),
    );

    if (invitation) {
      // Обновляем рейтинг практиканта
      const intern = allUsers.find((u) => u.id === invitation.internId);
      if (intern) {
        const rating = parseFloat(completeRating.value);
        // Находим задачу для получения вклада
        const task = tasks.find((t) => t.id === invitation.taskId);
        const contribution = task ? parseFloat(task.contribution) || 1 : 1;
        // Формула: рейтинг += вклад × (оценка / 5)
        const ratingChange = contribution * (rating / 5);
        intern.rating = (parseFloat(intern.rating) + ratingChange).toFixed(1);

        // Перерисовываем список пользователей для обновления рейтинга
        renderUsersList();
      }
    }

    alert("Задача закрыта, рейтинг обновлён");

    // Удаляем приглашение из списка активных
    activeInvitations = activeInvitations.filter(
      (inv) => inv.id !== parseInt(invitationId),
    );
    renderActiveInvitations();
  }

  completeTaskModal.classList.remove("active");
  completeWorkDescription.value = "";
  completeRating.value = "";
  completeReview.value = "";
});

// Закрытие модального окна создания и завершения задачи (Сценарий Б)
createAndCompleteCancel.addEventListener("click", function () {
  createAndCompleteTaskModal.classList.remove("active");
  newCompleteTaskName.value = "";
  newCompleteTaskDescription.value = "";
  newCompleteTaskEffort.value = "";
  newCompleteTaskDeadline.value = "";
  newCompleteTaskOperational.checked = false;
  newCompleteTaskGoal.value = "";
  newCompleteTaskContribution.value = "";
  newCompleteWorkDescription.value = "";
  newCompleteRating.value = "";
  newCompleteReview.value = "";
  newCompleteGoalFields.classList.remove("hidden");
  newCompleteContributionField.classList.remove("hidden");
});

// Подтверждение создания и завершения задачи (Сценарий Б)
createAndCompleteConfirm.addEventListener("click", function () {
  if (!newCompleteTaskName.value.trim()) {
    alert("Пожалуйста, введите название задачи");
    return;
  }
  if (!newCompleteTaskDescription.value.trim()) {
    alert("Пожалуйста, введите описание задачи");
    return;
  }
  if (
    !newCompleteTaskEffort.value ||
    parseFloat(newCompleteTaskEffort.value) <= 0
  ) {
    alert("Пожалуйста, укажите трудозатраты");
    return;
  }
  if (!newCompleteTaskDeadline.value) {
    alert("Пожалуйста, укажите срок выполнения");
    return;
  }
  if (!newCompleteTaskOperational.checked && !newCompleteTaskGoal.value) {
    alert("Пожалуйста, выберите цель блока");
    return;
  }
  if (
    !newCompleteTaskOperational.checked &&
    (!newCompleteTaskContribution.value ||
      parseFloat(newCompleteTaskContribution.value) <= 0)
  ) {
    alert("Пожалуйста, укажите вклад в цель");
    return;
  }
  if (!newCompleteWorkDescription.value.trim()) {
    alert("Пожалуйста, опишите выполненную работу");
    return;
  }
  if (
    !newCompleteRating.value ||
    parseFloat(newCompleteRating.value) < 1 ||
    parseFloat(newCompleteRating.value) > 5
  ) {
    alert("Пожалуйста, укажите оценку от 1 до 5");
    return;
  }
  // Сценарий Б: обновляем рейтинг практиканта
  const invitationId =
    createAndCompleteTaskModal.getAttribute("data-invitation-id");
  const invitation = activeInvitations.find(
    (inv) => inv.id === parseInt(invitationId),
  );

  if (invitation) {
    const intern = allUsers.find((u) => u.id === invitation.internId);
    if (intern) {
      const rating = parseFloat(newCompleteRating.value);
      // Получаем вклад из формы
      const contribution = newCompleteTaskOperational.checked
        ? (parseFloat(newCompleteTaskEffort.value) || 0) * 0.1
        : parseFloat(newCompleteTaskContribution.value) || 1;
      // Формула: рейтинг += вклад × (оценка / 5)
      const ratingChange = contribution * (rating / 5);
      intern.rating = (parseFloat(intern.rating) + ratingChange).toFixed(1);

      // Перерисовываем список пользователей для обновления рейтинга
      renderUsersList();
    }
  }

  alert("Задача создана и закрыта, рейтинг обновлён");

  // Удаляем приглашение из списка активных
  activeInvitations = activeInvitations.filter(
    (inv) => inv.id !== parseInt(invitationId),
  );
  renderActiveInvitations();

  createAndCompleteTaskModal.classList.remove("active");
  newCompleteTaskName.value = "";
  newCompleteTaskDescription.value = "";
  newCompleteTaskEffort.value = "";
  newCompleteTaskDeadline.value = "";
  newCompleteTaskOperational.checked = false;
  newCompleteTaskGoal.value = "";
  newCompleteTaskContribution.value = "";
  newCompleteWorkDescription.value = "";
  newCompleteRating.value = "";
  newCompleteReview.value = "";
  newCompleteGoalFields.classList.remove("hidden");
  newCompleteContributionField.classList.remove("hidden");
});

// Обновлённый обработчик переключения роли для показа/скрытия меню Аналитика
roleSelector.addEventListener("change", function () {
  const selectedOption = this.options[this.selectedIndex];
  const roleName = selectedOption.text;
  currentRole = this.value;
  // alert("Переключено на " + roleName); // Убрали alert, чтобы не блокировать выполнение

  // Переключаем кнопки в зависимости от роли
  const raiseHandBtn = document.getElementById("raiseHandBtn");
  const createTaskBtn = document.getElementById("createTaskBtn");
  const supervisorMenuItems = document.querySelectorAll(".supervisor-only");
  const hostMenuItems = document.querySelectorAll(".host-only");
  const supervisorTabs = document.getElementById("supervisorTabs");
  const hostTabs = document.getElementById("hostTabs");

  if (currentRole === "employee") {
    raiseHandBtn.style.display = "none";
    createTaskBtn.style.display = "flex";
    supervisorMenuItems.forEach((item) => (item.style.display = "none"));
    hostMenuItems.forEach((item) => (item.style.display = "none"));
    if (supervisorTabs) supervisorTabs.style.display = "none";
    if (hostTabs) hostTabs.style.display = "none";
  } else if (currentRole === "host") {
    raiseHandBtn.style.display = "none";
    createTaskBtn.style.display = "flex";
    supervisorMenuItems.forEach((item) => (item.style.display = "none"));
    hostMenuItems.forEach((item) => (item.style.display = "flex"));
    if (supervisorTabs) supervisorTabs.style.display = "none";
    if (hostTabs) hostTabs.style.display = "flex";
  } else if (currentRole === "supervisor") {
    raiseHandBtn.style.display = "none";
    createTaskBtn.style.display = "flex";
    supervisorMenuItems.forEach((item) => (item.style.display = "flex"));
    // Для куратора также показываем элементы хоста (включая аналитику)
    hostMenuItems.forEach((item) => {
      if (item.classList.contains("supervisor-only")) {
        item.style.display = "flex";
      } else {
        item.style.display = "none";
      }
    });
    if (supervisorTabs) supervisorTabs.style.display = "flex";
    if (hostTabs) hostTabs.style.display = "flex";
  } else {
    raiseHandBtn.style.display = "flex";
    createTaskBtn.style.display = "none";
    supervisorMenuItems.forEach((item) => (item.style.display = "none"));
    hostMenuItems.forEach((item) => (item.style.display = "none"));
    if (supervisorTabs) supervisorTabs.style.display = "none";
    if (hostTabs) hostTabs.style.display = "none";
  }

  // Обновляем название "Мои задачи" в зависимости от роли
  const mytasksNavLabel = document.getElementById("mytasks-nav-label");
  if (mytasksNavLabel) {
    if (
      currentRole === "employee" ||
      currentRole === "host" ||
      currentRole === "supervisor"
    ) {
      mytasksNavLabel.textContent = "Созданные задачи";
    } else {
      mytasksNavLabel.textContent = "Мои задачи";
    }
  }

  // Если хост или куратор, сначала настраиваем вкладки
  if (currentRole === "host" || currentRole === "supervisor") {
    const hostTabs = document.getElementById("hostTabs");
    if (hostTabs) {
      // Сбрасываем активные вкладки
      const tabs = hostTabs.querySelectorAll(".host-tab");
      tabs.forEach((t) => t.classList.remove("active"));
      // Активируем первую вкладку
      tabs[0].classList.add("active");
      // Скрываем только контенты вкладок в mytasks-screen
      const mytasksScreen = document.getElementById("mytasks-screen");
      if (mytasksScreen) {
        mytasksScreen.querySelectorAll(".tab-content").forEach((content) => {
          content.style.display = "none";
        });
      }
      // Показываем контент первой вкладки
      const firstTabId = tabs[0].getAttribute("data-tab");
      const firstContent = document.getElementById(firstTabId + "-content");
      if (firstContent) {
        firstContent.style.display = "block";
      }
    }
  }

  // Перерисовываем ленту в зависимости от роли
  renderTasks();

  // Перерисовываем "Мои задачи" в зависимости от роли (после настройки вкладок)
  renderHostTasks();

  // Перерисовываем аналитику, если экран аналитики активен
  const activeScreen = document.querySelector(".screen.active");
  if (activeScreen && activeScreen.id === "analytics-screen") {
    if (currentRole === "host") {
      populateInternSelector();
      renderHostAnalytics();
    } else if (currentRole === "supervisor") {
      populateInternSelector();
      renderSupervisorAnalytics();
    }
  }

  // Перерисовываем профиль
  renderProfile();

  // Если куратор, рендерим критические уведомления
  if (currentRole === "supervisor") {
    renderCriticalNotifications();
  } else {
    // Очищаем список уведомлений для других ролей
    const notificationsList = document.getElementById(
      "critical-notifications-list",
    );
    if (notificationsList) {
      notificationsList.innerHTML = "";
    }
  }
});

// Обработчик переключения типа задачи (простая/сложная)
const taskTypeSimple = document.getElementById("taskTypeSimple");
const taskTypeComplex = document.getElementById("taskTypeComplex");
const simpleTaskFields = document.getElementById("simpleTaskFields");
const complexTaskFields = document.getElementById("complexTaskFields");

if (taskTypeSimple && taskTypeComplex) {
  const handleTaskTypeChange = function () {
    const isComplex = taskTypeComplex.checked;

    if (isComplex) {
      simpleTaskFields.style.display = "none";
      complexTaskFields.style.display = "block";
      updateChecklistForComplexTask();
    } else {
      simpleTaskFields.style.display = "block";
      complexTaskFields.style.display = "none";
      updateChecklistForSimpleTask();
    }
  };

  taskTypeSimple.addEventListener("change", handleTaskTypeChange);
  taskTypeComplex.addEventListener("change", handleTaskTypeChange);
}

// Функция для обновления чек-листа для простой задачи
function updateChecklistForSimpleTask() {
  const checklistContainer = document.getElementById("hostTaskChecklist");
  checklistContainer.innerHTML = `
    <div class="checklist-row">
      <input type="text" class="modal-input checklist-input" placeholder="Элемент чек-листа" />
      <button type="button" class="remove-checklist-btn" style="display: none;">×</button>
    </div>
  `;
}

// Функция для обновления чек-листа для сложной задачи
function updateChecklistForComplexTask() {
  const checklistContainer = document.getElementById("hostTaskChecklist");
  checklistContainer.innerHTML = `
    <div class="checklist-row complex-checklist-row">
      <input type="text" class="modal-input checklist-input-text" placeholder="Элемент чек-листа" />
      <input type="date" class="modal-input checklist-input-deadline" placeholder="Дедлайн" />
      <input type="number" class="modal-input checklist-input-effort" placeholder="Часы" min="0.5" step="0.5" />
      <button type="button" class="remove-checklist-btn" style="display: none;">×</button>
    </div>
  `;
}

// Обработчик для кнопки "Поставить задачу" в профиле практиканта
document
  .getElementById("assignTaskFromProfileBtn")
  .addEventListener("click", function () {
    const hostTaskModal = document.getElementById("hostTaskModal");
    const internProfileName =
      document.getElementById("internProfileName").textContent;

    // Очищаем форму
    document.getElementById("hostTaskName").value = "";
    document.getElementById("hostTaskDescription").value = "";
    document.getElementById("hostTaskEffort").value = "";
    document.getElementById("hostTaskDeadline").value = "";
    document.getElementById("hostTaskGoal").value = "";
    document.getElementById("hostTaskOperational").checked = false;

    // Сбрасываем тип задачи на простой
    if (taskTypeSimple) taskTypeSimple.checked = true;
    if (taskTypeComplex) taskTypeComplex.checked = false;
    if (simpleTaskFields) simpleTaskFields.style.display = "block";
    if (complexTaskFields) complexTaskFields.style.display = "none";

    // Сбрасываем чек-лист до одного пустого поля
    updateChecklistForSimpleTask();

    // Сохраняем имя практиканта
    hostTaskModal.dataset.internName = internProfileName;
    // Сбрасываем режим редактирования
    hostTaskModal.dataset.editMode = "";
    hostTaskModal.dataset.taskId = "";
    // Восстанавливаем заголовок и кнопку
    hostTaskModal.querySelector(".modal-title").textContent =
      "Поставить задачу";
    document.getElementById("hostTaskConfirm").textContent = "Создать задачу";

    // Открываем модальное окно
    hostTaskModal.classList.add("active");
  });

// Обработчик для добавления элемента чек-листа
document
  .getElementById("addChecklistItem")
  .addEventListener("click", function () {
    const checklistContainer = document.getElementById("hostTaskChecklist");
    const isComplex = document.getElementById("taskTypeComplex")?.checked;

    const newRow = document.createElement("div");
    newRow.className =
      "checklist-row" + (isComplex ? " complex-checklist-row" : "");

    if (isComplex) {
      newRow.innerHTML = `
        <input type="text" class="modal-input checklist-input-text" placeholder="Элемент чек-листа" />
        <input type="date" class="modal-input checklist-input-deadline" placeholder="Дедлайн" />
        <input type="number" class="modal-input checklist-input-effort" placeholder="Часы" min="0.5" step="0.5" />
        <button type="button" class="remove-checklist-btn">×</button>
      `;
    } else {
      newRow.innerHTML = `
        <input type="text" class="modal-input checklist-input" placeholder="Элемент чек-листа" />
        <button type="button" class="remove-checklist-btn">×</button>
      `;
    }

    checklistContainer.appendChild(newRow);

    // Показываем кнопки удаления для всех строк
    checklistContainer
      .querySelectorAll(".remove-checklist-btn")
      .forEach((btn) => {
        btn.style.display = "flex";
      });
  });

// Обработчик для удаления элемента чек-листа (делегирование событий)
document
  .getElementById("hostTaskChecklist")
  .addEventListener("click", function (e) {
    if (e.target.classList.contains("remove-checklist-btn")) {
      const row = e.target.closest(".checklist-row");
      const checklistContainer = document.getElementById("hostTaskChecklist");

      // Удаляем только если больше одной строки
      if (checklistContainer.querySelectorAll(".checklist-row").length > 1) {
        row.remove();

        // Скрываем кнопку удаления если осталась одна строка
        if (
          checklistContainer.querySelectorAll(".checklist-row").length === 1
        ) {
          checklistContainer.querySelector(
            ".remove-checklist-btn",
          ).style.display = "none";
        }
      }
    }
  });

// Обработчик для кнопки "Отмена" в модальном окне хост-задачи
document
  .getElementById("hostTaskCancel")
  .addEventListener("click", function () {
    const hostTaskModal = document.getElementById("hostTaskModal");
    // Сбрасываем режим редактирования
    hostTaskModal.dataset.editMode = "";
    hostTaskModal.dataset.taskId = "";
    // Восстанавливаем заголовок и кнопку
    hostTaskModal.querySelector(".modal-title").textContent =
      "Поставить задачу";
    document.getElementById("hostTaskConfirm").textContent = "Создать задачу";
    hostTaskModal.classList.remove("active");
  });

// Обработчик для кнопки "Создать задачу" / "Сохранить изменения" в модальном окне хост-задачи
document
  .getElementById("hostTaskConfirm")
  .addEventListener("click", function () {
    // Cache DOM elements
    const hostTaskModal = document.getElementById("hostTaskModal");
    const taskTypeComplex = document.getElementById("taskTypeComplex");
    const hostTaskName = document.getElementById("hostTaskName");
    const hostTaskDescription = document.getElementById("hostTaskDescription");
    const hostTaskGoal = document.getElementById("hostTaskGoal");
    const hostTaskOperational = document.getElementById("hostTaskOperational");
    const hostTaskEffort = document.getElementById("hostTaskEffort");
    const hostTaskDeadline = document.getElementById("hostTaskDeadline");

    const internName = hostTaskModal.dataset.internName;
    const isEditMode = hostTaskModal.dataset.editMode === "true";
    const isComplex = taskTypeComplex?.checked;

    // Получаем данные формы
    const name = hostTaskName.value.trim();
    const description = hostTaskDescription.value.trim();
    const goal = hostTaskGoal.value;
    const operational = hostTaskOperational.checked;

    // Валидация общих полей
    if (!name || !description) {
      alert("Пожалуйста, заполните все обязательные поля");
      return;
    }

    let checklist = [];
    let effort = "";
    let deadline = "";

    if (isComplex) {
      // Сложная задача - собираем данные из каждого пункта чек-листа
      const checklistRows = document.querySelectorAll(".complex-checklist-row");
      checklistRows.forEach((row, index) => {
        const text = row.querySelector(".checklist-input-text")?.value.trim();
        const itemDeadline = row.querySelector(
          ".checklist-input-deadline",
        )?.value;
        const itemEffort = row.querySelector(".checklist-input-effort")?.value;

        if (text && itemDeadline && itemEffort) {
          checklist.push({
            id: index + 1,
            text: text,
            checked: false,
            deadline: itemDeadline,
            effort: itemEffort,
          });
        }
      });

      if (checklist.length === 0) {
        alert(
          "Пожалуйста, добавьте хотя бы один элемент в чек-лист с дедлайном и трудозатратами",
        );
        return;
      }

      // Для сложной задачи вычисляем общий дедлайн и суммарные трудозатраты
      const deadlines = checklist.map((item) => new Date(item.deadline));
      deadline = new Date(Math.max(...deadlines)).toISOString().split("T")[0];
      effort =
        checklist.reduce((sum, item) => sum + parseFloat(item.effort), 0) +
        " часов";
    } else {
      // Простая задача
      effort = hostTaskEffort.value.trim();
      deadline = hostTaskDeadline.value;

      if (!effort || !deadline) {
        alert("Пожалуйста, заполните все обязательные поля");
        return;
      }

      // Собираем чек-лист
      const checklistInputs = document.querySelectorAll(".checklist-input");
      checklistInputs.forEach((input, index) => {
        const text = input.value.trim();
        if (text) {
          checklist.push({
            id: index + 1,
            text: text,
            checked: false,
          });
        }
      });

      if (checklist.length === 0) {
        alert("Пожалуйста, добавьте хотя бы один элемент в чек-лист");
        return;
      }
    }

    if (isEditMode) {
      // Режим редактирования - обновляем существующую задачу
      const taskId = parseInt(hostTaskModal.dataset.taskId);
      const task = hostTasks.find((t) => t.id === taskId);
      if (task) {
        task.title = name;
        task.description = description;
        task.effort = effort;
        task.deadline = deadline;
        task.contribution = goal ? parseFloat(goal) : 0.1;
        task.operational = operational;
        task.taskType = isComplex ? "complex" : "simple";
        task.checklist = checklist;

        alert("Задача успешно обновлена");
      }
    } else {
      // Режим создания - создаем новую задачу
      // Находим ID практиканта по имени
      const intern = allUsers.find((u) => u.name === internName);
      const internId = intern ? intern.id : 1;

      // Создаем новую задачу
      const newTask = {
        id: hostTasks.length + 1,
        internId: internId,
        internName: internName,
        hostId: currentEmployeeId,
        title: name,
        description: description,
        checklist: checklist,
        deadline: deadline,
        contribution: goal ? parseFloat(goal) : 0.1,
        operational: operational,
        taskType: isComplex ? "complex" : "simple",
        effort: effort,
      };

      // Добавляем в массив задач хоста
      hostTasks.push(newTask);

      // Показываем уведомление
      alert("Задача успешно создана для практиканта " + internName);
    }

    // Сбрасываем режим редактирования
    hostTaskModal.dataset.editMode = "";
    hostTaskModal.dataset.taskId = "";
    // Восстанавливаем заголовок и кнопку
    hostTaskModal.querySelector(".modal-title").textContent =
      "Поставить задачу";
    document.getElementById("hostTaskConfirm").textContent = "Создать задачу";

    // Закрываем модальное окно
    hostTaskModal.classList.remove("active");

    // Перерисовываем задачи хоста
    renderHostTasks();
  });

// Обработчик закрытия модального окна хост-задачи при клике на оверлей
document
  .getElementById("hostTaskModal")
  .addEventListener("click", function (e) {
    if (e.target === this) {
      // Сбрасываем режим редактирования
      this.dataset.editMode = "";
      this.dataset.taskId = "";
      // Восстанавливаем заголовок и кнопку
      this.querySelector(".modal-title").textContent = "Поставить задачу";
      document.getElementById("hostTaskConfirm").textContent = "Создать задачу";
      this.classList.remove("active");
    }
  });

// Обработчики переключения вкладок хоста
const hostTabs = document.querySelectorAll(".host-tab");
hostTabs.forEach((tab) => {
  tab.addEventListener("click", function () {
    const tabId = this.getAttribute("data-tab");

    // Убираем активный класс со всех вкладок
    hostTabs.forEach((t) => t.classList.remove("active"));
    this.classList.add("active");

    // Скрываем все контенты вкладок
    document.querySelectorAll(".tab-content").forEach((content) => {
      content.style.display = "none";
    });

    // Показываем выбранный контент
    const selectedContent = document.getElementById(tabId + "-content");
    if (selectedContent) {
      selectedContent.style.display = "block";
    }

    // Перерисовываем задачи при переключении вкладок, чтобы контент отображался корректно
    renderHostTasks();
  });
});

// Обработчики вкладок пользователей
const usersTabs = document.querySelectorAll("#usersTabs .host-tab");
usersTabs.forEach((tab) => {
  tab.addEventListener("click", function () {
    const tabId = this.getAttribute("data-tab");

    // Убираем активный класс со всех вкладок
    usersTabs.forEach((t) => t.classList.remove("active"));
    this.classList.add("active");

    // Скрываем все контенты вкладок
    document
      .querySelectorAll("#users-screen .tab-content")
      .forEach((content) => {
        content.style.display = "none";
      });

    // Показываем выбранный контент
    const selectedContent = document.getElementById(tabId + "-content");
    if (selectedContent) {
      selectedContent.style.display = "block";
    }

    // Перерисовываем соответствующий список
    if (tabId === "interns") {
      renderUsersList(document.getElementById("usersSearch").value);
    } else if (tabId === "employees") {
      renderEmployeesList(document.getElementById("usersSearch").value);
    }
  });
});

// Функция debounce для отложенного выполнения
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Обработчик поиска пользователей с debounce
const usersSearch = document.getElementById("usersSearch");
if (usersSearch) {
  const debouncedSearch = debounce(function (filterText) {
    const activeTab = document.querySelector("#usersTabs .host-tab.active");
    if (activeTab) {
      const tabId = activeTab.getAttribute("data-tab");
      if (tabId === "interns") {
        renderUsersList(filterText);
      } else if (tabId === "employees") {
        renderEmployeesList(filterText);
      }
    }
  }, 300); // Задержка 300 мс

  usersSearch.addEventListener("input", function () {
    debouncedSearch(this.value);
  });
}

// Обработчик кнопки "Назад" в профиле сотрудника
document
  .getElementById("backFromEmployeeProfile")
  .addEventListener("click", function () {
    switchScreen("users-screen");
  });

// Обработчик кнопки "Редактировать" для профиля практиканта (просмотр)
document
  .getElementById("editInternProfileBtn")
  .addEventListener("click", function () {
    const internProfileScreen = document.getElementById(
      "intern-profile-screen",
    );
    const internId = internProfileScreen.getAttribute("data-intern-id");
    const intern = allUsers.find((u) => u.id === parseInt(internId));

    if (intern) {
      // Заполняем форму редактирования
      document.getElementById("editInternName").value = intern.name;
      document.getElementById("editInternBlock").value = intern.block;
      document.getElementById("editInternInterests").value =
        intern.interests.join(", ");

      // Заполняем расписание
      const scheduleMap = {
        Пн: "editScheduleMon",
        Вт: "editScheduleTue",
        Ср: "editScheduleWed",
        Чт: "editScheduleThu",
        Пт: "editScheduleFri",
      };
      intern.schedule.forEach((day) => {
        const selectId = scheduleMap[day.day];
        if (selectId) {
          document.getElementById(selectId).value = day.status;
        }
      });

      // Показываем форму, скрываем кнопки
      document.getElementById("internProfileEditForm").style.display = "block";
      document.getElementById("internProfileEditButtons").style.display =
        "none";
      document.getElementById("internProfileButtons").style.display = "none";
    }
  });

// Обработчик кнопки "Отмена" редактирования профиля практиканта
document
  .getElementById("cancelInternEditBtn")
  .addEventListener("click", function () {
    document.getElementById("internProfileEditForm").style.display = "none";
    document.getElementById("internProfileEditButtons").style.display = "block";
    document.getElementById("internProfileButtons").style.display = "block";
  });

// Обработчик кнопки "Сохранить" редактирования профиля практиканта
document
  .getElementById("saveInternEditBtn")
  .addEventListener("click", function () {
    const internProfileScreen = document.getElementById(
      "intern-profile-screen",
    );
    const internId = internProfileScreen.getAttribute("data-intern-id");
    const intern = allUsers.find((u) => u.id === parseInt(internId));

    if (intern) {
      // Обновляем данные
      intern.name = document.getElementById("editInternName").value;
      intern.block = document.getElementById("editInternBlock").value;

      // Парсим интересы
      const interestsText = document.getElementById(
        "editInternInterests",
      ).value;
      intern.interests = interestsText
        .split(",")
        .map((i) => i.trim())
        .filter((i) => i);

      // Обновляем расписание
      const scheduleMap = {
        Пн: "editScheduleMon",
        Вт: "editScheduleTue",
        Ср: "editScheduleWed",
        Чт: "editScheduleThu",
        Пт: "editScheduleFri",
      };
      intern.schedule = [
        {
          day: "Пн",
          status: document.getElementById(scheduleMap["Пн"]).value,
        },
        {
          day: "Вт",
          status: document.getElementById(scheduleMap["Вт"]).value,
        },
        {
          day: "Ср",
          status: document.getElementById(scheduleMap["Ср"]).value,
        },
        {
          day: "Чт",
          status: document.getElementById(scheduleMap["Чт"]).value,
        },
        {
          day: "Пт",
          status: document.getElementById(scheduleMap["Пт"]).value,
        },
      ];

      // Обновляем отображение
      showInternProfile(intern);
      renderUsersList();

      // Скрываем форму, показываем кнопки
      document.getElementById("internProfileEditForm").style.display = "none";
      document.getElementById("internProfileEditButtons").style.display =
        "block";
      document.getElementById("internProfileButtons").style.display = "block";

      alert("Профиль обновлён");
    }
  });

// ==================== АНАЛИТИКА ====================

// Переменные для хранения графиков - сгруппированы в объект
const charts = {
  // Хост графики
  ratingChart: null,
  taskTypeChart: null,
  weeklyTasksChart: null,

  // Куратор графики
  supervisorTaskTypeChart: null,
  supervisorWeeklyTasksChart: null,

  // Общие аналитические графики
  responseTimeChart: null,
  avgRatingChart: null,
  tasksAndHandsChart: null,
  officeAttendanceChart: null,
  blockActivityChart: null,
  hostLoadChart: null,
};

// Текущий выбранный практикант для аналитики
let selectedInternId = 1;

// Инициализация аналитики
function initAnalytics() {
  const analyticsScreen = document.getElementById("analytics-screen");
  if (!analyticsScreen) return;

  // Восстанавливаем содержимое экрана аналитики, если оно было очищено
  if (currentRole === "host" || currentRole === "supervisor") {
    if (
      !analyticsScreen.querySelector("#host-analytics") &&
      !analyticsScreen.querySelector("#supervisor-analytics")
    ) {
      // Если содержимое было очищено, перезагружаем страницу или восстанавливаем структуру
      // Для простоты, просто перерендерим при следующем открытии экрана
      return;
    }
  }

  // Показываем/скрываем секции в зависимости от роли
  const hostAnalytics = document.getElementById("host-analytics");
  const supervisorAnalytics = document.getElementById("supervisor-analytics");
  const internSelector = document.getElementById("internSelector");
  const supervisorInternSelector = document.getElementById(
    "supervisorInternSelector",
  );
  const supervisorTabs = document.getElementById("supervisorTabs");

  if (currentRole === "host") {
    if (hostAnalytics) hostAnalytics.style.display = "block";
    if (supervisorAnalytics) supervisorAnalytics.style.display = "none";
    if (internSelector) internSelector.style.display = "block";
    if (supervisorTabs) supervisorTabs.style.display = "none";
    if (supervisorInternSelector)
      supervisorInternSelector.style.display = "none";
    populateInternSelector();
    renderHostAnalytics();
  } else if (currentRole === "supervisor") {
    if (hostAnalytics) hostAnalytics.style.display = "none";
    if (supervisorAnalytics) supervisorAnalytics.style.display = "block";
    if (internSelector) internSelector.style.display = "none";
    if (supervisorInternSelector)
      supervisorInternSelector.style.display = "block";
    if (supervisorTabs) supervisorTabs.style.display = "flex";
    populateInternSelector();
    renderSupervisorAnalytics();
    // Инициализируем вкладки куратора
    initSupervisorTabs();
    // Инициализируем фильтр по периоду
    initPeriodFilter();
  } else {
    analyticsScreen.innerHTML = `
      <div class="feed-placeholder">
        <h2>Доступ запрещён</h2>
        <p>У вас нет прав для просмотра аналитики</p>
      </div>
    `;
  }
}

// Флаг для отслеживания инициализации вкладок куратора
let supervisorTabsInitialized = false;

// Инициализация вкладок куратора
function initSupervisorTabs() {
  const supervisorTabs = document.getElementById("supervisorTabs");
  if (!supervisorTabs) return;

  // Если вкладки уже инициализированы, не добавляем обработчики повторно
  if (supervisorTabsInitialized) return;

  const tabs = supervisorTabs.querySelectorAll(".host-tab");
  tabs.forEach((tab) => {
    tab.addEventListener("click", function () {
      // Убираем активный класс со всех вкладок
      tabs.forEach((t) => t.classList.remove("active"));
      // Добавляем активный класс на текущую вкладку
      this.classList.add("active");

      // Скрываем весь контент
      document.getElementById("my-interns-content").style.display = "none";
      document.getElementById("general-analytics-content").style.display =
        "none";

      // Показываем/скрываем селектор практика в зависимости от вкладки
      const supervisorInternSelector = document.getElementById(
        "supervisorInternSelector",
      );
      if (supervisorInternSelector) {
        const tabName = this.getAttribute("data-tab");
        supervisorInternSelector.style.display =
          tabName === "my-interns" ? "block" : "none";
      }

      // Показываем нужный контент
      const tabName = this.getAttribute("data-tab");
      if (tabName === "my-interns") {
        document.getElementById("my-interns-content").style.display = "block";
        renderSupervisorInternAnalytics();
      } else {
        document.getElementById("general-analytics-content").style.display =
          "block";
        renderSupervisorGeneralAnalytics();
      }
    });
  });

  // Помечаем вкладки как инициализированные
  supervisorTabsInitialized = true;
}

// Инициализация фильтра по периоду
function initPeriodFilter() {
  const periodSelect = document.getElementById("periodSelect");
  if (!periodSelect) return;

  periodSelect.addEventListener("change", function () {
    const period = this.value;
    updateAnalyticsForPeriod(period);
  });
}

// Обновление аналитики в зависимости от выбранного периода
function updateAnalyticsForPeriod(period) {
  // В реальном приложении здесь был бы запрос к API с фильтром по периоду
  // Для прототипа просто перерисовываем графики
  renderSupervisorGeneralAnalytics();

  // Можно добавить визуальную индикацию обновления
  const periodText =
    period === "30" ? "30 дней" : period === "90" ? "90 дней" : "всё время";
  console.log(`Аналитика обновлена за период: ${periodText}`);
}

// Заполнение селектора практикантов
function populateInternSelector() {
  // Заполняем селектор для хоста
  const hostSelector = document.getElementById("selectedIntern");
  if (hostSelector) {
    // Удаляем старый обработчик, если он существует
    const oldHostHandler = hostSelector._changeHandler;
    if (oldHostHandler) {
      hostSelector.removeEventListener("change", oldHostHandler);
    }

    hostSelector.innerHTML = "";
    allUsers.forEach((intern) => {
      const option = document.createElement("option");
      option.value = intern.id;
      option.textContent = intern.name;
      hostSelector.appendChild(option);
    });

    // Устанавливаем обработчик изменения для хоста
    const hostHandler = function () {
      selectedInternId = parseInt(this.value);
      if (currentRole === "host") {
        renderHostAnalytics();
      }
    };
    hostSelector.addEventListener("change", hostHandler);
    hostSelector._changeHandler = hostHandler;
  }

  // Заполняем селектор для куратора
  const supervisorSelector = document.getElementById(
    "selectedSupervisorIntern",
  );
  if (supervisorSelector) {
    // Удаляем старый обработчик, если он существует
    const oldSupervisorHandler = supervisorSelector._changeHandler;
    if (oldSupervisorHandler) {
      supervisorSelector.removeEventListener("change", oldSupervisorHandler);
    }

    supervisorSelector.innerHTML = "";
    allUsers.forEach((intern) => {
      const option = document.createElement("option");
      option.value = intern.id;
      option.textContent = intern.name;
      supervisorSelector.appendChild(option);
    });

    // Устанавливаем обработчик изменения для куратора
    const supervisorHandler = function () {
      selectedInternId = parseInt(this.value);
      if (currentRole === "supervisor") {
        // Обновляем аналитику для выбранного практики
        renderSupervisorInternAnalytics();
      }
    };
    supervisorSelector.addEventListener("change", supervisorHandler);
    supervisorSelector._changeHandler = supervisorHandler;
  }
}

// Рендеринг аналитики хоста
function renderHostAnalytics() {
  renderInternMetrics();
  renderTaskTypeChart();
  renderAnalyticsSchedule();
  renderWeeklyTasksChart();
  renderActiveTasksList();
  renderRecentReviews();
}

// Общая функция для рендеринга метрик практика
function renderInternMetricsCommon(metricsCardId, elementIds) {
  const metricsCard = document.getElementById(metricsCardId);
  if (!metricsCard) return;

  const intern = allUsers.find((u) => u.id === selectedInternId);
  if (!intern) {
    metricsCard.style.display = "none";
    return;
  }

  metricsCard.style.display = "block";

  // Filter once and reuse - combine redundant iterations
  const internCompletedTasks = completedTasks.filter(
    (t) => t.internId === intern.id,
  );
  const completedTasksCount = internCompletedTasks.length;

  const avgRating =
    internCompletedTasks.reduce((sum, t) => sum + t.rating, 0) /
      completedTasksCount || 0;

  const activeTasks = hostTasks.filter((t) => t.internId === intern.id);
  const overallProgress =
    activeTasks.reduce((sum, t) => sum + calculateProgress(t), 0) /
      activeTasks.length || 0;

  // Cache DOM elements to avoid repeated queries
  const ratingElement = document.getElementById(elementIds.rating);
  const completedTasksElement = document.getElementById(
    elementIds.completedTasks,
  );
  const avgRatingElement = document.getElementById(elementIds.avgRating);
  const progressElement = document.getElementById(elementIds.progress);

  if (ratingElement) ratingElement.textContent = intern.rating.toFixed(1);
  if (completedTasksElement)
    completedTasksElement.textContent = completedTasksCount;
  if (avgRatingElement) avgRatingElement.textContent = avgRating.toFixed(1);
  if (progressElement)
    progressElement.textContent = Math.round(overallProgress) + "%";
}

// Рендеринг метрик выбранного практика
function renderInternMetrics() {
  renderInternMetricsCommon("internMetrics", {
    rating: "metricRating",
    completedTasks: "metricCompletedTasks",
    avgRating: "metricAvgRating",
    progress: "metricProgress",
  });
}

// Рендеринг списка практикантов
function renderInternsTable() {
  const container = document.getElementById("internsList");
  if (!container) return;

  container.innerHTML = "";

  allUsers.forEach((intern) => {
    // Filter once and reuse - combine redundant iterations
    const internCompletedTasks = completedTasks.filter(
      (t) => t.internId === intern.id,
    );
    const completedTasksCount = internCompletedTasks.length;
    const avgRating =
      internCompletedTasks.reduce((sum, t) => sum + t.rating, 0) /
        completedTasksCount || 0;
    const activeTasks = hostTasks.filter((t) => t.internId === intern.id);
    const overallProgress =
      activeTasks.reduce((sum, t) => sum + calculateProgress(t), 0) /
        activeTasks.length || 0;

    const item = document.createElement("div");
    item.className = `intern-list-item ${selectedInternId === intern.id ? "active" : ""}`;
    item.innerHTML = `
      <div class="intern-item-header">
        <span class="intern-item-name">${intern.name}</span>
        <span class="intern-item-rating">${intern.rating}</span>
      </div>
      <div class="intern-item-details">
        <span class="intern-item-block">${intern.block}</span>
        <span class="intern-item-tasks">Выполнено: ${completedTasksCount}</span>
        <span class="intern-item-avg">Оценка: ${avgRating.toFixed(1)}</span>
      </div>
      <div class="intern-item-progress">
        <div class="progress-bar-bg">
          <div class="progress-bar-fill" style="width: ${overallProgress}%"></div>
        </div>
        <span>${Math.round(overallProgress)}%</span>
      </div>
    `;

    // Клик по элементу выбирает практика
    item.addEventListener("click", () => {
      selectedInternId = intern.id;
      document.getElementById("selectedIntern").value = intern.id;
      renderHostAnalytics();
    });

    container.appendChild(item);
  });
}

// Рендеринг графика динамики рейтинга
function renderRatingChart() {
  const ctx = document.getElementById("ratingChart");
  if (!ctx) return;

  const internHistory = ratingHistory.filter(
    (h) => h.internId === selectedInternId,
  );

  if (charts.ratingChart) {
    charts.ratingChart.destroy();
  }

  const ratings = internHistory.map((h) => h.rating);
  const minValue = Math.min(...ratings);
  const maxValue = Math.max(...ratings);
  const yMin = Math.floor(minValue / 10) * 10;

  charts.ratingChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: internHistory.map((h) => h.week),
      datasets: [
        {
          label: "Рейтинг",
          data: ratings,
          borderColor: "#10b981",
          backgroundColor: "rgba(16, 185, 129, 0.1)",
          borderWidth: 2,
          tension: 0.3,
          fill: true,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
      },
      scales: {
        y: {
          min: yMin < 0 ? 0 : yMin,
          max: 5,
          grid: {
            color: "rgba(0, 0, 0, 0.05)",
            lineWidth: 1,
          },
          ticks: {
            color: "#333",
            font: {
              size: 10,
            },
          },
        },
        x: {
          grid: {
            display: false,
          },
          ticks: {
            color: "#333",
            font: {
              size: 10,
            },
          },
        },
      },
    },
  });
}

// Общая функция для рендеринга графика распределения задач по типу
function renderTaskTypeChartCommon(ctx, chartInstance) {
  if (!ctx) return;

  const internTasks = completedTasks.filter(
    (t) => t.internId === selectedInternId,
  );
  const hostTasksCount = internTasks.filter((t) => t.type === "host").length;
  const feedTasksCount = internTasks.filter((t) => t.type === "feed").length;

  if (chartInstance) {
    chartInstance.destroy();
  }

  return new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: ["От хоста", "Из ленты"],
      datasets: [
        {
          data: [hostTasksCount, feedTasksCount],
          backgroundColor: ["#2cb5b4", "#f59e0b"],
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: "bottom",
          align: "center",
          labels: {
            color: "#333",
            font: {
              size: 12,
            },
            usePointStyle: true,
            pointStyle: "circle",
            padding: 20,
          },
        },
        datalabels: {
          display: true,
          color: "#333",
          font: {
            size: 12,
            weight: "normal",
          },
          formatter: function (value) {
            return value;
          },
        },
      },
    },
  });
}

// Рендеринг графика распределения задач по типу
function renderTaskTypeChart() {
  const ctx = document.getElementById("taskTypeChart");
  charts.taskTypeChart = renderTaskTypeChartCommon(ctx, charts.taskTypeChart);
}

// Рендеринг расписания в аналитике
function renderAnalyticsSchedule() {
  const container = document.getElementById("analyticsSchedule");
  if (!container) return;

  const intern = allUsers.find((u) => u.id === selectedInternId);
  if (!intern) return;

  container.innerHTML = `
    <table class="schedule-table">
      ${intern.schedule
        .map(
          (day) => `
        <tr>
          <th>${day.day}</th>
          <td><span class="schedule-status ${day.status}">${getScheduleStatusText(day.status)}</span></td>
        </tr>
      `,
        )
        .join("")}
    </table>
  `;
}

// Рендеринг графика закрытых задач по неделям
function renderWeeklyTasksChart() {
  const ctx = document.getElementById("weeklyTasksChart");
  if (!ctx) return;

  const internTasks = completedTasks.filter(
    (t) => t.internId === selectedInternId,
  );

  // Группируем по неделям
  const weeklyData = {};
  internTasks.forEach((task) => {
    const week = getWeekNumber(task.completedAt);
    weeklyData[week] = (weeklyData[week] || 0) + 1;
  });

  const weeks = Object.keys(weeklyData).sort();
  const counts = weeks.map((w) => weeklyData[w]);

  if (charts.weeklyTasksChart) {
    charts.weeklyTasksChart.destroy();
  }

  const minValue = Math.min(...counts);
  const yMin = Math.floor(minValue / 10) * 10;

  charts.weeklyTasksChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: weeks.map((w) => `Неделя ${w}`),
      datasets: [
        {
          label: "Закрыто задач",
          data: counts,
          borderColor: "#2cb5b4",
          backgroundColor: "rgba(44, 181, 180, 0.1)",
          borderWidth: 2,
          tension: 0.3,
          fill: false,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
        datalabels: {
          display: true,
          anchor: "end",
          align: "top",
          offset: 8,
          formatter: function (value) {
            return value;
          },
          color: "#333",
          font: {
            size: 12,
            weight: "normal",
          },
        },
      },
      scales: {
        y: {
          display: false,
          beginAtZero: true,
          min: yMin < 0 ? 0 : yMin,
          grace: "10%",
        },
        x: {
          ticks: {
            font: {
              size: 10,
              color: "#333",
            },
          },
          grid: {
            display: false,
          },
        },
      },
      interaction: {
        mode: "nearest",
        axis: "x",
        intersect: false,
      },
    },
  });
}

// Общая функция для рендеринга списка активных задач
function renderActiveTasksListCommon(
  containerId,
  sortButtonsSelector,
  filterIntern = true,
) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const tasksToRender = filterIntern
    ? hostTasks.filter((t) => t.internId === selectedInternId)
    : hostTasks.filter((t) => t.internId === selectedInternId);

  if (tasksToRender.length === 0) {
    container.innerHTML = "<p>Нет активных задач</p>";
    return;
  }

  // Get current sort type from active button
  const sortButtons = document.querySelectorAll(sortButtonsSelector);
  let sortType = "deadline";
  sortButtons.forEach((btn) => {
    if (btn.classList.contains("active")) {
      sortType = btn.dataset.sort;
    }
  });

  // Sort tasks
  const sortedTasks = sortTasks(tasksToRender, sortType);

  container.innerHTML = sortedTasks
    .map((task) => {
      const progress = calculateProgress(task);
      const completedCount = task.checklist.filter(
        (item) => item.checked,
      ).length;
      const totalCount = task.checklist.length;

      // Get deadline info based on task type
      let deadlineInfo;
      let taskTypeLabel = "";
      let effortDisplay = "";

      if (task.taskType === "complex") {
        // For complex tasks, find the nearest deadline among unchecked items
        const uncheckedItems = task.checklist.filter((item) => !item.checked);
        if (uncheckedItems.length > 0) {
          const nearestDeadline = uncheckedItems
            .map((item) => new Date(item.deadline))
            .reduce((min, date) => (date < min ? date : min));
          deadlineInfo = getDeadlineInfo(
            nearestDeadline.toISOString().split("T")[0],
          );
        } else {
          deadlineInfo = getDeadlineInfo(task.deadline);
        }

        // Calculate total effort for complex tasks
        const totalEffort = task.checklist.reduce(
          (sum, item) => sum + parseFloat(item.effort || 0),
          0,
        );
        effortDisplay = `${totalEffort} часов`;
        taskTypeLabel = `<span style="font-size: 12px; color: #2cb5b4; background: #e8f5f5; padding: 2px 8px; border-radius: 4px; margin-left: 8px;">Сложная задача</span>`;
      } else {
        // For simple tasks, use the overall deadline
        deadlineInfo = getDeadlineInfo(task.deadline);
        effortDisplay = task.effort || "";
      }

      const statusBadge = getStatusBadge(progress, deadlineInfo.status);

      // Use red color only for overdue tasks
      const progressColorClass =
        deadlineInfo.status === "overdue" ? "overdue" : "";

      return `
        <div class="task-progress-card" data-task-id="${task.id}">
          <div class="task-status-badge ${statusBadge.class}">${statusBadge.text}</div>
          <div class="task-card-header">
            <div class="task-card-title">${task.title}${taskTypeLabel}</div>
            <div class="task-card-percent">${progress}%</div>
          </div>
          <div class="task-deadline-info">
            <div class="deadline-indicator ${deadlineInfo.indicatorClass}"></div>
            <span>${deadlineInfo.text}</span>
          </div>
          ${effortDisplay ? `<div class="task-effort-info" style="font-size: 12px; color: #666; margin-bottom: 8px;">⏱ ${effortDisplay}</div>` : ""}
          <div class="task-progress-bar">
            <div class="task-progress-fill ${progressColorClass}" style="width: ${progress}%"></div>
          </div>
          <div class="task-footer-info">${completedCount} из ${totalCount} пунктов выполнено</div>
        </div>
      `;
    })
    .join("");
}

// Рендеринг списка активных задач
function renderActiveTasksList() {
  renderActiveTasksListCommon(
    "activeTasksList",
    "#taskSortButtons .sort-btn",
    true,
  );
}

// Сортировка задач
function sortTasks(tasks, sortType) {
  const sorted = [...tasks];
  switch (sortType) {
    case "deadline":
      return sorted.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
    case "progress":
      return sorted.sort((a, b) => calculateProgress(b) - calculateProgress(a));
    case "name":
      return sorted.sort((a, b) => a.title.localeCompare(b.title, "ru"));
    default:
      return sorted;
  }
}

// Получение класса цвета для прогресса
function getProgressColorClass(progress) {
  if (progress === 100) return "complete";
  if (progress >= 70) return "high";
  if (progress >= 30) return "medium";
  return "low";
}

// Получение информации о дедлайне
function getDeadlineInfo(deadline) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const deadlineDate = new Date(deadline);
  deadlineDate.setHours(0, 0, 0, 0);

  const diffTime = deadlineDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return {
      status: "overdue",
      indicatorClass: "overdue",
      text: `Просрочена (${formatDate(deadline)})`,
    };
  } else if (diffDays === 0) {
    return {
      status: "today",
      indicatorClass: "today",
      text: "Дедлайн сегодня",
    };
  } else if (diffDays === 1) {
    return {
      status: "tomorrow",
      indicatorClass: "tomorrow",
      text: "Завтра",
    };
  } else if (diffDays <= 5) {
    return {
      status: "soon",
      indicatorClass: "soon",
      text: `Скоро дедлайн (${formatDate(deadline)})`,
    };
  } else {
    return {
      status: "normal",
      indicatorClass: "normal",
      text: `В норме (${formatDate(deadline)})`,
    };
  }
}

// Получение бейджа статуса задачи
function getStatusBadge(progress, deadlineStatus) {
  if (progress === 100) {
    return { class: "ready", text: "[Готово]" };
  }
  if (deadlineStatus === "overdue") {
    return { class: "overdue", text: "[Просрочено]" };
  }
  if (deadlineStatus === "today" || deadlineStatus === "tomorrow") {
    return { class: "urgent", text: "[Срочно]" };
  }
  return { class: "in-progress", text: "[В работе]" };
}

// Рендеринг последних отзывов
function renderRecentReviews() {
  const container = document.getElementById("recentReviews");
  if (!container) return;

  const internReviews = reviews.filter((r) => r.internId === selectedInternId);

  if (internReviews.length === 0) {
    container.innerHTML = "<p>Нет отзывов</p>";
    return;
  }

  container.innerHTML = internReviews
    .map(
      (review) => `
      <div class="review-item">
        <div class="review-header">
          <span class="review-author">${review.author}</span>
          <span class="review-rating">${"★".repeat(review.rating)}${"☆".repeat(5 - review.rating)}</span>
        </div>
        <div class="review-text">${review.text}</div>
        <div class="review-date">${review.date}</div>
      </div>
    `,
    )
    .join("");
}

// Рендеринг аналитики куратора
function renderSupervisorAnalytics() {
  // По умолчанию показываем вкладку "Мои практиканты"
  renderSupervisorInternAnalytics();
}

// Рендеринг аналитики для вкладки "Мои практиканты"
function renderSupervisorInternAnalytics() {
  renderSupervisorInternMetrics();
  renderSupervisorTaskTypeChart();
  renderSupervisorAnalyticsSchedule();
  renderSupervisorWeeklyTasksChart();
  renderSupervisorActiveTasksList();
  renderSupervisorRecentReviews();
}

// Рендеринг аналитики для вкладки "Общая аналитика"
function renderSupervisorGeneralAnalytics() {
  renderResponseTimeChart();
  renderAvgRatingChart();
  renderTasksAndHandsChart();
  renderBlockActivityChart();
  renderOfficeAttendanceChart();
  renderBlockGoals();
  renderHostLoadChart();
  renderCriticalNotifications();
}

// Рендеринг графика скорости отклика по блокам
function renderResponseTimeChart() {
  const ctx = document.getElementById("responseTimeChart");
  if (!ctx) return;

  if (charts.responseTimeChart) {
    charts.responseTimeChart.destroy();
  }

  const maxValue = Math.max(
    ...responseTimeByBlock.map((b) => b.avgResponseTime),
  );

  charts.responseTimeChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: responseTimeByBlock.map((b) => b.block),
      datasets: [
        {
          label: "Среднее время отклика (часы)",
          data: responseTimeByBlock.map((b) => b.avgResponseTime),
          backgroundColor: "#2cb5b4",
          borderRadius: {
            topLeft: 6,
            topRight: 6,
            bottomLeft: 0,
            bottomRight: 0,
          },
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              return context.parsed.y.toFixed(1) + " ч";
            },
          },
        },
        datalabels: {
          display: true,
          anchor: "end",
          align: "top",
          offset: 4,
          formatter: function (value) {
            return value.toFixed(1) + " ч";
          },
          color: "#333",
          font: {
            size: 12,
            weight: "normal",
          },
        },
      },
      scales: {
        y: {
          display: false,
          beginAtZero: true,
          suggestedMax: maxValue * 1.15,
          grace: "15%",
        },
        x: {
          ticks: {
            font: {
              size: 10,
              color: "#333",
            },
          },
          grid: {
            display: false,
          },
        },
      },
    },
  });
}

// Рендеринг графика средней оценки по блокам
function renderAvgRatingChart() {
  const ctx = document.getElementById("avgRatingChart");
  if (!ctx) return;

  if (charts.avgRatingChart) {
    charts.avgRatingChart.destroy();
  }

  const maxValue = Math.max(...avgRatingByBlock.map((b) => b.avgRating));

  charts.avgRatingChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: avgRatingByBlock.map((b) => b.block),
      datasets: [
        {
          label: "Средняя оценка (1–5)",
          data: avgRatingByBlock.map((b) => b.avgRating),
          backgroundColor: "#10b981",
          borderRadius: {
            topLeft: 6,
            topRight: 6,
            bottomLeft: 0,
            bottomRight: 0,
          },
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              return context.parsed.y.toFixed(1);
            },
          },
        },
        datalabels: {
          display: true,
          anchor: "end",
          align: "top",
          offset: 4,
          formatter: function (value) {
            return value.toFixed(1);
          },
          color: "#333",
          font: {
            size: 12,
            weight: "normal",
          },
        },
      },
      scales: {
        y: {
          display: false,
          min: 0,
          suggestedMax: Math.max(maxValue * 1.2, 5.5),
          grace: "15%",
        },
        x: {
          ticks: {
            font: {
              size: 10,
              color: "#333",
            },
          },
          grid: {
            display: false,
          },
        },
      },
    },
  });
}

// Рендеринг графика задач и поднятых рук по неделям
function renderTasksAndHandsChart() {
  const ctx = document.getElementById("tasksAndHandsChart");
  if (!ctx) return;

  if (charts.tasksAndHandsChart) {
    charts.tasksAndHandsChart.destroy();
  }

  const tasksCreated = weeklyStats.map((s) => s.tasksCreated);
  const handsRaised = weeklyStats.map((s) => s.handsRaised);
  const minValue = Math.min(...tasksCreated, ...handsRaised);
  const yMin = Math.floor(minValue / 10) * 10;

  charts.tasksAndHandsChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: weeklyStats.map((s) => s.week),
      datasets: [
        {
          label: "Создано задач",
          data: tasksCreated,
          borderColor: "#2cb5b4",
          backgroundColor: "rgba(44, 181, 180, 0.1)",
          borderWidth: 2,
          tension: 0.3,
          fill: false,
        },
        {
          label: "Поднято рук",
          data: handsRaised,
          borderColor: "#f59e0b",
          backgroundColor: "rgba(245, 158, 11, 0.1)",
          borderWidth: 2,
          tension: 0.3,
          fill: false,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: "bottom",
          align: "center",
          labels: {
            color: "#333",
            font: {
              size: 12,
            },
            usePointStyle: true,
            pointStyle: "circle",
            padding: 20,
          },
        },
        tooltip: {
          mode: "index",
          intersect: false,
        },
        datalabels: {
          display: true,
          anchor: "end",
          align: "top",
          offset: 8,
          formatter: function (value) {
            return value;
          },
          color: "#333",
          font: {
            size: 12,
            weight: "normal",
          },
        },
      },
      scales: {
        y: {
          display: false,
          beginAtZero: true,
          min: yMin < 0 ? 0 : yMin,
          grace: "10%",
        },
        x: {
          ticks: {
            font: {
              size: 10,
              color: "#333",
            },
          },
          grid: {
            display: false,
          },
        },
      },
      interaction: {
        mode: "nearest",
        axis: "x",
        intersect: false,
      },
    },
  });
}

// Рендеринг таблицы активности блоков
function renderBlockActivityTable() {
  const tbody = document.querySelector("#blockActivityTable tbody");
  if (!tbody) return;

  tbody.innerHTML = blockActivity
    .map(
      (block) => `
      <tr>
        <td>${block.block}</td>
        <td>${block.tasksCreated}</td>
        <td>${block.tasksClosed}</td>
        <td>${block.responses}</td>
        <td>${block.overduePercent}%</td>
      </tr>
    `,
    )
    .join("");
}

// Рендеринг графика посещаемости офиса
function renderOfficeAttendanceChart() {
  const ctx = document.getElementById("officeAttendanceChart");
  if (!ctx) return;

  const days = ["Пн", "Вт", "Ср", "Чт", "Пт"];
  const morningCounts = [0, 0, 0, 0, 0];
  const afternoonCounts = [0, 0, 0, 0, 0];
  const allDayCounts = [0, 0, 0, 0, 0];

  allUsers.forEach((user) => {
    user.schedule.forEach((day) => {
      const dayIndex = days.indexOf(day.day);
      if (dayIndex === -1) return;

      if (day.status === "morning") {
        morningCounts[dayIndex]++;
      } else if (day.status === "afternoon") {
        afternoonCounts[dayIndex]++;
      } else if (day.status === "all_day") {
        // Практикант в офисе весь день - считаем отдельно
        allDayCounts[dayIndex]++;
      }
    });
  });

  if (charts.officeAttendanceChart) {
    charts.officeAttendanceChart.destroy();
  }

  const maxValue = Math.max(
    ...morningCounts,
    ...afternoonCounts,
    ...allDayCounts,
  );

  charts.officeAttendanceChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Понедельник", "Вторник", "Среда", "Четверг", "Пятница"],
      datasets: [
        {
          label: "До обеда",
          data: morningCounts,
          backgroundColor: "#2cb5b4",
          borderRadius: {
            topLeft: 6,
            topRight: 6,
            bottomLeft: 0,
            bottomRight: 0,
          },
        },
        {
          label: "После обеда",
          data: afternoonCounts,
          backgroundColor: "#94a3b8",
          borderRadius: {
            topLeft: 6,
            topRight: 6,
            bottomLeft: 0,
            bottomRight: 0,
          },
        },
        {
          label: "Целый день",
          data: allDayCounts,
          backgroundColor: "#f59e0b",
          borderRadius: {
            topLeft: 6,
            topRight: 6,
            bottomLeft: 0,
            bottomRight: 0,
          },
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: "bottom",
          align: "center",
          labels: {
            color: "#333",
            font: {
              size: 12,
            },
            usePointStyle: true,
            pointStyle: "circle",
            padding: 20,
          },
        },
        tooltip: {
          mode: "index",
          intersect: false,
        },
        datalabels: {
          display: true,
          anchor: "end",
          align: "top",
          offset: 4,
          formatter: function (value) {
            return value;
          },
          color: "#333",
          font: {
            size: 12,
            weight: "normal",
          },
        },
      },
      scales: {
        y: {
          display: false,
          beginAtZero: true,
          suggestedMax: maxValue * 1.15,
          grace: "15%",
        },
        x: {
          ticks: {
            font: {
              size: 10,
              color: "#333",
            },
          },
          grid: {
            display: false,
          },
        },
      },
    },
  });
}

// Рендеринг прогресс-баров целей блоков
function renderBlockGoals() {
  const container = document.getElementById("blockGoalsContainer");
  if (!container) return;

  if (blockGoals.length === 0) {
    container.innerHTML =
      '<div class="no-data-message">Нет данных для отображения</div>';
    return;
  }

  container.innerHTML = blockGoals
    .map(
      (goal) => `
    <div class="goal-item">
      <div class="goal-header">
        <span class="goal-name">${goal.block}: ${goal.goal}</span>
        <span class="goal-percentage">${goal.progress}%</span>
      </div>
      <div class="progress-bar-container">
        <div class="progress-bar-fill" style="width: ${goal.progress}%" data-percent="${goal.progress}%"></div>
      </div>
    </div>
  `,
    )
    .join("");
}

// Рендеринг таблицы нагрузки на хостов
function renderHostLoadTable() {
  const tbody = document.querySelector("#hostLoadTable tbody");
  if (!tbody) return;

  tbody.innerHTML = hostLoad
    .map(
      (host) => `
      <tr>
        <td>${host.hostName}</td>
        <td>${host.block}</td>
        <td>${host.activeTasks}</td>
        <td>${host.avgRating}</td>
      </tr>
    `,
    )
    .join("");
}

// Рендеринг графика активности блоков
function renderBlockActivityChart() {
  const ctx = document.getElementById("blockActivityChart");
  if (!ctx) return;

  if (charts.blockActivityChart) {
    charts.blockActivityChart.destroy();
  }

  const maxValue = Math.max(
    ...blockActivity.map((b) => b.tasksCreated),
    ...blockActivity.map((b) => b.tasksClosed),
  );

  charts.blockActivityChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: blockActivity.map((b) => b.block),
      datasets: [
        {
          label: "Создано задач",
          data: blockActivity.map((b) => b.tasksCreated),
          backgroundColor: "#2cb5b4",
          borderRadius: {
            topLeft: 6,
            topRight: 6,
            bottomLeft: 0,
            bottomRight: 0,
          },
        },
        {
          label: "Закрыто задач",
          data: blockActivity.map((b) => b.tasksClosed),
          backgroundColor: "#10b981",
          borderRadius: {
            topLeft: 6,
            topRight: 6,
            bottomLeft: 0,
            bottomRight: 0,
          },
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: "bottom",
          align: "center",
          labels: {
            color: "#333",
            font: {
              size: 12,
            },
            usePointStyle: true,
            pointStyle: "circle",
            padding: 20,
          },
        },
        tooltip: {
          mode: "index",
          intersect: false,
          callbacks: {
            footer: function (tooltipItems) {
              const index = tooltipItems[0].dataIndex;
              const overdue = blockActivity[index].overduePercent;
              return `Не выполнено в срок: ${overdue}%`;
            },
          },
        },
        datalabels: {
          display: true,
          anchor: "end",
          align: "top",
          offset: 4,
          formatter: function (value) {
            return value;
          },
          color: "#333",
          font: {
            size: 12,
            weight: "normal",
          },
        },
      },
      scales: {
        y: {
          display: false,
          beginAtZero: true,
          suggestedMax: maxValue * 1.15,
          grace: "15%",
        },
        x: {
          ticks: {
            font: {
              size: 10,
              color: "#333",
            },
          },
          grid: {
            display: false,
          },
        },
      },
    },
  });
}

// Рендеринг графика нагрузки на хостов
function renderHostLoadChart() {
  const ctx = document.getElementById("hostLoadChart");
  if (!ctx) return;

  if (charts.hostLoadChart) {
    charts.hostLoadChart.destroy();
  }

  const maxValue = Math.max(...hostLoad.map((h) => h.activeTasks));

  charts.hostLoadChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: hostLoad.map((h) => h.hostName.split(" ")[0]),
      datasets: [
        {
          label: "Активные задачи практикантов",
          data: hostLoad.map((h) => h.activeTasks),
          backgroundColor: "#f59e0b",
          borderRadius: {
            topLeft: 6,
            topRight: 6,
            bottomLeft: 0,
            bottomRight: 0,
          },
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              const index = context.dataIndex;
              const host = hostLoad[index];
              return [
                `Активные задачи: ${host.activeTasks}`,
                `Средняя оценка: ${host.avgRating}`,
              ];
            },
          },
        },
        datalabels: {
          display: true,
          anchor: "end",
          align: "top",
          offset: 4,
          formatter: function (value) {
            return value;
          },
          color: "#333",
          font: {
            size: 12,
            weight: "normal",
          },
        },
      },
      scales: {
        y: {
          display: false,
          beginAtZero: true,
          suggestedMax: maxValue * 1.15,
          grace: "15%",
        },
        x: {
          ticks: {
            font: {
              size: 10,
              color: "#333",
            },
          },
          grid: {
            display: false,
          },
        },
      },
    },
  });
}

// Рендеринг критических уведомлений
function renderCriticalNotifications() {
  const container = document.getElementById("criticalNotificationsList");
  if (!container) return;

  if (criticalNotifications.length === 0) {
    container.innerHTML =
      '<div class="no-data-message">Нет критических уведомлений</div>';
    return;
  }

  container.innerHTML = criticalNotifications
    .map(
      (notif) => `
      <div class="critical-notification ${notif.critical ? "critical" : "warning"}">
        <div class="notification-content">
          <div class="notification-title">${notif.title}</div>
          <div class="notification-text">${notif.text}</div>
          <div class="notification-date">${formatDateTime(notif.date)}</div>
        </div>
        <div class="notification-action">
          <button class="notification-action-btn" data-notification-id="${notif.id}">Перейти</button>
        </div>
      </div>
    `,
    )
    .join("");

  // Добавляем делегирование событий для кнопок уведомлений
  container.addEventListener("click", function (e) {
    if (e.target.classList.contains("notification-action-btn")) {
      const notificationId = parseInt(e.target.dataset.notificationId);
      handleNotificationAction(notificationId);
    }
  });
}

// Обработка нажатия на кнопку уведомления
function handleNotificationAction(notificationId) {
  const notif = criticalNotifications.find((n) => n.id === notificationId);
  if (notif) {
    alert(`Переход к уведомлению: ${notif.title}`);
  }
}

// Форматирование даты и времени
function formatDateTime(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Вспомогательная функция для получения номера недели
function getWeekNumber(dateString) {
  const date = new Date(dateString);
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
}

// Рендеринг метрик выбранного практика для куратора
function renderSupervisorInternMetrics() {
  renderInternMetricsCommon("supervisorInternMetrics", {
    rating: "supervisorMetricRating",
    completedTasks: "supervisorMetricCompletedTasks",
    avgRating: "supervisorMetricAvgRating",
    progress: "supervisorMetricProgress",
  });
}

// Рендеринг графика распределения задач по типу для куратора
function renderSupervisorTaskTypeChart() {
  const ctx = document.getElementById("supervisorTaskTypeChart");
  charts.supervisorTaskTypeChart = renderTaskTypeChartCommon(
    ctx,
    charts.supervisorTaskTypeChart,
  );
}

// Рендеринг расписания для куратора
function renderSupervisorAnalyticsSchedule() {
  const container = document.getElementById("supervisorAnalyticsSchedule");
  if (!container) return;

  const intern = allUsers.find((u) => u.id === selectedInternId);
  if (!intern) return;

  container.innerHTML = `
    <table class="schedule-table">
      ${intern.schedule
        .map(
          (day) => `
        <tr>
          <th>${day.day}</th>
          <td><span class="schedule-status ${day.status}">${getScheduleStatusText(day.status)}</span></td>
        </tr>
      `,
        )
        .join("")}
    </table>
  `;
}

// Рендеринг графика закрытых задач по неделям для куратора
function renderSupervisorWeeklyTasksChart() {
  const ctx = document.getElementById("supervisorWeeklyTasksChart");
  if (!ctx) return;

  const internTasks = completedTasks.filter(
    (t) => t.internId === selectedInternId,
  );

  // Группируем по неделям
  const weeklyData = {};
  internTasks.forEach((task) => {
    const week = getWeekNumber(task.completedAt);
    weeklyData[week] = (weeklyData[week] || 0) + 1;
  });

  const weeks = Object.keys(weeklyData).sort();
  const counts = weeks.map((w) => weeklyData[w]);

  if (charts.supervisorWeeklyTasksChart) {
    charts.supervisorWeeklyTasksChart.destroy();
  }

  const minValue = Math.min(...counts);
  const yMin = Math.floor(minValue / 10) * 10;

  charts.supervisorWeeklyTasksChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: weeks.map((w) => `Неделя ${w}`),
      datasets: [
        {
          label: "Закрыто задач",
          data: counts,
          borderColor: "#2cb5b4",
          backgroundColor: "rgba(44, 181, 180, 0.1)",
          borderWidth: 2,
          tension: 0.3,
          fill: false,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
        datalabels: {
          display: true,
          anchor: "end",
          align: "top",
          offset: 8,
          formatter: function (value) {
            return value;
          },
          color: "#333",
          font: {
            size: 12,
            weight: "normal",
          },
        },
      },
      scales: {
        y: {
          display: false,
          beginAtZero: true,
          min: yMin < 0 ? 0 : yMin,
          grace: "10%",
        },
        x: {
          ticks: {
            font: {
              size: 10,
              color: "#333",
            },
          },
          grid: {
            display: false,
          },
        },
      },
      interaction: {
        mode: "nearest",
        axis: "x",
        intersect: false,
      },
    },
  });
}

// Рендеринг списка активных задач для куратора
function renderSupervisorActiveTasksList() {
  renderActiveTasksListCommon(
    "supervisorActiveTasksList",
    "#supervisorTaskSortButtons .sort-btn",
    true,
  );
}

// Рендеринг последних отзывов для куратора
function renderSupervisorRecentReviews() {
  const container = document.getElementById("supervisorRecentReviews");
  if (!container) return;

  const internReviews = reviews.filter((r) => r.internId === selectedInternId);

  if (internReviews.length === 0) {
    container.innerHTML = "<p>Нет отзывов</p>";
    return;
  }

  container.innerHTML = internReviews
    .map(
      (review) => `
      <div class="review-item">
        <div class="review-header">
          <span class="review-author">${review.author}</span>
          <span class="review-rating">${"★".repeat(review.rating)}${"☆".repeat(5 - review.rating)}</span>
        </div>
        <div class="review-text">${review.text}</div>
        <div class="review-date">${review.date}</div>
      </div>
    `,
    )
    .join("");
}

// Вспомогательная функция для получения текста статуса расписания
function getScheduleStatusText(status) {
  switch (status) {
    case "morning":
      return "до обеда";
    case "afternoon":
      return "после обеда";
    case "out":
      return "не в офисе";
    case "all_day":
      return "целый день";
    default:
      return status;
  }
}

// ----- Event Listeners for Task Progress Chart -----

// Sort buttons for host analytics
const taskSortButtons = document.getElementById("taskSortButtons");
if (taskSortButtons) {
  taskSortButtons.addEventListener("click", function (e) {
    const sortBtn = e.target.closest(".sort-btn");
    if (!sortBtn) return;

    // Update active state
    taskSortButtons.querySelectorAll(".sort-btn").forEach((btn) => {
      btn.classList.remove("active");
    });
    sortBtn.classList.add("active");

    // Re-render tasks with new sort
    renderActiveTasksList();
  });
}

// Sort buttons for supervisor analytics
const supervisorTaskSortButtons = document.getElementById(
  "supervisorTaskSortButtons",
);
if (supervisorTaskSortButtons) {
  supervisorTaskSortButtons.addEventListener("click", function (e) {
    const sortBtn = e.target.closest(".sort-btn");
    if (!sortBtn) return;

    // Update active state
    supervisorTaskSortButtons.querySelectorAll(".sort-btn").forEach((btn) => {
      btn.classList.remove("active");
    });
    sortBtn.classList.add("active");

    // Re-render tasks with new sort
    renderSupervisorActiveTasksList();
  });
}

// Task card clicks to open checklist modal (host)
const activeTasksList = document.getElementById("activeTasksList");
if (activeTasksList) {
  activeTasksList.addEventListener("click", function (e) {
    const taskCard = e.target.closest(".task-progress-card");
    if (!taskCard) return;

    const taskId = parseInt(taskCard.dataset.taskId);
    openTaskChecklistModal(taskId);
  });
}

// Task card clicks to open checklist modal (supervisor)
const supervisorActiveTasksList = document.getElementById(
  "supervisorActiveTasksList",
);
if (supervisorActiveTasksList) {
  supervisorActiveTasksList.addEventListener("click", function (e) {
    const taskCard = e.target.closest(".task-progress-card");
    if (!taskCard) return;

    const taskId = parseInt(taskCard.dataset.taskId);
    openTaskChecklistModal(taskId);
  });
}

// Close checklist modal
const taskChecklistClose = document.getElementById("taskChecklistClose");
if (taskChecklistClose) {
  taskChecklistClose.addEventListener("click", function () {
    const taskChecklistModal = document.getElementById("taskChecklistModal");
    if (taskChecklistModal) {
      taskChecklistModal.classList.remove("active");
    }
  });
}

// Close checklist modal on overlay click
const taskChecklistModal = document.getElementById("taskChecklistModal");
if (taskChecklistModal) {
  taskChecklistModal.addEventListener("click", function (e) {
    if (e.target === taskChecklistModal) {
      taskChecklistModal.classList.remove("active");
    }
  });
}

// Checklist item checkboxes
const taskChecklistItems = document.getElementById("taskChecklistItems");
if (taskChecklistItems) {
  taskChecklistItems.addEventListener("change", function (e) {
    if (e.target.type === "checkbox") {
      const checkbox = e.target;
      const taskId = parseInt(checkbox.dataset.taskId);
      const itemId = parseInt(checkbox.dataset.itemId);

      // Update task in hostTasks array
      const task = hostTasks.find((t) => t.id === taskId);
      if (task) {
        const checklistItem = task.checklist.find((item) => item.id === itemId);
        if (checklistItem) {
          checklistItem.checked = checkbox.checked;

          // Update the text styling
          const textElement = checkbox.nextElementSibling;
          if (textElement) {
            textElement.classList.toggle("checked", checkbox.checked);
          }

          // Re-render the task lists to update progress bars
          renderActiveTasksList();
          renderSupervisorActiveTasksList();
        }
      }
    }
  });
}

// Function to open task checklist modal
function openTaskChecklistModal(taskId) {
  const task = hostTasks.find((t) => t.id === taskId);
  if (!task) return;

  const modal = document.getElementById("taskChecklistModal");
  const title = document.getElementById("taskChecklistTitle");
  const itemsContainer = document.getElementById("taskChecklistItems");

  if (!modal || !title || !itemsContainer) return;

  title.textContent = task.title;

  itemsContainer.innerHTML = task.checklist
    .map(
      (item) => `
    <label class="checklist-item">
      <input type="checkbox"
             data-task-id="${task.id}"
             data-item-id="${item.id}"
             ${item.checked ? "checked" : ""}>
      <span class="checklist-item-text ${item.checked ? "checked" : ""}">${item.text}</span>
    </label>
  `,
    )
    .join("");

  modal.classList.add("active");
}

// ===== PROFILE INLINE EDITING FUNCTIONALITY =====

// Store original values for cancel functionality - Map of Maps keyed by content element
const originalValuesMap = new Map();

// Initialize inline editing for profile blocks
function initProfileInlineEditing() {
  // Get all pencil icons
  const pencilIcons = document.querySelectorAll(".pencil-icon");

  pencilIcons.forEach((icon) => {
    icon.addEventListener("click", function () {
      const blockName = this.dataset.block;
      const blockSection = this.closest(".profile-block-section");
      const content = document.getElementById(`${blockName}-content`);

      if (!content) return;

      // Store original values
      storeOriginalValues(content);

      // Switch to edit mode
      enterEditMode(blockSection, content);
    });
  });

  // Handle cancel buttons
  document.querySelectorAll(".edit-btn.cancel").forEach((btn) => {
    btn.addEventListener("click", function () {
      const blockSection = this.closest(".profile-block-section");
      const content = this.closest(".profile-block-content");

      if (!content) return;

      // Restore original values
      restoreOriginalValues(content);

      // Exit edit mode
      exitEditMode(blockSection, content);
    });
  });

  // Handle save buttons
  document.querySelectorAll(".edit-btn.save").forEach((btn) => {
    btn.addEventListener("click", function () {
      const blockSection = this.closest(".profile-block-section");
      const content = this.closest(".profile-block-content");

      if (!content) return;

      // Save changes
      saveChanges(content);

      // Update view mode with new values
      updateViewMode(content);

      // Exit edit mode
      exitEditMode(blockSection, content);
    });
  });

  // Handle avatar change buttons
  document.querySelectorAll(".change-avatar-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      const input = this.nextElementSibling;
      if (input && input.type === "file") {
        input.click();
      }
    });
  });

  // Handle avatar file inputs
  document
    .querySelectorAll('input[type="file"][accept="image/*"]')
    .forEach((input) => {
      input.addEventListener("change", function () {
        if (this.files && this.files[0]) {
          // In a real app, you would upload the file here
          console.log("Avatar file selected:", this.files[0].name);
          alert(
            "Фото выбрано. В реальном приложении оно будет загружено на сервер.",
          );
        }
      });
    });

  // Handle add interest buttons
  document.querySelectorAll(".add-interest-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      const container = this.closest(".interests-edit");
      if (!container) return;

      const newInterest = document.createElement("div");
      newInterest.className = "interests-inputs";
      newInterest.innerHTML = `
        <input type="text" class="interest-input" placeholder="#новый-интерес">
        <button class="remove-interest">×</button>
      `;

      container.insertBefore(newInterest, this);

      // Add remove listener to new button
      newInterest
        .querySelector(".remove-interest")
        .addEventListener("click", function () {
          newInterest.remove();
        });

      // Focus on new input
      newInterest.querySelector(".interest-input").focus();
    });
  });

  // Handle remove interest buttons
  document.querySelectorAll(".remove-interest").forEach((btn) => {
    btn.addEventListener("click", function () {
      const container = this.closest(".interests-inputs");
      if (container) {
        container.remove();
      }
    });
  });
}

// Store original values from view mode
function storeOriginalValues(content) {
  const viewMode = content.querySelector(".view-mode");
  if (!viewMode) return;

  // Create a new Map for this content element
  const contentId = content.id;
  const originalValues = new Map();
  originalValuesMap.set(contentId, originalValues);

  // Store field values
  viewMode.querySelectorAll(".field-value[data-field]").forEach((field) => {
    const fieldName = field.dataset.field;
    originalValues.set(fieldName, field.textContent.trim());
  });

  // Store interests
  const interestsList = viewMode.querySelector(".interests-list");
  if (interestsList) {
    const interests = Array.from(
      interestsList.querySelectorAll(".interest-tag"),
    ).map((tag) => tag.textContent.trim());
    originalValues.set("interests", interests);
  }

  // Store schedule
  const scheduleDisplay = viewMode.querySelector(".schedule-display");
  if (scheduleDisplay) {
    const schedule = {};
    scheduleDisplay.querySelectorAll(".schedule-row").forEach((row) => {
      const day = row.querySelector(".day-label").textContent.trim();
      const statusSpan = row.querySelector(".schedule-status");
      // Store the actual status value using data attribute if available, otherwise parse from class
      let status = statusSpan.dataset.status;
      if (!status) {
        // Fallback to parsing from class name
        const className = statusSpan.className;
        if (className.includes("morning")) {
          status = "morning";
        } else if (className.includes("afternoon")) {
          status = "afternoon";
        } else {
          status = "out";
        }
      }
      schedule[day] = status;
    });
    originalValues.set("schedule", schedule);
  }
}

// Restore original values
function restoreOriginalValues(content) {
  const editMode = content.querySelector(".edit-mode");
  if (!editMode) return;

  // Get the content-specific original values
  const contentId = content.id;
  const originalValues = originalValuesMap.get(contentId);
  if (!originalValues) return;

  // Restore field values
  editMode
    .querySelectorAll(".field-input[data-field], .field-select[data-field]")
    .forEach((field) => {
      const fieldName = field.dataset.field;
      if (originalValues.has(fieldName)) {
        field.value = originalValues.get(fieldName);
      }
    });

  // Restore interests
  const interestsEdit = editMode.querySelector(".interests-edit");
  if (interestsEdit && originalValues.has("interests")) {
    const interests = originalValues.get("interests");
    interestsEdit.innerHTML =
      interests
        .map(
          (interest) => `
      <div class="interests-inputs">
        <input type="text" class="interest-input" value="${interest}">
        <button class="remove-interest">×</button>
      </div>
    `,
        )
        .join("") +
      `
      <button class="add-interest-btn">+ Добавить интерес</button>
    `;

    // Re-add event listeners
    initInterestListeners(interestsEdit);
  }

  // Restore schedule
  const scheduleEdit = editMode.querySelector(".schedule-edit");
  if (scheduleEdit && originalValues.has("schedule")) {
    const schedule = originalValues.get("schedule");

    scheduleEdit.querySelectorAll(".schedule-row").forEach((row) => {
      const dayLabel = row.querySelector(".day-label").textContent.trim();
      const select = row.querySelector(".schedule-select");

      if (select && schedule[dayLabel]) {
        // Use the stored status value directly
        select.value = schedule[dayLabel];
      }
    });
  }

  // Clean up the original values for this content
  originalValuesMap.delete(contentId);
}

// Save changes
function saveChanges(content) {
  const editMode = content.querySelector(".edit-mode");
  if (!editMode) return;

  // Collect new values
  const newValues = {};

  // Collect field values
  editMode
    .querySelectorAll(".field-input[data-field], .field-select[data-field]")
    .forEach((field) => {
      const fieldName = field.dataset.field;
      newValues[fieldName] = field.value;
    });

  // Collect interests
  const interestsEdit = editMode.querySelector(".interests-edit");
  if (interestsEdit) {
    const interests = Array.from(
      interestsEdit.querySelectorAll(".interest-input"),
    )
      .map((input) => input.value.trim())
      .filter((val) => val !== "");
    newValues.interests = interests;
  }

  // Collect schedule
  const scheduleEdit = editMode.querySelector(".schedule-edit");
  if (scheduleEdit) {
    const schedule = {};
    scheduleEdit.querySelectorAll(".schedule-row").forEach((row) => {
      const dayLabel = row.querySelector(".day-label").textContent.trim();
      const select = row.querySelector(".schedule-select");
      if (select) {
        schedule[dayLabel] = select.value;
      }
    });
    newValues.schedule = schedule;
  }

  // Update current user data (in a real app, this would be sent to server)
  console.log("Saving changes:", newValues);

  // Clean up the original values for this content
  const contentId = content.id;
  originalValuesMap.delete(contentId);

  // Update currentUser object based on current role
  if (currentRole === "intern") {
    if (newValues.name) currentUser.intern.name = newValues.name;
    if (newValues.block) currentUser.intern.block = newValues.block;
    if (newValues.interests) currentUser.intern.interests = newValues.interests;
    if (newValues.schedule)
      currentUser.intern.schedule = Object.entries(newValues.schedule).map(
        ([day, status]) => ({
          day,
          status,
        }),
      );
  } else if (currentRole === "employee" || currentRole === "host") {
    if (currentUser[currentRole]) {
      if (newValues.name) currentUser[currentRole].name = newValues.name;
      if (newValues.block) currentUser[currentRole].block = newValues.block;
    }
  } else if (currentRole === "supervisor") {
    if (newValues.name) currentUser.supervisor.name = newValues.name;
    if (newValues.block) currentUser.supervisor.block = newValues.block;
  }
}

// Update view mode with new values
function updateViewMode(content) {
  const viewMode = content.querySelector(".view-mode");
  if (!viewMode) return;

  // Update field values
  viewMode.querySelectorAll(".field-value[data-field]").forEach((field) => {
    const fieldName = field.dataset.field;
    const editMode = content.querySelector(".edit-mode");
    if (editMode) {
      const editField = editMode.querySelector(`[data-field="${fieldName}"]`);
      if (editField) {
        field.textContent = editField.value;
      }
    }
  });

  // Update interests
  const interestsList = viewMode.querySelector(".interests-list");
  const interestsEdit = content.querySelector(".edit-mode .interests-edit");
  if (interestsList && interestsEdit) {
    const interests = Array.from(
      interestsEdit.querySelectorAll(".interest-input"),
    )
      .map((input) => input.value.trim())
      .filter((val) => val !== "");
    interestsList.innerHTML = interests
      .map((interest) => `<span class="interest-tag">${interest}</span>`)
      .join("");
  }

  // Update schedule
  const scheduleDisplay = viewMode.querySelector(".schedule-display");
  const scheduleEdit = content.querySelector(".edit-mode .schedule-edit");
  if (scheduleDisplay && scheduleEdit) {
    const statusMap = {
      morning: "до обеда",
      afternoon: "после обеда",
      out: "не в офисе",
    };

    const classMap = {
      morning: "morning",
      afternoon: "afternoon",
      out: "out",
    };

    scheduleDisplay.querySelectorAll(".schedule-row").forEach((row) => {
      const dayLabel = row.querySelector(".day-label").textContent.trim();
      const statusSpan = row.querySelector(".schedule-status");

      // Find corresponding edit row
      const editRow = Array.from(
        scheduleEdit.querySelectorAll(".schedule-row"),
      ).find(
        (r) => r.querySelector(".day-label").textContent.trim() === dayLabel,
      );

      if (editRow && statusSpan) {
        const select = editRow.querySelector(".schedule-select");
        if (select) {
          const value = select.value;
          statusSpan.textContent = statusMap[value];
          statusSpan.className = `schedule-status ${classMap[value]}`;
        }
      }
    });
  }
}

// Enter edit mode
function enterEditMode(blockSection, content) {
  // Hide pencil icon
  const pencilIcon = blockSection.querySelector(".pencil-icon");
  if (pencilIcon) {
    pencilIcon.style.display = "none";
  }

  // Show edit mode, hide view mode
  content.querySelector(".view-mode").style.display = "none";
  content.querySelector(".edit-mode").style.display = "block";

  // Add editing class to section
  blockSection.classList.add("editing");
}

// Exit edit mode
function exitEditMode(blockSection, content) {
  // Show pencil icon
  const pencilIcon = blockSection.querySelector(".pencil-icon");
  if (pencilIcon) {
    pencilIcon.style.display = "flex";
  }

  // Show view mode, hide edit mode
  content.querySelector(".view-mode").style.display = "block";
  content.querySelector(".edit-mode").style.display = "none";

  // Remove editing class from section
  blockSection.classList.remove("editing");
}

// Initialize interest listeners (for dynamically added elements)
function initInterestListeners(container) {
  container.querySelectorAll(".remove-interest").forEach((btn) => {
    btn.addEventListener("click", function () {
      const inputsContainer = this.closest(".interests-inputs");
      if (inputsContainer) {
        inputsContainer.remove();
      }
    });
  });

  const addBtn = container.querySelector(".add-interest-btn");
  if (addBtn) {
    addBtn.addEventListener("click", function () {
      const newInterest = document.createElement("div");
      newInterest.className = "interests-inputs";
      newInterest.innerHTML = `
        <input type="text" class="interest-input" placeholder="#новый-интерес">
        <button class="remove-interest">×</button>
      `;

      container.insertBefore(newInterest, this);

      // Add remove listener to new button
      newInterest
        .querySelector(".remove-interest")
        .addEventListener("click", function () {
          newInterest.remove();
        });

      // Focus on new input
      newInterest.querySelector(".interest-input").focus();
    });
  }
}

// Initialize profile inline editing when profile screen is shown
function initProfileScreen() {
  initProfileInlineEditing();

  // QR button handlers
  const qrButtons = document.querySelectorAll(".qr-button");
  qrButtons.forEach((btn) => {
    btn.addEventListener("click", function () {
      alert("QR-код будет показан в модальном окне");
    });
  });

  // Profile button handlers in "Мои практиканты" section
  const hostProfileContent = document.getElementById("host-profile-content");
  const supervisorProfileContent = document.getElementById(
    "supervisor-profile-content",
  );

  const handleProfileButtonClick = function (e) {
    const profileBtn = e.target.closest(".action-btn.profile");
    if (profileBtn) {
      const internCard = profileBtn.closest(".intern-card");
      if (internCard) {
        const internName =
          internCard.querySelector(".intern-name")?.textContent;

        if (internName) {
          // Find intern data in allUsers array
          const intern = allUsers.find((u) => u.name === internName);

          if (intern) {
            showInternProfile(intern);
          } else {
            // Fallback: create minimal intern object if not found
            const internBlock =
              internCard.querySelector(".intern-block")?.textContent;
            const internAvatar =
              internCard.querySelector(".intern-avatar")?.textContent;
            const ratingText =
              internCard.querySelector(".intern-rating")?.textContent;
            const rating = ratingText
              ? parseFloat(ratingText.replace("Рейтинг: ", ""))
              : 0;

            showInternProfile({
              id: Date.now(),
              name: internName,
              block: internBlock,
              avatar: internAvatar,
              rating: rating,
              interests: [],
              schedule: [],
            });
          }
        }
      }
    }
  };

  if (hostProfileContent) {
    hostProfileContent.addEventListener("click", handleProfileButtonClick);
  }

  if (supervisorProfileContent) {
    supervisorProfileContent.addEventListener(
      "click",
      handleProfileButtonClick,
    );
  }
}

// Инициализация - рендерим задачи при загрузке
renderTasks();
renderHostTasks();
renderUsersList();
renderEmployeesList();
renderProfile();

// Initialize profile inline editing
initProfileScreen();

// Обработчики переключателя ленты для куратора
const supervisorFeedToggle = document.getElementById("supervisor-feed-toggle");
if (supervisorFeedToggle) {
  const toggleButtons =
    supervisorFeedToggle.querySelectorAll(".feed-toggle-btn");
  toggleButtons.forEach((btn) => {
    btn.addEventListener("click", function () {
      // Убираем активный класс со всех кнопок
      toggleButtons.forEach((b) => b.classList.remove("active"));
      // Добавляем активный класс на нажатую кнопку
      this.classList.add("active");
      // Обновляем режим ленты
      supervisorFeedMode = this.dataset.feed;
      // Перерисовываем ленту
      renderTasks();
    });
  });
}

// Обработчики модального окна черновика задачи
const createDraftTaskBtn = document.getElementById("createDraftTaskBtn");
const draftTaskModal = document.getElementById("draftTaskModal");
const draftTaskCancel = document.getElementById("draftTaskCancel");
const draftTaskSave = document.getElementById("draftTaskSave");

// Обработчик переключения типа задачи в модалке черновика
const draftTaskTypeSimple = document.getElementById("draftTaskTypeSimple");
const draftTaskTypeComplex = document.getElementById("draftTaskTypeComplex");
const draftSimpleTaskFields = document.getElementById("draftSimpleTaskFields");
const draftComplexTaskFields = document.getElementById(
  "draftComplexTaskFields",
);

if (draftTaskTypeSimple && draftTaskTypeComplex) {
  const handleDraftTaskTypeChange = function () {
    const isComplex = draftTaskTypeComplex.checked;

    if (isComplex) {
      draftSimpleTaskFields.style.display = "none";
      draftComplexTaskFields.style.display = "block";
      updateDraftChecklistForComplexTask();
    } else {
      draftSimpleTaskFields.style.display = "block";
      draftComplexTaskFields.style.display = "none";
      updateDraftChecklistForSimpleTask();
    }
  };

  draftTaskTypeSimple.addEventListener("change", handleDraftTaskTypeChange);
  draftTaskTypeComplex.addEventListener("change", handleDraftTaskTypeChange);
}

// Функции для обновления чек-листа черновика
function updateDraftChecklistForSimpleTask() {
  const checklistContainer = document.getElementById("draftTaskChecklist");
  checklistContainer.innerHTML = `
    <div class="checklist-row">
      <input type="text" class="modal-input checklist-input" placeholder="Элемент чек-листа" />
      <button type="button" class="remove-checklist-btn" style="display: none;">×</button>
    </div>
  `;
}

function updateDraftChecklistForComplexTask() {
  const checklistContainer = document.getElementById("draftTaskChecklist");
  checklistContainer.innerHTML = `
    <div class="checklist-row complex-checklist-row">
      <input type="text" class="modal-input checklist-input-text" placeholder="Элемент чек-листа" />
      <input type="date" class="modal-input checklist-input-deadline" placeholder="Дедлайн" />
      <input type="number" class="modal-input checklist-input-effort" placeholder="Часы" min="0.5" step="0.5" />
      <button type="button" class="remove-checklist-btn" style="display: none;">×</button>
    </div>
  `;
}

// Обработчик кнопки создания черновика
if (createDraftTaskBtn) {
  createDraftTaskBtn.addEventListener("click", function () {
    // Очищаем форму
    document.getElementById("draftTaskName").value = "";
    document.getElementById("draftTaskDescription").value = "";
    document.getElementById("draftTaskEffort").value = "";
    document.getElementById("draftTaskDeadline").value = "";
    document.getElementById("draftTaskGoal").value = "";
    document.getElementById("draftTaskOperational").checked = false;

    // Сбрасываем тип задачи на простой
    if (draftTaskTypeSimple) draftTaskTypeSimple.checked = true;
    if (draftTaskTypeComplex) draftTaskTypeComplex.checked = false;
    if (draftSimpleTaskFields) draftSimpleTaskFields.style.display = "block";
    if (draftComplexTaskFields) draftComplexTaskFields.style.display = "none";

    // Сбрасываем чек-лист до одного пустого поля
    updateDraftChecklistForSimpleTask();

    // Сбрасываем режим редактирования
    draftTaskModal.dataset.editDraftId = "";

    // Восстанавливаем заголовок и кнопку
    draftTaskModal.querySelector(".modal-title").textContent =
      "Новая задача (черновик)";
    document.getElementById("draftTaskSave").textContent = "Сохранить черновик";

    // Открываем модальное окно
    draftTaskModal.classList.add("active");
  });
}

// Обработчик добавления элемента чек-листа черновика
const addDraftChecklistItem = document.getElementById("addDraftChecklistItem");
if (addDraftChecklistItem) {
  addDraftChecklistItem.addEventListener("click", function () {
    const checklistContainer = document.getElementById("draftTaskChecklist");
    const isComplex = document.getElementById("draftTaskTypeComplex")?.checked;

    const newRow = document.createElement("div");
    newRow.className =
      "checklist-row" + (isComplex ? " complex-checklist-row" : "");

    if (isComplex) {
      newRow.innerHTML = `
        <input type="text" class="modal-input checklist-input-text" placeholder="Элемент чек-листа" />
        <input type="date" class="modal-input checklist-input-deadline" placeholder="Дедлайн" />
        <input type="number" class="modal-input checklist-input-effort" placeholder="Часы" min="0.5" step="0.5" />
        <button type="button" class="remove-checklist-btn">×</button>
      `;
    } else {
      newRow.innerHTML = `
        <input type="text" class="modal-input checklist-input" placeholder="Элемент чек-листа" />
        <button type="button" class="remove-checklist-btn">×</button>
      `;
    }

    checklistContainer.appendChild(newRow);

    checklistContainer
      .querySelectorAll(".remove-checklist-btn")
      .forEach((btn) => {
        btn.style.display = "flex";
      });
  });
}

// Обработчик удаления элементов чек-листа черновика
const draftTaskChecklist = document.getElementById("draftTaskChecklist");
if (draftTaskChecklist) {
  draftTaskChecklist.addEventListener("click", function (e) {
    if (e.target.classList.contains("remove-checklist-btn")) {
      const row = e.target.closest(".checklist-row");
      if (draftTaskChecklist.querySelectorAll(".checklist-row").length > 1) {
        row.remove();
        if (
          draftTaskChecklist.querySelectorAll(".checklist-row").length === 1
        ) {
          draftTaskChecklist.querySelector(
            ".remove-checklist-btn",
          ).style.display = "none";
        }
      }
    }
  });
}

// Обработчик сохранения черновика
if (draftTaskSave) {
  draftTaskSave.addEventListener("click", function () {
    const name = document.getElementById("draftTaskName").value.trim();
    const description = document
      .getElementById("draftTaskDescription")
      .value.trim();
    const goal = document.getElementById("draftTaskGoal").value;
    const operational = document.getElementById("draftTaskOperational").checked;
    const isComplex = document.getElementById("draftTaskTypeComplex")?.checked;
    const editDraftId = draftTaskModal.dataset.editDraftId;

    if (!name || !description) {
      alert("Пожалуйста, заполните все обязательные поля");
      return;
    }

    let checklist = [];
    let effort = "";
    let deadline = "";

    if (isComplex) {
      const checklistRows = document.querySelectorAll(
        "#draftTaskChecklist .complex-checklist-row",
      );
      checklistRows.forEach((row, index) => {
        const text = row.querySelector(".checklist-input-text")?.value.trim();
        const itemDeadline = row.querySelector(
          ".checklist-input-deadline",
        )?.value;
        const itemEffort = row.querySelector(".checklist-input-effort")?.value;

        if (text && itemDeadline && itemEffort) {
          checklist.push({
            id: index + 1,
            text: text,
            checked: false,
            deadline: itemDeadline,
            effort: itemEffort,
          });
        }
      });

      if (checklist.length === 0) {
        alert(
          "Пожалуйста, добавьте хотя бы один элемент в чек-лист с дедлайном и трудозатратами",
        );
        return;
      }

      const deadlines = checklist.map((item) => new Date(item.deadline));
      deadline = new Date(Math.max(...deadlines)).toISOString().split("T")[0];
      effort =
        checklist.reduce((sum, item) => sum + parseFloat(item.effort), 0) +
        " часов";
    } else {
      effort = document.getElementById("draftTaskEffort").value.trim();
      deadline = document.getElementById("draftTaskDeadline").value;

      if (!effort || !deadline) {
        alert("Пожалуйста, заполните все обязательные поля");
        return;
      }

      const checklistInputs = document.querySelectorAll(
        "#draftTaskChecklist .checklist-input",
      );
      checklistInputs.forEach((input, index) => {
        const text = input.value.trim();
        if (text) {
          checklist.push({
            id: index + 1,
            text: text,
            checked: false,
          });
        }
      });

      if (checklist.length === 0) {
        alert("Пожалуйста, добавьте хотя бы один элемент в чек-лист");
        return;
      }
    }

    if (editDraftId) {
      // Режим редактирования
      const draftIndex = draftTasks.findIndex(
        (t) => t.id === parseInt(editDraftId),
      );
      if (draftIndex > -1) {
        draftTasks[draftIndex] = {
          ...draftTasks[draftIndex],
          title: name,
          description: description,
          checklist: checklist,
          deadline: deadline,
          contribution: goal ? parseFloat(goal) : 0.1,
          operational: operational,
          taskType: isComplex ? "complex" : "simple",
          effort: effort,
        };
        alert("Черновик обновлён");
      }
    } else {
      // Режим создания
      const newDraft = {
        id: Date.now(),
        internId: currentInternId,
        internName: currentUser.intern.name,
        title: name,
        description: description,
        checklist: checklist,
        deadline: deadline,
        contribution: goal ? parseFloat(goal) : 0.1,
        operational: operational,
        taskType: isComplex ? "complex" : "simple",
        effort: effort,
        status: "pending",
      };

      draftTasks.push(newDraft);
      alert("Черновик задачи сохранён");
    }

    draftTaskModal.classList.remove("active");
    renderHostTasks();
  });
}

// Обработчик отмены черновика
if (draftTaskCancel) {
  draftTaskCancel.addEventListener("click", function () {
    draftTaskModal.classList.remove("active");
  });
}

// Обработчик закрытия модального окна черновика при клике на оверлей
if (draftTaskModal) {
  draftTaskModal.addEventListener("click", function (e) {
    if (e.target === draftTaskModal) {
      draftTaskModal.classList.remove("active");
    }
  });
}

// Делегирование событий для карточек черновиков
myTasksScreen.addEventListener("click", function (e) {
  const sendBtn = e.target.closest('[data-action="send"]');
  if (sendBtn) {
    const draftId = parseInt(sendBtn.getAttribute("data-draft-id"));
    const draft = draftTasks.find((t) => t.id === draftId);
    if (draft) {
      // Перемещаем из черновиков в задачи на согласовании
      draft.status = "awaiting_approval";
      alert("Задача отправлена хосту на согласование");
      renderHostTasks();
    }
    return;
  }

  const editBtn = e.target.closest('[data-action="edit"]');
  if (editBtn) {
    const draftId = parseInt(editBtn.getAttribute("data-draft-id"));
    const draft = draftTasks.find((t) => t.id === draftId);
    if (draft) {
      // Открываем модалку для редактирования
      openDraftTaskForEdit(draft);
    }
    return;
  }

  const deleteBtn = e.target.closest('[data-action="delete"]');
  if (deleteBtn) {
    const draftId = parseInt(deleteBtn.getAttribute("data-draft-id"));
    if (confirm("Удалить черновик задачи?")) {
      const index = draftTasks.findIndex((t) => t.id === draftId);
      if (index > -1) {
        draftTasks.splice(index, 1);
        alert("Черновик удалён");
        renderHostTasks();
      }
    }
    return;
  }
});

// Функция для открытия черновика на редактирование
function openDraftTaskForEdit(draft) {
  // Заполняем поля формы
  document.getElementById("draftTaskName").value = draft.title;
  document.getElementById("draftTaskDescription").value = draft.description;
  document.getElementById("draftTaskGoal").value =
    typeof draft.contribution === "number"
      ? draft.contribution.toString()
      : draft.contribution;
  document.getElementById("draftTaskOperational").checked = draft.operational;

  // Устанавливаем тип задачи
  if (draft.taskType === "complex") {
    if (draftTaskTypeComplex) draftTaskTypeComplex.checked = true;
    if (draftTaskTypeSimple) draftTaskTypeSimple.checked = false;
    if (draftSimpleTaskFields) draftSimpleTaskFields.style.display = "none";
    if (draftComplexTaskFields) draftComplexTaskFields.style.display = "block";
  } else {
    if (draftTaskTypeSimple) draftTaskTypeSimple.checked = true;
    if (draftTaskTypeComplex) draftTaskTypeComplex.checked = false;
    if (draftSimpleTaskFields) draftSimpleTaskFields.style.display = "block";
    if (draftComplexTaskFields) draftComplexTaskFields.style.display = "none";
    document.getElementById("draftTaskEffort").value = draft.effort || "";
    document.getElementById("draftTaskDeadline").value = draft.deadline || "";
  }

  // Заполняем чек-лист
  const checklistContainer = document.getElementById("draftTaskChecklist");
  checklistContainer.innerHTML = "";

  draft.checklist.forEach((item, index) => {
    const row = document.createElement("div");
    row.className =
      "checklist-row" +
      (draft.taskType === "complex" ? " complex-checklist-row" : "");

    if (draft.taskType === "complex") {
      row.innerHTML = `
        <input type="text" class="modal-input checklist-input-text" value="${item.text}" placeholder="Элемент чек-листа" />
        <input type="date" class="modal-input checklist-input-deadline" value="${item.deadline || ""}" placeholder="Дедлайн" />
        <input type="number" class="modal-input checklist-input-effort" value="${item.effort || ""}" placeholder="Часы" min="0.5" step="0.5" />
        <button type="button" class="remove-checklist-btn" style="display: flex;">×</button>
      `;
    } else {
      row.innerHTML = `
        <input type="text" class="modal-input checklist-input" value="${item.text}" placeholder="Элемент чек-листа" />
        <button type="button" class="remove-checklist-btn" style="display: flex;">×</button>
      `;
    }

    checklistContainer.appendChild(row);
  });

  // Сохраняем ID черновика для редактирования
  draftTaskModal.dataset.editDraftId = draft.id;

  // Меняем заголовок и кнопку
  draftTaskModal.querySelector(".modal-title").textContent =
    "Редактировать черновик";
  document.getElementById("draftTaskSave").textContent = "Сохранить изменения";

  draftTaskModal.classList.add("active");
}

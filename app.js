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
      { day: "Пн", status: "morning" },
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
    contribution: "Фронтенд",
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
    contribution: "Аналитика",
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
    contribution: "DevOps",
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
    contribution: "UI/UX",
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
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
  },
  {
    id: 2,
    name: "Мария Петрова",
    block: "IT",
    helpBlocks: ["Аналитика", "Маркетинг"],
    startTime: "2025-04-25T10:00",
    endTime: "2025-04-25T13:00",
    rating: 4.5,
    avatar: "https://randomuser.me/api/portraits/women/2.jpg",
  },
  {
    id: 3,
    name: "Алексей Смирнов",
    block: "Маркетинг",
    helpBlocks: [],
    startTime: "2025-04-26T15:00",
    endTime: "2025-04-26T18:00",
    rating: 4.9,
    avatar: "https://randomuser.me/api/portraits/men/3.jpg",
  },
];

// Массив всех сотрудников (включая хостов и руководителя)
const allEmployees = [
  {
    id: 101,
    name: "Алексей Петров",
    block: "Аналитика",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    role: "employee",
  },
  {
    id: 102,
    name: "Мария Иванова",
    block: "Маркетинг",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    role: "host",
  },
  {
    id: 103,
    name: "Дмитрий Сидоров",
    block: "IT",
    avatar: "https://randomuser.me/api/portraits/men/22.jpg",
    role: "employee",
  },
  {
    id: 104,
    name: "Елена Козлова",
    block: "Аналитика",
    avatar: "https://randomuser.me/api/portraits/women/65.jpg",
    role: "supervisor",
  },
  {
    id: 105,
    name: "Олег Иванов",
    block: "Маркетинг",
    avatar: "https://randomuser.me/api/portraits/men/52.jpg",
    role: "employee",
  },
];

// Получаем элементы
const roleSelector = document.getElementById("roleSelector");
const notifBtn = document.getElementById("notifBtn");
const feedScreen = document.getElementById("feed-screen");
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
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
    schedule: [
      { day: "Пн", status: "morning" },
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
    avatar: "https://randomuser.me/api/portraits/women/2.jpg",
    schedule: [
      { day: "Пн", status: "afternoon" },
      { day: "Вт", status: "morning" },
      { day: "Ср", status: "morning" },
      { day: "Чт", status: "morning" },
      { day: "Пт", status: "out" },
    ],
  },
  {
    id: 3,
    name: "Алексей Смирнов",
    block: "Маркетинг",
    interests: ["#аналитика", "#дизайн"],
    rating: 4.9,
    avatar: "https://randomuser.me/api/portraits/men/3.jpg",
    schedule: [
      { day: "Пн", status: "morning" },
      { day: "Вт", status: "morning" },
      { day: "Ср", status: "afternoon" },
      { day: "Чт", status: "afternoon" },
      { day: "Пт", status: "morning" },
    ],
  },
  {
    id: 4,
    name: "Елена Козлова",
    block: "Аналитика",
    interests: ["#данные", "#ml"],
    rating: 4.7,
    avatar: "https://randomuser.me/api/portraits/women/4.jpg",
    schedule: [
      { day: "Пн", status: "out" },
      { day: "Вт", status: "afternoon" },
      { day: "Ср", status: "afternoon" },
      { day: "Чт", status: "morning" },
      { day: "Пт", status: "morning" },
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
    deadline: "2025-05-20",
    contribution: "Обучение",
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
    deadline: "2025-05-25",
    contribution: "Документация",
    operational: true,
  },
];

// Функция для расчёта прогресса задачи
function calculateProgress(task) {
  const total = task.checklist.length;
  const checked = task.checklist.filter((item) => item.checked).length;
  return Math.round((checked / total) * 100);
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
      document.getElementById("currentUserRating").textContent = intern.rating;
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
    checklistHTML += `
            <div class="checklist-item">
              <input type="checkbox" id="task-${task.id}-item-${item.id}"
                     data-task-id="${task.id}" data-item-id="${item.id}"
                     ${item.checked ? "checked" : ""}>
              <label for="task-${task.id}-item-${item.id}">${item.text}</label>
            </div>
          `;
  });

  card.innerHTML = `
          <h3 class="host-task-title">${task.title}</h3>
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

// Функция для рендеринга всех задач хоста
function renderHostTasks() {
  const myTasksContent = document.getElementById("my-tasks-content");
  const internTasksContent = document.getElementById("intern-tasks-content");
  const hostTabs = document.getElementById("hostTabs");

  // Очищаем контейнеры
  if (myTasksContent) myTasksContent.innerHTML = "";
  if (internTasksContent) internTasksContent.innerHTML = "";
  // Очищаем экран задач для практики - удаляем только карточки задач
  const existingCards = myTasksScreen.querySelectorAll(".host-task-card");
  existingCards.forEach((card) => card.remove());
  const existingPlaceholders =
    myTasksScreen.querySelectorAll(".feed-placeholder");
  existingPlaceholders.forEach((ph) => ph.remove());

  // Показываем/скрываем вкладки для хоста
  if (hostTabs) {
    hostTabs.style.display = currentRole === "host" ? "flex" : "none";
  }

  if (currentRole === "intern") {
    // Для практика показываем его задачи с чек-листами (фильтруем по internId)
    const internTasks = hostTasks.filter((t) => t.internId === currentInternId);

    if (internTasks.length === 0) {
      myTasksScreen.innerHTML = `
              <div class="feed-placeholder">
                <h2>Нет задач</h2>
                <p>У вас пока нет назначенных задач</p>
              </div>
            `;
    } else {
      internTasks.forEach((task) => {
        const card = renderHostTaskCard(task);
        myTasksScreen.appendChild(card);
      });
    }

    // Добавляем обработчики для чекбоксов
    const checkboxes = myTasksScreen.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach((checkbox) => {
      checkbox.addEventListener("change", function () {
        const taskId = parseInt(this.getAttribute("data-task-id"));
        const itemId = parseInt(this.getAttribute("data-item-id"));

        // Обновляем состояние в массиве
        const task = hostTasks.find((t) => t.id === taskId);
        if (task) {
          const item = task.checklist.find((i) => i.id === itemId);
          if (item) {
            item.checked = this.checked;

            // Перерисовываем карточку для обновления прогресса
            const card = myTasksScreen.querySelector(
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
                cb.addEventListener("change", function () {
                  const tId = parseInt(this.getAttribute("data-task-id"));
                  const iId = parseInt(this.getAttribute("data-item-id"));
                  const t = hostTasks.find((t) => t.id === tId);
                  if (t) {
                    const i = t.checklist.find((i) => i.id === iId);
                    if (i) {
                      i.checked = this.checked;
                      const c = myTasksScreen.querySelector(
                        `[data-task-id="${tId}"]`,
                      );
                      if (c) {
                        const nc = renderHostTaskCard(t);
                        c.replaceWith(nc);
                        const ncb = nc.querySelectorAll(
                          'input[type="checkbox"]',
                        );
                        ncb.forEach((cb) => {
                          cb.addEventListener("change", arguments.callee);
                        });
                        const notifyBtn = nc.querySelector(".notify-btn");
                        if (notifyBtn) {
                          notifyBtn.addEventListener("click", function () {
                            alert(
                              "Уведомление отправлено хосту о задаче #" + tId,
                            );
                          });
                        }
                      }
                    }
                  }
                });
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
      });
    });

    // Добавляем обработчики для кнопок "Сообщить хосту"
    const notifyButtons = myTasksScreen.querySelectorAll(".notify-btn");
    notifyButtons.forEach((btn) => {
      btn.addEventListener("click", function () {
        const taskId = this.getAttribute("data-task-id");
        alert("Уведомление отправлено хосту о задаче #" + taskId);
      });
    });
  } else if (currentRole === "host") {
    // Для хоста показываем вкладки с задачами
    // Вкладка "Мои задачи" - задачи сотрудника
    const employeeTasks = tasks.filter((t) => t.authorId === currentEmployeeId);

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

    // Вкладка "Задачи моих практикантов"
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
          checklistHTML += `
                  <div class="checklist-item">
                    <input type="checkbox" disabled ${item.checked ? "checked" : ""}>
                    <span class="checklist-text">${item.text}</span>
                  </div>
                `;
        });

        card.innerHTML = `
                <div class="task-header">
                  <h3 class="task-title">${task.title}</h3>
                  <span class="task-deadline">до ${formatDate(task.deadline)}</span>
                </div>
                <div class="task-meta">
                  <div class="meta-item">
                    <span class="meta-label">Практикант:</span> ${task.internName}
                  </div>
                  <div class="meta-item">
                    <span class="meta-label">Вклад:</span> ${task.contribution}
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

      // Добавляем обработчики для кнопок "Редактировать задачу"
      const editButtons = internTasksContent.querySelectorAll(".edit-task-btn");
      editButtons.forEach((btn) => {
        btn.addEventListener("click", function () {
          const taskId = parseInt(this.getAttribute("data-task-id"));
          const task = hostTasks.find((t) => t.id === taskId);
          if (task) {
            // Открываем модальное окно редактирования задачи
            const hostTaskModal = document.getElementById("hostTaskModal");

            // Заполняем поля формы данными задачи
            document.getElementById("hostTaskName").value = task.title;
            document.getElementById("hostTaskDescription").value =
              task.description;
            document.getElementById("hostTaskEffort").value = task.effort || "";
            document.getElementById("hostTaskDeadline").value = task.deadline;
            document.getElementById("hostTaskGoal").value =
              task.contribution || "";
            document.getElementById("hostTaskOperational").checked =
              task.operational || false;

            // Заполняем чек-лист
            const checklistContainer =
              document.getElementById("hostTaskChecklist");
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
        });
      });

      // Добавляем обработчики для кнопок "Завершить задачу"
      const completeButtons = internTasksContent.querySelectorAll(
        ".complete-task-btn:not([disabled])",
      );
      completeButtons.forEach((btn) => {
        btn.addEventListener("click", function () {
          const taskId = parseInt(this.getAttribute("data-task-id"));
          const task = hostTasks.find((t) => t.id === taskId);
          if (task) {
            // Открываем модальное окно завершения задачи
            const completeModal = document.getElementById("completeTaskModal");
            document.getElementById("completeTaskName").textContent =
              task.title;
            document.getElementById("completeWorkDescription").value = "";
            document.getElementById("completeRating").value = "";
            document.getElementById("completeReview").value = "";
            completeModal.dataset.taskId = taskId;
            completeModal.classList.add("active");
          }
        });
      });
    }
  } else if (currentRole === "employee" || currentRole === "supervisor") {
    // Для сотрудника/руководителя показываем созданные ими задачи
    const employeeTasks = tasks.filter((t) => t.authorId === currentEmployeeId);

    if (employeeTasks.length === 0) {
      myTasksScreen.innerHTML = `
            <div class="feed-placeholder">
              <h2>Нет задач</h2>
              <p>Вы ещё не создали ни одной задачи</p>
            </div>
          `;
      return;
    }

    employeeTasks.forEach((task) => {
      const card = renderEmployeeTaskCard(task);
      myTasksScreen.appendChild(card);
    });

    // Добавляем обработчики для кнопок "Посмотреть отклики"
    const respondButtons = myTasksScreen.querySelectorAll(".respond-btn");
    respondButtons.forEach((btn) => {
      btn.addEventListener("click", function () {
        const taskId = this.getAttribute("data-task-id");
        alert("Отклики на задачу #" + taskId);
      });
    });
  }
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
  card.className = "intern-card";
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
          <div class="intern-header">
            <img src="${intern.avatar}" class="intern-avatar" alt="${intern.name}">
            <div class="intern-info">
              <div class="intern-name">${intern.name}</div>
              <div class="intern-rating"><span>⭐</span>${intern.rating}</div>
            </div>
          </div>
          <div class="intern-blocks">
            <div class="intern-block"><span class="intern-block-label">Блок практики:</span>${intern.block}</div>
            <div class="intern-block"><span class="intern-block-label">Хочет помочь:</span>${helpBlocksHTML}</div>
          </div>
          <div class="intern-time">📅 ${timeSlot}</div>
          <button class="invite-btn" data-intern-id="${intern.id}">Пригласить</button>
        `;

  return card;
}

// Функция для рендеринга ленты поднятых рук (для сотрудника)
function renderRaisedHands() {
  feedScreen.innerHTML = "";
  raisedHands.forEach((intern) => {
    const card = renderInternCard(intern);
    feedScreen.appendChild(card);
  });

  // Добавляем обработчики для кнопок "Пригласить"
  const inviteButtons = feedScreen.querySelectorAll(".invite-btn");
  inviteButtons.forEach((btn) => {
    btn.addEventListener("click", function () {
      const internId = this.getAttribute("data-intern-id");
      const intern = raisedHands.find((i) => i.id === parseInt(internId));
      if (intern) {
        openInviteModal(intern);
      }
    });
  });
}

// Функция для открытия модалки приглашения
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
              <span class="meta-label">Вклад:</span> ${task.contribution}
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
                <span class="meta-label">Вклад:</span> ${task.contribution}
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

// Функция для рендеринга всех задач
function renderTasks() {
  feedScreen.innerHTML = "";

  if (currentRole === "employee" || currentRole === "host") {
    // Для сотрудника и хоста показываем ленту поднятых рук
    renderRaisedHands();
  } else {
    // Для практиканта показываем задачи
    tasks.forEach((task) => {
      const card = renderTaskCard(task);
      feedScreen.appendChild(card);
    });

    // Добавляем обработчики для кнопок отклика
    const respondButtons = document.querySelectorAll(".respond-btn");
    respondButtons.forEach((btn) => {
      btn.addEventListener("click", function () {
        const taskId = this.getAttribute("data-task-id");
        const buttonText = this.textContent.trim();

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
      });
    });
  }
}

// Обработчик для кнопки "Отмена" в модальном окне отклика
document.getElementById("respondCancel").addEventListener("click", function () {
  const respondModal = document.getElementById("respondModal");
  respondModal.classList.remove("active");
});

// Обработчик для кнопки "Отправить отклик" в модальном окне
document
  .getElementById("respondConfirm")
  .addEventListener("click", function () {
    const respondModal = document.getElementById("respondModal");
    const respondTimeInput = document.getElementById("respondTime");
    const taskId = respondModal.dataset.taskId;

    if (!respondTimeInput.value) {
      alert("Пожалуйста, укажите время прихода");
      return;
    }

    // Здесь можно добавить логику отправки отклика на сервер
    alert("Отклик отправлен");

    // Закрываем модальное окно
    respondModal.classList.remove("active");
  });

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
  const activeInvitationsSection = document.getElementById(
    "active-invitations-section",
  );

  if (currentRole === "intern") {
    // Показываем профиль практиканта
    internProfileContent.style.display = "block";
    employeeProfileContent.style.display = "none";
    activeInvitationsSection.style.display = "none";

    // Заполняем данные практиканта
    const internData = currentUser.intern;
    document.getElementById("currentUserName").textContent = internData.name;
    document.getElementById("currentUserBlock").textContent = internData.block;
    document.getElementById("currentUserRating").textContent =
      internData.rating.toFixed(1);

    // Заполняем интересы
    const interestsContainer = document.getElementById("currentUserInterests");
    interestsContainer.innerHTML = "";
    internData.interests.forEach((interest) => {
      const tag = document.createElement("span");
      tag.className = "interest-tag";
      tag.textContent = interest;
      interestsContainer.appendChild(tag);
    });

    // Заполняем расписание
    const scheduleContainer = document.getElementById("currentUserSchedule");
    scheduleContainer.innerHTML = "";
    const statusText = {
      morning: "до обеда",
      afternoon: "после обеда",
      out: "не в офисе",
    };
    internData.schedule.forEach((day) => {
      const row = document.createElement("tr");
      row.innerHTML = `
              <th>${day.day}</th>
              <td><span class="schedule-status ${day.status}">${statusText[day.status]}</span></td>
            `;
      scheduleContainer.appendChild(row);
    });

    // Скрываем форму редактирования при открытии профиля
    document.getElementById("currentUserEditForm").style.display = "none";
    document.getElementById("currentUserEditButtons").style.display = "block";
    document.getElementById("currentUserViewButtons").style.display = "none";
  } else if (
    currentRole === "employee" ||
    currentRole === "host" ||
    currentRole === "supervisor"
  ) {
    // Показываем профиль сотрудника/хоста/руководителя
    internProfileContent.style.display = "none";
    employeeProfileContent.style.display = "block";
    activeInvitationsSection.style.display = "block";

    // Заполняем данные сотрудника/хоста/руководителя
    const employeeData =
      currentRole === "employee"
        ? currentUser.employee
        : currentRole === "host"
          ? currentUser.employee
          : currentUser.supervisor;
    document.getElementById("employeeProfileName").textContent =
      employeeData.name;
    document.getElementById("employeeProfileBlock").textContent =
      employeeData.block;
    document.getElementById("employeeProfileAvatar").textContent = getInitials(
      employeeData.name,
    );

    // Скрываем форму редактирования при открытии профиля
    document.getElementById("employeeEditForm").style.display = "none";
    document.getElementById("employeeEditButtons").style.display = "block";
    document.getElementById("employeeViewButtons").style.display = "none";

    // Рендерим активные приглашения
    renderActiveInvitations();
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
    card.className = "host-task-card";
    card.innerHTML = `
            <div class="intern-header">
              <img src="${invitation.avatar}" class="intern-avatar" alt="${invitation.name}">
              <div class="intern-info">
                <div class="intern-name">${invitation.name}</div>
                <div class="intern-rating"><span>⭐</span>${invitation.rating}</div>
              </div>
            </div>
            <div class="intern-blocks">
              <div class="intern-block"><span class="intern-block-label">Задача:</span>${invitation.taskName || "Будет создана"}</div>
              <div class="intern-block"><span class="intern-block-label">Блок:</span>${invitation.block}</div>
            </div>
            <button class="notify-btn complete-work-btn" data-invitation-id="${invitation.id}">Завершить работу</button>
          `;
    activeInvitationsList.appendChild(card);
  });

  // Добавляем обработчики для кнопок "Завершить работу"
  const completeButtons =
    activeInvitationsList.querySelectorAll(".complete-work-btn");
  completeButtons.forEach((btn) => {
    btn.addEventListener("click", function () {
      const invitationId = this.getAttribute("data-invitation-id");
      const invitation = activeInvitations.find(
        (inv) => inv.id === parseInt(invitationId),
      );
      if (invitation) {
        openCompleteWorkModal(invitation);
      }
    });
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

// Обработчик переключения роли
roleSelector.addEventListener("change", function () {
  const selectedOption = this.options[this.selectedIndex];
  const roleName = selectedOption.text;
  currentRole = this.value;
  alert("Переключено на " + roleName);

  // Переключаем кнопки в зависимости от роли
  const raiseHandBtn = document.getElementById("raiseHandBtn");
  const createTaskBtn = document.getElementById("createTaskBtn");

  if (currentRole === "employee" || currentRole === "host") {
    raiseHandBtn.style.display = "none";
    createTaskBtn.style.display = "flex";
  } else {
    raiseHandBtn.style.display = "flex";
    createTaskBtn.style.display = "none";
  }

  // Перерисовываем ленту в зависимости от роли
  renderTasks();

  // Перерисовываем профиль
  renderProfile();
});

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

    item.addEventListener("click", function () {
      // Помечаем как прочитанное
      notification.unread = false;
      renderNotifications();
      alert(`Переход к уведомлению: ${notification.title}`);
    });

    notificationsList.appendChild(item);
  });
}

// Обработчик кнопки уведомлений
const notificationsDropdown = document.getElementById("notificationsDropdown");
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

// Обработчики модального окна "Поднять руку"
const raiseHandBtn = document.getElementById("raiseHandBtn");
const raiseHandModal = document.getElementById("raiseHandModal");
const raiseHandConfirm = document.getElementById("raiseHandConfirm");
const raiseHandCancel = document.getElementById("raiseHandCancel");
const raiseHandTime = document.getElementById("raiseHandTime");

// Открытие модального окна
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

// Закрытие модального окна по кнопке "Отмена"
raiseHandCancel.addEventListener("click", function () {
  raiseHandModal.classList.remove("active");
  // Очищаем поля
  raiseHandTime.value = "";
  document
    .querySelectorAll(".help-block-checkbox")
    .forEach((cb) => (cb.checked = false));
});

// Подтверждение поднятия руки
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

// Закрытие модального окна при клике на оверлей
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
inviteCancel.addEventListener("click", function () {
  inviteModal.classList.remove("active");
  // Очищаем поля
  inviteTask.value = "";
  inviteComment.value = "";
});

// Отправка приглашения
inviteConfirm.addEventListener("click", function () {
  const taskId = inviteTask.value;
  const comment = inviteComment.value;
  const internId = inviteModal.getAttribute("data-intern-id");
  // Ищем практиканта в both arrays (raisedHands or allUsers)
  const intern =
    raisedHands.find((i) => i.id === parseInt(internId)) ||
    allUsers.find((i) => i.id === parseInt(internId));

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
      avatar: intern.avatar,
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

// Закрытие модального окна при клике на оверлей
inviteModal.addEventListener("click", function (e) {
  if (e.target === inviteModal) {
    inviteModal.classList.remove("active");
    // Очищаем поля
    inviteTask.value = "";
    inviteComment.value = "";
  }
});

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
createTaskBtn.addEventListener("click", function () {
  createTaskModal.classList.add("active");
  // Устанавливаем дату по умолчанию (через неделю)
  const defaultDate = new Date();
  defaultDate.setDate(defaultDate.getDate() + 7);
  taskDeadline.value = defaultDate.toISOString().split("T")[0];
});

// Закрытие модального окна по кнопке "Отмена"
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

// Обработчик чекбокса "Операционная задача"
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

// Обработчик изменения трудозатрат для операционной задачи
taskEffort.addEventListener("input", function () {
  if (taskOperational.checked) {
    const effort = parseFloat(this.value) || 0;
    const contribution = Math.max(0.1, effort * 0.1);
    taskContribution.value = contribution.toFixed(1);
  }
});

// Подтверждение создания задачи
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

// Закрытие модального окна при клике на оверлей
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
            <img src="${user.avatar}" class="user-list-item-avatar" alt="${user.name}">
            <div class="user-list-item-info">
              <div class="user-list-item-name">${user.name}</div>
              <div class="user-list-item-block">${user.block}</div>
            </div>
            <div class="user-list-item-rating">⭐ ${user.rating}</div>
          `;
    userItem.addEventListener("click", function () {
      showInternProfile(user);
    });
    usersList.appendChild(userItem);
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
      supervisor: "Руководитель",
    };

    employeeItem.innerHTML = `
            <img src="${employee.avatar}" class="user-list-item-avatar" alt="${employee.name}">
            <div class="user-list-item-info">
              <div class="user-list-item-name">${employee.name}</div>
              <div class="user-list-item-block">${employee.block}</div>
            </div>
            <div class="user-list-item-rating" style="font-size: 12px; color: #666;">${roleLabels[employee.role]}</div>
          `;
    employeeItem.addEventListener("click", function () {
      showEmployeeProfile(employee);
    });
    employeesList.appendChild(employeeItem);
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
  employeePublicAvatar.src = employee.avatar;
  employeePublicName.textContent = employee.name;
  employeePublicBlock.textContent = employee.block;

  const roleLabels = {
    employee: "Сотрудник",
    host: "Хост",
    supervisor: "Руководитель",
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

  // Заполняем данные
  internProfileAvatar.src = user.avatar;
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
  if (currentRole === "employee" || currentRole === "host") {
    internProfileButtons.style.display = "block";
    // Скрываем кнопку "Поставить задачу" для обычного сотрудника
    const assignTaskBtn = document.getElementById("assignTaskFromProfileBtn");
    if (assignTaskBtn) {
      assignTaskBtn.style.display =
        currentRole === "host" ? "inline-block" : "none";
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
    switchScreen("users-screen");
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

// Обработчик кнопки "Сохранить настройки" в профиле сотрудника
document
  .getElementById("saveSettingsBtn")
  .addEventListener("click", function () {
    const notifNewTasks = document.getElementById("notifNewTasks").checked;
    const notifResponses = document.getElementById("notifResponses").checked;
    const notifMessages = document.getElementById("notifMessages").checked;
    const notifRating = document.getElementById("notifRating").checked;

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
      avatar: intern.avatar,
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

// Функция для рендеринга критических уведомлений
function renderCriticalNotifications(sortByDate = true) {
  const notificationsList = document.getElementById(
    "critical-notifications-list",
  );
  notificationsList.innerHTML = "";

  let notifications = [...criticalNotifications];

  if (sortByDate) {
    notifications.sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  notifications.forEach((notification) => {
    const card = document.createElement("div");
    card.className = `notification-card ${notification.critical ? "critical" : ""}`;

    const iconSvg = getNotificationIcon(notification.type);
    const date = new Date(notification.date);
    const formattedDate = date.toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });

    card.innerHTML = `
            <div class="notification-header">
              <svg class="notification-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                ${iconSvg}
              </svg>
              <span class="notification-title">${notification.title}</span>
              <span class="notification-date">${formattedDate}</span>
            </div>
            <p class="notification-text">${notification.text}</p>
            <div class="notification-action">
              <button class="notification-btn" data-notification-id="${notification.id}">Перейти</button>
            </div>
          `;
    notificationsList.appendChild(card);
  });

  // Добавляем обработчики для кнопок "Перейти"
  const actionButtons = notificationsList.querySelectorAll(".notification-btn");
  actionButtons.forEach((btn) => {
    btn.addEventListener("click", function () {
      const notificationId = this.getAttribute("data-notification-id");
      const notification = criticalNotifications.find(
        (n) => n.id === parseInt(notificationId),
      );
      if (notification) {
        alert(`Переход к: ${notification.title}`);
      }
    });
  });
}

// Функция для получения иконки уведомления по типу
function getNotificationIcon(type) {
  const icons = {
    "task-not-completed":
      '<circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line>',
    "inactive-intern":
      '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path>',
    "employee-violation":
      '<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line>',
    "low-response-rate":
      '<circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline>',
    "intern-refusing":
      '<circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line>',
    "host-overload":
      '<rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>',
    "goal-not-achieved":
      '<circle cx="12" cy="12" r="10"></circle><path d="M8 12h8"></path><path d="M12 8v8"></path>',
  };
  return icons[type] || icons["task-not-completed"];
}

// Обработчик кнопки сортировки уведомлений
let notificationsSortAscending = false;
document
  .getElementById("sortNotificationsBtn")
  .addEventListener("click", function () {
    notificationsSortAscending = !notificationsSortAscending;
    this.textContent = notificationsSortAscending
      ? "Сортировать по дате ↑"
      : "Сортировать по дате ↓";
    renderCriticalNotifications(notificationsSortAscending);
  });

// Обновлённый обработчик переключения роли для показа/скрытия меню Аналитика
roleSelector.addEventListener("change", function () {
  const selectedOption = this.options[this.selectedIndex];
  const roleName = selectedOption.text;
  currentRole = this.value;
  alert("Переключено на " + roleName);

  // Переключаем кнопки в зависимости от роли
  const raiseHandBtn = document.getElementById("raiseHandBtn");
  const createTaskBtn = document.getElementById("createTaskBtn");
  const supervisorMenuItems = document.querySelectorAll(".supervisor-only");
  const hostMenuItems = document.querySelectorAll(".host-only");

  if (currentRole === "employee") {
    raiseHandBtn.style.display = "none";
    createTaskBtn.style.display = "flex";
    supervisorMenuItems.forEach((item) => (item.style.display = "none"));
    hostMenuItems.forEach((item) => (item.style.display = "none"));
  } else if (currentRole === "host") {
    raiseHandBtn.style.display = "none";
    createTaskBtn.style.display = "flex";
    supervisorMenuItems.forEach((item) => (item.style.display = "none"));
    hostMenuItems.forEach((item) => (item.style.display = "flex"));
  } else if (currentRole === "supervisor") {
    raiseHandBtn.style.display = "none";
    createTaskBtn.style.display = "flex";
    supervisorMenuItems.forEach((item) => (item.style.display = "flex"));
    hostMenuItems.forEach((item) => (item.style.display = "none"));
  } else {
    raiseHandBtn.style.display = "flex";
    createTaskBtn.style.display = "none";
    supervisorMenuItems.forEach((item) => (item.style.display = "none"));
    hostMenuItems.forEach((item) => (item.style.display = "none"));
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

  // Перерисовываем ленту в зависимости от роли
  renderTasks();

  // Перерисовываем "Мои задачи" в зависимости от роли
  renderHostTasks();

  // Перерисовываем профиль
  renderProfile();

  // Если руководитель, рендерим критические уведомления
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

    // Сбрасываем чек-лист до одного пустого поля
    const checklistContainer = document.getElementById("hostTaskChecklist");
    checklistContainer.innerHTML = `
          <div class="checklist-row">
            <input
              type="text"
              class="modal-input checklist-input"
              placeholder="Элемент чек-листа" />
            <button type="button" class="remove-checklist-btn" style="display: none;">×</button>
          </div>
        `;

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
    const newRow = document.createElement("div");
    newRow.className = "checklist-row";
    newRow.innerHTML = `
          <input
            type="text"
            class="modal-input checklist-input"
            placeholder="Элемент чек-листа" />
          <button type="button" class="remove-checklist-btn">×</button>
        `;
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
    const hostTaskModal = document.getElementById("hostTaskModal");
    const internName = hostTaskModal.dataset.internName;
    const isEditMode = hostTaskModal.dataset.editMode === "true";

    // Получаем данные формы
    const name = document.getElementById("hostTaskName").value.trim();
    const description = document
      .getElementById("hostTaskDescription")
      .value.trim();
    const effort = document.getElementById("hostTaskEffort").value.trim();
    const deadline = document.getElementById("hostTaskDeadline").value;
    const goal = document.getElementById("hostTaskGoal").value;
    const operational = document.getElementById("hostTaskOperational").checked;

    // Валидация
    if (!name || !description || !effort || !deadline) {
      alert("Пожалуйста, заполните все обязательные поля");
      return;
    }

    // Собираем чек-лист
    const checklistInputs = document.querySelectorAll(".checklist-input");
    const checklist = [];
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

    if (isEditMode) {
      // Режим редактирования - обновляем существующую задачу
      const taskId = parseInt(hostTaskModal.dataset.taskId);
      const task = hostTasks.find((t) => t.id === taskId);
      if (task) {
        task.title = name;
        task.description = description;
        task.effort = effort;
        task.deadline = deadline;
        task.contribution = goal || "Общее";
        task.operational = operational;
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
        contribution: goal || "Общее",
        operational: operational,
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

// Обработчик поиска пользователей
const usersSearch = document.getElementById("usersSearch");
if (usersSearch) {
  usersSearch.addEventListener("input", function () {
    const filterText = this.value;
    const activeTab = document.querySelector("#usersTabs .host-tab.active");
    if (activeTab) {
      const tabId = activeTab.getAttribute("data-tab");
      if (tabId === "interns") {
        renderUsersList(filterText);
      } else if (tabId === "employees") {
        renderEmployeesList(filterText);
      }
    }
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

// Обработчик кнопки "Редактировать" для текущего профиля практиканта
document
  .getElementById("editCurrentUserBtn")
  .addEventListener("click", function () {
    const internData = currentUser.intern;

    // Заполняем форму редактирования
    document.getElementById("editCurrentUserName").value = internData.name;
    document.getElementById("editCurrentUserBlock").value = internData.block;
    document.getElementById("editCurrentUserInterests").value =
      internData.interests.join(", ");

    // Заполняем расписание
    const scheduleMap = {
      Пн: "editCurrentScheduleMon",
      Вт: "editCurrentScheduleTue",
      Ср: "editCurrentScheduleWed",
      Чт: "editCurrentScheduleThu",
      Пт: "editCurrentScheduleFri",
    };
    internData.schedule.forEach((day) => {
      const selectId = scheduleMap[day.day];
      if (selectId) {
        document.getElementById(selectId).value = day.status;
      }
    });

    // Показываем форму, скрываем кнопки
    document.getElementById("currentUserEditForm").style.display = "block";
    document.getElementById("currentUserEditButtons").style.display = "none";
    document.getElementById("currentUserViewButtons").style.display = "none";
  });

// Обработчик кнопки "Отмена" редактирования текущего профиля
document
  .getElementById("cancelCurrentUserEditBtn")
  .addEventListener("click", function () {
    document.getElementById("currentUserEditForm").style.display = "none";
    document.getElementById("currentUserEditButtons").style.display = "block";
    document.getElementById("currentUserViewButtons").style.display = "block";
  });

// Обработчик кнопки "Сохранить" редактирования текущего профиля
document
  .getElementById("saveCurrentUserEditBtn")
  .addEventListener("click", function () {
    const internData = currentUser.intern;

    // Обновляем данные
    internData.name = document.getElementById("editCurrentUserName").value;
    internData.block = document.getElementById("editCurrentUserBlock").value;

    // Парсим интересы
    const interestsText = document.getElementById(
      "editCurrentUserInterests",
    ).value;
    internData.interests = interestsText
      .split(",")
      .map((i) => i.trim())
      .filter((i) => i);

    // Обновляем расписание
    const scheduleMap = {
      Пн: "editCurrentScheduleMon",
      Вт: "editCurrentScheduleTue",
      Ср: "editCurrentScheduleWed",
      Чт: "editCurrentScheduleThu",
      Пт: "editCurrentScheduleFri",
    };
    internData.schedule = [
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
    renderProfile();

    // Скрываем форму, показываем кнопки
    document.getElementById("currentUserEditForm").style.display = "none";
    document.getElementById("currentUserEditButtons").style.display = "block";
    document.getElementById("currentUserViewButtons").style.display = "block";

    alert("Профиль обновлён");
  });

// Обработчик кнопки "Редактировать" для профиля сотрудника
document
  .getElementById("editEmployeeBtn")
  .addEventListener("click", function () {
    const employeeData =
      currentRole === "employee"
        ? currentUser.employee
        : currentRole === "host"
          ? currentUser.employee
          : currentUser.supervisor;

    // Заполняем форму редактирования
    document.getElementById("editEmployeeName").value = employeeData.name;
    document.getElementById("editEmployeeBlock").value = employeeData.block;

    // Заполняем настройки уведомлений
    document.getElementById("editNotifNewTasks").checked =
      document.getElementById("notifNewTasks").checked;
    document.getElementById("editNotifResponses").checked =
      document.getElementById("notifResponses").checked;
    document.getElementById("editNotifMessages").checked =
      document.getElementById("notifMessages").checked;
    document.getElementById("editNotifRating").checked =
      document.getElementById("notifRating").checked;

    // Показываем форму, скрываем кнопки
    document.getElementById("employeeEditForm").style.display = "block";
    document.getElementById("employeeEditButtons").style.display = "none";
    document.getElementById("employeeViewButtons").style.display = "none";
  });

// Обработчик кнопки "Отмена" редактирования профиля сотрудника
document
  .getElementById("cancelEmployeeEditBtn")
  .addEventListener("click", function () {
    document.getElementById("employeeEditForm").style.display = "none";
    document.getElementById("employeeEditButtons").style.display = "block";
    document.getElementById("employeeViewButtons").style.display = "none";
  });

// Обработчик кнопки "Сохранить" редактирования профиля сотрудника
document
  .getElementById("saveEmployeeEditBtn")
  .addEventListener("click", function () {
    const employeeData =
      currentRole === "employee"
        ? currentUser.employee
        : currentRole === "host"
          ? currentUser.employee
          : currentUser.supervisor;

    // Обновляем данные
    employeeData.name = document.getElementById("editEmployeeName").value;
    employeeData.block = document.getElementById("editEmployeeBlock").value;

    // Обновляем настройки уведомлений
    document.getElementById("notifNewTasks").checked =
      document.getElementById("editNotifNewTasks").checked;
    document.getElementById("notifResponses").checked =
      document.getElementById("editNotifResponses").checked;
    document.getElementById("notifMessages").checked =
      document.getElementById("editNotifMessages").checked;
    document.getElementById("notifRating").checked =
      document.getElementById("editNotifRating").checked;

    // Обновляем отображение
    renderProfile();

    // Скрываем форму, показываем кнопки
    document.getElementById("employeeEditForm").style.display = "none";
    document.getElementById("employeeEditButtons").style.display = "block";
    document.getElementById("employeeViewButtons").style.display = "none";

    alert("Профиль обновлён");
  });

// Инициализация - рендерим задачи при загрузке
renderTasks();
renderHostTasks();
renderUsersList();
renderEmployeesList();
renderProfile();

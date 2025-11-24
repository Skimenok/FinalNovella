// main.js — полностью переписанная версия с точным соответствием сюжету

let currentScene = "scene1";

const textEl = document.getElementById("text");
const choicesEl = document.getElementById("choices");
const bg = document.getElementById("bg");
const charImg = document.getElementById("charImg");
const typeSound = document.getElementById("typeSound");
const clickSound = document.getElementById("clickSound");

// стартовый экран / кнопка
const startScreen = document.getElementById("startScreen");
const startBtn = document.getElementById("startBtn");

// параметры
const TYPING_SPEED = 40; // ms, +20% быстрее (от 50 -> 40)
let skipRequested = false;
let skipBtn = null;
let audioAllowed = false;
let time = 0;

// Отслеживание времени игры
let startTime = Date.now();

let GAME_STATE = {
  hearts: 4,
};

// Сцены
const scenes = {
  scene1: {
    bg: "backgrounds/1.1.jpg",
    char: "",
    text: "Так, ладно. Еще один фикс для футера, и можно спать... Хотя кого я обманываю? Заказчик пришлет правки в 8 утра.\n\nЗвук глотка кофе.\n\nХолодный. Вкус жженой резины и безысходности. Идеально.\n\nЗвук нажатия клавиш. Сережа открывает панель разработчика (F12).\n\nДа где же эта ошибка?.. Так, body, div, main-container... Стоп. Это еще что?\n\nНа экране: Среди красных ошибок и желтых предупреждений начинает пульсировать фиолетовая строка. Текст переливается, будто он живой.\n\nSYSTEM_STATUS: CRITICAL.\nSOUL_CAPACITY: 1%.\nINITIATE_REBOOT? [Y/N]\n\nЕмкость души: 1%? Очень смешно, Макс. Опять свои скрипты мне в проект подсунул?",
    choices: [
      {
        text: "Попробовать закрыть консоль и игнорировать.",
        next: "skepticism",
      },
      { text: "Хуже уже не будет. Ввести Y.", next: "reboot" },
      {
        text: "Попытаться найти исходный код этого сообщения.",
        next: "analysis",
      },
    ],
  },
  skepticism: {
    bg: "backgrounds/1.1.jpg",
    char: "",
    text: "У меня нет времени на пасхалки. Дедлайн горит.\n\n(Нажимает крестик. Окно не закрывается. Сообщение мигает ярче и начинает издавать низкочастотный гул).\n\nДа вы издеваетесь... Ладно. Хочешь ребут? Получай.",
    choices: [{ text: "Ввести Y", next: "reboot" }],
  },
  analysis: {
    bg: "backgrounds/1.1.jpg",
    char: "",
    text: "Интересно. Какой библиотеки это метод? React? Vue? Или что-то самописное?\n\n(Пытается кликнуть на источник файла. Ссылка ведет в null)\n\nНикакого источника. Прямо в памяти процесса. Ладно, любопытство победило.",
    choices: [{ text: "Ввести Y", next: "reboot" }],
  },
  reboot: {
    bg: "backgrounds/1.1.jpg",
    char: "",
    text: "(Сережа) (печатает):\n«Y».\n«Enter».",
    choices: [{ text: "Продолжить", next: "immersion" }],
  },
  immersion: {
    bg: "backgrounds/1.2.jpg",
    char: "",
    text: 'Офис искажается. Цвета инвертируются. Монитор "стекает" на стол.\n\nЗвук: Глитч-эффекты, нарастающий цифровой шум, звук битого стекла.\n\nЧто за... Видеокарта сгорела? Черт, только не сейчас, у меня нет денег на нов...\n\nЭкран вспыхивает ослепительным светом. Руки Сережи начинают распадаться на пиксели.\n\nЯ... Я не чувствую рук! Какого хрена?!\n\nТекст на экране (мысли):\nМЕНЯ. ТЯНЕТ. ВНУТРЬ.\n\nЧерный экран. Тишина.\n\n...\n\nАбстрактное пространство. Темно-фиолетовое небо с бегущими строками двоичного кода. Под ногами — парящая платформа из полупрозрачного стекла. Вокруг летают гигантские скобки { } и обрывки тегов <div>.\n\n(Сережа) (медленно встает, держась за голову):\nГолова раскалывается... Это сон? Я заснул на клаве?\n\n(Смотрит вниз)\nЯ стою на платформе... висящей в нигде. А вон то облако похоже на кусок CSS-стиля overflow: hidden. Отличный приход, Сережа. Пора завязывать с кофе.',
    choices: [
      { text: "Закричать и позвать на помощь.", next: "shout" },
      { text: "Подойти к краю платформы.", next: "edge" },
    ],
  },
  shout: {
    bg: "backgrounds/1.2.jpg",
    char: "",
    text: "ЭЙ! КТО-НИБУДЬ! МАКС! НАЧАЛЬНИК! Я УВОЛЬНЯЮСЬ!",
    choices: [{ text: "Продолжить", next: "meeting" }],
  },
  edge: {
    bg: "backgrounds/1.2.jpg",
    char: "",
    text: "Высота... бесконечная. Внизу только темнота и... удаленные файлы?",
    choices: [{ text: "Продолжить", next: "meeting" }],
  },
  meeting: {
    bg: "backgrounds/1.2.jpg",
    char: "img/gpt.svg",
    text: 'Воздух перед Сережей начинает мерцать. Полигоны собираются в нестабильную, постоянно меняющуюся форму (шар, куб, пирамида).\n\n(???):\nИнициализация завершена. Объект: Сергей. Статус: Частично поврежден.\n\n(Сережа):\nТы кто такой? Глюк? Вирус?\n\n(ЭХО):\nЯ — ЭХО. Системный администратор этого сектора. Приветствую, Сергей.\n\n(Форма ЭХО меняет цвет с синего на тревожный оранжевый)\n\n(ЭХО):\nТы активировал протокол восстановления. Твоя операционная система... то, что вы называете "жизнь"... перегружена мусорными файлами. Депрессия. Рутина. Нереализованные амбиции. Кэш переполнен.\n\n(Сережа):\nСлушай, геометрическая фигура, верни меня в офис. У меня дедлайн через 4 часа. Заказчик меня убьет.\n\n(ЭХО):\nВ текущем состоянии твое возвращение приведет к фатальной ошибке. Ты здесь не случайно.\n\n(Вокруг платформы всплывают экраны с воспоминаниями Сережи: бесконечные правки, одинокие вечера, пустой холодильник).\n\n(ЭХО):\nПосмотри. Твой код неоптимизирован. Чтобы выйти, ты должен провести рефакторинг. Очистить систему от багов.\n\n(Сережа):\nТы хочешь сказать, что я застрял внутри... собственной выгоревшей психики, которая выглядит как сломанный веб-сайт?\n\n(ЭХО):\nГрубая аналогия, но корректная. return true.',
    choices: [
      {
        text: "Я не буду играть в твои игры. Где кнопка выхода?",
        next: "aggression",
      },
      {
        text: "Отлично. Сначала правки от заказчика, теперь правки от собственной души. ТЗ есть?",
        next: "irony",
      },
      { text: "А если я не справлюсь? Что будет?", next: "fear" },
    ],
  },
  aggression: {
    bg: "backgrounds/1.2.jpg",
    char: "img/gpt.svg",
    text: "(ЭХО):\nКнопка выхода заблокирована процессом ECHO.exe. Принудительное завершение невозможно\n\n(Сережа):\nЧертовщина...",
    choices: [{ text: "Продолжить", next: "final" }],
  },
  irony: {
    bg: "backgrounds/1.2.jpg",
    char: "img/gpt.svg",
    text: "(ЭХО):\n(Меняет форму на смайлик из символов ASCII) :)\nТЗ формируется динамически. Твоя задача — выжить и писать код.",
    choices: [{ text: "Продолжить", next: "final" }],
  },
  fear: {
    bg: "backgrounds/1.2.jpg",
    char: "img/gpt.svg",
    text: "(ЭХО):\nТогда ты,... а в прочем не важно. Лучше тебе этого не знать.",
    choices: [{ text: "Продолжить", next: "final" }],
  },
  final: {
    bg: "backgrounds/1.2.jpg",
    char: "img/gpt.svg",
    text: "(ЭХО):\nВнимание. Обнаружен первый вирусный кластер. Приготовься, Сергей. Компиляция начинается.\n\nПлатформа под ногами начинает дрожать. Сережа перемещается в незнакомое место.\n\n(Сережа):\n«...».\n\nКОНЕЦ АКТА 1",
    choices: [{ text: "Начать Акт 2", next: "act2_level1_start" }],
  },
  // Акт 2: Уровень 1 - Бесконечный цикл
  act2_level1_start: {
    bg: "backgrounds/2.1.jpg",
    char: "img/gpt.svg",
    text: "Акт 2: Оптимизация Души\n\nУровень 1: Бесконечный цикл\n\nЭХО:\nСмотри. Это твой обычный вторник. Ты берешь задачу, решаешь ее, берешь следующую. Смысла нет. Есть только процесс.\n\n(Сережа):\nНо я делаю важные вещи! Я разрабатываю софт для банков!\n\nЭХО:\nДокажи свою эффективность. Вставай за пульт.",
    choices: [{ text: "Начать мини-игру", next: "level1_assemble" }],
  },
  level1_assemble: {
    bg: "backgrounds/2.1.jpg",
    char: "img/gpt.svg",
    text: "Собери фрагменты кода, чтобы обработать задачи на конвейере.",
    minigame: {
      type: "assemble",
      data: [
        {
          title: "Собери console.log('Привет');",
          blocks: [
            { id: "1", text: "console." },
            { id: "2", text: "log(" },
            { id: "3", text: "'Привет'" },
            { id: "4", text: ");" },
          ],
          target: ["1", "2", "3", "4"],
        },
        {
          title: "Собери document.createElement('div')",
          blocks: [
            { id: "1", text: "document." },
            { id: "2", text: "createElement(" },
            { id: "3", text: "'div'" },
            { id: "4", text: ")" },
          ],
          target: ["1", "2", "3", "4"],
        },
        {
          title: "Собери button.addEventListener('click', handler)",
          blocks: [
            { id: "1", text: "button." },
            { id: "2", text: "addEventListener(" },
            { id: "3", text: "'click'," },
            { id: "4", text: "handler" },
            { id: "5", text: ")" },
          ],
          target: ["1", "2", "3", "4", "5"],
        },
        {
          title: "Собери const x = input.value;",
          blocks: [
            { id: "1", text: "const x = " },
            { id: "2", text: "input." },
            { id: "3", text: "value;" },
          ],
          target: ["1", "2", "3"],
        },
        {
          title: "Собери element.textContent = 'Готово';",
          blocks: [
            { id: "1", text: "element." },
            { id: "2", text: "textContent = " },
            { id: "3", text: "'Готово';" },
          ],
          target: ["1", "2", "3"],
        },
      ],
      next: "level1_response",
    },
    choices: [],
  },
  level1_response: {
    bg: "backgrounds/2.1.jpg",
    char: "img/gpt.svg",
    text: "ЭХО:\nБыстрее. Заказчик ждет. Дедлайн через 5 секунд. Ты пропускаешь блоки. Ты плохой сотрудник?",
    choices: [
      { text: "Заткнись! Я стараюсь!", next: "level1_response1" },
      { text: "Да пошло оно всё!", next: "level1_break" },
      {
        text: "Почему их так много?! Откуда они берутся?!",
        next: "level1_response3",
      },
    ],
  },
  level1_response1: {
    bg: "backgrounds/2.1.jpg",
    char: "img/gpt.svg",
    text: "Замедление. Минус здоровье.",
    choices: [{ text: "Продолжить", next: "level1_clicker" }],
    onEnter: () => GAME_STATE.hearts--,
  },
  level1_response3: {
    bg: "backgrounds/2.1.jpg",
    char: "img/gpt.svg",
    text: "ЭХО:\nИз твоей неспособности сказать 'Нет'",
    choices: [{ text: "Продолжить", next: "level1_clicker" }],
  },
  level1_break: {
    bg: "backgrounds/2.1.jpg",
    char: "img/gpt.svg",
    text: "Прерывание конвейера.",
    choices: [{ text: "Продолжить", next: "level1_hack" }],
  },
  level1_clicker: {
    bg: "backgrounds/2.1.jpg",
    char: "img/gpt.svg",
    text: "Нажимай, чтобы обработать задачи.",
    minigame: {
      type: "clicker",
      data: 30,
      next: "level1_hack",
    },
    choices: [],
  },
  level1_hack: {
    bg: "backgrounds/2.1.jpg",
    char: "img/gpt.svg",
    text: "(Момент взлома. Сережа открывает консоль.)\n\nЭХО:\nВнимание! Попытка несанкционированного доступа. Что ты делаешь?",
    choices: [
      {
        text: "Сейчас я сломаю этот чертов конвейер. Я не робот!",
        next: "level1_hack_response",
      },
    ],
  },
  level1_hack_response: {
    bg: "backgrounds/2.1.jpg",
    char: "img/gpt.svg",
    text: "ЭХО:\nВыход из цикла не предусмотрен контрактом. Но... твой уровень кортизола критический. Ладно. Пиши свой код.",
    choices: [{ text: "Продолжить", next: "level1_custom_code" }],
  },
  level1_custom_code: {
    bg: "backgrounds/2.1.jpg",
    char: "img/gpt.svg",
    text: "Напиши свой код, чтобы сломать конвейер.",
    minigame: {
      type: "riddle",
      data: [
        {
          q: "Как остановить бесконечный цикл в JavaScript?",
          a: ["break", "return", "throw", "process.exit()"],
          hint: "Ключевое слово для прерывания цикла.",
        },
      ],
      next: "level1_end",
    },
    choices: [],
  },
  level1_end: {
    bg: "backgrounds/2.1.jpg",
    char: "img/gpt.svg",
    text: "(Сережа):\nТишина... Наконец-то.\n\nЭХО:\nТы остановил производство. Ты чувствуешь вину?",
    choices: [
      { text: "Да. Я подвел коллег.", next: "level1_guilt" },
      { text: "Нет. Я чувствую облегчение.", next: "level1_relief" },
    ],
  },
  level1_guilt: {
    bg: "backgrounds/2.1.jpg",
    char: "img/gpt.svg",
    text: "ЭХО:\nТипичная ошибка выжившего. Идем дальше.",
    choices: [{ text: "Продолжить", next: "act2_level2_start" }],
    onEnter: () => GAME_STATE.hearts--,
  },
  level1_relief: {
    bg: "backgrounds/2.1.jpg",
    char: "img/gpt.svg",
    text: "ЭХО:\nТак и запишем: 'Свобода важнее долга'.",
    choices: [{ text: "Продолжить", next: "act2_level2_start" }],
  },
  // Акт 2: Уровень 2 - Архив памяти
  act2_level2_start: {
    bg: "backgrounds/2.2.jpg",
    char: "img/gpt.svg",
    text: "Уровень 2: Архив памяти\n\nСережа стоит перед старой гитарой.\n\nЭХО:\nОбъект #4042: Гитара. Последнее использование: 6 лет назад. Вердикт: Удалить.\n\n(Сережа):\nПодожди. Я хотел стать музыкантом. Я писал песни.\n\nЭХО:\nТы пишешь API для микрокредитов. Она конфликтует с текущей версией реальности.",
    choices: [
      {
        text: "Ты прав. Детство кончилось. Нужно освободить место.",
        next: "level2_guitar_delete",
      },
      {
        text: "Это не баг, это фича! Это делает меня живым!",
        next: "level2_guitar_feature",
      },
      {
        text: "Может, заархивируем? Вдруг я вернусь к ней?",
        next: "level2_guitar_archive",
      },
    ],
  },
  level2_guitar_delete: {
    bg: "backgrounds/2.2.jpg",
    char: "img/gpt.svg",
    text: "Сережа чувствует укол в сердце.\n\nЭХО:\nОперация успешна. Боль удалена.",
    choices: [{ text: "Продолжить", next: "level2_maria_start" }],
    onEnter: () => GAME_STATE.hearts--,
  },
  level2_guitar_feature: {
    bg: "backgrounds/2.2.jpg",
    char: "img/gpt.svg",
    text: "ЭХО:\nТак не пойдет.",
    choices: [{ text: "Продолжить", next: "level2_guitar_archive" }],
  },
  level2_guitar_archive: {
    bg: "backgrounds/2.2.jpg",
    char: "img/gpt.svg",
    text: "ЭХО:\nАрхивация... Файл сжат. Доступ только на чтение.",
    choices: [{ text: "Продолжить", next: "level2_maria_start" }],
  },
  level2_maria_start: {
    bg: "backgrounds/2.2.jpg",
    char: "img/gpt.svg",
    text: "ЭХО:\nОбъект #9999: Мария. Источник критических ошибок. Причина бессонницы. Ты перечитываешь старые чаты каждую пятницу. Это перегружает оперативку.\n\n(Сережа):\nЯ обещал ей поехать на море. А сам взял проект на выходные.\n\nЭХО:\nВыбери команду для этого файла.",
    choices: [
      {
        text: "Я хочу забыть ее голос. Так будет проще.",
        next: "level2_maria_erase",
      },
      {
        text: "Это я виноват. Я должен страдать.",
        next: "level2_maria_suffer",
      },
      {
        text: "Я облажался. Это больно. Но это опыт. Я не удалю это, но я закрою этот гештальт.",
        next: "level2_maria_experience",
      },
    ],
  },
  level2_maria_erase: {
    bg: "backgrounds/2.2.jpg",
    char: "img/gpt.svg",
    text: "ЭХО:\nСтирание личности запущено. Ты становишься эффективнее.",
    choices: [{ text: "Продолжить задачку 1", next: "level2_task1" }],
  },
  level2_maria_suffer: {
    bg: "backgrounds/2.2.jpg",
    char: "img/gpt.svg",
    text: "ЭХО:\nОшибка. Самоуничижение не решает проблему. Ты создаешь бесконечный цикл вины.",
    choices: [
      { text: "Удалить", next: "level2_maria_erase" },
      { text: "Закрыть гештальт", next: "level2_maria_experience" },
    ],
  },
  level2_maria_experience: {
    bg: "backgrounds/2.2.jpg",
    char: "img/gpt.svg",
    text: 'ЭХО:\nХм. Преобразование "боли" в "опыт". Интересный алгоритм. Одобряю.',
    choices: [{ text: "Продолжить", next: "level2_task2" }],
  },
  level2_task1: {
    bg: "backgrounds/2.2.jpg",
    char: "img/gpt.svg",
    text: "Задачка 1: Реши загадки для стирания.",
    minigame: {
      type: "riddle",
      data: [
        {
          q: "Как удалить переменную в JavaScript?",
          a: ["delete", "null", "undefined"],
          hint: "Ключевое слово для удаления свойства.",
        },
        {
          q: "Как очистить консоль?",
          a: ["console.clear", "clear"],
          hint: "Метод консоли.",
        },
      ],
      next: "act2_level3_start",
    },
    choices: [],
    onEnter: () => GAME_STATE.hearts--,
  },
  level2_task2: {
    bg: "backgrounds/2.2.jpg",
    char: "img/gpt.svg",
    text: "Задачка 2: Реши загадки для преобразования.",
    minigame: {
      type: "riddle",
      data: [
        {
          q: "Как преобразовать строку в число?",
          a: ["parseInt", "Number", "parseFloat", "number", "+"],
          hint: "Функции для парсинга.",
        },
        {
          q: "Как объединить массивы?",
          a: ["concat", "spread operator"],
          hint: "Метод массива.",
        },
      ],
      next: "act2_level3_start",
    },
    choices: [],
  },
  // Акт 2: Уровень 3 - Зеркальная комната
  act2_level3_start: {
    bg: "backgrounds/2.3.jpg",
    char: "img/gpt.svg",
    text:
      "Уровень 3: Зеркальная комната\n\nНа Сережу бегут его копии-монстры (манекены из шкафов)\n\nМонстр-1:\nПосмотри на своих бывших однокурсников! Они уже работают в Гугле! А ты кто?\n\n(Сережа) (получая урон):\nАгх! Прекрати!\n\nЭХО:\nЗащищайся! Используй Дебаггер!\n\n(Сережа стреляет, монстр распадается, но у Сережи темнеет в глазах)\n\nЭХО:\nВнимание! Уровень жизни: " +
      GAME_STATE.hearts +
      "%. Ты убиваешь свои амбиции!\n\n(Сережа):\nНо они нападают! Что мне делать?! \n\nМонстр-2:\nТы никому не нужен. Ты умрешь один, и тебя заменят на следующий день.",
    choices: [
      {
        text: "Стрелять дальше. Я уничтожу этот голос в голове!",
        next: "level3_shoot_continue",
      },
      {
        text: "Опустить дебагер. ЭХО, как мне найти исходный код этого бага?",
        next: "level3_drop_weapon",
      },
    ],
  },
  level3_shoot_continue: {
    bg: "backgrounds/2.3.jpg",
    char: "img/gpt.svg",
    text: "Отнимает сердце. Конец мини-игры.",
    choices: [{ text: "Продолжить", next: "act2_final" }],
    onEnter: () => GAME_STATE.hearts--,
  },
  level3_drop_weapon: {
    bg: "backgrounds/2.3.jpg",
    char: "img/gpt.svg",
    text: "ЭХО:\nИсточник ошибки не в них. Источник в центре комнаты.\n\nТам сидит маленький мальчик (он сам в детстве) и играет в тетрис.\n\n(Сережа подходит к ребенку.)\n\nРебенок:\nЯ просто хотел делать игры..., чтобы люди становилсь хоть немного счасливеее..., а сейчас...",
    choices: [{ text: "Продолжить", next: "act2_final" }],
  },
  // Финал Акта 2
  act2_final: {
    bg: "backgrounds/3.1.jpg",
    char: "img/self.svg",
    text: "Финал Акта 2: Разговор с Собой\n\n(Белая комната. ЭХО трансформируется в спокойную версию Сережи.)\n\n(Сережа):\nТы — это я. Я догадался еще на конвейере.\n\nЭХО-Сережа:\nЯ — твой инстинкт самосохранения. Твоя подсистема безопасности.\nТы помнишь момент перед тем, как попал сюда?",
    choices: [
      { text: "Я пил кофе... третий за час.", next: "act2_final_reveal" },
      { text: "У меня заболело в груди.", next: "act2_final_reveal" },
      { text: "Экран поплыл.", next: "act2_final_reveal" },
    ],
  },
  act2_final_reveal: {
    bg: "backgrounds/3.1.jpg",
    char: "img/self.svg",
    text: 'ЭХО-Сережа:\nСердце пропустило удар. Твой организм нажал на "Стоп-кран". Если бы я не запустил эту симуляцию, ты бы умер там, в офисе, в 2:15 ночи.\n\n(Сережа):\nТак я в реанимации?\n\nЭХО-Сережа:\nПока нет. Ты просто в отключке.',
    choices: [{ text: "Продолжить в Акт 3", next: "act3_start" }],
    onEnter: () => GAME_STATE.hearts--, // Обязательная потеря 1 сердца
  },
  // Акт 3
  act3_start: {
    bg: "backgrounds/3.1.jpg",
    char: "",
    text: "Акт 3 - Завершение",
    choices: [{ text: "Продолжить", next: "determine_ending" }],
  },
  determine_ending: {
    bg: "backgrounds/3.2.jpg",
    char: "",
    text: "Определение концовки...",
    choices: [],
    onEnter: function () {
      let remaining = GAME_STATE.hearts;
      let nextScene;
      if (remaining >= 3) {
        nextScene = "ending_true";
      } else if (remaining >= 1) {
        nextScene = "ending_middle";
      } else {
        nextScene = "ending_bad";
      }
      setTimeout(() => showScene(nextScene), 1000);
    },
  },
  ending_bad: {
    bg: "backgrounds/3.2.jpg",
    char: "",
    text: "Концовка 1: Плохая\n\nОн просыпается в офисе. Солнце встает. Он чувствует прилив сил. Он садится, выполняет поставленную задачу, пишет идеальный код. Его лицо ничего не выражает. Камера отъезжает, и мы видим, что в его глазах бегут строки кода. Он стал идеальным сотрудником, полностью утратив человечность и мечты.\n\nСережа:\nЧтож, время 4:30... Пора за работу\nА вот и моё ТЗ\n...",
    choices: [{ text: "Завершить игру", next: "game_end" }],
  },
  ending_middle: {
    bg: "backgrounds/3.2.jpg",
    char: "",
    text: "Концовка 2: Нейтральная\n\nОн просыпается. Выключает компьютер, не доделав задачу. Выходит на улицу, вдыхает воздух. Звонит другу, с которым не общался год:\n???:\nАло...\nСережа:\nМиш, привет, как насчет, сходить в бар?\nОн остается на той же работе, но перестает перерабатывать. Жизнь налаживается, хоть и остается обычной.\nМиша:\nА уж думал ты совсем погряз в работе и не предложишь. Пойдем конечно!",
    choices: [{ text: "Завершить игру", next: "game_end" }],
  },
  ending_true: {
    bg: "backgrounds/3.2.jpg",
    char: "",
    text: "Концовка 3: Истинная\n\nСережа смотрит на консоль и рушит полностью ИИ\n\nВиртуальный мир рушится. Сережа просыпается в офисе. Он смотрит на монитор, берет телефон и набирает номер директора.\nМатвей Ильич, я увольняюсь!\nОн берет свой рюкзак и выходит из здания.\nСережа достает телефон и покупает билет в одну сторону туда, куда всегда хотел.",
    choices: [{ text: "Завершить игру", next: "game_end" }],
  },
  game_end: {
    bg: "backgrounds/3.3.jpg",
    char: "",
    text: `Ты провел в этой игре всего пару минут. Это 0.001% твоей жизни. А что делать дальше решай сам. Удачи!`,
    choices: [],
  },
};

// --- UI: SKIP button (создаём один раз) ---
function ensureSkipButton() {
  if (skipBtn) return;
  skipBtn = document.createElement("button");
  skipBtn.id = "skipBtn";
  skipBtn.className = "choice-btn";
  skipBtn.textContent = "Скип";
  Object.assign(skipBtn.style, {
    position: "absolute",
    right: "18px",
    bottom: "18px",
    display: "none",
    zIndex: 9998,
  });
  skipBtn.onclick = () => {
    skipRequested = true;
  };
  document.body.appendChild(skipBtn);
}
ensureSkipButton();

// --- Попытка разблокировать аудио при нажатии START ---
async function unlockAudioOnStart() {
  try {
    typeSound.currentTime = 0;
    await typeSound.play();
    typeSound.pause();
    typeSound.currentTime = 0;
    audioAllowed = true;
  } catch (e) {
    audioAllowed = false;
  }
}

// --- ПЕЧАТЬ ТЕКСТА ---
async function typeText(text) {
  // показать скип
  skipRequested = false;
  skipBtn.style.display = "block";

  textEl.innerHTML = "";
  let i = 0;

  // если аудио разрешено — запустить звук в loop
  if (audioAllowed) {
    try {
      typeSound.loop = true;
      typeSound.currentTime = 0;
      await typeSound.play();
    } catch (e) {
      audioAllowed = false;
    }
  }

  while (i < text.length) {
    if (skipRequested) {
      textEl.textContent = text;
      break;
    }

    textEl.textContent += text[i];
    i++;

    // автоскролл
    textEl.scrollTop = textEl.scrollHeight;

    await new Promise((r) => setTimeout(r, TYPING_SPEED));
  }

  // остановка звука
  if (audioAllowed) {
    try {
      typeSound.pause();
      typeSound.currentTime = 0;
    } catch (e) {}
  }

  // скрыть скип
  skipBtn.style.display = "none";
}

// --- Переход сцен ---
async function showScene(name) {
  const s = scenes[name];
  if (!s) return;

  bg.style.backgroundImage = `url('${s.bg}')`;
  charImg.src = s.char || "";
  charImg.style.display = s.char ? "block" : "none";

  // очистка опций и мини-игр
  choicesEl.innerHTML = "";
  const minigameRoot = document.getElementById("minigame-root");
  if (minigameRoot) minigameRoot.innerHTML = "";

  // печатаем
  await typeText(s.text);

  // Если есть onEnter, вызвать его
  if (s.onEnter) s.onEnter();

  // Если в сцене есть мини-игра
  if (s.minigame) {
    startMinigame(
      s.minigame.type,
      s.minigame.data || s.minigame.opts || s.minigame.tasks,
      () => {
        showScene(s.minigame.next);
      },
    );
    return;
  }

  // создаём кнопки выбора
  s.choices.forEach((ch) => {
    const b = document.createElement("button");
    b.className = "choice-btn";
    b.textContent = ch.text;
    b.onclick = () => {
      clickSound.currentTime = 0;
      clickSound.play().catch(() => {});
      showScene(ch.next);
    };
    choicesEl.appendChild(b);
  });

  // автоскролл вниз
  textEl.scrollTop = textEl.scrollHeight;
}

// --- Обработчик START ---
startBtn.addEventListener("click", async () => {
  // разблокируем аудио при старте (нажатие кнопки — законный user gesture)
  await unlockAudioOnStart();

  // скрываем стартовый экран
  if (startScreen) startScreen.style.display = "none";

  // запускаем сцену
  showScene("scene1");
});

// Если по какой-то причине окно не показано (например ты удалил HTML), оставим безопасный fallback:
if (!startScreen || !startBtn) {
  // запустить сразу (попытка разблокировать аудио заранее)
  unlockAudioOnStart().then(() => {
    showScene("scene1");
  });
}

// ===============================
// МИНИ-ИГРЫ — ЕДИНЫЙ ФРЕЙМВОРК
// ===============================
function ensureMinigameRoot() {
  let root = document.getElementById("minigame-root");
  if (!root) {
    root = document.createElement("div");
    root.id = "minigame-root";
    root.style.marginTop = "20px";
    root.style.display = "flex";
    root.style.flexDirection = "column";
    root.style.gap = "12px";
    document.getElementById("terminal").appendChild(root);
  }
  return root;
}

function escapeHtml(s) {
  return s.replace(
    /[&<>]/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]),
  );
}

function shuffle(arr) {
  return arr.sort(() => Math.random() - 0.5);
}

// Улучшенная проверка ответа для riddle
function normalizeAnswer(input) {
  return input
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/\(.*?\)/g, "()")
    .replace(/['"`].*?['"`]/g, "''");
}

// -----------------------------
// 1) СЛОВЕСНЫЕ ЗАГАДКИ (RIDDLE)
// -----------------------------
function startRiddle(list, onDone) {
  const root = ensureMinigameRoot();
  let i = 0;

  function render() {
    const r = list[i];
    root.innerHTML = `
      <div style="color:#00ff99; text-align:center; font-size:18px;">${escapeHtml(
        r.q,
      )}</div>
      <input id="rIn" class="mg-input" placeholder="Введи ответ..." style="width:100%; padding:10px; font-family:'Courier New';">
      <div style="display:flex; gap:12px; justify-content:center; flex-wrap:wrap;">
        <button class="choice-btn" id="rCheck">Проверить</button>
        <button class="choice-btn" id="rHintBtn">Показать подсказку</button>
      </div>
      <div id="rMsg" style="color:#ffcc00; text-align:center; min-height:24px;"></div>
    `;

    const msg = document.getElementById("rMsg");
    let hintShown = false;

    document.getElementById("rCheck").onclick = () => {
      const input = document.getElementById("rIn").value.trim();
      const normalized = normalizeAnswer(input);
      const correctVariants = r.a.map((a) => normalizeAnswer(a));

      if (correctVariants.includes(normalized)) {
        i++;
        if (i >= list.length) {
          root.innerHTML = "";
          onDone();
        } else {
          render();
        }
      } else {
        msg.textContent = "Неверно, попробуй ещё.";
      }
    };

    document.getElementById("rHintBtn").onclick = () => {
      if (!hintShown) {
        msg.textContent = r.hint;
        hintShown = true;
      }
    };
  }

  render();
}

// -----------------------------
// 2) ОДИНОЧНЫЕ ВЫБОРЫ (MCQ)
// -----------------------------
function startMCQ(list, onDone) {
  const root = ensureMinigameRoot();
  let i = 0;

  function render() {
    const q = list[i];

    root.innerHTML = `
      <div class="mg-title">${escapeHtml(q.q)}</div>
      <div id="mcq"></div>
      <div id="mcqMsg" class="mg-msg"></div>
    `;

    q.options.forEach((opt, index) => {
      let b = document.createElement("button");
      b.className = "choice-btn";
      b.textContent = opt;
      b.onclick = () => {
        if (index === q.correct) {
          i++;
          if (i < list.length) render();
          else {
            root.innerHTML = "";
            onDone();
          }
        } else {
          document.getElementById("mcqMsg").textContent =
            "Неверно — попробуй ещё.";
        }
      };
      document.getElementById("mcq").appendChild(b);
    });
  }

  render();
}

// -----------------------------
// 3) МНОЖЕСТВЕННЫЕ ВЫБОРЫ (MULTI)
// -----------------------------
function startMulti(list, onDone) {
  const root = ensureMinigameRoot();
  let i = 0;

  function render() {
    const q = list[i];
    root.innerHTML = `
      <div class="mg-title">${escapeHtml(q.q)}</div>
      <div id="mList"></div>
      <button class="choice-btn" id="mCheck">Проверить</button>
      <div id="mMsg" class="mg-msg"></div>
    `;

    q.options.forEach((opt, index) => {
      let el = document.createElement("label");
      el.innerHTML = `
        <input type="checkbox" value="${index}">
        ${escapeHtml(opt)}
      `;
      document.getElementById("mList").appendChild(el);
    });

    document.getElementById("mCheck").onclick = () => {
      let chosen = [...document.querySelectorAll("#mList input")]
        .filter((c) => c.checked)
        .map((c) => Number(c.value));

      const correct = q.correct.sort().join(",");
      const got = chosen.sort().join(",");

      if (correct !== got) {
        document.getElementById("mMsg").textContent = "Неверно.";
        return;
      }

      i++;
      if (i < list.length) render();
      else {
        root.innerHTML = "";
        onDone();
      }
    };
  }

  render();
}

// -----------------------------
// 4) CLICKER
// -----------------------------
function startClicker(target, onDone) {
  const root = ensureMinigameRoot();
  root.innerHTML = `
    <div class="mg-title">Нажми ${target} раз</div>
    <button id="cl" class="choice-btn">Клик</button>
    <div id="clCount" class="mg-msg">0</div>
  `;

  let c = 0;
  document.getElementById("cl").onclick = () => {
    c++;
    document.getElementById("clCount").textContent = c;
    if (c >= target) {
      root.innerHTML = "";
      onDone();
    }
  };
}

// -----------------------------
// 5) АРКАДА (простая)
// -----------------------------
function startArcade(goal, onDone) {
  const root = ensureMinigameRoot();
  root.innerHTML = `
    <div class="mg-title">Попади по ${goal} целям</div>
    <button id="arc" class="choice-btn">Выстрелить</button>
    <div id="arcMsg" class="mg-msg"></div>
  `;

  let score = 0;
  document.getElementById("arc").onclick = () => {
    // псевдо-рандом
    if (Math.random() > 0.4) {
      score++;
      if (score >= goal) {
        root.innerHTML = "";
        onDone();
      }
    } else {
      document.getElementById("arcMsg").textContent = "Промах.";
    }
  };
}

// -----------------------------
// 6) ПРОСТОЙ «ШУТЕР»
// -----------------------------
function startShooter(goal, onDone) {
  const root = ensureMinigameRoot();
  const sfx = new Audio("sounds/short-laser-shot_gkcb6rnu.mp3");

  root.innerHTML = `
    <div style="color:#00ff99; text-align:center; font-size:18px;">Сбей ${goal} мишеней</div>
    <div style="display:flex; justify-content:center; margin:20px 0;">
      <button id="shoot" class="choice-btn" style="padding:14px 40px;">Выстрел</button>
    </div>
    <div id="shootMsg" style="color:#ffcc00; text-align:center;"></div>
    <div id="shootCount" style="color:#00ff99; text-align:center; font-size:20px;">0 / ${goal}</div>
  `;

  let score = 0;
  const countEl = document.getElementById("shootCount");

  document.getElementById("shoot").onclick = () => {
    sfx.currentTime = 0;
    sfx.play().catch(() => {});

    if (Math.random() > 0.3) {
      score++;
      countEl.textContent = `${score} / ${goal}`;
      if (score >= goal) {
        setTimeout(() => {
          root.innerHTML = "";
          onDone();
        }, 600);
      }
    } else {
      document.getElementById("shootMsg").textContent = "Промах!";
      setTimeout(() => {
        document.getElementById("shootMsg").textContent = "";
      }, 1000);
    }
  };
}

// -----------------------------
// 7) "СОБЕРИ КОД" (ASSEMBLE SIMPLE)
// -----------------------------
function startAssemble(tasks, onDone) {
  const root = ensureMinigameRoot();
  let t = 0;

  function render() {
    const item = tasks[t];
    const blocks = shuffle(item.blocks.slice());
    root.innerHTML = `
      <div style="color:#00ff99; text-align:center; font-size:18px; margin-bottom:10px;">${escapeHtml(
        item.title,
      )}</div>
      <div id="slots" style="display:flex; gap:10px; justify-content:center; flex-wrap:wrap; margin:15px 0;"></div>
      <div id="pool" style="display:flex; gap:10px; justify-content:center; flex-wrap:wrap;"></div>
      <div id="asmMsg" style="color:#ffcc00; text-align:center; min-height:24px;"></div>
    `;

    const slots = document.getElementById("slots");
    const pool = document.getElementById("pool");

    item.target.forEach(() => {
      const s = document.createElement("button");
      s.className = "choice-btn";
      s.textContent = "?";
      s.dataset.id = "";
      s.style.minWidth = "100px";
      slots.appendChild(s);

      s.onclick = () => {
        if (!s.dataset.id) return;
        const back = item.blocks.find((x) => x.id === s.dataset.id);
        blocks.push(back);
        refreshPool();
        s.dataset.id = "";
        s.textContent = "?";
      };
    });

    function refreshPool() {
      pool.innerHTML = "";
      blocks.forEach((b) => {
        const btn = document.createElement("button");
        btn.className = "choice-btn";
        btn.textContent = b.text;
        btn.style.minWidth = "100px";
        btn.onclick = () => {
          const empty = [...slots.children].find((x) => !x.dataset.id);
          if (!empty) return;
          empty.dataset.id = b.id;
          empty.textContent = b.text;
          blocks.splice(blocks.indexOf(b), 1);
          refreshPool();
          check();
        };
        pool.appendChild(btn);
      });
    }

    function check() {
      const curr = [...slots.children].map((x) => x.dataset.id);
      if (curr.includes("")) return;
      if (curr.join(",") === item.target.join(",")) {
        t++;
        if (t < tasks.length) render();
        else {
          root.innerHTML = "";
          onDone();
        }
      } else {
        document.getElementById("asmMsg").textContent = "Неправильный порядок.";
      }
    }

    refreshPool();
  }

  render();
}




// -----------------------------
// Вызов мини-игр
// -----------------------------
window.startMinigame = function (type, data, onDone) {
  if (type === "riddle") return startRiddle(data, onDone);
  if (type === "mcq") return startMCQ(data, onDone);
  if (type === "multi") return startMulti(data, onDone);
  if (type === "clicker") return startClicker(data, onDone);
  if (type === "arcade") return startArcade(data, onDone);
  if (type === "shooter") return startShooter(data, onDone);
  if (type === "assemble") return startAssemble(data, onDone);
};

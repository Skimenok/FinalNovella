// main.js — замените существующий файл этим кодом

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

// Сцены (оставил как у тебя — не трогаю)
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
    text: "(ЭХО):\nВнимание. Обнаружен первый вирусный кластер. Приготовься, Сергей. Компиляция начинается.\n\nПлатформа под ногами начинает дрожать. Из пустоты появляются враждебные красные пиксели, формирующие фигуру Огромного Будильника.\n\n(Сережа):\nНу конечно. Мой главный враг. Ладно, Эхо. Где тут у вас консоль? Я покажу этому коду, кто тут настоящий разработчик.\n\nКОНЕЦ АКТА 1",
    choices: [{ text: "Завершить Акт 1", next: "end_act1" }],
  },
  end_act1: {
    bg: "backgrounds/1.2.jpg",
    char: "img/gpt.svg",
    text: "КОНЕЦ АКТА 1",
    choices: [{ text: "Начать Акт 2", next: "start" }],
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

  // очистка опций
  choicesEl.innerHTML = "";

  // печатаем
  await typeText(s.text);

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

  // запускаем сцену (раньше вызывался автоматом — теперь по старту)
  showScene("scene1");
});

// Если по какой-то причине окно не показано (например ты удалил HTML), оставим безопасный fallback:
if (!startScreen || !startBtn) {
  // запустить сразу (попытка разблокировать аудио заранее)
  unlockAudioOnStart().then(() => {
    showScene("scene1");
  });
}

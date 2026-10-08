// ===== Данные выставки =====
// Палитра: [фон, цвет 1, цвет 2, цвет 3, цвет 4].
// style — какая функция рисует картину, seed — «случайность» именно этой работы.
const WORKS = [
  {
    title: "Орбиты тишины", author: "Мира Ланская", year: 2024, category: "Геометрия",
    style: "orbits", seed: 11, palette: ["#0d1b2a", "#e0b973", "#f4efe6", "#5b8bb8", "#c96f4a"],
    description: "Окружности расходятся от невидимого центра, как круги на воде. Работа о том, как тишина тоже может иметь форму."
  },
  {
    title: "Сетка дыхания", author: "Тимур Велес", year: 2023, category: "Геометрия",
    style: "grid", seed: 27, palette: ["#14121f", "#f2c14e", "#f78154", "#4d9078", "#b4436c"],
    description: "Строгая сетка, в которой каждая клетка живёт своей жизнью. Порядок и случайность здесь дышат в одном ритме."
  },
  {
    title: "Баухаус после полуночи", author: "Ева Орлик", year: 2025, category: "Геометрия",
    style: "bauhaus", seed: 5, palette: ["#1b1b1e", "#d64933", "#e8c547", "#2e5eaa", "#f3efe0"],
    description: "Оммаж школе Баухаус: круг, квадрат и линия ведут ночной разговор. Простые фигуры складываются в напряжённое равновесие."
  },
  {
    title: "Тёплое свечение", author: "Арина Сол", year: 2026, category: "Свет",
    style: "glow", seed: 42, palette: ["#0a0a12", "#ff7a59", "#ffc15e", "#c86bfa", "#4cc9f0"],
    description: "Размытые пятна цвета смешиваются, как огни ночного города сквозь запотевшее стекло. Картина без единой чёткой линии."
  },
  {
    title: "Лучи в соборе", author: "Лев Марков", year: 2022, category: "Свет",
    style: "rays", seed: 8, palette: ["#07090f", "#ffe8a3", "#ffb86b", "#7aa2ff", "#ffffff"],
    description: "Свет падает сверху и рассыпается на десятки лучей. В воздухе медленно кружатся пылинки — как под куполом старого собора."
  },
  {
    title: "Полярное сияние", author: "Нея Кари", year: 2025, category: "Свет",
    style: "aurora", seed: 19, palette: ["#050b14", "#3ef0b0", "#2fa4ff", "#b46bff", "#ffffff"],
    description: "Зелёные и фиолетовые ленты колышутся над тёмной землёй. Автор пыталась поймать момент, который невозможно сфотографировать."
  },
  {
    title: "Утро в горах", author: "Глеб Северин", year: 2021, category: "Природа",
    style: "mountains", seed: 33, palette: ["#f6d6b8", "#e9a68c", "#6b5b95", "#2b2d42", "#fff3e0"],
    description: "Хребты один за другим растворяются в рассветной дымке. Чем дальше гора, тем больше в ней неба."
  },
  {
    title: "Закат над морем", author: "Лиза Морено", year: 2024, category: "Природа",
    style: "sea", seed: 14, palette: ["#2a1b3d", "#44318d", "#ff9e6d", "#ffd29d", "#e98074"],
    description: "Солнце касается горизонта, и его отражение дробится на волнах. Последние минуты дня, превращённые в полосы цвета."
  },
  {
    title: "Ночные дюны", author: "Амир Хадад", year: 2023, category: "Природа",
    style: "dunes", seed: 61, palette: ["#0b1026", "#1c2a5a", "#c78b5a", "#e7b17a", "#f4e3c1"],
    description: "Пустыня под луной: мягкие изгибы песка и холодный свет звёзд. Пейзаж, в котором время будто остановилось."
  },
  {
    title: "Волны звука", author: "Ия Ромашова", year: 2026, category: "Движение",
    style: "waves", seed: 3, palette: ["#0e0e10", "#00d4ff", "#7b61ff", "#ff5ca8", "#ffffff"],
    description: "Тридцать линий колеблются, как струны после удара. Так могла бы выглядеть музыка, если бы её можно было увидеть."
  },
  {
    title: "Спираль роста", author: "Даниил Фрей", year: 2022, category: "Движение",
    style: "spiral", seed: 21, palette: ["#101614", "#e9c46a", "#2a9d8f", "#f4a261", "#e76f51"],
    description: "Точки расположены по «золотому углу» — так растут семена подсолнуха. Математика природы в чистом виде."
  },
  {
    title: "Течение", author: "Соня Беркут", year: 2025, category: "Движение",
    style: "flow", seed: 77, palette: ["#0f0c1d", "#ff6b6b", "#feca57", "#48dbfb", "#ff9ff3"],
    description: "Цветные нити плывут слева направо, переплетаясь и расходясь. Работа о потоке, который нельзя остановить."
  }
];

const CATEGORIES = ["Все", "Геометрия", "Свет", "Природа", "Движение"];

// Пользователь попросил меньше анимаций?
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;


// ===== Вспомогательные функции для рисования =====
const W = 400;
const H = 500;

// Генератор псевдослучайных чисел: при одном seed картина всегда одинаковая
function createRandom(seed) {
  return function () {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Округление координат, чтобы SVG был компактнее
const n = (value) => Math.round(value * 10) / 10;

// Смешивание двух цветов: t = 0 → первый, t = 1 → второй
function mix(a, b, t) {
  const ca = parseInt(a.slice(1), 16);
  const cb = parseInt(b.slice(1), 16);
  const channel = (shift) => Math.round(((ca >> shift) & 255) * (1 - t) + ((cb >> shift) & 255) * t);
  return "#" + ((1 << 24) | (channel(16) << 16) | (channel(8) << 8) | channel(0)).toString(16).slice(1);
}

// Линейный градиент. stops — массив [смещение, цвет, прозрачность]
function gradient(id, stops, x2 = 0, y2 = 1) {
  const stopTags = stops
    .map(([offset, color, opacity = 1]) => `<stop offset="${offset}" stop-color="${color}" stop-opacity="${opacity}"/>`)
    .join("");
  return `<linearGradient id="${id}" x1="0" y1="0" x2="${x2}" y2="${y2}">${stopTags}</linearGradient>`;
}

function background(color) {
  return `<rect width="${W}" height="${H}" fill="${color}"/>`;
}

function blurFilter(id, amount) {
  return `<filter id="${id}" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="${amount}"/></filter>`;
}

// Россыпь звёзд или пылинок
function dots(random, count, color, area = H) {
  let svg = "";
  for (let i = 0; i < count; i++) {
    svg += `<circle cx="${n(random() * W)}" cy="${n(random() * area)}" r="${n(0.5 + random() * 1.4)}" fill="${color}" opacity="${n(0.2 + random() * 0.7)}"/>`;
  }
  return svg;
}


// ===== Картины: каждая функция рисует свой стиль =====
// random — генератор случайных чисел, p — палитра, id — уникальный префикс для градиентов
const PAINTERS = {
  // Концентрические орбиты с «планетами»
  orbits(random, p) {
    const cx = 200;
    const cy = 240;
    let svg = background(p[0]);
    svg += `<circle cx="${cx + 70}" cy="${cy - 80}" r="54" fill="${p[1]}"/>`;
    for (let i = 0; i < 11; i++) {
      svg += `<circle cx="${n(cx + (random() - 0.5) * 30)}" cy="${n(cy + (random() - 0.5) * 30)}" r="${30 + i * 17}"
        fill="none" stroke="${p[2 + (i % 3)]}" stroke-width="${n(1 + random() * 2.5)}" opacity="${n(0.35 + random() * 0.5)}"/>`;
    }
    for (let i = 0; i < 6; i++) {
      const angle = random() * Math.PI * 2;
      const radius = 50 + i * 30;
      svg += `<circle cx="${n(cx + Math.cos(angle) * radius)}" cy="${n(cy + Math.sin(angle) * radius)}" r="${n(4 + random() * 7)}" fill="${p[1 + (i % 4)]}"/>`;
    }
    return svg;
  },

  // Сетка из кругов, четвертей круга и квадратов
  grid(random, p) {
    const cols = 6;
    const rows = 8;
    const cell = 56;
    const offsetX = (W - cols * cell) / 2;
    const offsetY = (H - rows * cell) / 2;
    let svg = background(p[0]);

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const cx = offsetX + x * cell + cell / 2;
        const cy = offsetY + y * cell + cell / 2;
        const color = p[1 + Math.floor(random() * 4)];
        const kind = random();

        if (kind < 0.5) {
          svg += `<circle cx="${cx}" cy="${cy}" r="${n(cell * (0.12 + random() * 0.3))}" fill="${color}"/>`;
        } else if (kind < 0.8) {
          const rotate = Math.floor(random() * 4) * 90;
          svg += `<path d="M${-cell / 2} ${-cell / 2} h${cell} a${cell} ${cell} 0 0 1 ${-cell} ${cell} z"
            fill="${color}" opacity="0.9" transform="translate(${cx} ${cy}) rotate(${rotate})"/>`;
        } else {
          svg += `<rect x="${n(cx - cell * 0.3)}" y="${n(cy - cell * 0.3)}" width="${n(cell * 0.6)}" height="${n(cell * 0.6)}"
            fill="none" stroke="${color}" stroke-width="2"/>`;
        }
      }
    }
    return svg;
  },

  // Композиция в духе Баухауса
  bauhaus(random, p) {
    const shift = () => (random() - 0.5) * 24;
    return background(p[0])
      + `<circle cx="${n(150 + shift())}" cy="${n(180 + shift())}" r="110" fill="${p[1]}"/>`
      + `<rect x="${n(205 + shift())}" y="${n(215 + shift())}" width="140" height="210" fill="${p[3]}" opacity="0.92"/>`
      + `<path d="M60 430 a90 90 0 0 1 180 0 z" fill="${p[2]}"/>`
      + `<line x1="40" y1="${n(90 + shift())}" x2="360" y2="${n(330 + shift())}" stroke="${p[4]}" stroke-width="3"/>`
      + `<circle cx="${n(300 + shift())}" cy="110" r="22" fill="none" stroke="${p[4]}" stroke-width="3"/>`
      + `<rect x="40" y="455" width="320" height="4" fill="${p[4]}" opacity="0.6"/>`;
  },

  // Размытые пятна света
  glow(random, p, id) {
    let svg = `<defs>${blurFilter(id + "blur", 38)}</defs>` + background(p[0]);
    svg += `<g filter="url(#${id}blur)">`;
    for (let i = 0; i < 7; i++) {
      svg += `<circle cx="${n(60 + random() * 280)}" cy="${n(80 + random() * 340)}" r="${n(50 + random() * 90)}"
        fill="${p[1 + (i % 4)]}" opacity="${n(0.55 + random() * 0.4)}"/>`;
    }
    svg += "</g>";
    return svg + dots(random, 25, "#ffffff");
  },

  // Лучи света сверху и пылинки
  rays(random, p, id) {
    let svg = "<defs>"
      + gradient(id + "ray", [[0, p[1], 0.9], [1, p[1], 0]])
      + `<radialGradient id="${id}halo"><stop offset="0" stop-color="${p[2]}" stop-opacity="0.7"/><stop offset="1" stop-color="${p[2]}" stop-opacity="0"/></radialGradient>`
      + "</defs>" + background(p[0]);

    const ox = 200;
    const oy = -30;
    const length = 640;
    for (let i = 0; i < 16; i++) {
      const angle = (-48 + i * 6.4 + (random() - 0.5) * 4) * Math.PI / 180;
      const spread = (0.6 + random() * 1.6) * Math.PI / 180;
      const x1 = ox + Math.sin(angle - spread) * length;
      const y1 = oy + Math.cos(angle - spread) * length;
      const x2 = ox + Math.sin(angle + spread) * length;
      const y2 = oy + Math.cos(angle + spread) * length;
      svg += `<polygon points="${ox},${oy} ${n(x1)},${n(y1)} ${n(x2)},${n(y2)}" fill="url(#${id}ray)" opacity="${n(0.25 + random() * 0.5)}"/>`;
    }
    svg += `<ellipse cx="200" cy="480" rx="240" ry="100" fill="url(#${id}halo)"/>`;
    svg += `<circle cx="200" cy="-30" r="60" fill="${p[1]}" opacity="0.5"/>`;
    return svg + dots(random, 50, p[4]);
  },

  // Колышущиеся ленты сияния над тёмной землёй
  aurora(random, p, id) {
    let defs = blurFilter(id + "blur", 12);
    let bands = "";

    for (let i = 0; i < 4; i++) {
      const color = p[1 + (i % 3)];
      defs += gradient(id + "band" + i, [[0, color, 0.9], [1, color, 0]]);

      const base = 90 + i * 55;
      const amp = 30 + random() * 30;
      const freq = 0.01 + random() * 0.012;
      const phase = random() * 6;
      let top = "";
      let bottom = "";
      for (let x = 0; x <= W; x += 10) {
        const y = base + Math.sin(x * freq + phase) * amp;
        top += `${x === 0 ? "M" : "L"}${x} ${n(y)} `;
        bottom = `L${x} ${n(y + 130)} ` + bottom;
      }
      bands += `<path d="${top}${bottom}Z" fill="url(#${id}band${i})" opacity="0.8"/>`;
    }

    return `<defs>${defs}</defs>` + background(p[0])
      + dots(random, 70, p[4], 380)
      + `<g filter="url(#${id}blur)">${bands}</g>`
      + `<path d="M0 430 Q100 395 200 420 T400 410 V500 H0 Z" fill="#02050a"/>`;
  },

  // Горные хребты на рассвете
  mountains(random, p, id) {
    let svg = `<defs>${gradient(id + "sky", [[0, p[1]], [1, p[0]]])}</defs>`
      + `<rect width="${W}" height="${H}" fill="url(#${id}sky)"/>`
      + `<circle cx="270" cy="170" r="46" fill="${p[4]}" opacity="0.95"/>`;

    for (let i = 0; i < 5; i++) {
      const base = 230 + i * 55;
      let y = base - random() * 60;
      let d = `M0 ${n(y)}`;
      for (let x = 20; x <= W; x += 20) {
        y += (random() - 0.5) * 40;
        y = Math.min(base, Math.max(base - 110, y));
        d += ` L${x} ${n(y)}`;
      }
      d += ` L${W} ${H} L0 ${H} Z`;
      svg += `<path d="${d}" fill="${mix(p[2], p[3], i / 4)}" opacity="${n(0.55 + i * 0.11)}"/>`;
    }
    return svg;
  },

  // Солнце садится в море
  sea(random, p, id) {
    let svg = "<defs>"
      + gradient(id + "sky", [[0, p[0]], [1, p[2]]])
      + gradient(id + "water", [[0, p[1]], [1, p[0]]])
      + "</defs>"
      + `<rect width="${W}" height="300" fill="url(#${id}sky)"/>`
      + `<circle cx="200" cy="290" r="90" fill="${p[3]}"/>`;

    // Полосы на солнце в стиле ретро
    for (let k = 0; k < 4; k++) {
      svg += `<rect x="100" y="${250 + k * 12}" width="200" height="${2 + k * 1.5}" fill="${p[2]}"/>`;
    }

    svg += `<rect y="300" width="${W}" height="200" fill="url(#${id}water)"/>`;

    // Отражение солнца на воде
    for (let k = 0; k < 14; k++) {
      const width = (160 - k * 9) * (0.7 + random() * 0.5);
      const y = 312 + k * 13;
      svg += `<line x1="${n(200 - width / 2)}" y1="${y}" x2="${n(200 + width / 2)}" y2="${y}" stroke="${p[3]}" stroke-width="3" stroke-linecap="round" opacity="${n(0.85 - k * 0.05)}"/>`;
    }

    // Мелкие волны
    for (let k = 0; k < 18; k++) {
      const x = random() * W;
      const y = 315 + random() * 180;
      svg += `<line x1="${n(x)}" y1="${n(y)}" x2="${n(x + 20 + random() * 40)}" y2="${n(y)}" stroke="${p[4]}" stroke-width="1.5" opacity="0.35"/>`;
    }
    return svg;
  },

  // Дюны под луной
  dunes(random, p, id) {
    let defs = gradient(id + "sky", [[0, p[0]], [1, p[1]]]);
    let layers = "";

    for (let i = 0; i < 4; i++) {
      const light = mix(p[2], p[3], i / 3);
      defs += gradient(id + "dune" + i, [[0, light], [1, mix(light, p[0], 0.6)]], 1, 0);
      const y0 = 270 + i * 55;
      const y1 = y0 + (random() - 0.5) * 60;
      layers += `<path d="M0 ${n(y0)} C130 ${n(y0 - 30 - random() * 60)}, 270 ${n(y1 + 30 + random() * 50)}, 400 ${n(y1)} L400 500 L0 500 Z" fill="url(#${id}dune${i})"/>`;
    }

    return `<defs>${defs}</defs>`
      + `<rect width="${W}" height="${H}" fill="url(#${id}sky)"/>`
      + dots(random, 80, "#ffffff", 300)
      + `<circle cx="290" cy="120" r="70" fill="${p[4]}" opacity="0.08"/>`
      + `<circle cx="290" cy="120" r="34" fill="${p[4]}"/>`
      + layers;
  },

  // Колеблющиеся линии, как звуковая волна
  waves(random, p, id) {
    const grad = `<linearGradient id="${id}line" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="${W}" y2="0">`
      + `<stop offset="0" stop-color="${p[1]}"/><stop offset="0.5" stop-color="${p[2]}"/><stop offset="1" stop-color="${p[3]}"/></linearGradient>`;
    let svg = `<defs>${grad}</defs>` + background(p[0]);

    const lines = 30;
    const freq = 0.018 + random() * 0.01;
    const phase = random() * 6;
    for (let j = 0; j < lines; j++) {
      const y0 = 70 + j * 12.5;
      const strength = Math.sin(Math.PI * (j + 0.5) / lines);
      const amp = 10 + 40 * strength;
      let d = "";
      for (let x = 0; x <= W; x += 6) {
        const envelope = Math.sin(Math.PI * x / W);
        const y = y0 + Math.sin(x * freq + phase + j * 0.22) * amp * envelope;
        d += `${x === 0 ? "M" : "L"}${x} ${n(y)} `;
      }
      svg += `<path d="${d}" fill="none" stroke="url(#${id}line)" stroke-width="1.4" opacity="${n(0.3 + 0.65 * strength)}"/>`;
    }
    return svg;
  },

  // Спираль по «золотому углу», как семена подсолнуха
  spiral(random, p) {
    let svg = background(p[0]);
    const count = 420;
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < count; i++) {
      const radius = Math.sqrt(i) * 10.5;
      const x = 200 + Math.cos(i * golden) * radius;
      const y = 250 + Math.sin(i * golden) * radius;
      const color = p[1 + (Math.floor(radius / 42) % 4)];
      svg += `<circle cx="${n(x)}" cy="${n(y)}" r="${n(1 + (i / count) * 5.5)}" fill="${color}" opacity="${n(0.75 + random() * 0.25)}"/>`;
    }
    return svg;
  },

  // Плавные цветные нити
  flow(random, p) {
    let svg = background(p[0]);
    const lines = 36;
    for (let i = 0; i < lines; i++) {
      const t = i / (lines - 1);
      const y1 = 40 + t * 260 + (random() - 0.5) * 10;
      const y2 = 200 + t * 260;
      const c1 = y1 + 160 + random() * 40;
      const c2 = y2 - 220;
      // Цвет плавно меняется от нити к нити
      const segment = Math.min(2, Math.floor(t * 3));
      const color = mix(p[1 + segment], p[2 + segment], t * 3 - segment);
      svg += `<path d="M-20 ${n(y1)} C140 ${n(c1)}, 260 ${n(c2)}, 420 ${n(y2)}" fill="none" stroke="${color}" stroke-width="1.6" opacity="0.8"/>`;
    }
    return svg;
  }
};

// Собирает SVG-картину по данным произведения
let svgCounter = 0;
function renderArtwork(work) {
  svgCounter += 1;
  const id = "art" + svgCounter + "-"; // уникальный id, чтобы градиенты разных картин не путались
  const random = createRandom(work.seed);
  const content = PAINTERS[work.style](random, work.palette, id);
  return `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${work.title}" preserveAspectRatio="xMidYMid slice">${content}</svg>`;
}


// ===== Галерея =====
const grid = document.getElementById("grid");
const filtersBox = document.getElementById("filters");
let currentCategory = "Все";
let filterTimer = null;

// Карточки создаём один раз
const cards = WORKS.map((work, index) => {
  const card = document.createElement("button");
  card.type = "button";
  card.className = "card";
  card.dataset.index = index;
  card.dataset.category = work.category;
  card.style.setProperty("--accent", work.palette[1]);
  card.style.setProperty("--delay", (index % 3) * 90 + "ms");
  card.setAttribute("aria-label", `Открыть работу «${work.title}»`);
  card.innerHTML = `
    <span class="card-frame">${renderArtwork(work)}</span>
    <span class="card-info">
      <span class="card-title">${work.title}</span>
      <span class="card-meta">${work.author} · ${work.year}</span>
    </span>`;
  card.addEventListener("click", () => openModal(index));
  grid.appendChild(card);
  return card;
});

// Плавное появление карточек при прокрутке
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

cards.forEach((card) => observer.observe(card));

// Кнопки-фильтры
CATEGORIES.forEach((category) => {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "filter" + (category === currentCategory ? " is-active" : "");
  button.textContent = category;
  button.setAttribute("aria-pressed", category === currentCategory);
  button.addEventListener("click", () => applyFilter(category));
  filtersBox.appendChild(button);
});

function applyFilter(category) {
  if (category === currentCategory) return;
  currentCategory = category;

  filtersBox.querySelectorAll(".filter").forEach((button) => {
    const active = button.textContent === category;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", active);
  });

  // 1) карточки плавно гаснут, 2) меняем набор, 3) снова проявляем
  cards.forEach((card) => card.classList.add("is-hiding"));
  clearTimeout(filterTimer);
  filterTimer = setTimeout(() => {
    cards.forEach((card) => {
      card.hidden = category !== "Все" && card.dataset.category !== category;
    });
    requestAnimationFrame(() => {
      requestAnimationFrame(() => cards.forEach((card) => card.classList.remove("is-hiding")));
    });
  }, reducedMotion ? 0 : 250);
}

// Работы, которые сейчас видны (по ним листаем в окне просмотра)
function visibleWorks() {
  return WORKS
    .map((work, index) => index)
    .filter((index) => currentCategory === "Все" || WORKS[index].category === currentCategory);
}


// ===== Окно просмотра =====
const modal = document.getElementById("modal");
const modalArt = document.getElementById("modal-art");
const modalCategory = document.getElementById("modal-category");
const modalTitle = document.getElementById("modal-title");
const modalAuthor = document.getElementById("modal-author");
const modalText = document.getElementById("modal-text");
const counter = document.getElementById("counter");
const closeButton = document.getElementById("modal-close");

let currentIndex = null;
let lastFocused = null;

function showWork(index) {
  const work = WORKS[index];
  const list = visibleWorks();
  currentIndex = index;

  modalArt.innerHTML = renderArtwork(work);
  modalCategory.textContent = work.category;
  modalTitle.textContent = work.title;
  modalAuthor.textContent = `${work.author}, ${work.year}`;
  modalText.textContent = work.description;
  counter.textContent = `${list.indexOf(index) + 1} / ${list.length}`;
}

function openModal(index) {
  lastFocused = document.activeElement;
  showWork(index);
  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  closeButton.focus();
}

function closeModal() {
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  currentIndex = null;
  if (lastFocused) lastFocused.focus();
}

// step = 1 — следующая работа, step = -1 — предыдущая (по кругу)
function step(direction) {
  const list = visibleWorks();
  const position = list.indexOf(currentIndex);
  const next = list[(position + direction + list.length) % list.length];
  showWork(next);
}

closeButton.addEventListener("click", closeModal);
document.getElementById("prev").addEventListener("click", () => step(-1));
document.getElementById("next").addEventListener("click", () => step(1));

// Клик по тёмному фону вокруг окна закрывает его
modal.addEventListener("click", (event) => {
  if (event.target === modal) closeModal();
});

// Клавиатура: Esc — закрыть, стрелки — листать
document.addEventListener("keydown", (event) => {
  if (currentIndex === null) return;
  if (event.key === "Escape") closeModal();
  if (event.key === "ArrowRight") step(1);
  if (event.key === "ArrowLeft") step(-1);
});


// ===== Кнопка «Смотреть выставку» =====
document.getElementById("start").addEventListener("click", () => {
  document.getElementById("gallery").scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" });
});

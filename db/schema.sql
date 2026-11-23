-- MELBUS OS — схема базы (Cloudflare D1 / SQLite). Версия 0.1 · 23.11.2026. Описание системы — docs/crm/SYSTEM.md.
-- Деньги — в грошах (INTEGER, 1 zł = 100), время — ISO 8601 UTC (TEXT), id — короткие строки (ULID/UUID).
-- Главная таблица — events (журнал, только добавление): действия из приложения бригады приходят событиями с UUID,
-- созданным на телефоне (офлайн-очередь), повтор того же id сервер пропускает (INSERT OR IGNORE).
-- Остальные таблицы — текущее состояние («проекции»), их обновляет сервер при приёме события.

PRAGMA foreign_keys = ON;

-- ───────────── люди и техника ─────────────
CREATE TABLE staff (
  id            TEXT PRIMARY KEY,
  name          TEXT NOT NULL,
  phone         TEXT NOT NULL UNIQUE,
  role          TEXT NOT NULL CHECK (role IN ('owner','manager','lead','mover','packer','driver')),
  lang          TEXT NOT NULL DEFAULT 'pl' CHECK (lang IN ('pl','en','ru','uk')),
  email         TEXT,                          -- для входа в Пульт (Cloudflare Access)
  pin_hash      TEXT,                          -- PIN приложения бригады (PBKDF2), сбрасывает менеджер
  cost_hour     INTEGER NOT NULL DEFAULT 4000, -- себестоимость часа, гроши (40 zł со всеми налогами)
  monitoring_ok TEXT,                          -- когда подписал уведомление о фиксации времени/координат (Kodeks pracy 22³)
  active        INTEGER NOT NULL DEFAULT 1,
  created_at    TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);

CREATE TABLE vans (
  id         TEXT PRIMARY KEY,
  name       TEXT NOT NULL,                    -- «Бус 1»
  plate      TEXT NOT NULL UNIQUE,             -- WX 1234A
  model      TEXT NOT NULL DEFAULT 'Fiat Ducato L3H2',
  volume_m3  REAL NOT NULL DEFAULT 13,
  active     INTEGER NOT NULL DEFAULT 1,
  notes      TEXT
);

-- ───────────── клиенты, заявки, оферты ─────────────
CREATE TABLE clients (
  id         TEXT PRIMARY KEY,
  name       TEXT,
  phone      TEXT,
  email      TEXT,
  lang       TEXT NOT NULL DEFAULT 'pl' CHECK (lang IN ('pl','en','ru','uk')),
  channel    TEXT,                             -- как удобнее связаться: phone/whatsapp/telegram/email
  nip        TEXT,                             -- для фактуры фирме
  consent_at TEXT,                             -- согласие на обработку данных (RODO) из формы
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);
CREATE INDEX clients_phone ON clients(phone);

CREATE TABLE leads (
  id          TEXT PRIMARY KEY,                -- M-261118-ABCD (как в Telegram сейчас)
  client_id   TEXT NOT NULL REFERENCES clients(id),
  source      TEXT NOT NULL CHECK (source IN ('site','phone','whatsapp','instagram','facebook','referral','other')),
  status      TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new','contacted','video','offer_sent','won','lost')),
  lost_reason TEXT,
  move_json   TEXT,                            -- состояние формы «Что у вас дома» (MovePayload), как в /api/quote
  estimate    INTEGER,                         -- цена формы, гроши
  wish_date   TEXT,
  video_keys  TEXT,                            -- JSON-список ключей R2 с видео клиента
  owner_id    TEXT REFERENCES staff(id),       -- кто ведёт
  created_at  TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  updated_at  TEXT
);
CREATE INDEX leads_status ON leads(status, created_at);

CREATE TABLE offers (
  id           TEXT PRIMARY KEY,
  lead_id      TEXT NOT NULL REFERENCES leads(id),
  version      INTEGER NOT NULL DEFAULT 1,
  status       TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','sent','viewed','accepted','declined','expired')),
  level        INTEGER NOT NULL CHECK (level IN (1,2,3)),       -- 1 Грузотакси · 2 Перевозка · 3 Под ключ
  pay          TEXT NOT NULL DEFAULT 'fixed' CHECK (pay IN ('fixed','hourly')),
  move_json    TEXT NOT NULL,
  calc_total   INTEGER NOT NULL,               -- результат calc() на сервере
  manual       INTEGER NOT NULL DEFAULT 0,     -- корректировка менеджера (± гроши)
  manual_note  TEXT,                           -- причина (клиент не видит)
  total        INTEGER NOT NULL,
  deposit      INTEGER NOT NULL,               -- задаток 20 %, мин. 200 zł
  date         TEXT, window TEXT,
  valid_until  TEXT NOT NULL,                  -- 14 дней
  token        TEXT NOT NULL UNIQUE,           -- подписанная ссылка клиента
  sent_at TEXT, viewed_at TEXT, accepted_at TEXT, accepted_ip TEXT,
  created_by   TEXT REFERENCES staff(id),
  created_at   TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);
CREATE INDEX offers_lead ON offers(lead_id, version);

-- ───────────── заказы (переезды) ─────────────
CREATE TABLE jobs (
  id           TEXT PRIMARY KEY,               -- MB-2611-014
  offer_id     TEXT REFERENCES offers(id),
  client_id    TEXT NOT NULL REFERENCES clients(id),
  status       TEXT NOT NULL DEFAULT 'booked' CHECK (status IN ('booked','confirmed','in_progress','done','closed','cancelled')),
  level        INTEGER NOT NULL CHECK (level IN (1,2,3)),
  pay          TEXT NOT NULL DEFAULT 'fixed' CHECK (pay IN ('fixed','hourly')),
  date         TEXT NOT NULL,                  -- день переезда (YYYY-MM-DD)
  window       TEXT,                           -- окно прибытия «8:00–9:00»
  price        INTEGER NOT NULL,               -- фиксированная цена (без доп. работ)
  extras_total INTEGER NOT NULL DEFAULT 0,     -- согласованные доп. работы
  plan_hours   REAL,                           -- часы бригады по оферте (dur), для «план / факт»
  crew_size    INTEGER, vans_needed INTEGER,
  boxes_planned INTEGER DEFAULT 0,
  rooms_json   TEXT,                           -- комнаты новой квартиры с цветами (для выгрузки по QR)
  notes        TEXT,                           -- заметка менеджера бригаде
  track_token  TEXT NOT NULL UNIQUE,           -- страница переезда клиента /t/<token>
  rating       INTEGER, client_comment TEXT,
  created_at   TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  updated_at   TEXT
);
CREATE INDEX jobs_date ON jobs(date, status);

CREATE TABLE job_addresses (
  job_id   TEXT NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  kind     TEXT NOT NULL CHECK (kind IN ('from','to','stop')),
  seq      INTEGER NOT NULL DEFAULT 0,
  address  TEXT NOT NULL,
  lat REAL, lng REAL,
  floor    INTEGER, lift INTEGER, house TEXT, door TEXT,   -- как в форме: этаж, лифт, тип дома, где встанет бус
  access_notes TEXT,                                        -- код домофона, парковка, ключи
  PRIMARY KEY (job_id, kind, seq)
);

CREATE TABLE job_items (                        -- вещи из списка формы (с размерами)
  id        TEXT PRIMARY KEY,
  job_id    TEXT NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  item_key  TEXT NOT NULL,                     -- id из ITEMS (move.ts): wardrobe, bed, sofa…
  sel_json  TEXT,                              -- выбранные размеры
  qty       INTEGER NOT NULL DEFAULT 1,
  asm       INTEGER NOT NULL DEFAULT 0,        -- разбираем/собираем
  plan_min  INTEGER,                           -- норма минут (из move.ts)
  status    TEXT NOT NULL DEFAULT 'listed' CHECK (status IN ('listed','disassembled','wrapped','loaded','unloaded','assembled','placed')),
  fact_min  INTEGER                            -- факт (из событий) → отчёт «нормы времени»
);

CREATE TABLE job_changes (                      -- доп. работы: только с согласия клиента ДО начала
  id          TEXT PRIMARY KEY,
  job_id      TEXT NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  extra_key   TEXT,                            -- id из EXTRAS (move.ts) или NULL для своей работы
  title       TEXT NOT NULL,
  qty         INTEGER NOT NULL DEFAULT 1,
  price       INTEGER NOT NULL,                -- гроши (для своей работы цену ставит менеджер)
  status      TEXT NOT NULL DEFAULT 'proposed' CHECK (status IN ('proposed','approved','rejected','done')),
  proposed_by TEXT REFERENCES staff(id),
  approved_at TEXT,
  approved_via TEXT CHECK (approved_via IN ('signature','link','phone')),
  signature_photo TEXT REFERENCES photos(id),
  created_at  TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);

CREATE TABLE assignments (                      -- кто и на каком бусе едет на заказ
  job_id   TEXT NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  staff_id TEXT NOT NULL REFERENCES staff(id),
  role     TEXT NOT NULL CHECK (role IN ('lead','mover','packer','driver')),
  van_id   TEXT REFERENCES vans(id),
  PRIMARY KEY (job_id, staff_id)
);

CREATE TABLE stages (                           -- 10 шагов переезда (набор зависит от пакета)
  job_id     TEXT NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  stage      INTEGER NOT NULL CHECK (stage BETWEEN 1 AND 10),
  -- 1 Выезд · 2 Прибытие · 3 Осмотр и защита · 4 Упаковка/разборка · 5 Погрузка · 6 В пути · 7 Выгрузка ·
  -- 8 Сборка и расстановка · 9 Приёмка · 10 Возврат на базу
  status     TEXT NOT NULL DEFAULT 'todo' CHECK (status IN ('todo','active','done','skipped')),
  started_at TEXT, ended_at TEXT,
  checklist_json TEXT,                         -- отмеченные пункты
  PRIMARY KEY (job_id, stage)
);

-- ───────────── коробки и QR ─────────────
CREATE TABLE boxes (
  code        TEXT PRIMARY KEY,                -- MB-7F3K2 — напечатан на наклейке, QR = https://melbus.pl/b/<code>
  job_id      TEXT REFERENCES jobs(id),        -- NULL — наклейка ещё не использована
  room        TEXT,                            -- kitchen/bedroom/living/kids/office/bath/hall/other
  num         INTEGER,                         -- № в заказе (Кухня · 07)
  contents    TEXT,                            -- «тарелки, кастрюли»
  fragile     INTEGER NOT NULL DEFAULT 0,
  first_night INTEGER NOT NULL DEFAULT 0,      -- «коробка первой ночи»
  status      TEXT NOT NULL DEFAULT 'free' CHECK (status IN ('free','packed','loaded','unloaded','placed','unpacked','returned')),
  van_id      TEXT REFERENCES vans(id),
  packed_at TEXT, loaded_at TEXT, unloaded_at TEXT, placed_at TEXT,
  packed_by TEXT REFERENCES staff(id)
);
CREATE INDEX boxes_job ON boxes(job_id, status);

CREATE TABLE box_stock (                        -- склад фирменных коробок
  kind      TEXT PRIMARY KEY CHECK (kind IN ('S','M','L','wardrobe','book','tv')),
  on_hand   INTEGER NOT NULL DEFAULT 0,
  issued    INTEGER NOT NULL DEFAULT 0,        -- у клиентов/в бусах
  min_level INTEGER NOT NULL DEFAULT 50        -- ниже — напоминание заказать
);

-- ───────────── фото, время, деньги, инциденты ─────────────
CREATE TABLE photos (
  id        TEXT PRIMARY KEY,                  -- UUID с телефона
  job_id    TEXT NOT NULL REFERENCES jobs(id),
  stage     INTEGER,
  kind      TEXT NOT NULL CHECK (kind IN ('before','after','parking','box','item','damage','signature','receipt','odometer','other')),
  box_code  TEXT REFERENCES boxes(code),
  item_id   TEXT REFERENCES job_items(id),
  r2_key    TEXT NOT NULL,                     -- media/<job>/<stage>/<id>.webp (+ _s.webp превью 400 px)
  sha256    TEXT NOT NULL,                     -- доказательство, что фото не меняли
  taken_by  TEXT REFERENCES staff(id),
  taken_at  TEXT NOT NULL,                     -- время на телефоне
  lat REAL, lng REAL, acc REAL,
  visible_to_client INTEGER NOT NULL DEFAULT 1
);
CREATE INDEX photos_job ON photos(job_id, stage);

CREATE TABLE time_entries (
  id        TEXT PRIMARY KEY,
  staff_id  TEXT NOT NULL REFERENCES staff(id),
  job_id    TEXT REFERENCES jobs(id),
  kind      TEXT NOT NULL CHECK (kind IN ('day_start','arrive','break_start','break_end','leave','day_end')),
  at        TEXT NOT NULL,
  lat REAL, lng REAL, acc REAL                  -- только в момент события, без постоянного слежения
);
CREATE INDEX time_staff ON time_entries(staff_id, at);

CREATE TABLE payments (
  id        TEXT PRIMARY KEY,
  job_id    TEXT NOT NULL REFERENCES jobs(id),
  kind      TEXT NOT NULL CHECK (kind IN ('deposit','final','extra','refund')),
  method    TEXT NOT NULL CHECK (method IN ('blik','card','cash','transfer','p24','stripe')),
  amount    INTEGER NOT NULL,
  status    TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','paid','failed','refunded')),
  provider_ref TEXT,                           -- id платежа Przelewy24/Stripe или № чека терминала
  paid_at   TEXT,
  taken_by  TEXT REFERENCES staff(id)
);

CREATE TABLE invoices (
  id        TEXT PRIMARY KEY,
  job_id    TEXT NOT NULL REFERENCES jobs(id),
  number    TEXT,                              -- номер фактуры
  ksef_id   TEXT,                              -- номер в KSeF (через Fakturownia/inFakt)
  amount    INTEGER NOT NULL,
  pdf_key   TEXT,                              -- R2
  status    TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','issued','sent','paid','corrected')),
  issued_at TEXT
);

CREATE TABLE incidents (
  id         TEXT PRIMARY KEY,
  job_id     TEXT NOT NULL REFERENCES jobs(id),
  kind       TEXT NOT NULL CHECK (kind IN ('damage','delay','access','client','vehicle','other')),
  severity   INTEGER NOT NULL DEFAULT 2 CHECK (severity BETWEEN 1 AND 3),
  text       TEXT,
  item_id    TEXT REFERENCES job_items(id),
  box_code   TEXT REFERENCES boxes(code),
  reported_by TEXT REFERENCES staff(id),
  reported_at TEXT NOT NULL,
  resolution TEXT, resolved_at TEXT,
  client_informed INTEGER NOT NULL DEFAULT 0
);

-- ───────────── журнал событий ─────────────
CREATE TABLE events (
  id        TEXT PRIMARY KEY,                  -- UUID, создан на устройстве (повтор = пропуск)
  job_id    TEXT REFERENCES jobs(id),
  lead_id   TEXT REFERENCES leads(id),
  type      TEXT NOT NULL,                     -- lead_created, offer_sent, offer_accepted, day_start, stage_start, stage_end,
                                               -- box_packed, box_loaded, box_unloaded, photo_added, item_state, change_proposed,
                                               -- change_approved, incident, payment, job_done, …
  actor     TEXT,                              -- staff.id | 'client' | 'system'
  at_client TEXT,                              -- время на устройстве
  at_server TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  payload   TEXT                               -- JSON
);
CREATE INDEX events_job ON events(job_id, at_server);
CREATE INDEX events_lead ON events(lead_id, at_server);

CREATE TABLE settings (                         -- шаблоны сообщений (4 языка), нормы, чат Telegram и т. п.
  key   TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

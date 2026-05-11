# tablecrm mobile order form

Мобильная форма создания продажи для [tablecrm.com](https://tablecrm.com).

## Стек

- **Next.js 16** (App Router, TypeScript)
- **Tailwind CSS v4**
- **shadcn/ui** (base-ui компоненты)
- **TanStack Query v5** — кеширование запросов к API
- **Sonner** — toast-уведомления
- **Bun** — менеджер пакетов и рантайм

## Функциональность

| Раздел | Описание |
|---|---|
| Токен | Ввод и сохранение токена кассы в localStorage |
| Клиент | Поиск контрагента по номеру телефона (debounce 350 мс) |
| Организация | Выбор из списка (обязательное поле) |
| Склад | Выбор из списка |
| Счёт (касса) | Выбор из списка |
| Тип цен | Выбор типа — автоматически подставляется в цены товаров |
| Товары | Поиск по номенклатуре, добавление в корзину, редактирование количества и цены |
| Итого | Фиксированная панель с суммой и кнопками |
| Создать продажу | POST `/docs_sales/?token=...` с `generate_out=false` |
| Создать и провести | POST `/docs_sales/?token=...` с `generate_out=true` |

## Локальный запуск

```bash
bun install
bun dev
```

Открыть: [http://localhost:3000](http://localhost:3000)

## Деплой на Vercel

1. Залить репозиторий на GitHub
2. Импортировать в [vercel.com](https://vercel.com) → «Import Project»
3. Framework Preset: **Next.js** (определяется автоматически)
4. Нажать **Deploy** — переменные окружения не нужны, токен хранится в браузере

## Структура проекта

```
src/
├── app/
│   ├── layout.tsx          # Root layout: мобильный контейнер, Toaster, QueryProvider
│   └── page.tsx            # Entry: TokenGate → OrderScreen
├── components/
│   ├── order/
│   │   ├── order-form.tsx          # Основная форма заказа
│   │   ├── contragent-field.tsx    # Поле телефона + поиск клиента
│   │   ├── select-field.tsx        # Универсальный Select с лоадером
│   │   ├── nomenclature-picker.tsx # Поиск товаров + корзина
│   │   └── order-summary.tsx       # Нижняя панель: итого + кнопки
│   ├── token-form.tsx      # Форма ввода токена
│   ├── token-gate.tsx      # Гард: показывает форму токена, если не авторизован
│   ├── order-screen.tsx    # Экран заказа со sticky-шапкой
│   └── query-provider.tsx  # TanStack Query Provider
├── hooks/
│   ├── use-token.ts            # Хранение токена в localStorage
│   ├── use-references.ts       # Хуки для справочников (org, warehouse, paybox, etc.)
│   ├── use-cart.ts             # Управление корзиной товаров
│   └── use-debounced-value.ts  # Debounce хук
└── lib/
    ├── api.ts          # HTTP-клиент для tablecrm API
    ├── api-types.ts    # TypeScript типы сущностей
    ├── token.ts        # Утилиты localStorage
    └── utils.ts        # cn() и прочее
```

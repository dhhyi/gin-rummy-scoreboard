# Project Guidelines

## Tech Stack

- Vue 3 (Composition API, `<script setup>`)
- TypeScript
- Vite
- Tailwind CSS
- Playwright for end-to-end testing

## Localization

This project uses **vue-i18n** for all localization. Use its APIs (`$t`, `$d`, `$n`, etc.) for translations, date/time formatting, and number formatting — do not use raw `Intl` APIs directly.

Component-scoped translations use `<i18n>` SFC blocks with `locale="de"` and `locale="en"`.

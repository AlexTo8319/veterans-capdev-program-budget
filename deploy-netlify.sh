#!/bin/bash

# Скрипт для розгортання бюджетного калькулятора на Netlify

echo "🚀 Розгортання бюджетного калькулятора..."

# Збудувати проект
echo "📦 Збірка проекту..."
npm run build

# Перевірити чи папка build існує
if [ ! -d "build" ]; then
    echo "❌ Помилка: Папка build не знайдена"
    exit 1
fi

echo "✅ Проект збудовано успішно!"

echo ""
echo "🌐 Для розгортання на Netlify:"
echo "1. Перейдіть на https://netlify.com"
echo "2. Натисніть 'New site from Git' або 'Deploy manually'"
echo "3. Якщо вручну: перетягніть папку 'build' на Netlify"
echo "4. Отримайте URL типу: https://your-app-name.netlify.app"
echo ""

echo "📁 Папка 'build' готова для завантаження"
echo "📋 Вміст папки build:"
ls -la build/

echo ""
echo "🎉 Готово! Тепер можете розгорнути додаток на Netlify" 
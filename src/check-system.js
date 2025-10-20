#!/usr/bin/env node

// Скрипт проверки системы перед установкой
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('\n==============================================');
console.log('  🔍 Проверка системы перед установкой');
console.log('==============================================\n');

let hasErrors = false;

// Проверка Node.js
console.log('1️⃣  Проверка Node.js...');
try {
  const nodeVersion = process.version;
  const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);
  
  console.log(`   ✅ Node.js установлен: ${nodeVersion}`);
  
  if (majorVersion < 18) {
    console.log('   ⚠️  ВНИМАНИЕ: Рекомендуется Node.js версии 18 или выше');
    console.log('   📥 Скачайте с https://nodejs.org/\n');
    hasErrors = true;
  } else {
    console.log('   ✅ Версия подходит\n');
  }
} catch (error) {
  console.log('   ❌ Node.js не установлен или работает некорректно\n');
  hasErrors = true;
}

// Проверка npm
console.log('2️⃣  Проверка npm...');
try {
  const npmVersion = execSync('npm --version', { encoding: 'utf-8' }).trim();
  console.log(`   ✅ npm установлен: ${npmVersion}\n`);
} catch (error) {
  console.log('   ❌ npm не найден\n');
  hasErrors = true;
}

// Проверка доступного места на диске
console.log('3️⃣  Проверка свободного места...');
try {
  const stats = fs.statfsSync(process.cwd());
  const freeSpace = (stats.bsize * stats.bavail) / (1024 * 1024 * 1024);
  
  if (freeSpace < 1) {
    console.log(`   ⚠️  Мало свободного места: ${freeSpace.toFixed(2)} ГБ`);
    console.log('   💾 Рекомендуется освободить минимум 1 ГБ\n');
    hasErrors = true;
  } else {
    console.log(`   ✅ Свободно: ${freeSpace.toFixed(2)} ГБ\n`);
  }
} catch (error) {
  console.log('   ℹ️  Не удалось проверить место на диске\n');
}

// Проверка прав доступа
console.log('4️⃣  Проверка прав доступа...');
try {
  const testDir = path.join(process.cwd(), 'test-write-' + Date.now());
  fs.mkdirSync(testDir);
  fs.rmdirSync(testDir);
  console.log('   ✅ Права на запись есть\n');
} catch (error) {
  console.log('   ❌ Нет прав на запись в текущую папку');
  console.log('   💡 Попробуйте запустить от имени администратора\n');
  hasErrors = true;
}

// Проверка портов
console.log('5️⃣  Проверка доступности портов...');
import { createServer } from 'net';

function checkPort(port) {
  return new Promise((resolve) => {
    const server = createServer();
    
    server.once('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        resolve(false);
      } else {
        resolve(true);
      }
    });
    
    server.once('listening', () => {
      server.close();
      resolve(true);
    });
    
    server.listen(port);
  });
}

const port5173Available = await checkPort(5173);
const port3001Available = await checkPort(3001);

if (!port5173Available) {
  console.log('   ⚠️  Порт 5173 занят (фронтенд)');
  console.log('   💡 Измените порт в vite.config.ts\n');
} else {
  console.log('   ✅ Порт 5173 свободен (фронтенд)');
}

if (!port3001Available) {
  console.log('   ⚠️  Порт 3001 занят (бэкенд)');
  console.log('   💡 Измените порт в server/index.js\n');
} else {
  console.log('   ✅ Порт 3001 свободен (бэкенд)\n');
}

// Проверка существующих файлов
console.log('6️⃣  Проверка файлов проекта...');
const requiredFiles = [
  'package.json',
  'vite.config.ts',
  'tsconfig.json',
  'App.tsx',
  'server/index.js',
  'server/setup-db.js'
];

let missingFiles = false;
requiredFiles.forEach(file => {
  if (!fs.existsSync(file)) {
    console.log(`   ❌ Отсутствует файл: ${file}`);
    missingFiles = true;
  }
});

if (!missingFiles) {
  console.log('   ✅ Все необходимые файлы на месте\n');
} else {
  console.log('   ⚠️  Некоторые файлы отсутствуют\n');
  hasErrors = true;
}

// Итоговый результат
console.log('==============================================');
if (hasErrors) {
  console.log('  ⚠️  Обнаружены проблемы');
  console.log('  📖 Смотрите рекомендации выше');
  console.log('  💡 Некоторые проблемы не критичны');
} else {
  console.log('  ✅ Система готова к установке!');
  console.log('');
  console.log('  Следующие шаги:');
  console.log('  1. npm install');
  console.log('  2. npm run setup');
  console.log('  3. npm run dev');
}
console.log('==============================================\n');

process.exit(hasErrors ? 1 : 0);

/**
 * Тестовый компонент для проверки работы Tailwind CSS
 * 
 * ИНСТРУКЦИЯ ПО ИСПОЛЬЗОВАНИЮ:
 * 1. Раскомментируйте импорт в App.tsx (строка 18)
 * 2. Добавьте <TailwindTest /> в начало компонента App
 * 3. Если вы видите цветные блоки с правильными стилями - Tailwind работает!
 * 4. После проверки закомментируйте обратно
 */

export default function TailwindTest() {
  return (
    <div className="fixed bottom-4 left-4 z-[9999] bg-white p-6 rounded-lg shadow-2xl border-4 border-purple-500 max-w-md">
      <h3 className="text-xl font-bold text-purple-600 mb-4">
        🎨 Tailwind CSS Test
      </h3>
      
      <div className="space-y-3">
        {/* Test 1: Colors */}
        <div className="flex gap-2">
          <div className="w-12 h-12 bg-red-500 rounded"></div>
          <div className="w-12 h-12 bg-green-500 rounded"></div>
          <div className="w-12 h-12 bg-blue-500 rounded"></div>
          <div className="w-12 h-12 bg-yellow-500 rounded"></div>
        </div>
        
        {/* Test 2: Gradients */}
        <div className="h-12 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 rounded"></div>
        
        {/* Test 3: Text styles */}
        <div className="space-y-1">
          <p className="text-sm text-gray-600">Small text</p>
          <p className="text-base text-gray-800">Base text</p>
          <p className="text-lg font-bold text-purple-700">Large bold text</p>
        </div>
        
        {/* Test 4: Shadows and borders */}
        <div className="p-4 bg-purple-100 rounded-lg shadow-lg border-2 border-purple-300">
          Shadow & Border Test
        </div>
        
        {/* Test 5: Flexbox */}
        <div className="flex items-center justify-between p-3 bg-blue-50 rounded">
          <span>Left</span>
          <span>Center</span>
          <span>Right</span>
        </div>
        
        <div className="text-xs text-green-600 font-bold mt-4 p-2 bg-green-50 rounded border border-green-300">
          ✅ Если вы видите все эти стили - Tailwind работает правильно!
        </div>
      </div>
    </div>
  );
}

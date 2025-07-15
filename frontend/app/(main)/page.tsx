import CentralColumn from '@/components/CentralColumn';

export default function MainPage() {
  return (
    <div className="w-screen h-screen overflow-hidden bg-[#3A3A3A] text-white flex">
      {/* Левый столбец */}
      <div className="w-[15%] p-[10px] flex flex-col gap-3">
        {/* Блок ввода сообщения */}
        <div className="h-[20%] bg-[#222222] rounded-xl p-3">
          <textarea
            className="w-full h-full resize-none bg-transparent text-white placeholder:text-gray-300 outline-none"
            placeholder="Введите сообщение..."
          />
        </div>

        {/* Блок скриптов */}
        <div className="h-[20%] bg-[#222222] rounded-xl p-3 flex flex-col">
          <p className="text-sm font-semibold text-white mb-2">Скрипты</p>

          {/* Фиолетовая полоска */}
          <div className="h-[5px] rounded-full bg-purple-500 mb-3 w-full" />

          {/* Внешний scroll-контейнер */}
          <div className="flex-1 overflow-y-auto pr-2 custom-scroll">
            {/* Внутренний фон и кнопки */}
            <div className="bg-[#363636] rounded-lg p-2 grid grid-cols-4 gap-2">
              {Array.from({ length: 50 }).map((_, i) => (
                <button
                  key={i}
                  className="bg-[#282828] hover:bg-neutral-700 rounded-md py-2 text-sm text-white transition-colors"
                >
                  {i < 4 ? ['ХАХА', 'ЯЯ', 'КУ', 'C3'][i] : `C${i}`}
                </button>
              ))}
            </div>
          </div>
        </div>


        {/* Пустой нижний блок */}
        <div className="flex-1 bg-[#222222] rounded-xl" />
      </div>

      {/* Центральный столбец */}
      <div className="w-[30%] -ml-2 p-[10px] flex flex-col gap-3">
        <CentralColumn />
      </div>

      {/* Правый столбец */}
      <div className="flex-1 flex flex-col">
        {/* Видеоблок 16:9 */}
        <div className="aspect-video w-full bg-black">
          {/* Здесь можно вставить iframe Twitch или видео */}
          <p className="p-4">Стрим</p>
        </div>

        {/* Оставшаяся часть */}
        <div className="flex-1 bg-neutral-950 p-4 overflow-auto">
          <p>Контент под стримом</p>
        </div>
      </div>
    </div>
  );
}
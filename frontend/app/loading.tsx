export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-900 text-white animate-fade-in">
      <div className="flex flex-col items-center gap-4">
        <img src="/tf.ico" alt="Logo" className="w-12 h-12 animate-pulse" />
        <p className="text-lg font-medium">Загрузка...</p>
      </div>
    </div>
  );
}
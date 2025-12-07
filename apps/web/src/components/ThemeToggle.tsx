'use client';

interface ThemeMeta {
  label: string;
  value: string;
}

interface Props {
  current: ThemeMeta;
  onNext: () => void;
}

const ThemeToggle = ({ current, onNext }: Props) => {
  return (
    <button
      onClick={onNext}
      className="flex flex-col items-start justify-center gap-1.5 p-1.5 hover:opacity-80 transition-opacity"
    >
      <div className="w-[38px] h-[38px] rounded-full border border-white/25 flex items-center justify-center relative overflow-hidden">
        <div
          className="absolute w-2 h-2 rounded-full"
          style={{
            top: "20%",
            left: "30%",
            backgroundColor: "rgba(255, 224, 180, 0.55)",
          }}
        />
        <div
          className="absolute w-2 h-2 rounded-full"
          style={{
            top: "50%",
            left: "60%",
            backgroundColor: "rgba(150, 217, 255, 0.45)",
          }}
        />
        <div
          className="absolute w-2 h-2 rounded-full"
          style={{
            top: "70%",
            left: "35%",
            backgroundColor: "rgba(255, 150, 215, 0.45)",
          }}
        />
      </div>
      <span className="text-white/75 text-xs tracking-wide">{current.label}</span>
    </button>
  );
};

export default ThemeToggle;


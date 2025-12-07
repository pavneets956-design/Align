'use client';

import { useMemo, useState } from "react";
import { TargetLanguage } from "../lib/tts";

interface LangOption {
  value: TargetLanguage;
  label: string;
  description: string;
}

const OPTIONS: LangOption[] = [
  { value: "auto", label: "Auto", description: "Detect language" },
  { value: "pa", label: "Punjabi", description: "Punjabi sacred voice" },
  { value: "hi", label: "Hindi", description: "Hindi sacred voice" },
  { value: "en", label: "English", description: "English sacred voice" }
];

interface Props {
  value: TargetLanguage;
  onSelect: (lang: TargetLanguage) => void;
  tintColor?: string;
}

const LangGlobe = ({ value, onSelect, tintColor = "rgba(255,255,255,0.75)" }: Props) => {
  const [visible, setVisible] = useState(false);
  const displayLabel = useMemo(() => OPTIONS.find((opt) => opt.value === value)?.label ?? "Auto", [value]);

  const close = () => setVisible(false);
  const handleSelect = (lang: TargetLanguage) => {
    onSelect(lang);
    setVisible(false);
  };

  return (
    <>
      <button
        onClick={() => setVisible(true)}
        className="flex flex-col items-center justify-center gap-1"
      >
        <div
          className="w-[42px] h-[42px] rounded-full border flex items-center justify-center relative overflow-hidden"
          style={{ borderColor: tintColor }}
        >
          <div
            className="absolute top-[9px] w-full h-px"
            style={{ backgroundColor: "rgba(255,255,255,0.6)" }}
          />
          <div
            className="absolute w-full h-px"
            style={{ backgroundColor: "rgba(255,255,255,0.6)" }}
          />
          <div
            className="absolute bottom-[9px] w-full h-px"
            style={{ backgroundColor: "rgba(255,255,255,0.6)" }}
          />
        </div>
        <span className="text-white/75 text-xs tracking-wide">{displayLabel}</span>
      </button>
      
      {visible && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center pt-[30vh] px-5"
          onClick={close}
        >
          <div
            className="bg-[rgba(14,10,22,0.95)] border border-white/10 rounded-2xl p-5 gap-3 min-w-[280px]"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-[#f9f3dd] text-lg font-semibold text-center mb-2">
              Choose Language
            </h3>
            {OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => handleSelect(option.value)}
                className={`w-full py-2.5 px-3.5 rounded-xl text-left transition-colors ${
                  option.value === value
                    ? "bg-[rgba(255,223,186,0.2)]"
                    : "bg-transparent hover:bg-white/5"
                }`}
              >
                <div className="text-[#f6e9d4] text-base font-semibold">{option.label}</div>
                <div className="text-[rgba(246,233,212,0.7)] text-xs mt-0.5">
                  {option.description}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default LangGlobe;


import { useState, useEffect } from "react";

interface SliderControlProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  onChange: (value: number) => void;
}

export default function SliderControl({
  label,
  value,
  min,
  max,
  step = 1,
  unit = "",
  onChange,
}: SliderControlProps) {
  const [rangeValue, setRangeValue] = useState(value);
  const [inputValue, setInputValue] = useState(value.toString());

  useEffect(() => {
    setRangeValue(value);
    setInputValue(value.toString());
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputBlur = () => {
    let parsed = parseFloat(inputValue);
    if (isNaN(parsed)) {
      parsed = value;
    } else {
      parsed = Math.min(Math.max(parsed, min), max);
    }
    setInputValue(parsed.toString());
    if (parsed !== value) {
      onChange(parsed);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.currentTarget.blur();
    }
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-neutral-400 w-8 shrink-0">{label}</span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={rangeValue}
        onChange={(e) => {
          const v = Number(e.target.value);
          setRangeValue(v);
          setInputValue(v.toString());
          onChange(v);
        }}
        className="flex-1 accent-white text-xs"
      />
      <div className="flex items-center justify-end w-12 shrink-0">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          onKeyDown={handleKeyDown}
          className="w-8 bg-transparent text-xs outline-none text-right placeholder:text-neutral-600 focus:bg-white/10 rounded px-0.5"
        />
        {unit && (
          <span className="text-xs text-neutral-400 ml-0.5">{unit}</span>
        )}
      </div>
    </div>
  );
}

import { useClickAway } from "@uidotdev/usehooks";
import { useCallback, useState } from "react";
import { HexAlphaColorPicker } from "react-colorful";

export const Picker = ({
  label,
  color,
  onChange,
}: {
  label: string;
  color: string;
  onChange: (newColor: string) => void;
}) => {
  const [isOpen, toggle] = useState(false);

  const close = useCallback(() => toggle(false), []);
  const ref = useClickAway<HTMLDivElement>(close);

  return (
    <div className="picker">
      <span>{label}</span>
      <div
        className="swatch"
        style={{ backgroundColor: color }}
        onClick={() => toggle(true)}
      />

      {isOpen && (
        <div className="popover" ref={ref}>
          <HexAlphaColorPicker color={color} onChange={onChange} />
        </div>
      )}
    </div>
  );
};

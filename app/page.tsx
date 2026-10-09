"use client";

import { useState } from "react";
import { DrawableWidget } from "./drawableWidet";
import Image from "next/image";
import parse from "html-react-parser";

export default function Page() {
  const [images, setImages] = useState<string[]>([]);
  return (
    <>
      <DrawableWidget
        sendImage={(data: string) => {
          setImages([...images, data]);
        }}
      />
      <div style={{ display: "flex", flexWrap: "wrap", gap: "2px" }}>
        {images.map((image, idx) => {
          return (
            <div style={{ border: "1px solid black" }} key={idx}>
              {parse(image)}
            </div>
          );
        })}
      </div>
    </>
  );
}

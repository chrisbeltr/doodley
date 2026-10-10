"use client";

import { useImmer } from "use-immer";
import { DrawableWidget } from "./drawableWidet";

type SendImage = (data: string) => void;

export default function Interface({ sendImage }: { sendImage: SendImage }) {
  const [images, setImages] = useImmer<string[]>([]);

  return (
    <>
      <DrawableWidget
        sendImage={(data: string) => {
          setImages((images) => {
            images.push(data);
          });
          sendImage(data);
        }}
      />
      <div style={{ display: "flex", flexWrap: "wrap", gap: "2px" }}>
        {images.map((img, idx) => {
          return (
            <img
              style={{ border: "1px solid black" }}
              src={img}
              alt="piece from internet user"
              key={idx}
            ></img>
          );
        })}
      </div>
    </>
  );
}

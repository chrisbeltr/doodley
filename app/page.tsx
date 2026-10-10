import Interface from "./interface";

async function sendImage(data: string) {
  console.log("heh. nice image.");
}

export default function Page() {
  return <Interface sendImage={sendImage} />;
}

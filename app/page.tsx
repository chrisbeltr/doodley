import Interface from "./interface";

async function sendImage(data: string) {
  "use server";
  console.log("heh. nice image.");
}

export default function Page() {
  return <Interface sendImage={sendImage} />;
}

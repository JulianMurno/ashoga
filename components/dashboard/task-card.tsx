import Pill from "../Pill";
import Link from "next/link";

export default function TaskCard (
  { tareaId, titulo, descripcion, estado, hecha, bgColor, text, eventName }:
  {
    tareaId: number
    titulo: string;
    descripcion: string | null;
    estado: string | null;
    hecha: boolean;
    bgColor: `#${string}`
    text: string
    eventName: string
  }
) {

  return <Link href={`/task/${tareaId}`}><div
    className="transition-colors cursor-pointer bg-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl dark:bg-gray-800 p-2 flex flex-col gap-2 select-none"
  >
    <span className="text-lg">{titulo}</span>
    <span className="text-md">Evento: {eventName}</span>
    <div className="flex gap-2">
      <Pill bgColor={bgColor}>{text}</Pill>
      <Pill bgColor={ hecha ? '#00c95177' : '#09f8'} >{estado}</Pill>
    </div>
    <p>{descripcion}</p>
  </div>
  </Link>
}
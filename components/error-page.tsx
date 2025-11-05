import Link from "next/link";
import { Button } from "./ui/button";

export default function ErrorPage ({ title, buttonLink, message }: { title: string, message: string, buttonLink: string }) {
  return (
    <div className="text-center">
      <h1 className="text-3xl mb-5">{title}</h1>
      <p>{message}</p>
      <Button asChild className="mt-12">
        <Link href={buttonLink}>Volver a eventos</Link>
      </Button>
    </div>
    )
}
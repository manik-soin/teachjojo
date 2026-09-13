import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 px-4 py-20 text-center">
      <Image src="/jojo/jojo-error.svg" alt="" width={120} height={120} className="h-auto" />
      <h1 className="font-title text-2xl tracking-tight">Jojo can&apos;t find that</h1>
      <p className="max-w-sm text-muted-foreground text-sm leading-6">Sessions belong to the browser that started them. If this is yours, make sure you&apos;re on the same device.</p>
      <Button href="/teach-jojo/sessions" variant="secondary" rounded="full" size="md">
        Your sessions
      </Button>
    </div>
  );
}

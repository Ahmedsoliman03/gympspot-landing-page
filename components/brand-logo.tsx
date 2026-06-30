import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";

/** GymSpot wordmark — the green "G" tile + name, mirrors the app navbar. */
export function BrandLogo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("flex items-center gap-2 group", className)}>
      <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center font-black text-primary-foreground transform group-hover:rotate-6 transition-transform shadow-lg shadow-primary/20">
        G
      </div>
      <span className="font-black text-xl leading-none">GymSpot</span>
    </Link>
  );
}

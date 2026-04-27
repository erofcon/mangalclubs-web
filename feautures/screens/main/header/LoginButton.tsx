import { LogIn } from "lucide-react";

export function LoginButton() {
    return (
        <button className="cursor-pointer md:flex shrink-0 items-center gap-4 rounded-full px-5 py-2 font-semibold hover:scale-105 duration-300 bg-card text-text border border-border hover:opacity-90">
            <LogIn className="w-5" />
            Войти
        </button>
    );
}
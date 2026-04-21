const LINKS = ["О нас", "Контакты", "Доставка"];

export default function HeaderLinks() {
    return (
        <div className="flex flex-col md:flex-row gap-4 font-medium">
            {LINKS.map((label) => (
                <a
                    key={label}
                    className={'cursor-pointer text-text hover:text-text-muted transition-colors border-b md:border-0 border-border pb-2 md:pb-0'}
                >
                    {label}
                </a>
            ))}
        </div>
    );
}
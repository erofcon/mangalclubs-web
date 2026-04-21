import HeaderLinks from "@/feautures/screens/main/header/HeaderLinks";

export function MobileMenu() {
    return (
        <div className="md:hidden px-4 pb-4 flex flex-col gap-4 text-text">
            <div className="flex flex-col gap-3 mt-2">
                <a href={'#'} className={'font-medium border-b border-border pb-2'}>
                    Корзина
                </a>
                <a href={'#'} className={'font-medium border-b border-border pb-2'}>
                    Войти
                </a>
                <a href={'#'} className={'font-medium border-b border-border pb-2'}>
                    Уведомления
                </a>
            </div>

            <HeaderLinks/>
        </div>
    )
}
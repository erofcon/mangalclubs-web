import {categories} from "@/mocks/mocks-data";


export function CategoriesNav() {
    return (
        <nav className={'mt-8'}>
            <ul className={'flex gap-8 overflow-x-auto scroll-smooth flex-nowrap whitespace-nowrap select-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]'}>
                {categories.map(category => (
                    <li
                        key={category.id}
                        className={'cursor-pointer text-text font-medium hover:text-text-muted'}
                    >
                        {category.title}
                    </li>
                ))}
            </ul>
        </nav>
    )
}
import {menus} from "@/mocks/mocks-data";
import {MenuItem} from "@/feautures/screens/main/menu/MenuItem";

export function MenuSection() {
    return (
        <div className="mt-4 space-y-12 md:max-w-6xl mx-auto px-4">
            {menus.map((menu) => (
                <section
                    key={menu.id}
                    id={`menu-${menu.id}`}
                    className="relative"
                >
                    <div className="md:mb-8 mb-4  md:py-4">
                        <h2 className="text-text text-base md:text-lg font-semibold tracking-wide">
                            {menu.title}
                        </h2>

                        <div className="mt-2 h-0.5 w-12 rounded-full bg-warning"/>
                    </div>

                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                        {menu.items.map((item) => (
                            <MenuItem key={item.id} item={item}/>
                        ))}
                    </div>
                </section>
            ))}
        </div>
    );
}
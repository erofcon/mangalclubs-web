import {menus} from "@/mocks/mocks-data";
import {MenuItem} from "@/feautures/screens/main/menu/MenuItem";


export function MenuSection() {
    return (
        <div
            className={'md:mt-8'}
        >
            {menus.map((menu) => (
                <div
                    key={menu.id}
                >

                    <div className="grid grid-cols-2 md:grid-cols-3 md:gap-4">
                        {menu.items.map((item) => (
                            <MenuItem
                                key={item.id}
                                item={item}
                            />
                        ))}
                    </div>


                </div>
            ))}

        </div>
    )
}
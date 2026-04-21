import Header from "@/feautures/screens/main/header/Header";
import {CategoriesNav} from "@/feautures/screens/main/category/CategoryNav";
import {MenuSection} from "@/feautures/screens/main/menu/MenuSection";

export function MainScreen() {
    return (
        <section className={'mx-4'}>

            <section>
                <Header/>
            </section>

            <section>
                <CategoriesNav/>
            </section>

            <section>
                <MenuSection/>
            </section>

        </section>

    )
}
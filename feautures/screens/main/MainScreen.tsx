import Header from "@/feautures/screens/main/header/Header";
import {CategoriesNav} from "@/feautures/screens/main/category/CategoryNav";
import {MenuSection} from "@/feautures/screens/main/menu/MenuSection";
import Stories from "@/feautures/screens/main/stories/Stories";

export function MainScreen() {
    return (
        <main>
            <Header/>
            <Stories />
            <CategoriesNav/>
            <MenuSection/>
        </main>

    )
}
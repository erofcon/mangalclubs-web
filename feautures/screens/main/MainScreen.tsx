import {CategoriesNav} from "@/feautures/screens/main/category/CategoryNav";
import {MenuSection} from "@/feautures/screens/main/menu/MenuSection";
import Stories from "@/feautures/screens/main/stories/Stories";
import CartButton from "@/feautures/floating-buttons/CartButton";
import {HeroSection} from "@/feautures/screens/main/hero/HeroSection";


export function MainScreen() {
    return (
        <main>
            <HeroSection/>
            <Stories/>
            <CategoriesNav/>
            <MenuSection/>
            <CartButton/>
        </main>
    )
}

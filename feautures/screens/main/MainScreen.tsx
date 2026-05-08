import {CategoriesNav} from "@/feautures/screens/main/category/CategoryNav";
import {MenuSection} from "@/feautures/screens/main/menu/MenuSection";
import Stories from "@/feautures/screens/main/stories/Stories";
import {CartDrawer} from "@/feautures/screens/main/cart/CartDrawer";
import FloatingButton from "@/feautures/floating-buttons/FloatingButton";
import {HeroSection} from "@/feautures/screens/main/hero/HeroSection";


export function MainScreen() {
    return (
        <main className="bg-[#070808]">
            <HeroSection/>
            <Stories/>
            <CategoriesNav/>
            <MenuSection/>
            <CartDrawer/>
            <FloatingButton/>
        </main>
    )
}

import Header from "@/feautures/screens/main/header/Header";
import {CategoriesNav} from "@/feautures/screens/main/category/CategoryNav";
import {MenuSection} from "@/feautures/screens/main/menu/MenuSection";
import Stories from "@/feautures/screens/main/stories/Stories";
import {CartDrawer} from "@/feautures/screens/main/cart/CartDrawer";
import FloatingButton from "@/feautures/floating_buttons/FloatingButton";
import {AuthModal} from "@/feautures/auth/AuthModal";


export function MainScreen() {
    return (
        <main>
            <Header/>
            <Stories/>
            <CategoriesNav/>
            <MenuSection/>
            <CartDrawer/>
            <FloatingButton/>
            <AuthModal/>
        </main>
    )
}
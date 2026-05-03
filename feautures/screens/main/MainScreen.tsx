import {CategoriesNav} from "@/feautures/screens/main/category/CategoryNav";
import {MenuSection} from "@/feautures/screens/main/menu/MenuSection";
import Stories from "@/feautures/screens/main/stories/Stories";
import {CartDrawer} from "@/feautures/screens/main/cart/CartDrawer";
import FloatingButton from "@/feautures/floating-buttons/FloatingButton";
import WelcomeBookingBanner from "@/feautures/screens/main/booking/WelcomeBookingBanner";


export function MainScreen() {
    return (
        <main>
            <Stories/>
            <WelcomeBookingBanner/>
            <CategoriesNav/>
            <MenuSection/>
            <CartDrawer/>
            <FloatingButton/>
        </main>
    )
}
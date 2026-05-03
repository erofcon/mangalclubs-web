import {CategoriesNav} from "@/feautures/screens/main/category/CategoryNav";
import {MenuSection} from "@/feautures/screens/main/menu/MenuSection";
import Stories from "@/feautures/screens/main/stories/Stories";
import {CartDrawer} from "@/feautures/screens/main/cart/CartDrawer";
import FloatingButton from "@/feautures/floating-buttons/FloatingButton";
import {AuthModal} from "@/feautures/auth/AuthModal";
import {OrderTypeModal} from "@/feautures/order/OrderTypeModal";
import {RestaurantTypeModal} from "@/feautures/order/RestaurantTypeModal";
import {DeliveryTypeModal} from "@/feautures/order/DeliveryTypeModal";
import WelcomeBookingBanner from "@/feautures/screens/main/booking/WelcomeBookingBanner";
import {AuthCodeConfirm} from "@/feautures/auth/AuthCodeConfirm";


export function MainScreen() {
    return (
        <main>
            <Stories/>
            <WelcomeBookingBanner/>
            <CategoriesNav/>
            <MenuSection/>
            <CartDrawer/>
            <FloatingButton/>
            <AuthModal/>
            <AuthCodeConfirm/>
            <OrderTypeModal/>
            <RestaurantTypeModal/>
            <DeliveryTypeModal/>
        </main>
    )
}
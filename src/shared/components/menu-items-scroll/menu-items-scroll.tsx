import type {BaseItem} from "../../interfaces/family-genres.interface.ts";
import "./menu-items-scroll.scss";

interface MenuItemsScrollProps<T> {
    items: BaseItem<T>[];
    currentItem: string;
    setCurrentItem: (item: T) => void;
}

const MenuItemsScroll = <T,>({items, currentItem, setCurrentItem}: MenuItemsScrollProps<T>) => {

    return (
        <div className="menu-items-scroll">
            <div className={currentItem === "all" ? "menu-items-scroll-item menu-items-scroll-item-active" : "menu-items-scroll-item"}
                 data-testid="menu-items-scroll-item"
                 onClick={() => setCurrentItem("all" as T)}>
                <p className="menu-items-scroll-item-text" data-testid="home-menu-item-text">All</p>
            </div>
            {items.map((item: BaseItem<T>, index: number) => {
                return (
                    <div className={currentItem === String(item.value) ? "menu-items-scroll-item menu-items-scroll-item-active" : "menu-items-scroll-item"}
                         key={index}
                         data-testid="home-menu-item"
                         onClick={() => setCurrentItem(item.value)}>
                        <p className="menu-items-scroll-item-text" data-testid="home-menu-item-text">{item.short}</p>
                    </div>
                )
            })}
        </div>
    )
}

export default MenuItemsScroll;
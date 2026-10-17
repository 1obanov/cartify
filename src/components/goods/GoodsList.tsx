import { useShopContext } from "../../context/context";
import { GoodsItem } from "./GoodsItem";

function GoodsList() {
  const { state } = useShopContext();
  const { goods } = state;

  if (!goods.length) {
    return <h3>Nothing found</h3>;
  }

  return (
    <ul className="list">
      {goods.map((item) => (
        <GoodsItem key={item.id} {...item} />
      ))}
    </ul>
  );
}

export { GoodsList };

import { useEffect, useState } from "react";
import { GoodsList } from "../components/goods/GoodsList";
import { Preloader } from "../components/shared/Preloader";
import { TriangleAlert } from "lucide-react";
import { useShopContext } from "../context/context";
import type { ProductList } from "../types/product";

function Shop() {
  const { state, dispatch } = useShopContext();
  const { goods, loadingGoods } = state;
  const [shopError, setShopError] = useState("");

  useEffect(() => {
    if (goods.length || shopError) return;

    const controller = new AbortController();

    async function fetchProducts() {
      try {
        const response = await fetch(
          "https://dummyjson.com/products?limit=50",
          {
            signal: controller.signal,
          },
        );

        if (!response.ok) {
          throw new Error(
            `Products request failed with status ${response.status}`,
          );
        }

        const data: ProductList = await response.json();

        if (!Array.isArray(data?.products) || data.products.length === 0) {
          throw new Error("Products were missing from the API response");
        }

        dispatch({ type: "SET_GOODS", payload: data.products });
      } catch (error: unknown) {
        if (error instanceof Error && error.name === "AbortError") {
          return;
        }

        console.error("Error fetching products:", error);
        setShopError("Could not load products. Please try again.");
        dispatch({ type: "SET_LOADING_GOODS", payload: false });
      }
    }

    fetchProducts();

    return () => controller.abort();
  }, [goods, dispatch, shopError]);

  return loadingGoods ? (
    <Preloader />
  ) : (
    <div className="section shop">
      <div className="container">
        {shopError ? (
          <div className="api-error">
            <span className="api-error__icon">
              <TriangleAlert size={28} strokeWidth={1.6} />
            </span>
            <h1>Products unavailable</h1>
            <p>{shopError}</p>
            <button
              className="btn"
              onClick={() => {
                dispatch({ type: "SET_LOADING_GOODS", payload: true });
                setShopError("");
              }}
            >
              Try again
            </button>
          </div>
        ) : (
          <>
            <div className="headline">
              <h1 className="headline__title">Shop</h1>
            </div>
            <GoodsList />
          </>
        )}
      </div>
    </div>
  );
}

export { Shop };

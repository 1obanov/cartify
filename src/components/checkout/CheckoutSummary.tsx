import { useShopContext } from "../../context/context";
import type { CheckoutStepIndex } from "../../context/reducer";
import { OrderItem } from "../order/OrderItem";

type CheckoutSummaryProps = {
  currentStep: CheckoutStepIndex;
  onNextStep: () => void;
  isSubmitting: boolean;
  deliveryPrice: number;
  subTotalPrice: number;
  totalPrice: number;
  handlePlaceOrder: () => void | Promise<void>;
};

type ButtonText =
  | "Proceed to Payment"
  | "Proceed to Review"
  | "Placing order..."
  | "Place Order";

function CheckoutSummary({
  currentStep,
  onNextStep,
  isSubmitting,
  deliveryPrice,
  subTotalPrice,
  totalPrice,
  handlePlaceOrder,
}: CheckoutSummaryProps) {
  const { state } = useShopContext();
  const { cart } = state;

  const getButtonText = (): ButtonText => {
    if (currentStep === 0) return "Proceed to Payment";
    if (currentStep === 1) return "Proceed to Review";

    return isSubmitting ? "Placing order..." : "Place Order";
  };

  return (
    <div className="summary-box">
      <h2 className="summary-box__title">Order summary</h2>
      <div className="summary-box__body">
        <ul className="order-list">
          {cart.map((item) => (
            <li className="order-list__item" key={item.id}>
              <OrderItem
                {...item}
                showInfo={false}
                showOnlyQty={true}
                enableToggle={false}
                imageModifier="small"
              />
            </li>
          ))}
        </ul>
      </div>
      <table className="summary-box__table summary-box__table--border-top">
        <tbody>
          <tr>
            <th>Subtotal</th>
            <td>${subTotalPrice}</td>
          </tr>
          <tr>
            <th>Delivery</th>
            <td>{deliveryPrice === 0 ? "Free" : `$${deliveryPrice}`}</td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <th>Total</th>
            <td>${totalPrice}</td>
          </tr>
        </tfoot>
      </table>
      <div className="summary-box__actions">
        {currentStep < 2 ? (
          <button className="btn" onClick={onNextStep}>
            {getButtonText()}
          </button>
        ) : (
          <button
            className="btn"
            onClick={handlePlaceOrder}
            disabled={isSubmitting}
          >
            {getButtonText()}
          </button>
        )}
      </div>
    </div>
  );
}

export { CheckoutSummary };

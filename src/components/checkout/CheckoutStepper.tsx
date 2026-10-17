import { useShopContext } from "../../context/context";
import { Check } from "lucide-react";

type CheckoutSteps = "Shipping" | "Payment" | "Review";

const steps: CheckoutSteps[] = ["Shipping", "Payment", "Review"];

function CheckoutStepper() {
  const { state } = useShopContext();
  const { currentStep } = state;

  return (
    <div className="checkout-stepper">
      {steps.map((step, index) => (
        <div
          key={index}
          className={`checkout-stepper__step ${
            index < currentStep
              ? "completed"
              : index === currentStep
                ? "active"
                : ""
          }`}
        >
          <span className="checkout-stepper__indicator">
            {index < currentStep ? (
              <Check strokeWidth="1.2" size="18" />
            ) : (
              `${index + 1}.`
            )}
          </span>
          <span className="checkout-stepper__title">{step}</span>
        </div>
      ))}
    </div>
  );
}

export { CheckoutStepper };

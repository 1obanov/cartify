import { Controller } from "react-hook-form";
import type { ChangeEvent } from "react";
import type { Control } from "react-hook-form";
import type { CheckoutFormValues } from "../../types/checkout";

type ExpiryDateInputProps = {
  control: Control<CheckoutFormValues>;
};

function ExpiryDateInput({ control }: ExpiryDateInputProps) {
  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement>,
    onChange: (value: string) => void,
  ) => {
    // Remove all non-numeric characters from the input
    let input = e.target.value.replace(/[^0-9]/g, "");
    // Limit the input length to 4 characters
    if (input.length > 4) input = input.slice(0, 4);

    // If the length of the input is 3 or more, automatically add a "/" after the MM part
    if (input.length >= 3) {
      input = `${input.slice(0, 2)}/${input.slice(2)}`;
    }

    // Update the input value using onChange from react-hook-form
    onChange(input);
  };

  return (
    <>
      <Controller
        name="expiryDate"
        control={control}
        defaultValue=""
        render={({ field: { value, onChange }, fieldState: { error } }) => (
          <>
            <div className="form-group__wrap">
              <input
                id="expiryDate"
                type="text"
                placeholder=" "
                value={value}
                onChange={(e) => handleInputChange(e, onChange)}
              />
              <label className="label" htmlFor="expiryDate">
                Expiry Date
              </label>
            </div>
            {error && <p className="error">{error.message}</p>}
          </>
        )}
      />
    </>
  );
}

export { ExpiryDateInput };

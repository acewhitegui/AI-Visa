import {MouseEventHandler} from "react";
import Loader from "@/app/components/ui/Loader";
import classNames from "classnames";
import {buttonLinkPropTypes} from "@/app/library/objects/types";
import PropTypes from "prop-types";

interface Button {
  id: string;
  url: string;
  text: string;
  type: string;
  newTab: boolean;
}

const Button = ({
                  button,
                  appearance,
                  compact = false,
                  handleClick,
                  loading = false,
                  type,
                }: {
  button: Button,
  appearance: string,
  compact: boolean,
  handleClick: MouseEventHandler,
  loading: boolean,
  type?: "button" | "submit" | "reset" | undefined
}) => {
  return (
    <button onClick={handleClick} type={type}>
      <div
        className={classNames(
          // Common classes
          "flex w-full justify-center lg:w-auto text-center uppercase tracking-wide font-semibold text-base md:text-sm border-2 rounded-md",
          // Full-size button
          {
            "px-8 py-4": !compact,
          },
          // Compact button
          {
            "px-6 py-2": compact,
          },
          // Specific to when the button is fully dark
          {
            "bg-primary-600 text-white border-primary-600":
              appearance === "dark",
          },
          // Specific to when the button is dark outlines
          {
            "text-primary-600 border-primary-600":
              appearance === "dark-outline",
          },
          // Specific to when the button is fully white
          {
            "bg-white text-primary-600 border-white": appearance === "white",
          },
          // Specific to when the button is white outlines
          {
            "text-white border-white": appearance === "white-outline",
          }
        )}
      >
        {loading && <Loader/>}
        {button.text}
      </div>
    </button>
  )
}

Button.propTypes = {
  button: buttonLinkPropTypes,
  appearance: PropTypes.oneOf([
    "dark",
    "white-outline",
    "white",
    "dark-outline",
  ]),
  compact: PropTypes.bool,
}

export default Button
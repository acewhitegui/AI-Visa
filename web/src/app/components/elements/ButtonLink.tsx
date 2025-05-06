import classNames from "classnames"
import PropTypes from "prop-types"
import CustomLink from "./CustomLink";
import {buttonLinkPropTypes} from "@/app/library/objects/types";

interface Button {
  id: string;
  url: string;
  text: string;
  type: string;
  newTab: boolean;
}

const ButtonContent = ({button, appearance, compact}: { button: Button, appearance: string, compact: boolean }) => {
  return (
    <div
      className={classNames(
        // Common classes
        "block w-full lg:w-auto text-center uppercase tracking-wide font-semibold text-base md:text-sm border-2 rounded-full",
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
          "bg-violet-600 text-white hover:bg-violet-700 border-violet-600": appearance === "dark",
        },
        // Specific to when the button is dark outlines
        {
          "text-primary-600 border-primary-600": appearance === "dark-outline",
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
      {button.text}
    </div>
  )
}

const ButtonLink = ({locale, button, appearance, compact = false}: {
  locale: string,
  button: Button,
  appearance: string,
  compact: boolean
}) => {

  return (
    <CustomLink link={button} locale={locale}>
      <ButtonContent
        button={button}
        appearance={appearance}
        compact={compact}
      />
    </CustomLink>
  )
}

ButtonLink.propTypes = {
  button: buttonLinkPropTypes,
  appearance: PropTypes.oneOf([
    "dark",
    "white-outline",
    "white",
    "dark-outline",
  ]),
  compact: PropTypes.bool,
}

export default ButtonLink
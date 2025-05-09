import PropTypes from "prop-types"
import {linkPropTypes, StrapiLink} from "@/app/library/objects/types";
import Button from "@/app/components/elements/Button";
import {Link} from "@/i18n/routing";

const CustomLink = ({link, locale, children}: { link: StrapiLink | Button, locale: string, children: any }) => {
  const isInternalLink = link.url.startsWith("/")

  // For internal links, use the Next.js Link component
  if (isInternalLink) {
    return (
      <Link href="/[[...slug]]" as={link.url} title={link.text} locale={locale}>
        <a>{children}</a>
      </Link>
    )
  }

  // Plain <a> tags for external links
  if (link.newTab) {
    return (
      <Link href={link.url} title={link.text} target="_blank" rel="noopener noreferrer" locale={locale}>
        {children}
      </Link>
    )
  }

  return (
    <Link href={link.url} target="_self" title={link.text} locale={locale}>
      {children}
    </Link>
  )
}

CustomLink.propTypes = {
  link: linkPropTypes,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
}

export default CustomLink
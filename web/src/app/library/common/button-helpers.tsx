// Decide what the button will look like based on its type (primary or secondary)
// and on its background (light or dark).
export function getButtonAppearance(type: string, background?: string) {
  if (type === 'primary') {
    if (background === 'light') {
      // Dark primary button on a light background
      return 'dark'
    }
    // Fully white primary button on a dark background
    return 'white'
  }
  if (type === 'secondary') {
    if (background === 'light') {
      // Dark outline primary button on a light background
      return 'dark-outline'
    }
    // White outline primary button on a dark background
    return 'white-outline'
  }

  // Shouldn't happen, but default to dark button just in case
  return 'dark'
}

export function renderButtonStyle(type: string) {
  switch (type) {
    case "primary":
      return "bg-violet-600 text-white hover:bg-violet-700 font-bold py-3 px-8 rounded-full shadow-lg transition duration-300";
    case "secondary":
      return "px-8 py-3 text-lg font-semibold border-2 rounded border-black";
    default:
      return "px-8 py-3 text-lg font-semibold rounded";
  }
}

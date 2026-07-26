/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html"],
  theme: {
    extend: {
      colors: {
        "surface":                  "#fdf9ec",
        "surface-container":        "#f2eee1",
        "surface-container-low":    "#f8f3e6",
        "surface-container-high":   "#ece8db",
        "surface-container-lowest": "#ffffff",
        "on-surface":               "#1c1c14",
        "on-surface-variant":       "#434939",
        "surface-variant":          "#e6e2d6",
        "outline":                  "#737968",
        "outline-variant":          "#c3c9b5",
        "primary":                  "#406900",
        "primary-container":        "#80b341",
        "on-primary-container":     "#264200",
        "primary-fixed":            "#bcf379",
        "on-primary-fixed":         "#102000",
        "secondary":                "#934938",
        "secondary-container":      "#fea18b",
        "tertiary":                 "#635e55",
      },
      fontFamily: {
        headline: ["Space Grotesk"],
        body:     ["Plus Jakarta Sans"],
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/container-queries"),
  ],
};

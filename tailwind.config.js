module.exports = {
  mode: "jit",
  purge: ["./src/pages/**/*.{ts,tsx}", "./src/components/**/*.{ts,tsx}"],
  plugins: [require("@tailwindcss/forms")],
};

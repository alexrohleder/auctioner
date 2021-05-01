module.exports = {
  mode: "jit",
  purge: ["./src/**/*.{ts,tsx}"],
  plugins: [require("@tailwindcss/forms")],
};

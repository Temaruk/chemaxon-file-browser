import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders header text", () => {
  render(<App />);
  const headerTextElement = screen.getByText(/ChemAxon File Browser/i);
  expect(headerTextElement).toBeInTheDocument();
});

import { render, screen, within } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { MemoryRouter } from "react-router-dom";
import CollectionSection from "./CollectionSection";

describe("CollectionSection", () => {
  it("renders Reason for the Season section with the three Christmas crosses", () => {
    render(
      <MemoryRouter>
        <CollectionSection />
      </MemoryRouter>
    );

    expect(screen.getByRole("heading", { level: 2, name: "Our Collection" })).toBeInTheDocument();
    const seasonHeading = screen.getByRole("heading", { level: 2, name: "Reason for the Season" });
    expect(seasonHeading).toBeInTheDocument();

    const seasonSection = seasonHeading.closest("#reason-for-the-season") as HTMLElement;
    expect(seasonSection).toBeInTheDocument();

    expect(within(seasonSection).getByRole("link", { name: /O Holy Night/i })).toHaveAttribute(
      "href",
      "/product/o-holy-night"
    );
    expect(within(seasonSection).getByRole("link", { name: /O Little Town of Bethlehem/i })).toHaveAttribute(
      "href",
      "/product/o-little-town-of-bethlehem"
    );
    expect(within(seasonSection).getByRole("link", { name: /Angels We Have Heard on High/i })).toHaveAttribute(
      "href",
      "/product/angels-we-have-heard-on-high"
    );
  });
});

import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import ProductPage from "./ProductPage";

const renderProductPage = (slug: string) => {
  return render(
    <MemoryRouter initialEntries={[`/product/${slug}`]}>
      <Routes>
        <Route path="/product/:slug" element={<ProductPage />} />
      </Routes>
    </MemoryRouter>
  );
};

describe("ProductPage", () => {
  it("renders How Great Thou Art with copy and single image", () => {
    renderProductPage("how-great-thou-art");

    expect(screen.getByRole("heading", { level: 1, name: "How Great Thou Art" })).toBeInTheDocument();
    expect(screen.getByText(/Psalm 8:3/i)).toBeInTheDocument();
    expect(screen.getByText(/Look up on a clear night/i)).toBeInTheDocument();

    // How Great Thou Art has a single image, so carousel controls are not rendered
    expect(screen.queryByRole("button", { name: /previous image/i })).not.toBeInTheDocument();
    expect(screen.getByAltText("How Great Thou Art")).toBeInTheDocument();
  });

  it("renders Mightier than the Waves with copy and single image", () => {
    renderProductPage("mightier-than-the-waves");

    expect(screen.getByRole("heading", { level: 1, name: "Mightier than the Waves" })).toBeInTheDocument();
    expect(screen.getByText(/Psalm 93:4/i)).toBeInTheDocument();
    expect(screen.getByText(/The ocean doesn't ask permission either/i)).toBeInTheDocument();

    // Mightier currently has a single image, so carousel controls are not rendered
    expect(screen.queryByRole("button", { name: /previous image/i })).not.toBeInTheDocument();
    expect(screen.getByAltText("Mightier than the Waves")).toBeInTheDocument();
  });

  it("renders Deep Waters with copy and carousel slideshow", () => {
    renderProductPage("deep-waters");

    expect(screen.getByRole("heading", { level: 1, name: "Deep Waters" })).toBeInTheDocument();
    expect(screen.getAllByText(/Isaiah 43:2/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/Some storms don't stay at the edges/i)).toBeInTheDocument();

    // Deep Waters has multiple images with useSlideshow, so carousel controls are present
    expect(screen.getByRole("button", { name: /previous image/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /next image/i })).toBeInTheDocument();
    expect(screen.getByRole("region", { name: /thumbnail previews/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /^select Example 1$/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /^select Example 1 \(back\)$/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /^select Example 2$/i })).toBeInTheDocument();
  });

  it("renders Walking on Water with copy and carousel slideshow", () => {
    renderProductPage("walking-on-water");

    expect(screen.getByRole("heading", { level: 1, name: "Walking on Water" })).toBeInTheDocument();
    expect(screen.getByText(/Psalm 107:29/i)).toBeInTheDocument();
    expect(screen.getByText(/Fix Your Eyes Above the Waves/i)).toBeInTheDocument();

    // Walking on Water has multiple images with useSlideshow, so carousel controls are present
    expect(screen.getByRole("button", { name: /previous image/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /next image/i })).toBeInTheDocument();
    expect(screen.getByRole("region", { name: /thumbnail previews/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /^select Front-engraved$/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /^select Back-engraved$/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /^select Back-engraved \(back\)$/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /^select Western Red Cedar Backing$/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /^select Western Red Cedar Backing \(back\)$/i })).toBeInTheDocument();
  });

  it("renders Shattered But Not Broken with carousel slideshow and new variant", () => {
    renderProductPage("shattered-but-not-broken");

    expect(screen.getByRole("heading", { level: 1, name: "Shattered But Not Broken" })).toBeInTheDocument();
    expect(screen.getByText(/Available in 20" and 14" sizes\./i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /previous image/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /next image/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /^select Full shattered glass$/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /^select Front engraving, Western Red Cedar backing$/i })).toBeInTheDocument();
  });

  it("renders Product Not Found for unknown slug", () => {
    renderProductPage("unknown-cross");

    expect(screen.getByRole("heading", { level: 1, name: "Product Not Found" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Return to Home/i })).toBeInTheDocument();
  });
});

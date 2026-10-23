import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import CrossImageSlideshow from "./CrossImageSlideshow";

describe("CrossImageSlideshow", () => {
  const sampleImages = [
    { src: "/test-front.webp", title: "Front View", alt: "Walking front" },
    { src: "/test-detail.webp", title: "Detail View", alt: "Walking detail" },
    { src: "/test-cedar.webp", title: "Cedar Backing", alt: "Walking cedar" },
  ];

  it("renders with accessible carousel roles and labels", () => {
    render(<CrossImageSlideshow images={sampleImages} title="Walking On Water" />);

    // Previous and Next buttons with accessible names
    expect(screen.getByRole("button", { name: /previous image/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /next image/i })).toBeInTheDocument();

    // Play/Pause button
    expect(screen.getByRole("button", { name: /pause automatic slideshow/i })).toBeInTheDocument();

    // Thumbnails
    expect(screen.getByRole("button", { name: /select Front View/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /select Cedar Backing/i })).toBeInTheDocument();

    // Thumbnail region
    expect(screen.getByRole("region", { name: /thumbnail previews/i })).toBeInTheDocument();
  });

  it("renders single image cleanly without carousel controls when only one image is supplied", () => {
    render(<CrossImageSlideshow images={[{ src: "/single.webp", alt: "Single Cross" }]} title="Single Cross" />);

    expect(screen.queryByRole("region", { name: /carousel/i })).not.toBeInTheDocument();
    expect(screen.getByAltText("Single Cross")).toBeInTheDocument();
  });
});

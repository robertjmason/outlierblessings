import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import JourneyOrderPage from "./JourneyOrderPage";

describe("JourneyOrderPage", () => {
  it("renders the Journey Christian School partnership header and order sections", () => {
    render(
      <MemoryRouter initialEntries={["/journey"]}>
        <JourneyOrderPage />
      </MemoryRouter>
    );

    expect(screen.getByText(/Journey Christian School Partnership/i)).toBeInTheDocument();
    expect(screen.getByText(/Christmas Crosses & Ornaments/i)).toBeInTheDocument();
    expect(screen.getByText(/10% of every order goes directly back to Journey Christian School!/i)).toBeInTheDocument();
    expect(screen.getByText(/1. Your Information/i)).toBeInTheDocument();
    expect(screen.getByText(/2. Christmas Crosses/i)).toBeInTheDocument();
    expect(screen.getByText(/3. Personalized Christmas Ornaments/i)).toBeInTheDocument();
    expect(screen.getByText(/4. Resin & Glass Crosses/i)).toBeInTheDocument();
    expect(screen.getByText(/5. Build Your Own Cross/i)).toBeInTheDocument();
    expect(screen.getByText(/6. Make It Personal/i)).toBeInTheDocument();
    expect(screen.getByText(/7. Delivery & Payment Method/i)).toBeInTheDocument();
  });
});

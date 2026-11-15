import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";
import VillageOrderPage from "./VillageOrderPage";

describe("VillageOrderPage", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it("renders the It Takes a Village header and all order sections matching the PDF", () => {
    render(
      <MemoryRouter initialEntries={["/village"]}>
        <VillageOrderPage />
      </MemoryRouter>
    );

    expect(screen.getByText(/It Takes a Village/i)).toBeInTheDocument();
    expect(screen.getByText(/Holiday Shop for a Cause/i)).toBeInTheDocument();
    expect(screen.getByText(/November 15, 2026/i)).toBeInTheDocument();
    expect(screen.getByText(/10% of every sale goes back to a cause I believe in\./i)).toBeInTheDocument();
    expect(screen.getByText(/tk@outlierblessings\.com/i)).toBeInTheDocument();
    expect(screen.getByText(/1\. Your Information/i)).toBeInTheDocument();
    expect(screen.getByText(/2\. Christmas Crosses/i)).toBeInTheDocument();
    expect(screen.getByText(/3\. Personalized Christmas Ornaments/i)).toBeInTheDocument();
    expect(screen.getByText(/4\. Resin & Glass Crosses/i)).toBeInTheDocument();
    expect(screen.getByText(/5\. Build Your Own Cross/i)).toBeInTheDocument();
    expect(screen.getByText(/6\. Make It Personal/i)).toBeInTheDocument();
    expect(screen.getByText(/7\. Pickup & Payment/i)).toBeInTheDocument();
    expect(screen.getByText(/@tkmc555/i)).toBeInTheDocument();
    expect(screen.getByText(/Terri-Kim Mason, 858-232-4588/i)).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Increase O Holy Night 20" quantity/i })).not.toBeInTheDocument();
    expect(screen.queryByText(/Student & Grade/i)).not.toBeInTheDocument();
  });

  it("calculates subtotal, 7.75% sales tax, total, and 10% cause contribution without pre-order discounts", () => {
    render(
      <MemoryRouter initialEntries={["/village"]}>
        <VillageOrderPage />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole("button", { name: /Increase O Holy Night 14" quantity/i }));
    fireEvent.click(screen.getByRole("button", { name: /Increase Wood Laser Ornament quantity/i }));
    fireEvent.click(screen.getByRole("button", { name: /Increase Resin Wave on Top 14" quantity/i }));

    // Subtotal = 75 + 10 + 150 = 235.00
    // Tax = 235 * 0.0775 = 18.2125 -> $18.21
    // Total = 253.2125 -> $253.21
    // Cause = 235 * 0.1 = $23.50
    expect(screen.getByText("$235.00")).toBeInTheDocument();
    expect(screen.getByText("$18.21")).toBeInTheDocument();
    expect(screen.getByText("$253.21")).toBeInTheDocument();
    expect(screen.getByText("$23.50")).toBeInTheDocument();
    expect(screen.getByLabelText(/Names for ornaments/i)).toBeInTheDocument();
  });

  it("shows other pickup details input when Other is selected", () => {
    render(
      <MemoryRouter initialEntries={["/village"]}>
        <VillageOrderPage />
      </MemoryRouter>
    );

    expect(screen.queryByLabelText(/Other pickup \/ delivery details/i)).not.toBeInTheDocument();
    fireEvent.click(screen.getByLabelText(/^Other$/i));
    expect(screen.getByLabelText(/Other pickup \/ delivery details/i)).toBeInTheDocument();
  });

  it("submits order to Netlify forms and renders the confirmation receipt", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(null, { status: 200 }));
    const dateNowSpy = vi.spyOn(Date, "now");
    dateNowSpy.mockReturnValueOnce(1_000_000);

    render(
      <MemoryRouter initialEntries={["/village"]}>
        <VillageOrderPage />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/Name \*/i), { target: { value: "Sarah Jenkins" } });
    fireEvent.change(screen.getByLabelText(/Phone \*/i), { target: { value: "858-555-0123" } });
    fireEvent.change(screen.getByLabelText(/Email \*/i), { target: { value: "sarah@example.com" } });
    fireEvent.change(screen.getByLabelText(/Needed by/i), { target: { value: "December 10" } });

    fireEvent.click(screen.getByRole("button", { name: /Increase O Holy Night 10" quantity/i }));

    // Simulate > 4 seconds elapsed on page
    dateNowSpy.mockReturnValue(1_010_000);

    fireEvent.click(screen.getByRole("button", { name: /Submit Order to TK/i }));

    await waitFor(() => {
      expect(screen.getByText(/Thank You for Your Order!/i)).toBeInTheDocument();
    });

    expect(fetchMock).toHaveBeenCalledWith(
      "/__forms.html",
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      })
    );

    const body = fetchMock.mock.calls[0]?.[1]?.body as string;
    expect(body).toContain("form-name=village-order");
    expect(body).toContain("orderId=ITV-");
    expect(screen.getByText(/Send Venmo to @tkmc555/i)).toBeInTheDocument();
  });
});

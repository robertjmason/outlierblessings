import { useState, useEffect, useMemo } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import {
  Sparkles,
  Heart,
  CheckCircle2,
  Gift,
  Plus,
  Minus,
  ShoppingBag,
  CreditCard,
  MapPin,
  Mail,
  Phone,
  Copy,
  Printer,
  HandHeart,
} from "lucide-react";
import {
  CEDAR_CROSS_OPTIONS,
  CEDAR_SIZES,
  RESIN_CROSS_OPTIONS,
  SALES_TAX_RATE,
} from "@/data/orderCatalog";

interface SubmittedVillageOrder {
  "form-name": string;
  "bot-field": string;
  orderId: string;
  name: string;
  phone: string;
  email: string;
  neededBy: string;
  orderSummary: string;
  ornamentNames: string;
  customIdea: string;
  familyName: string;
  bibleVerse: string;
  delivery: string;
  payment: string;
  subtotal: string;
  tax: string;
  total: string;
  causeDonation: string;
  itemsList: string[];
  createdDate: string;
}

const VillageOrderPage = () => {
  const { toast } = useToast();
  const [loadTime] = useState<number>(Date.now());
  const [submittedOrder, setSubmittedOrder] = useState<SubmittedVillageOrder | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Honeypot field for bot protection
  const [botField, setBotField] = useState("");

  // Section 1: Your Information
  const [contact, setContact] = useState({
    name: "",
    phone: "",
    email: "",
    neededBy: "",
  });

  // Section 2: Cedar Crosses
  const [cedarCrosses, setCedarCrosses] = useState<{ [id: string]: { [size: string]: number } }>(
    () =>
      CEDAR_CROSS_OPTIONS.reduce(
        (acc, opt) => ({ ...acc, [opt.id]: { '10"': 0, '14"': 0 } }),
        {}
      )
  );

  // Section 3: Personalized Christmas Ornaments
  const [woodOrnamentsQty, setWoodOrnamentsQty] = useState(0);
  const [resinOrnamentsQty, setResinOrnamentsQty] = useState(0);
  const [ornamentNames, setOrnamentNames] = useState("");

  // Section 4: Resin & Glass Crosses
  const [resinCrosses, setResinCrosses] = useState<{ [id: string]: { [size: string]: number } }>(
    () =>
      RESIN_CROSS_OPTIONS.reduce(
        (acc, opt) => ({ ...acc, [opt.id]: { '14"': 0, '20"': 0 } }),
        {}
      )
  );

  // Section 5: Build Your Own Cross
  const [hasCustomIdea, setHasCustomIdea] = useState(false);
  const [customIdea, setCustomIdea] = useState("");

  // Section 6: Make It Personal (engraved on the back of your cross)
  const [personalization, setPersonalization] = useState({
    familyName: "",
    bibleVerse: "",
  });

  // Section 7: Pickup & Payment
  const [pickupMethod, setPickupMethod] = useState<"tk-pickup" | "other">("tk-pickup");
  const [pickupOtherDetails, setPickupOtherDetails] = useState("");
  const [payment, setPayment] = useState<"venmo" | "zelle" | "cash">("venmo");

  const updateCedarQty = (crossId: string, size: string, delta: number) => {
    setCedarCrosses((prev) => {
      const current = prev[crossId]?.[size] || 0;
      const next = Math.max(0, current + delta);
      return {
        ...prev,
        [crossId]: {
          ...prev[crossId],
          [size]: next,
        },
      };
    });
  };

  const updateResinQty = (crossId: string, size: string, delta: number) => {
    setResinCrosses((prev) => {
      const current = prev[crossId]?.[size] || 0;
      const next = Math.max(0, current + delta);
      return {
        ...prev,
        [crossId]: {
          ...prev[crossId],
          [size]: next,
        },
      };
    });
  };

  const orderDetails = useMemo(() => {
    let subtotal = 0;
    let totalCedarCount = 0;
    const itemsList: string[] = [];

    CEDAR_CROSS_OPTIONS.forEach((opt) => {
      CEDAR_SIZES.forEach((s) => {
        const qty = cedarCrosses[opt.id]?.[s.label] || 0;
        if (qty > 0) {
          const itemCost = qty * s.price;
          subtotal += itemCost;
          totalCedarCount += qty;
          itemsList.push(`${opt.name} (${s.label}) x${qty} ($${itemCost})`);
        }
      });
    });

    if (woodOrnamentsQty > 0) {
      const woodCost = woodOrnamentsQty * 10;
      subtotal += woodCost;
      itemsList.push(`Wood Laser Ornament x${woodOrnamentsQty} ($${woodCost})`);
    }
    if (resinOrnamentsQty > 0) {
      const resinCost = resinOrnamentsQty * 15;
      subtotal += resinCost;
      itemsList.push(`Resin Ornament x${resinOrnamentsQty} ($${resinCost})`);
    }

    RESIN_CROSS_OPTIONS.forEach((opt) => {
      (['14"', '20"'] as const).forEach((size) => {
        const qty = resinCrosses[opt.id]?.[size] || 0;
        if (qty > 0) {
          const price = opt.prices[size];
          const cost = qty * price;
          subtotal += cost;
          itemsList.push(`${opt.name} (${size}) x${qty} ($${cost})`);
        }
      });
    });

    if (hasCustomIdea && customIdea.trim()) {
      itemsList.push(`Custom Design Request: "${customIdea.trim()}" (Estimate provided by TK)`);
    }

    const tax = subtotal * SALES_TAX_RATE;
    const total = subtotal + tax;
    const causeDonation = subtotal * 0.1;

    const totalItemCount =
      totalCedarCount +
      woodOrnamentsQty +
      resinOrnamentsQty +
      Object.values(resinCrosses).reduce(
        (acc, sizes) => acc + (sizes['14"'] || 0) + (sizes['20"'] || 0),
        0
      );

    return {
      subtotal,
      totalCedarCount,
      totalItemCount,
      itemsList,
      tax,
      total,
      causeDonation,
    };
  }, [cedarCrosses, woodOrnamentsQty, resinOrnamentsQty, resinCrosses, hasCustomIdea, customIdea]);

  // Set page robots tag to noindex, nofollow
  useEffect(() => {
    let metaRobots = document.querySelector('meta[name="robots"]') as HTMLMetaElement | null;
    const originalContent = metaRobots ? metaRobots.content : null;

    if (!metaRobots) {
      metaRobots = document.createElement("meta");
      metaRobots.name = "robots";
      document.head.appendChild(metaRobots);
    }
    metaRobots.content = "noindex, nofollow";

    document.title = "It Takes a Village Cross Order Form | Outlier Blessings";

    return () => {
      if (metaRobots) {
        if (originalContent) {
          metaRobots.content = originalContent;
        } else {
          metaRobots.remove();
        }
      }
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Anti-spam honeypot check
    if (botField.trim() !== "") {
      console.warn("Spam detected via honeypot.");
      toast({ title: "Order received!", description: "Thank you for your order." });
      return;
    }

    // 2. Anti-spam timing check (must be on page >= 4 seconds)
    const elapsedSeconds = (Date.now() - loadTime) / 1000;
    if (elapsedSeconds < 4) {
      toast({
        title: "Please take your time",
        description: "Submission was too fast. Please verify your order details before submitting.",
        variant: "destructive",
      });
      return;
    }

    // 3. Validation
    if (!contact.name.trim()) {
      toast({ title: "Name required", description: "Please enter your name.", variant: "destructive" });
      return;
    }
    if (!contact.phone.trim()) {
      toast({ title: "Phone number required", description: "Please enter your phone number.", variant: "destructive" });
      return;
    }
    if (!contact.email.trim() || !contact.email.includes("@")) {
      toast({ title: "Valid email required", description: "Please enter a valid email address.", variant: "destructive" });
      return;
    }

    if (orderDetails.totalItemCount === 0 && (!hasCustomIdea || !customIdea.trim())) {
      toast({
        title: "No items selected",
        description: "Please choose at least one cross, ornament, or describe a custom design.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    const orderId = `ITV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const itemsSummaryText = orderDetails.itemsList.join("\n");

    const deliverySummary =
      pickupMethod === "tk-pickup"
        ? "Pick up from TK"
        : pickupOtherDetails.trim()
          ? `Other: ${pickupOtherDetails.trim()}`
          : "Other (details to be arranged with TK)";

    const paymentLabel = payment === "venmo" ? "Venmo" : payment === "zelle" ? "Zelle" : "Cash";

    const payload = {
      "form-name": "village-order",
      "bot-field": botField,
      orderId,
      name: contact.name.trim(),
      phone: contact.phone.trim(),
      email: contact.email.trim(),
      neededBy: contact.neededBy.trim(),
      orderSummary: itemsSummaryText,
      ornamentNames: ornamentNames.trim(),
      customIdea: hasCustomIdea ? customIdea.trim() : "",
      familyName: personalization.familyName.trim(),
      bibleVerse: personalization.bibleVerse.trim(),
      delivery: deliverySummary,
      payment: paymentLabel,
      subtotal: orderDetails.subtotal.toFixed(2),
      tax: orderDetails.tax.toFixed(2),
      total: orderDetails.total.toFixed(2),
      causeDonation: orderDetails.causeDonation.toFixed(2),
    };

    try {
      const formBody = new URLSearchParams(payload as Record<string, string>).toString();
      const netlifyPromise = fetch("/__forms.html", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formBody,
      }).catch((err) => console.warn("Netlify form post error:", err));

      const webhookUrl = import.meta.env.VITE_GOOGLE_SHEETS_WEBHOOK_URL;
      let sheetsPromise = Promise.resolve();
      if (webhookUrl) {
        sheetsPromise = fetch(webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "text/plain;charset=utf-8" },
          body: JSON.stringify(payload),
        }).catch((err) => console.warn("Google Sheets webhook error:", err));
      }

      await Promise.all([netlifyPromise, sheetsPromise]);

      setSubmittedOrder({
        ...payload,
        itemsList: orderDetails.itemsList,
        createdDate: new Date().toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        }),
      });

      toast({
        title: "Order Submitted!",
        description: `Thank you! Your order #${orderId} has been received.`,
      });

      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      console.error("Submission error:", error);
      toast({
        title: "Submission error",
        description: "There was an issue submitting your order. Please email tk@outlierblessings.com or call 858-232-4588.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${label} copied to clipboard.`,
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
          {/* Header Banner */}
          <div className="text-center space-y-4 mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs sm:text-sm font-medium">
              <HandHeart className="w-4 h-4" />
              <span>It Takes a Village • Holiday Shop for a Cause • November 15, 2026</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl font-light tracking-tight text-foreground">
              Cross Order Form
            </h1>

            <p className="font-serif italic text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
              10% of every sale goes back to a cause I believe in.
            </p>

            <div className="flex flex-wrap justify-center items-center gap-x-5 gap-y-2 text-xs sm:text-sm text-muted-foreground pt-1">
              <span className="flex items-center gap-1.5">
                <Phone className="w-4 h-4 text-primary" />
                Call TK at{" "}
                <a href="tel:858-232-4588" className="font-medium text-foreground hover:underline">
                  858-232-4588
                </a>
              </span>
              <span className="flex items-center gap-1.5">
                <Mail className="w-4 h-4 text-primary" />
                Email{" "}
                <a href="mailto:tk@outlierblessings.com" className="font-medium text-foreground hover:underline">
                  tk@outlierblessings.com
                </a>
              </span>
            </div>
          </div>

          {submittedOrder ? (
            <Card className="border-border shadow-md" role="status" aria-live="polite">
              <CardHeader className="text-center space-y-3 pb-4">
                <div className="w-16 h-16 rounded-full bg-green-100 text-green-700 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <CardTitle className="font-serif text-3xl font-light text-foreground">
                  Thank You for Your Order!
                </CardTitle>
                <CardDescription className="text-base text-muted-foreground max-w-lg mx-auto">
                  Your order has been recorded. 10% of every sale goes back to a cause I believe in.
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="bg-muted/50 p-4 sm:p-6 rounded-lg space-y-4 border border-border">
                  <div className="flex flex-wrap justify-between items-center gap-2 border-b border-border pb-3">
                    <span className="text-sm text-muted-foreground">Order Reference:</span>
                    <span className="font-mono font-semibold text-foreground text-base flex items-center gap-1.5">
                      {submittedOrder.orderId}
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        className="h-6 w-6"
                        onClick={() => copyToClipboard(submittedOrder.orderId, "Order ID")}
                        title="Copy Order ID"
                        aria-label="Copy Order ID"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </Button>
                    </span>
                  </div>
                  <div className="flex flex-wrap justify-between items-center gap-2 border-b border-border pb-3">
                    <span className="text-sm text-muted-foreground">Contact:</span>
                    <span className="font-medium text-foreground">
                      {submittedOrder.name} ({submittedOrder.phone})
                    </span>
                  </div>
                  {submittedOrder.neededBy && (
                    <div className="flex flex-wrap justify-between items-center gap-2 border-b border-border pb-3">
                      <span className="text-sm text-muted-foreground">Needed By:</span>
                      <span className="font-medium text-foreground">{submittedOrder.neededBy}</span>
                    </div>
                  )}
                  <div className="flex flex-wrap justify-between items-center gap-2 border-b border-border pb-3">
                    <span className="text-sm text-muted-foreground">Pickup:</span>
                    <span className="font-medium text-foreground">{submittedOrder.delivery}</span>
                  </div>
                  <div className="flex flex-wrap justify-between items-center gap-2 border-b border-border pb-3">
                    <span className="text-sm text-muted-foreground">Total Due:</span>
                    <span className="font-serif text-2xl font-semibold text-primary">${submittedOrder.total}</span>
                  </div>
                  <div className="flex flex-wrap justify-between items-center gap-2 text-green-700 font-medium">
                    <span className="text-sm">10% Cause Contribution:</span>
                    <span>${submittedOrder.causeDonation}</span>
                  </div>
                </div>

                {/* Items Breakdown */}
                <div className="space-y-2">
                  <h4 className="font-serif text-lg font-medium text-foreground">Items in Your Order:</h4>
                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                    {submittedOrder.itemsList.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                  {submittedOrder.ornamentNames && (
                    <p className="text-sm text-muted-foreground pt-1">
                      <strong>Names for Ornaments:</strong> {submittedOrder.ornamentNames}
                    </p>
                  )}
                  {(submittedOrder.familyName || submittedOrder.bibleVerse) && (
                    <p className="text-sm text-muted-foreground pt-1">
                      <strong>Back Engraving:</strong>{" "}
                      {submittedOrder.familyName ? `"${submittedOrder.familyName}"` : ""}
                      {submittedOrder.familyName && submittedOrder.bibleVerse ? " • " : ""}
                      {submittedOrder.bibleVerse ? `Verse: ${submittedOrder.bibleVerse}` : ""}
                    </p>
                  )}
                </div>

                {/* Payment Instructions */}
                <div className="border border-primary/20 bg-primary/5 p-5 rounded-lg space-y-3">
                  <h4 className="font-serif text-lg font-medium text-foreground flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-primary" />
                    Payment Details
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Total Due: <strong>${submittedOrder.total}</strong> via <strong>{submittedOrder.payment}</strong>.{" "}
                    {submittedOrder.payment === "Cash"
                      ? "Please bring cash with you at the time of pickup."
                      : submittedOrder.payment === "Venmo"
                        ? "Send Venmo to @tkmc555, or TK will follow up with you directly."
                        : "Send Zelle to Terri-Kim Mason (858-232-4588), or TK will follow up with you directly."}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => window.print()}
                  >
                    <Printer className="w-4 h-4 mr-2" />
                    Print Order Receipt
                  </Button>
                  <Button
                    type="button"
                    className="flex-1 bg-primary text-primary-foreground hover:bg-navy-light"
                    onClick={() => {
                      setSubmittedOrder(null);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                  >
                    Place Another Order
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <form onSubmit={handleSubmit} method="POST" data-netlify="true" name="village-order">
              {/* Netlify & Anti-spam hidden inputs */}
              <input type="hidden" name="form-name" value="village-order" />
              <div style={{ display: "none" }} aria-hidden="true">
                <label>
                  Leave this empty:
                  <input
                    name="bot-field"
                    value={botField}
                    onChange={(e) => setBotField(e.target.value)}
                    tabIndex={-1}
                    autoComplete="off"
                  />
                </label>
              </div>

              {/* 2-Column Responsive Layout: Form on Left, Calculation on Right */}
              <div className="lg:grid lg:grid-cols-12 lg:gap-8 items-start">
                {/* Left Column: Form Sections 1 to 7 */}
                <div className="lg:col-span-7 xl:col-span-8 space-y-8">
                  {/* SECTION 1: Your Information */}
                  <Card className="border-border">
                    <CardHeader>
                      <CardTitle className="font-serif text-2xl font-light text-foreground flex items-center gap-2">
                        <HandHeart className="w-5 h-5 text-primary" />
                        1. Your Information
                      </CardTitle>
                      <CardDescription>
                        Please provide your contact details and when you need your order by.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="customer-name">Name *</Label>
                          <Input
                            id="customer-name"
                            name="name"
                            required
                            autoComplete="name"
                            value={contact.name}
                            onChange={(e) => setContact({ ...contact, name: e.target.value })}
                            placeholder="e.g. Sarah Jenkins"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="customer-phone">Phone *</Label>
                          <Input
                            id="customer-phone"
                            name="phone"
                            type="tel"
                            required
                            autoComplete="tel"
                            value={contact.phone}
                            onChange={(e) => setContact({ ...contact, phone: e.target.value })}
                            placeholder="e.g. 858-555-0123"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="customer-email">Email *</Label>
                          <Input
                            id="customer-email"
                            name="email"
                            type="email"
                            required
                            autoComplete="email"
                            autoCorrect="off"
                            autoCapitalize="none"
                            spellCheck={false}
                            value={contact.email}
                            onChange={(e) => setContact({ ...contact, email: e.target.value })}
                            placeholder="e.g. sarah@example.com"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="needed-by">Needed by</Label>
                          <Input
                            id="needed-by"
                            name="neededBy"
                            value={contact.neededBy}
                            onChange={(e) => setContact({ ...contact, neededBy: e.target.value })}
                            placeholder="e.g. December 15"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* SECTION 2: Christmas Crosses (All on Cedar and Engraved) */}
                  <Card className="border-border">
                    <CardHeader>
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <CardTitle className="font-serif text-2xl font-light text-foreground flex items-center gap-2">
                          <Gift className="w-5 h-5 text-primary" />
                          2. Christmas Crosses
                        </CardTitle>
                        <Badge variant="secondary" className="font-sans text-xs">
                          All on Cedar & Engraved
                        </Badge>
                      </div>
                      <CardDescription>
                        Select quantities for any sizes you wish to order (10&quot; is $50, 14&quot; is $75).
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {CEDAR_CROSS_OPTIONS.map((cross) => (
                        <div
                          key={cross.id}
                          className="p-4 rounded-lg bg-card border border-border/80 hover:border-primary/40 transition-colors space-y-3"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div className="flex items-center gap-3">
                              {"preview" in cross && cross.preview && (
                                <img
                                  src={cross.preview}
                                  alt={cross.name}
                                  className="w-12 h-12 object-cover rounded shadow-sm shrink-0 border border-border"
                                />
                              )}
                              <div>
                                <h4 className="font-serif text-lg font-medium text-foreground">{cross.name}</h4>
                                <p className="text-xs text-muted-foreground">Handcrafted solid cedar wood</p>
                              </div>
                            </div>
                          </div>

                          {/* Size selectors */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                            {CEDAR_SIZES.map((size) => {
                              const currentQty = cedarCrosses[cross.id]?.[size.label] || 0;
                              return (
                                <div
                                  key={size.label}
                                  className={`flex items-center justify-between p-2.5 rounded border transition-all ${
                                    currentQty > 0
                                      ? "border-primary bg-primary/5 text-foreground"
                                      : "border-border/70 bg-background text-muted-foreground"
                                  }`}
                                >
                                  <div className="space-y-0.5">
                                    <span className="text-sm font-semibold text-foreground">{size.label}</span>
                                    <span className="text-xs text-muted-foreground block">${size.price}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Button
                                      type="button"
                                      size="icon"
                                      variant="outline"
                                      className="h-7 w-7 rounded-full"
                                      disabled={currentQty === 0}
                                      aria-label={`Decrease ${cross.name} ${size.label} quantity`}
                                      onClick={() => updateCedarQty(cross.id, size.label, -1)}
                                    >
                                      <Minus className="w-3.5 h-3.5" />
                                    </Button>
                                    <span className="font-mono text-sm w-5 text-center font-medium text-foreground">
                                      {currentQty}
                                    </span>
                                    <Button
                                      type="button"
                                      size="icon"
                                      variant="outline"
                                      className="h-7 w-7 rounded-full hover:bg-primary hover:text-primary-foreground"
                                      aria-label={`Increase ${cross.name} ${size.label} quantity`}
                                      onClick={() => updateCedarQty(cross.id, size.label, 1)}
                                    >
                                      <Plus className="w-3.5 h-3.5" />
                                    </Button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                      <p className="text-xs text-muted-foreground italic">
                        See them all at{" "}
                        <a href="/" className="underline hover:text-foreground">
                          OutlierBlessings.com
                        </a>
                        .
                      </p>
                    </CardContent>
                  </Card>

                  {/* SECTION 3: Personalized Christmas Ornaments */}
                  <Card className="border-border">
                    <CardHeader>
                      <CardTitle className="font-serif text-2xl font-light text-foreground flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-primary" />
                        3. Personalized Christmas Ornaments
                      </CardTitle>
                      <CardDescription>
                        Add names below for any ornaments you select.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Wood Laser Ornament */}
                        <div
                          className={`p-4 rounded-lg border flex items-center justify-between ${
                            woodOrnamentsQty > 0 ? "border-primary bg-primary/5" : "border-border bg-card"
                          }`}
                        >
                          <div>
                            <h4 className="font-serif text-base font-medium text-foreground">Wood Laser Ornament</h4>
                            <p className="text-xs text-muted-foreground">$10 each</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              type="button"
                              size="icon"
                              variant="outline"
                              className="h-8 w-8 rounded-full"
                              disabled={woodOrnamentsQty === 0}
                              aria-label="Decrease Wood Laser Ornament quantity"
                              onClick={() => setWoodOrnamentsQty((q) => Math.max(0, q - 1))}
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </Button>
                            <span className="font-mono text-sm w-6 text-center font-medium">
                              {woodOrnamentsQty}
                            </span>
                            <Button
                              type="button"
                              size="icon"
                              variant="outline"
                              className="h-8 w-8 rounded-full hover:bg-primary hover:text-primary-foreground"
                              aria-label="Increase Wood Laser Ornament quantity"
                              onClick={() => setWoodOrnamentsQty((q) => q + 1)}
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </div>

                        {/* Resin Ornament */}
                        <div
                          className={`p-4 rounded-lg border flex items-center justify-between ${
                            resinOrnamentsQty > 0 ? "border-primary bg-primary/5" : "border-border bg-card"
                          }`}
                        >
                          <div>
                            <h4 className="font-serif text-base font-medium text-foreground">Resin Ornament</h4>
                            <p className="text-xs text-muted-foreground">$15 each</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              type="button"
                              size="icon"
                              variant="outline"
                              className="h-8 w-8 rounded-full"
                              disabled={resinOrnamentsQty === 0}
                              aria-label="Decrease Resin Ornament quantity"
                              onClick={() => setResinOrnamentsQty((q) => Math.max(0, q - 1))}
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </Button>
                            <span className="font-mono text-sm w-6 text-center font-medium">
                              {resinOrnamentsQty}
                            </span>
                            <Button
                              type="button"
                              size="icon"
                              variant="outline"
                              className="h-8 w-8 rounded-full hover:bg-primary hover:text-primary-foreground"
                              aria-label="Increase Resin Ornament quantity"
                              onClick={() => setResinOrnamentsQty((q) => q + 1)}
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </div>
                      </div>

                      {(woodOrnamentsQty > 0 || resinOrnamentsQty > 0) && (
                        <div className="space-y-2 pt-2 animate-in fade-in-50">
                          <Label htmlFor="ornament-names">Names for ornaments</Label>
                          <Input
                            id="ornament-names"
                            name="ornamentNames"
                            value={ornamentNames}
                            onChange={(e) => setOrnamentNames(e.target.value)}
                            placeholder="e.g. Mason, Emily, Grandad, etc."
                          />
                          <p className="text-xs text-muted-foreground">
                            Please list the names you&apos;d like on your ornaments.
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* SECTION 4: Resin & Glass Crosses */}
                  <Card className="border-border">
                    <CardHeader>
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <CardTitle className="font-serif text-2xl font-light text-foreground flex items-center gap-2">
                          <Heart className="w-5 h-5 text-primary" />
                          4. Resin &amp; Glass Crosses
                        </CardTitle>
                        <Badge variant="secondary" className="font-sans text-xs">
                          All on Cedar • Back Engraving Included
                        </Badge>
                      </div>
                      <CardDescription>
                        Every resin and glass cross includes your family name and chosen Bible verse on the back.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-5">
                      {RESIN_CROSS_OPTIONS.map((cross) => (
                        <div
                          key={cross.id}
                          className="p-4 rounded-lg bg-card border border-border/80 hover:border-primary/40 transition-colors space-y-3"
                        >
                          <div className="flex items-center gap-3">
                            {"preview" in cross && cross.preview && (
                              <img
                                src={cross.preview}
                                alt={cross.name}
                                className="w-12 h-12 object-cover rounded shadow-sm shrink-0 border border-border"
                              />
                            )}
                            <h4 className="font-serif text-lg font-medium text-foreground">{cross.name}</h4>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                            {(['14"', '20"'] as const).map((size) => {
                              const price = cross.prices[size];
                              const currentQty = resinCrosses[cross.id]?.[size] || 0;
                              return (
                                <div
                                  key={size}
                                  className={`flex items-center justify-between p-2.5 rounded border transition-all ${
                                    currentQty > 0
                                      ? "border-primary bg-primary/5 text-foreground"
                                      : "border-border/70 bg-background text-muted-foreground"
                                  }`}
                                >
                                  <div className="space-y-0.5">
                                    <span className="text-sm font-semibold text-foreground">{size}</span>
                                    <span className="text-xs text-muted-foreground block">${price}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Button
                                      type="button"
                                      size="icon"
                                      variant="outline"
                                      className="h-7 w-7 rounded-full"
                                      disabled={currentQty === 0}
                                      aria-label={`Decrease ${cross.name} ${size} quantity`}
                                      onClick={() => updateResinQty(cross.id, size, -1)}
                                    >
                                      <Minus className="w-3.5 h-3.5" />
                                    </Button>
                                    <span className="font-mono text-sm w-5 text-center font-medium text-foreground">
                                      {currentQty}
                                    </span>
                                    <Button
                                      type="button"
                                      size="icon"
                                      variant="outline"
                                      className="h-7 w-7 rounded-full hover:bg-primary hover:text-primary-foreground"
                                      aria-label={`Increase ${cross.name} ${size} quantity`}
                                      onClick={() => updateResinQty(cross.id, size, 1)}
                                    >
                                      <Plus className="w-3.5 h-3.5" />
                                    </Button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  {/* SECTION 5: Build Your Own Cross */}
                  <Card className="border-border">
                    <CardHeader>
                      <CardTitle className="font-serif text-2xl font-light text-foreground flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-primary" />
                        5. Build Your Own Cross
                      </CardTitle>
                      <CardDescription>
                        I personally design crosses for births, baptisms, dedications, memorials and weddings. You think of it, I will make it!
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="custom-cross-toggle"
                          checked={hasCustomIdea}
                          onCheckedChange={(checked) => setHasCustomIdea(Boolean(checked))}
                        />
                        <Label htmlFor="custom-cross-toggle" className="cursor-pointer font-medium">
                          I have a custom cross idea I&apos;d like TK to design
                        </Label>
                      </div>

                      {hasCustomIdea && (
                        <div className="space-y-2 pt-2 animate-in fade-in-50">
                          <Label htmlFor="custom-idea-text">Describe your idea</Label>
                          <Textarea
                            id="custom-idea-text"
                            name="customIdea"
                            rows={3}
                            value={customIdea}
                            onChange={(e) => setCustomIdea(e.target.value)}
                            placeholder="Tell TK about the occasion, colors, special elements, or message..."
                          />
                          <p className="text-xs text-muted-foreground">
                            TK will contact you personally to review details and provide an exact quote.
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* SECTION 6: Make It Personal (engraved on the back of your cross) */}
                  <Card className="border-border">
                    <CardHeader>
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <CardTitle className="font-serif text-2xl font-light text-foreground">
                          6. Make It Personal
                        </CardTitle>
                        <Badge variant="outline" className="text-xs">
                          Engraved on the back of your cross
                        </Badge>
                      </div>
                      <CardDescription>
                        Personalize your cross with your family name and Bible verse &amp; reference.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="family-name">Family name</Label>
                        <Input
                          id="family-name"
                          name="familyName"
                          value={personalization.familyName}
                          onChange={(e) => setPersonalization({ ...personalization, familyName: e.target.value })}
                          placeholder="e.g. The Mason Family"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="bible-verse">Bible verse &amp; reference</Label>
                        <Input
                          id="bible-verse"
                          name="bibleVerse"
                          value={personalization.bibleVerse}
                          onChange={(e) => setPersonalization({ ...personalization, bibleVerse: e.target.value })}
                          placeholder="e.g. Joshua 24:15 - As for me and my house, we will serve the Lord."
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {/* SECTION 7: Pickup & Payment */}
                  <Card className="border-border">
                    <CardHeader>
                      <CardTitle className="font-serif text-2xl font-light text-foreground flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-primary" />
                        7. Pickup &amp; Payment
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Pickup */}
                      <fieldset className="space-y-3">
                        <legend className="text-sm font-semibold text-foreground">Pickup</legend>
                        <RadioGroup
                          value={pickupMethod}
                          onValueChange={(val) => setPickupMethod(val as "tk-pickup" | "other")}
                          className="space-y-2"
                        >
                          <div className="flex items-center space-x-2 p-3 rounded-lg border border-border bg-card cursor-pointer hover:border-primary/40">
                            <RadioGroupItem value="tk-pickup" id="pickup-tk" />
                            <Label htmlFor="pickup-tk" className="cursor-pointer text-sm font-medium flex-1">
                              Pick up from TK
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2 p-3 rounded-lg border border-border bg-card cursor-pointer hover:border-primary/40">
                            <RadioGroupItem value="other" id="pickup-other" />
                            <Label htmlFor="pickup-other" className="cursor-pointer text-sm font-medium flex-1">
                              Other
                            </Label>
                          </div>
                        </RadioGroup>

                        {pickupMethod === "other" && (
                          <div className="space-y-2 pt-1 animate-in fade-in-50">
                            <Label htmlFor="pickup-other-details">Other pickup / delivery details</Label>
                            <Input
                              id="pickup-other-details"
                              value={pickupOtherDetails}
                              onChange={(e) => setPickupOtherDetails(e.target.value)}
                              placeholder="Let TK know your preferred pickup or delivery arrangement"
                            />
                          </div>
                        )}
                      </fieldset>

                      <Separator />

                      {/* Payment */}
                      <fieldset className="space-y-3">
                        <legend className="text-sm font-semibold text-foreground">Payment</legend>
                        <RadioGroup
                          value={payment}
                          onValueChange={(val) => setPayment(val as "venmo" | "zelle" | "cash")}
                          className="grid grid-cols-1 sm:grid-cols-3 gap-3"
                        >
                          <div className="flex items-center space-x-2 p-3 rounded-lg border border-border bg-card cursor-pointer hover:border-primary/40">
                            <RadioGroupItem value="cash" id="payment-cash" />
                            <Label htmlFor="payment-cash" className="cursor-pointer text-sm font-medium">
                              Cash
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2 p-3 rounded-lg border border-border bg-card cursor-pointer hover:border-primary/40">
                            <RadioGroupItem value="zelle" id="payment-zelle" />
                            <Label htmlFor="payment-zelle" className="cursor-pointer text-sm font-medium">
                              Zelle
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2 p-3 rounded-lg border border-border bg-card cursor-pointer hover:border-primary/40">
                            <RadioGroupItem value="venmo" id="payment-venmo" />
                            <Label htmlFor="payment-venmo" className="cursor-pointer text-sm font-medium">
                              Venmo
                            </Label>
                          </div>
                        </RadioGroup>
                        <p className="text-xs text-muted-foreground">
                          Venmo: <span className="font-medium text-foreground">@tkmc555</span> &nbsp;|&nbsp; Zelle:{" "}
                          <span className="font-medium text-foreground">Terri-Kim Mason, 858-232-4588</span>
                        </p>
                      </fieldset>
                    </CardContent>
                  </Card>
                </div>

                {/* Right Column: Sticky Order Calculation Sidebar */}
                <div className="lg:col-span-5 xl:col-span-4 mt-8 lg:mt-0 lg:sticky lg:top-24 space-y-4">
                  <Card className="border-primary/40 bg-card shadow-md">
                    <CardContent className="pt-6 pb-6 space-y-4">
                      <div className="flex items-center justify-between border-b border-border pb-3">
                        <div className="flex items-center gap-2">
                          <ShoppingBag className="w-5 h-5 text-primary" />
                          <span className="font-serif text-lg font-medium text-foreground">Order Calculation</span>
                        </div>
                        <Badge variant="outline" className="font-mono text-xs">
                          {orderDetails.totalItemCount} {orderDetails.totalItemCount === 1 ? "item" : "items"}
                        </Badge>
                      </div>

                      {orderDetails.itemsList.length > 0 && (
                        <div className="max-h-40 overflow-y-auto space-y-1.5 text-xs text-muted-foreground border-b border-border pb-3">
                          {orderDetails.itemsList.map((item, idx) => (
                            <div key={idx} className="flex justify-between items-start gap-2">
                              <span className="line-clamp-1 flex-1">• {item}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="space-y-1.5 text-sm">
                        <div className="flex justify-between text-muted-foreground">
                          <span>Subtotal:</span>
                          <span className="font-mono font-medium text-foreground">
                            ${orderDetails.subtotal.toFixed(2)}
                          </span>
                        </div>

                        <div className="flex justify-between text-muted-foreground">
                          <span>Sales Tax (7.75%):</span>
                          <span className="font-mono font-medium text-foreground">
                            ${orderDetails.tax.toFixed(2)}
                          </span>
                        </div>

                        <Separator className="my-2" />

                        <div className="flex justify-between items-baseline pt-1">
                          <span className="font-serif text-xl font-medium text-foreground">Total:</span>
                          <span className="font-serif text-2xl sm:text-3xl font-semibold text-primary">
                            ${orderDetails.total.toFixed(2)}
                          </span>
                        </div>

                        {/* 10% Cause donation impact badge */}
                        <div className="p-2.5 rounded bg-green-50 border border-green-200 text-green-800 text-xs sm:text-sm flex items-center justify-between mt-2">
                          <span className="font-medium flex items-center gap-1.5">
                            <HandHeart className="w-4 h-4 text-green-700" />
                            10% Cause Contribution:
                          </span>
                          <span className="font-mono font-bold text-green-800">
                            ${orderDetails.causeDonation.toFixed(2)}
                          </span>
                        </div>
                      </div>

                      <p className="text-xs text-muted-foreground text-center italic pt-1">
                        &ldquo;Every cross is made to order, prayed over, and perfectly imperfect, knots and all.&rdquo; — TK The Tardigrade
                      </p>

                      <Button
                        type="submit"
                        disabled={
                          isSubmitting ||
                          (orderDetails.totalItemCount === 0 && (!hasCustomIdea || !customIdea.trim()))
                        }
                        className="w-full h-12 text-base font-medium bg-primary text-primary-foreground hover:bg-navy-light shadow-md transition-all"
                      >
                        {isSubmitting ? "Submitting Order..." : "Submit Order to TK"}
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </form>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default VillageOrderPage;

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
  Calendar,
  Gift,
  Plus,
  Minus,
  School,
  ShoppingBag,
  CreditCard,
  MapPin,
  Clock,
  Phone,
  Mail,
  Copy,
  Printer,
} from "lucide-react";
import oHolyNightImg from "@/assets/o-holy-night.jpg";
import shatteredImg from "@/assets/shattered1.png";

// Types
interface CedarCrossItem {
  id: string;
  name: string;
  sizes: { [size: string]: number }; // size -> qty
}

interface ResinCrossItem {
  id: string;
  name: string;
  sizes: { [size: string]: number }; // size -> qty
}

const CEDAR_CROSS_OPTIONS = [
  { id: "o-holy-night", name: "O Holy Night", preview: oHolyNightImg },
  { id: "angels-we-have-heard", name: "Angels We Have Heard on High" },
  { id: "o-little-town", name: "O Little Town of Bethlehem" },
  { id: "o-come-emmanuel", name: "O Come, O Come, Emmanuel" },
  { id: "silent-night", name: "Silent Night" },
];

const CEDAR_SIZES = [
  { label: '10"', price: 50 },
  { label: '14"', price: 75 },
  { label: '20"', price: 125 },
];

const RESIN_CROSS_OPTIONS = [
  { id: "resin-wave", name: "Resin Wave on Top", prices: { '14"': 150, '20"': 225 } },
  { id: "full-resin", name: "Full Resin", prices: { '14"': 175, '20"': 250 } },
  { id: "shattered-top-bottom", name: "Shattered Glass Top & Bottom, verse on front", prices: { '14"': 250, '20"': 325 } },
  { id: "full-shattered", name: "Full Shattered Glass", prices: { '14"': 275, '20"': 350 } },
  { id: "full-resin-shattered", name: "Full Resin & Shattered Glass", prices: { '14"': 325, '20"': 400 } },
];

const SALES_TAX_RATE = 0.0775; // 7.75% per form

const JourneyOrderPage = () => {
  const { toast } = useToast();
  const [loadTime] = useState<number>(Date.now());
  const [submittedOrder, setSubmittedOrder] = useState<any | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Honeypot field for bot protection
  const [botField, setBotField] = useState("");

  // Contact Info
  const [contact, setContact] = useState({
    name: "",
    phone: "",
    email: "",
    studentGrade: "",
  });

  // Cedar Crosses: { [crossId]: { '10"': qty, '14"': qty, '20"': qty } }
  const [cedarCrosses, setCedarCrosses] = useState<{ [id: string]: { [size: string]: number } }>(
    CEDAR_CROSS_OPTIONS.reduce((acc, opt) => ({ ...acc, [opt.id]: { '10"': 0, '14"': 0, '20"': 0 } }), {})
  );

  // Ornaments
  const [woodOrnamentsQty, setWoodOrnamentsQty] = useState(0);
  const [resinOrnamentsQty, setResinOrnamentsQty] = useState(0);
  const [ornamentNames, setOrnamentNames] = useState("");

  // Resin & Glass Crosses: { [crossId]: { '14"': qty, '20"': qty } }
  const [resinCrosses, setResinCrosses] = useState<{ [id: string]: { [size: string]: number } }>(
    RESIN_CROSS_OPTIONS.reduce((acc, opt) => ({ ...acc, [opt.id]: { '14"': 0, '20"': 0 } }), {})
  );

  // Custom Idea
  const [hasCustomIdea, setHasCustomIdea] = useState(false);
  const [customIdea, setCustomIdea] = useState("");

  // Personalization on back
  const [personalization, setPersonalization] = useState({
    familyName: "",
    neededBy: "Journey Christmas Market (Dec 2)",
    bibleVerse: "",
  });

  // Delivery & Payment
  const [delivery, setDelivery] = useState("booth-dec-2");
  const [payment, setPayment] = useState("venmo");

  // Determine if pre-order deadline (Oct 30) is active
  // If current date is on or before Oct 30, discount applies
  const isEarlyBird = useMemo(() => {
    const now = new Date();
    // Default to true for current season or when month is before November
    // In October (month 9 zero-indexed), up to day 30:
    const month = now.getMonth();
    const day = now.getDate();
    if (month < 9) return true; // Before October
    if (month === 9 && day <= 30) return true; // Oct 1 - Oct 30
    return false; // After Oct 30
  }, []);

  // Update Cedar Qty
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

  // Update Resin Qty
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

  // Calculations
  const orderDetails = useMemo(() => {
    let subtotal = 0;
    let totalCedarCount = 0;
    const itemsList: string[] = [];

    // 1. Cedar Crosses
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

    // 2. Ornaments
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

    // 3. Resin & Glass Crosses
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

    // 4. Custom Cross Idea
    if (hasCustomIdea && customIdea.trim()) {
      itemsList.push(`Custom Design Request: "${customIdea.trim()}" (Estimate provided by TK)`);
    }

    // 5. Engraving after Oct 30 ($15 per cedar cross if after Oct 30)
    const engravingFee = !isEarlyBird && totalCedarCount > 0 ? totalCedarCount * 15 : 0;

    // 6. 10% Discount if pre-ordered on/by Oct 30
    const discount = isEarlyBird ? subtotal * 0.1 : 0;
    const discountedSubtotal = Math.max(0, subtotal - discount + engravingFee);

    // 7. Sales Tax (7.75% applied after discount)
    const tax = discountedSubtotal * SALES_TAX_RATE;
    const total = discountedSubtotal + tax;

    // 8. 10% donation back to Journey Christian School (based on order total before tax)
    const schoolDonation = discountedSubtotal * 0.1;

    const totalItemCount = totalCedarCount + woodOrnamentsQty + resinOrnamentsQty +
      Object.values(resinCrosses).reduce(
        (acc, sizes) => acc + (sizes['14"'] || 0) + (sizes['20"'] || 0),
        0
      );

    return {
      subtotal,
      totalCedarCount,
      totalItemCount,
      itemsList,
      engravingFee,
      discount,
      tax,
      total,
      schoolDonation,
    };
  }, [
    cedarCrosses,
    woodOrnamentsQty,
    resinOrnamentsQty,
    resinCrosses,
    hasCustomIdea,
    customIdea,
    isEarlyBird,
  ]);

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

    document.title = "Journey Christian School Christmas Order Form | Outlier Blessings";

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
      // Pretend success so bot departs without retrying
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
    if (!contact.studentGrade.trim()) {
      toast({
        title: "Student name & grade required",
        description: "Please specify the student name and grade so Journey Christian School receives credit.",
        variant: "destructive",
      });
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

    const orderId = `JCS-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const itemsSummaryText = orderDetails.itemsList.join("\n");

    const payload = {
      "form-name": "journey-christmas-order",
      "bot-field": botField,
      orderId: orderId,
      name: contact.name.trim(),
      phone: contact.phone.trim(),
      email: contact.email.trim(),
      studentGrade: contact.studentGrade.trim(),
      orderSummary: itemsSummaryText,
      ornamentNames: ornamentNames.trim(),
      customIdea: hasCustomIdea ? customIdea.trim() : "",
      familyName: personalization.familyName.trim(),
      neededBy: personalization.neededBy.trim(),
      bibleVerse: personalization.bibleVerse.trim(),
      delivery: delivery === "booth-dec-2" ? "Pick up at Booth, Journey Christmas Market (Dec 2)" : "Pick up from TK",
      payment: payment === "venmo" ? "Venmo" : payment === "zelle" ? "Zelle" : "Cash",
      subtotal: orderDetails.subtotal.toFixed(2),
      engravingFee: orderDetails.engravingFee.toFixed(2),
      discount: orderDetails.discount.toFixed(2),
      tax: orderDetails.tax.toFixed(2),
      total: orderDetails.total.toFixed(2),
      schoolDonation: orderDetails.schoolDonation.toFixed(2),
    };

    try {
      // 1. Submit to Netlify Forms (URL-encoded)
      const formBody = new URLSearchParams(payload as Record<string, string>).toString();
      const netlifyPromise = fetch("/__forms.html", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formBody,
      }).catch((err) => console.warn("Netlify form post error:", err));

      // 2. Submit to Google Apps Script Webhook for Google Sheets logging (if configured)
      const webhookUrl = import.meta.env.VITE_GOOGLE_SHEETS_WEBHOOK_URL;
      let sheetsPromise = Promise.resolve();
      if (webhookUrl) {
        // Use text/plain or json to avoid CORS preflight hurdles in Apps Script
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
        description: "There was an issue submitting your order. Please call TK at 858-232-4588 or email tk@outlierblessings.com.",
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
        <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
          {/* Header Banner */}
          <div className="text-center space-y-4 mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs sm:text-sm font-medium">
              <School className="w-4 h-4" />
              <span>Journey Christian School Partnership</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl font-light tracking-tight text-foreground">
              Christmas Crosses & Ornaments
            </h1>

            <p className="font-serif italic text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
              10% of every order goes directly back to Journey Christian School!
            </p>

            <div className="flex flex-wrap justify-center items-center gap-4 text-xs sm:text-sm text-muted-foreground pt-1">
              <span className="flex items-center gap-1.5">
                <Phone className="w-4 h-4 text-primary" />
                <a href="tel:8582324588" className="hover:underline">858-232-4588</a>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Mail className="w-4 h-4 text-primary" />
                <a href="mailto:tk@outlierblessings.com" className="hover:underline">tk@outlierblessings.com</a>
              </span>
            </div>
          </div>

          {/* Promotion Callout */}
          <Card className="border-primary/30 bg-primary/5 mb-8 shadow-sm">
            <CardContent className="pt-6 pb-6">
              <div className="flex items-start gap-4">
                <div className="p-2.5 rounded-full bg-primary/10 text-primary shrink-0 mt-0.5">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div className="space-y-1.5 text-left">
                  <h3 className="font-serif text-lg font-medium text-foreground">
                    {isEarlyBird ? "Pre-Order by October 30 & Save 10%!" : "Journey Christmas Market Delivery"}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {isEarlyBird ? (
                      <>
                        Order on or before <strong>October 30</strong> with your family name engraved <strong>FREE</strong> (normally $15). All orders will be crafted with love and prayer, ready for pick up at TK's booth on <strong>December 2</strong> at the Journey Christmas Market!
                      </>
                    ) : (
                      <>
                        All orders are handcrafted and will be ready for pickup at TK's booth at the Journey Christmas Market on <strong>December 2</strong> (or available for direct pickup).
                      </>
                    )}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* If order submitted, show confirmation view */}
          {submittedOrder ? (
            <Card className="border-border shadow-md">
              <CardHeader className="text-center space-y-3 pb-4">
                <div className="w-16 h-16 rounded-full bg-green-100 text-green-700 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <CardTitle className="font-serif text-3xl font-light text-foreground">
                  Thank You for Your Order!
                </CardTitle>
                <CardDescription className="text-base text-muted-foreground max-w-lg mx-auto">
                  Your order has been recorded. Journey Christian School will receive 10% of your order total.
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
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </Button>
                    </span>
                  </div>
                  <div className="flex flex-wrap justify-between items-center gap-2 border-b border-border pb-3">
                    <span className="text-sm text-muted-foreground">Parent / Contact:</span>
                    <span className="font-medium text-foreground">{submittedOrder.name} ({submittedOrder.phone})</span>
                  </div>
                  <div className="flex flex-wrap justify-between items-center gap-2 border-b border-border pb-3">
                    <span className="text-sm text-muted-foreground">Student & Grade:</span>
                    <span className="font-medium text-foreground">{submittedOrder.studentGrade}</span>
                  </div>
                  <div className="flex flex-wrap justify-between items-center gap-2 border-b border-border pb-3">
                    <span className="text-sm text-muted-foreground">Delivery:</span>
                    <span className="font-medium text-foreground">{submittedOrder.delivery}</span>
                  </div>
                  <div className="flex flex-wrap justify-between items-center gap-2 border-b border-border pb-3">
                    <span className="text-sm text-muted-foreground">Total Due:</span>
                    <span className="font-serif text-2xl font-semibold text-primary">${submittedOrder.total}</span>
                  </div>
                  <div className="flex flex-wrap justify-between items-center gap-2 text-green-700 font-medium">
                    <span className="text-sm">Journey School Contribution:</span>
                    <span>${submittedOrder.schoolDonation}</span>
                  </div>
                </div>

                {/* Items Breakdown */}
                <div className="space-y-2">
                  <h4 className="font-serif text-lg font-medium text-foreground">Items in Your Order:</h4>
                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                    {submittedOrder.itemsList.map((item: string, idx: number) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                  {submittedOrder.familyName && (
                    <p className="text-sm text-muted-foreground pt-1">
                      <strong>Back Engraving:</strong> "{submittedOrder.familyName}"
                      {submittedOrder.bibleVerse ? ` • Verse: ${submittedOrder.bibleVerse}` : ""}
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
                    Total Due: <strong>${submittedOrder.total}</strong> via <strong>{submittedOrder.payment}</strong>.
                    {submittedOrder.payment === "Cash"
                      ? " Please bring cash with you at the time of pickup."
                      : " TK will contact you directly with payment details for your order, or you may complete payment upon pickup."}
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
            /* Order Form */
            <form onSubmit={handleSubmit} className="space-y-8" data-netlify="true" name="journey-christmas-order">
              {/* Netlify & Anti-spam hidden inputs */}
              <input type="hidden" name="form-name" value="journey-christmas-order" />
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

              {/* SECTION 1: Your Information */}
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="font-serif text-2xl font-light text-foreground flex items-center gap-2">
                    <School className="w-5 h-5 text-primary" />
                    1. Your Information
                  </CardTitle>
                  <CardDescription>
                    Please provide your contact info and student details so we can attribute 10% to Journey.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="parent-name">Your Full Name *</Label>
                      <Input
                        id="parent-name"
                        required
                        value={contact.name}
                        onChange={(e) => setContact({ ...contact, name: e.target.value })}
                        placeholder="e.g. Sarah Jenkins"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="parent-phone">Phone Number *</Label>
                      <Input
                        id="parent-phone"
                        type="tel"
                        required
                        value={contact.phone}
                        onChange={(e) => setContact({ ...contact, phone: e.target.value })}
                        placeholder="e.g. 858-555-0123"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="parent-email">Email Address *</Label>
                      <Input
                        id="parent-email"
                        type="email"
                        required
                        value={contact.email}
                        onChange={(e) => setContact({ ...contact, email: e.target.value })}
                        placeholder="e.g. sarah@example.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="student-grade">Student & Grade *</Label>
                      <Input
                        id="student-grade"
                        required
                        value={contact.studentGrade}
                        onChange={(e) => setContact({ ...contact, studentGrade: e.target.value })}
                        placeholder="e.g. Noah Jenkins - 3rd Grade"
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
                    Select quantities for any sizes you wish to order (10" is $50, 14" is $75, 20" is $125).
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
                          {cross.preview && (
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
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
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
                    Pre-order now, ready at the Christmas Market on December 2!
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Wood Laser Ornament */}
                    <div
                      className={`p-4 rounded-lg border flex items-center justify-between ${
                        woodOrnamentsQty > 0
                          ? "border-primary bg-primary/5"
                          : "border-border bg-card"
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
                          onClick={() => setWoodOrnamentsQty((q) => q + 1)}
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>

                    {/* Resin Ornament */}
                    <div
                      className={`p-4 rounded-lg border flex items-center justify-between ${
                        resinOrnamentsQty > 0
                          ? "border-primary bg-primary/5"
                          : "border-border bg-card"
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
                          onClick={() => setResinOrnamentsQty((q) => q + 1)}
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {(woodOrnamentsQty > 0 || resinOrnamentsQty > 0) && (
                    <div className="space-y-2 pt-2 animate-in fade-in-50">
                      <Label htmlFor="ornament-names">Names for Ornaments *</Label>
                      <Input
                        id="ornament-names"
                        value={ornamentNames}
                        onChange={(e) => setOrnamentNames(e.target.value)}
                        placeholder="e.g. Mason, Emily, Grandad, etc."
                      />
                      <p className="text-xs text-muted-foreground">
                        Please list the names you'd like engraved on your ornaments.
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
                      4. Resin & Glass Crosses
                    </CardTitle>
                    <Badge variant="secondary" className="font-sans text-xs">
                      Free Back Engraving Included
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
                      <div className="flex items-center justify-between">
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
                    5. Build Your Own Cross (Custom Design)
                  </CardTitle>
                  <CardDescription>
                    "I personally design crosses for births, baptisms, dedications, memorials and weddings. You think of it, I will make it!"
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
                      I have a custom cross idea I'd like TK to design
                    </Label>
                  </div>

                  {hasCustomIdea && (
                    <div className="space-y-2 pt-2 animate-in fade-in-50">
                      <Label htmlFor="custom-idea-text">Describe Your Idea</Label>
                      <Textarea
                        id="custom-idea-text"
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

              {/* SECTION 6: Make It Personal (Engraved on back) */}
              <Card className="border-border">
                <CardHeader>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <CardTitle className="font-serif text-2xl font-light text-foreground">
                      6. Make It Personal
                    </CardTitle>
                    <Badge variant="outline" className="text-xs">
                      {isEarlyBird ? "Free with Pre-Order" : "Engraved on Back"}
                    </Badge>
                  </div>
                  <CardDescription>
                    Personalize your cross with your family name and beloved scripture verse.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="family-name">Family Name to Engrave</Label>
                      <Input
                        id="family-name"
                        value={personalization.familyName}
                        onChange={(e) => setPersonalization({ ...personalization, familyName: e.target.value })}
                        placeholder="e.g. The Mason Family"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="needed-by">Needed By</Label>
                      <Input
                        id="needed-by"
                        value={personalization.neededBy}
                        onChange={(e) => setPersonalization({ ...personalization, neededBy: e.target.value })}
                        placeholder="e.g. Journey Christmas Market (Dec 2)"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bible-verse">Bible Verse & Reference</Label>
                    <Input
                      id="bible-verse"
                      value={personalization.bibleVerse}
                      onChange={(e) => setPersonalization({ ...personalization, bibleVerse: e.target.value })}
                      placeholder="e.g. Joshua 24:15 - As for me and my house, we will serve the Lord."
                    />
                  </div>
                </CardContent>
              </Card>

              {/* SECTION 7: Delivery & Payment */}
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="font-serif text-2xl font-light text-foreground flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-primary" />
                    7. Delivery & Payment Method
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Delivery */}
                  <div className="space-y-3">
                    <Label className="text-sm font-semibold">Delivery Preference</Label>
                    <RadioGroup value={delivery} onValueChange={setDelivery} className="space-y-2">
                      <div className="flex items-center space-x-2 p-3 rounded-lg border border-border bg-card cursor-pointer hover:border-primary/40">
                        <RadioGroupItem value="booth-dec-2" id="delivery-booth" />
                        <Label htmlFor="delivery-booth" className="cursor-pointer text-sm font-medium flex-1">
                          Pick up at my booth, Journey Christmas Market (Dec 2)
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-3 rounded-lg border border-border bg-card cursor-pointer hover:border-primary/40">
                        <RadioGroupItem value="tk-pickup" id="delivery-tk" />
                        <Label htmlFor="delivery-tk" className="cursor-pointer text-sm font-medium flex-1">
                          Pick up directly from TK
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <Separator />

                  {/* Payment */}
                  <div className="space-y-3">
                    <Label className="text-sm font-semibold">Preferred Payment Method</Label>
                    <RadioGroup value={payment} onValueChange={setPayment} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="flex items-center space-x-2 p-3 rounded-lg border border-border bg-card cursor-pointer hover:border-primary/40">
                        <RadioGroupItem value="venmo" id="payment-venmo" />
                        <Label htmlFor="payment-venmo" className="cursor-pointer text-sm font-medium">
                          Venmo
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-3 rounded-lg border border-border bg-card cursor-pointer hover:border-primary/40">
                        <RadioGroupItem value="zelle" id="payment-zelle" />
                        <Label htmlFor="payment-zelle" className="cursor-pointer text-sm font-medium">
                          Zelle
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-3 rounded-lg border border-border bg-card cursor-pointer hover:border-primary/40">
                        <RadioGroupItem value="cash" id="payment-cash" />
                        <Label htmlFor="payment-cash" className="cursor-pointer text-sm font-medium">
                          Cash at Pickup
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                </CardContent>
              </Card>

              {/* SECTION 8: Real-Time Order Summary Card & Total */}
              <Card className="border-primary/40 bg-card shadow-lg sticky bottom-4 z-40">
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

                  <div className="space-y-1.5 text-sm">
                    <div className="flex justify-between text-muted-foreground">
                      <span>Subtotal:</span>
                      <span className="font-mono font-medium text-foreground">${orderDetails.subtotal.toFixed(2)}</span>
                    </div>

                    {orderDetails.engravingFee > 0 && (
                      <div className="flex justify-between text-muted-foreground">
                        <span>Engraving Fee (+$15 ea after Oct 30):</span>
                        <span className="font-mono font-medium text-foreground">${orderDetails.engravingFee.toFixed(2)}</span>
                      </div>
                    )}

                    {orderDetails.discount > 0 && (
                      <div className="flex justify-between text-green-700 font-medium">
                        <span>Pre-Order Discount (10% by Oct 30):</span>
                        <span className="font-mono">-${orderDetails.discount.toFixed(2)}</span>
                      </div>
                    )}

                    <div className="flex justify-between text-muted-foreground">
                      <span>Sales Tax (7.75%):</span>
                      <span className="font-mono font-medium text-foreground">${orderDetails.tax.toFixed(2)}</span>
                    </div>

                    <Separator className="my-2" />

                    <div className="flex justify-between items-baseline pt-1">
                      <span className="font-serif text-xl font-medium text-foreground">Total Due:</span>
                      <span className="font-serif text-2xl sm:text-3xl font-semibold text-primary">
                        ${orderDetails.total.toFixed(2)}
                      </span>
                    </div>

                    {/* School donation impact badge */}
                    <div className="p-2.5 rounded bg-green-50 border border-green-200 text-green-800 text-xs sm:text-sm flex items-center justify-between mt-2">
                      <span className="font-medium flex items-center gap-1.5">
                        <School className="w-4 h-4 text-green-700" />
                        Journey Christian School receives:
                      </span>
                      <span className="font-mono font-bold text-green-800">
                        ${orderDetails.schoolDonation.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground text-center italic pt-1">
                    "Every cross is made to order, prayed over, and perfectly imperfect, knots and all." — TK
                  </p>

                  <Button
                    type="submit"
                    disabled={isSubmitting || (orderDetails.totalItemCount === 0 && (!hasCustomIdea || !customIdea.trim()))}
                    className="w-full h-12 text-base font-medium bg-primary text-primary-foreground hover:bg-navy-light shadow-md transition-all"
                  >
                    {isSubmitting ? "Submitting Order..." : "Submit Order to TK"}
                  </Button>
                </CardContent>
              </Card>
            </form>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default JourneyOrderPage;

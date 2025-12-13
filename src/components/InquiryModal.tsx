import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";

interface InquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName: string;
}

const InquiryModal = ({ isOpen, onClose, productName }: InquiryModalProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    contactMethod: "email",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast({
        title: "Name required",
        description: "Please enter your name.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast({
        title: "Valid email required",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Create FormData for Netlify Forms
      const netlifyFormData = new FormData();
      netlifyFormData.append('form-name', 'product-inquiry');
      netlifyFormData.append('product', productName);
      netlifyFormData.append('name', formData.name.trim());
      netlifyFormData.append('email', formData.email.trim());
      netlifyFormData.append('phone', formData.phone.trim() || 'Not provided');
      netlifyFormData.append('contactMethod', formData.contactMethod);

      const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(netlifyFormData as any).toString(),
      });

      if (!response.ok) {
        throw new Error('Form submission failed');
      }

      toast({
        title: "Inquiry sent!",
        description: "We'll be in touch soon to discuss your custom cross.",
      });
      
      setFormData({ name: "", email: "", phone: "", contactMethod: "email" });
      onClose();
    } catch (error: any) {
      console.error("Error sending inquiry:", error);
      toast({
        title: "Something went wrong",
        description: "Please try again or contact us directly.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-background border-border">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl font-light tracking-wide text-foreground">
            Inquire About This Cross
          </DialogTitle>
        </DialogHeader>
        
        <form 
          onSubmit={handleSubmit} 
          className="space-y-6 mt-4"
          name="product-inquiry"
          data-netlify="true"
          data-netlify-honeypot="bot-field"
        >
          {/* Hidden fields for Netlify */}
          <input type="hidden" name="form-name" value="product-inquiry" />
          <div style={{ display: 'none' }}>
            <label>
              Don't fill this out if you're human: <input name="bot-field" />
            </label>
          </div>

          <div className="space-y-2">
            <Label htmlFor="product" className="font-sans text-sm text-muted-foreground">
              Product
            </Label>
            <Input
              id="product"
              name="product"
              value={productName}
              disabled
              className="bg-muted border-border font-serif"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="name" className="font-sans text-sm text-muted-foreground">
              Your Name *
            </Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter your name"
              className="border-border focus:ring-accent"
              maxLength={100}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="font-sans text-sm text-muted-foreground">
              Email Address *
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="your@email.com"
              className="border-border focus:ring-accent"
              maxLength={255}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="font-sans text-sm text-muted-foreground">
              Phone Number (optional)
            </Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="(555) 123-4567"
              className="border-border focus:ring-accent"
              maxLength={20}
            />
          </div>

          <div className="space-y-3">
            <Label className="font-sans text-sm text-muted-foreground">
              Preferred Contact Method
            </Label>
            <RadioGroup
              name="contactMethod"
              value={formData.contactMethod}
              onValueChange={(value) => setFormData({ ...formData, contactMethod: value })}
              className="flex gap-6"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="email" id="contact-email" className="border-accent text-accent" />
                <Label htmlFor="contact-email" className="font-sans text-sm cursor-pointer">
                  Email
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="phone" id="contact-phone" className="border-accent text-accent" />
                <Label htmlFor="contact-phone" className="font-sans text-sm cursor-pointer">
                  Phone
                </Label>
              </div>
            </RadioGroup>
          </div>

          <p className="text-xs text-muted-foreground text-center italic">
            We will never sell your info. Ever.
          </p>

          <div className="flex gap-4 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 border-border text-foreground hover:bg-muted"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-primary text-primary-foreground hover:bg-navy-light"
            >
              {isSubmitting ? "Sending..." : "Send Inquiry"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default InquiryModal;

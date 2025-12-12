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
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "Inquiry sent!",
      description: "We'll be in touch soon to discuss your custom cross.",
    });
    
    setFormData({ name: "", email: "", phone: "", contactMethod: "email" });
    setIsSubmitting(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-background border-border">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl font-light tracking-wide text-foreground">
            Inquire About This Cross
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="space-y-2">
            <Label htmlFor="product" className="font-sans text-sm text-muted-foreground">
              Product
            </Label>
            <Input
              id="product"
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
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter your name"
              className="border-border focus:ring-accent"
              maxLength={100}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="font-sans text-sm text-muted-foreground">
              Email Address *
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="your@email.com"
              className="border-border focus:ring-accent"
              maxLength={255}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="font-sans text-sm text-muted-foreground">
              Phone Number (optional)
            </Label>
            <Input
              id="phone"
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

          <div className="flex gap-4 pt-4">
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

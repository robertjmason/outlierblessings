import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface InquiryRequest {
  productName: string;
  name: string;
  email: string;
  phone?: string;
  contactMethod: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { productName, name, email, phone, contactMethod }: InquiryRequest = await req.json();

    console.log("Received inquiry:", { productName, name, email, phone, contactMethod });

    // Send notification email to the business
    const notificationRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Outlier Blessings <onboarding@resend.dev>",
        to: ["info@outlierhealing.com"],
        subject: `New Inquiry: ${productName}`,
        html: `
          <h2>New Cross Inquiry</h2>
          <p><strong>Product:</strong> ${productName}</p>
          <p><strong>Customer Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone || "Not provided"}</p>
          <p><strong>Preferred Contact Method:</strong> ${contactMethod}</p>
          <hr>
          <p style="color: #666; font-size: 12px;">This inquiry was submitted through the Outlier Blessings website.</p>
        `,
      }),
    });

    if (!notificationRes.ok) {
      const errorData = await notificationRes.text();
      console.error("Resend API error:", errorData);
      throw new Error(`Failed to send notification email: ${errorData}`);
    }

    console.log("Notification email sent successfully");

    // Send confirmation email to the customer
    const confirmationRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Outlier Blessings <onboarding@resend.dev>",
        to: [email],
        subject: "We received your inquiry!",
        html: `
          <h1 style="font-family: Georgia, serif; color: #1a365d;">Thank you, ${name}!</h1>
          <p style="font-family: Arial, sans-serif; color: #444; line-height: 1.6;">
            We've received your inquiry about the <strong>${productName}</strong> cross 
            and will be in touch via ${contactMethod} soon to discuss the details.
          </p>
          <p style="font-family: Arial, sans-serif; color: #444; line-height: 1.6;">
            Each of our crosses is handcrafted with care, and we're honored to help you 
            find the perfect piece for your home or a loved one.
          </p>
          <p style="font-family: Arial, sans-serif; color: #444; line-height: 1.6;">
            <em>10% of every purchase supports our church community.</em>
          </p>
          <p style="font-family: Arial, sans-serif; color: #444; margin-top: 24px;">
            With blessings,<br>
            <strong>Outlier Blessings</strong>
          </p>
        `,
      }),
    });

    if (!confirmationRes.ok) {
      console.error("Failed to send confirmation email, but notification was sent");
    } else {
      console.log("Confirmation email sent successfully");
    }

    return new Response(
      JSON.stringify({ success: true, message: "Inquiry sent successfully" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in send-inquiry function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);

/**
 * Outlier Blessings - Event Order Sync & Email Receipts
 * Google Apps Script for Outlier Healing / Outlier Blessings Google Workspace
 * Supports both:
 *   - Journey Christian School ("journey-christmas-order") -> "Orders" sheet
 *   - It Takes a Village ("village-order") -> "Village Orders" sheet
 *
 * HOW TO DEPLOY / UPDATE:
 * 1. Open your Google Sheet (in your Outlier Healing / Outlier Blessings Google account).
 * 2. Go to Extensions > Apps Script.
 * 3. Paste this code completely, replacing any default code.
 * 4. Click "Deploy" > "Manage deployments" > Edit (or "New deployment").
 * 5. Select type: "Web app", Execute as: "Me", Who has access: "Anyone".
 * 6. Click "Deploy" and authorize permissions if prompted.
 * 7. Ensure your .env has:
 *    VITE_GOOGLE_SHEETS_WEBHOOK_URL="https://script.google.com/macros/s/.../exec"
 */

const JOURNEY_SHEET_NAME = "Orders";
const VILLAGE_SHEET_NAME = "Village Orders";
const NOTIFICATION_EMAIL = "tk@outlierblessings.com";

const JOURNEY_HEADERS = [
  "Timestamp",
  "Order ID",
  "Parent Name",
  "Phone",
  "Email",
  "Student & Grade",
  "Items Ordered",
  "Ornament Names",
  "Custom Cross Idea",
  "Family Engraving",
  "Needed By",
  "Bible Verse",
  "Delivery Method",
  "Payment Method",
  "Subtotal ($)",
  "Engraving Fee ($)",
  "10% Pre-Order Discount ($)",
  "Tax (7.75%) ($)",
  "Total ($)",
  "10% Journey Donation ($)"
];

const VILLAGE_HEADERS = [
  "Timestamp",
  "Order ID",
  "Name",
  "Phone",
  "Email",
  "Needed By",
  "Items Ordered",
  "Ornament Names",
  "Custom Cross Idea",
  "Family Engraving",
  "Bible Verse",
  "Pickup Method",
  "Payment Method",
  "Subtotal ($)",
  "Tax (7.75%) ($)",
  "Total ($)",
  "10% Cause Contribution ($)"
];

function setupSheet(sheet, headers) {
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(headers);
    const headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setBackground("#1a365d"); // Deep navy
    headerRange.setFontColor("#ffffff");
    headerRange.setFontWeight("bold");
    sheet.setFrozenRows(1);
  }
}

function getTargetSheet(ss, isVillage) {
  if (isVillage) {
    let sheet = ss.getSheetByName(VILLAGE_SHEET_NAME);
    if (!sheet) {
      sheet = ss.insertSheet(VILLAGE_SHEET_NAME);
    }
    setupSheet(sheet, VILLAGE_HEADERS);
    return sheet;
  }

  let sheet = ss.getSheetByName(JOURNEY_SHEET_NAME) || ss.getSheetByName("Sheet1") || ss.getSheets()[0];
  if (!sheet) {
    sheet = ss.insertSheet(JOURNEY_SHEET_NAME);
  }
  setupSheet(sheet, JOURNEY_HEADERS);
  return sheet;
}

function buildPaymentInstructions(payment, totalFormatted, isVillage) {
  if (payment === "Cash") {
    return "Please bring $" + totalFormatted + " in cash at the time of pickup.";
  }
  if (isVillage) {
    if (payment === "Venmo") {
      return "Please send $" + totalFormatted + " via Venmo to @tkmc555 (or complete payment upon pickup).";
    }
    if (payment === "Zelle") {
      return "Please send $" + totalFormatted + " via Zelle to Terri-Kim Mason (858-232-4588) (or complete payment upon pickup).";
    }
  }
  return "TK will follow up with you directly with payment details, or you may complete payment upon pickup.";
}

function buildCustomerReceiptBody(data, orderId, formattedDate, isVillage) {
  const totalFormatted = Number(data.total || 0).toFixed(2);
  const subtotalFormatted = Number(data.subtotal || 0).toFixed(2);
  const taxFormatted = Number(data.tax || 0).toFixed(2);
  const donationValue = isVillage ? data.causeDonation : data.schoolDonation;
  const donationFormatted = Number(donationValue || 0).toFixed(2);

  const eventLine = isVillage
    ? "It Takes a Village | Holiday Shop for a Cause (November 15, 2026)"
    : "Journey Christian School Christmas Market";
  const contributionLine = isVillage
    ? "10% Cause Contribution: $" + donationFormatted + " (10% of every sale goes back to a cause I believe in.)"
    : "10% Journey School Contribution: $" + donationFormatted;

  const lines = [
    "Hi " + (data.name || "Friend") + ",",
    "",
    "Thank you for your Outlier Blessings order! Here is a copy of your order receipt:",
    "",
    "Event: " + eventLine,
    "Order Reference: " + orderId,
    "Order Date: " + formattedDate,
    "",
    "--- Contact & Pickup ---",
    "Name: " + (data.name || ""),
    "Phone: " + (data.phone || ""),
    "Email: " + (data.email || ""),
    ...(isVillage ? [] : ["Student & Grade: " + (data.studentGrade || "")]),
    "Needed By: " + (data.neededBy || "Not specified"),
    "Pickup / Delivery: " + (data.delivery || ""),
    "",
    "--- Items Ordered ---",
    data.orderSummary || "None",
    ""
  ];

  if (data.ornamentNames) {
    lines.push("Names for Ornaments: " + data.ornamentNames);
  }
  if (data.customIdea) {
    lines.push("Custom Cross Idea: " + data.customIdea);
  }
  if (data.familyName) {
    lines.push("Family Name (Back Engraving): " + data.familyName);
  }
  if (data.bibleVerse) {
    lines.push("Bible Verse & Reference: " + data.bibleVerse);
  }

  lines.push(
    "",
    "--- Order Totals ---",
    "Subtotal: $" + subtotalFormatted
  );

  if (!isVillage && Number(data.engravingFee || 0) > 0) {
    lines.push("Engraving Fee: $" + Number(data.engravingFee).toFixed(2));
  }
  if (!isVillage && Number(data.discount || 0) > 0) {
    lines.push("Pre-Order Discount (10%): -$" + Number(data.discount).toFixed(2));
  }

  lines.push(
    "Sales Tax (7.75%): $" + taxFormatted,
    "Total: $" + totalFormatted,
    contributionLine,
    "",
    "--- Payment ---",
    "Selected Method: " + (data.payment || ""),
    buildPaymentInstructions(data.payment, totalFormatted, isVillage),
    "",
    "\"Every cross is made to order, prayed over, and perfectly imperfect, knots and all.\"",
    "",
    "Love, Hugs and Blessings,",
    "TK The Tardigrade | 858-232-4588",
    "tk@outlierblessings.com | OutlierBlessings.com"
  );

  return lines.join("\n");
}

function doPost(e) {
  try {
    let data;
    if (e.postData && e.postData.type === "application/json") {
      data = JSON.parse(e.postData.contents);
    } else if (e.postData && e.postData.contents) {
      data = JSON.parse(e.postData.contents);
    } else if (e.parameter) {
      data = e.parameter;
    } else {
      data = {};
    }

    const now = new Date();
    const formattedDate = Utilities.formatDate(
      now,
      Session.getScriptTimeZone() || "America/Los_Angeles",
      "yyyy-MM-dd HH:mm:ss"
    );

    const isVillage =
      data["form-name"] === "village-order" ||
      (typeof data.orderId === "string" && data.orderId.indexOf("ITV-") === 0);

    const orderId =
      data.orderId ||
      ((isVillage ? "ITV-" : "JCS-") + now.getFullYear() + "-" + Math.floor(1000 + Math.random() * 9000));

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = getTargetSheet(ss, isVillage);

    const row = isVillage
      ? [
          formattedDate,
          orderId,
          data.name || "",
          data.phone || "",
          data.email || "",
          data.neededBy || "",
          data.orderSummary || "",
          data.ornamentNames || "",
          data.customIdea || "",
          data.familyName || "",
          data.bibleVerse || "",
          data.delivery || "",
          data.payment || "",
          Number(data.subtotal) || 0,
          Number(data.tax) || 0,
          Number(data.total) || 0,
          Number(data.causeDonation) || 0
        ]
      : [
          formattedDate,
          orderId,
          data.name || "",
          data.phone || "",
          data.email || "",
          data.studentGrade || "",
          data.orderSummary || "",
          data.ornamentNames || "",
          data.customIdea || "",
          data.familyName || "",
          data.neededBy || "",
          data.bibleVerse || "",
          data.delivery || "",
          data.payment || "",
          Number(data.subtotal) || 0,
          Number(data.engravingFee) || 0,
          Number(data.discount) || 0,
          Number(data.tax) || 0,
          Number(data.total) || 0,
          Number(data.schoolDonation) || 0
        ];

    sheet.appendRow(row);

    // 1. Send order notification to TK
    try {
      if (NOTIFICATION_EMAIL) {
        const subject = isVillage
          ? `[New Village Order] ${orderId} - ${data.name || "Customer"}`
          : `[New Journey Order] ${orderId} - ${data.name || "Customer"} (${data.studentGrade || ""})`;

        const donationLabel = isVillage ? "10% Cause Contribution" : "10% Donation to Journey";
        const donationVal = isVillage ? data.causeDonation : data.schoolDonation;

        const body = `${isVillage ? "New It Takes a Village Order!" : "New Christmas Order for Journey Christian School!"}

Order ID: ${orderId}
Name: ${data.name || ""}
Phone: ${data.phone || ""}
Email: ${data.email || ""}
${isVillage ? "" : `Student & Grade: ${data.studentGrade || ""}\n`}Needed By: ${data.neededBy || "Not specified"}

Items Ordered:
${data.orderSummary || ""}

Ornament Names: ${data.ornamentNames || "None"}
Custom Idea: ${data.customIdea || "None"}
Family Engraving on Back: ${data.familyName || "None"}
Bible Verse: ${data.bibleVerse || "None"}

Pickup / Delivery: ${data.delivery || ""}
Payment Method: ${data.payment || ""}

Subtotal: $${Number(data.subtotal || 0).toFixed(2)}
Tax (7.75%): $${Number(data.tax || 0).toFixed(2)}
Total: $${Number(data.total || 0).toFixed(2)}
${donationLabel}: $${Number(donationVal || 0).toFixed(2)}

Timestamp: ${formattedDate}
`;
        MailApp.sendEmail({
          to: NOTIFICATION_EMAIL,
          replyTo: data.email || NOTIFICATION_EMAIL,
          subject: subject,
          body: body
        });
      }
    } catch (mailErr) {
      console.warn("TK notification email failed:", mailErr);
    }

    // 2. Send confirmation receipt copy to the form submitter
    try {
      const customerEmail = (data.email || "").trim();
      if (customerEmail && customerEmail.indexOf("@") !== -1) {
        MailApp.sendEmail({
          to: customerEmail,
          replyTo: NOTIFICATION_EMAIL,
          subject: `Outlier Blessings Order Confirmation - ${orderId}`,
          body: buildCustomerReceiptBody(data, orderId, formattedDate, isVillage)
        });
      }
    } catch (customerMailErr) {
      console.warn("Customer receipt email failed:", customerMailErr);
    }

    return ContentService
      .createTextOutput(JSON.stringify({ status: "success", orderId: orderId }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: "active", message: "Outlier Blessings Orders Webhook is online." }))
    .setMimeType(ContentService.MimeType.JSON);
}

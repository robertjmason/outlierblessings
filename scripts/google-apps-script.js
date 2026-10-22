/**
 * Outlier Blessings - Journey Christian School Order Sync
 * Google Apps Script for Outlier Healing / Outlier Blessings Google Workspace
 *
 * HOW TO DEPLOY:
 * 1. Open Google Sheets (in your Outlier Healing / Outlier Blessings Google account).
 * 2. Create a new Sheet, e.g. "Journey Christmas Orders 2026".
 * 3. Go to Extensions > Apps Script.
 * 4. Paste this code completely, replacing any default code.
 * 5. Click "Deploy" > "New deployment".
 * 6. Select type: "Web app".
 * 7. Set:
 *    - Description: "Journey Orders Webhook"
 *    - Execute as: "Me" (your Google account)
 *    - Who has access: "Anyone" (crucial so your website form can post to it)
 * 8. Click "Deploy" and authorize permissions.
 * 9. Copy the Web App URL (starts with https://script.google.com/macros/s/...)
 * 10. Add it to your project .env:
 *     VITE_GOOGLE_SHEETS_WEBHOOK_URL="https://script.google.com/macros/s/.../exec"
 */

const SHEET_NAME = "Orders";
const NOTIFICATION_EMAIL = "tk@outlierblessings.com"; // Can also be orders@outlierhealing.com

function setupSheet(sheet) {
  const headers = [
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

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(headers);
    const headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setBackground("#1a365d"); // Deep navy
    headerRange.setFontColor("#ffffff");
    headerRange.setFontWeight("bold");
    sheet.setFrozenRows(1);
  }
}

function doPost(e) {
  try {
    let data;
    if (e.postData && e.postData.type === "application/json") {
      data = JSON.parse(e.postData.contents);
    } else if (e.parameter) {
      data = e.parameter;
    } else {
      data = {};
    }

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(SHEET_NAME) || ss.getSheetByName("Sheet1") || ss.getSheets()[0];
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
    }
    setupSheet(sheet);

    const now = new Date();
    const formattedDate = Utilities.formatDate(now, Session.getScriptTimeZone() || "America/Los_Angeles", "yyyy-MM-dd HH:mm:ss");
    const orderId = data.orderId || ("JCS-" + now.getFullYear() + "-" + Math.floor(1000 + Math.random() * 9000));

    const row = [
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

    // Optional: Send instant email notification via Outlier Healing Google Workspace
    try {
      if (NOTIFICATION_EMAIL) {
        const subject = `[New Journey Order] ${orderId} - ${data.name} (${data.studentGrade})`;
        const body = `New Christmas Order for Journey Christian School!

Order ID: ${orderId}
Parent Name: ${data.name}
Phone: ${data.phone}
Email: ${data.email}
Student & Grade: ${data.studentGrade}

Items Ordered:
${data.orderSummary}

Family Engraving on Back: ${data.familyName || "None"}
Needed By: ${data.neededBy || "Dec 2 Market"}
Bible Verse: ${data.bibleVerse || "None"}
Ornament Names: ${data.ornamentNames || "None"}
Custom Idea: ${data.customIdea || "None"}

Delivery: ${data.delivery}
Payment Method: ${data.payment}

Total: $${Number(data.total || 0).toFixed(2)}
10% Donation to Journey: $${Number(data.schoolDonation || 0).toFixed(2)}

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
      console.warn("Mail notification failed:", mailErr);
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
    .createTextOutput(JSON.stringify({ status: "active", message: "Journey Orders Webhook is online." }))
    .setMimeType(ContentService.MimeType.JSON);
}

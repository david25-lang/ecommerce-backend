const express = require("express");
const nodemailer = require("nodemailer");

const router = express.Router();

function getTransporter() {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
    throw new Error("Email service is not configured");
  }

  return nodemailer.createTransport({
    service: process.env.SMTP_SERVICE || "gmail",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });
}

router.post("/", async (req, res) => {
  const { name, email, address, city, zip, items, total } = req.body;

  if (!name || !email || !address || !city || !zip || !Array.isArray(items) || !items.length) {
    return res.status(400).json({ message: "Complete order details are required" });
  }

  const itemLines = items
    .map((item) => `${item.name} x ${item.quantity} - $${(item.price * item.quantity).toFixed(2)}`)
    .join("\n");

  // The order is approved before email delivery so an SMTP outage does not lose the order.
  let emailSent = false;
  try {
    const transporter = getTransporter();
    await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: email,
      subject: "Your Davis_Gee order confirmation",
      text: [
        `Hi ${name},`,
        "",
        "Thank you for your order from Davis_Gee.",
        "",
        "Order summary:",
        itemLines,
        `Total: $${Number(total).toFixed(2)}`,
        "",
        `Shipping address: ${address}, ${city}, ${zip}`,
        "",
        "We will send another update when your order ships.",
      ].join("\n"),
    });
    emailSent = true;
  } catch (error) {
    console.error("Order email error:", error.message);
  }

  res.status(201).json({
    message: emailSent ? "Order approved and receipt sent" : "Order approved; receipt email is pending",
    emailSent,
  });
});

module.exports = router;

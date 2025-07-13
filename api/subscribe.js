// api/subscribe.js
const mailchimp = require("@mailchimp/mailchimp_marketing");

module.exports = async (req, res) => {
  // Only accept POST requests
  if (req.method !== "POST") {
    return res.status(405).end("Method Not Allowed");
  }

  // Parse the submitted email
  const { email } = JSON.parse(req.body || "{}");
  if (!email) {
    return res.status(400).end("Missing email address");
  }

  // Configure Mailchimp from your Vercel environment variables
  mailchimp.setConfig({
    apiKey: process.env.MAILCHIMP_API_KEY,
    server: process.env.MAILCHIMP_API_KEY.split("-")[1],
  });

  try {
    // Subscribe the email
    const response = await mailchimp.lists.addListMember(
      process.env.MAILCHIMP_LIST_ID,
      { email_address: email, status: "subscribed" }
    );
    // Success!
    return res.status(200).json({ message: "Subscribed!", id: response.id });
  } catch (err) {
    // Mailchimp returned an error
    return res
      .status(err.status || 500)
      .json({ error: err.message });
  }
};

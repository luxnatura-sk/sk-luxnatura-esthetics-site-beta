// api/subscribe.js
const mailchimp = require("@mailchimp/mailchimp_marketing");

module.exports = async (req, res) => {
  // Only allow POST
  if (req.method !== "POST") {
    return res.status(405).end("Method Not Allowed");
  }

  // Parse the email from the JSON body
  let { email } = {};
  try {
    ({ email } = JSON.parse(req.body || "{}"));
  } catch {
    return res.status(400).end("Invalid JSON");
  }
  if (!email) {
    return res.status(400).end("Missing email address");
  }

  // Configure Mailchimp
  mailchimp.setConfig({
    apiKey: process.env.MAILCHIMP_API_KEY,
    server: process.env.MAILCHIMP_API_KEY.split("-")[1],
  });

  try {
    const response = await mailchimp.lists.addListMember(
      process.env.MAILCHIMP_LIST_ID,
      { email_address: email, status: "subscribed" }
    );
    return res
      .status(200)
      .json({ message: "Subscribed!", id: response.id });
  } catch (err) {
    // Surface Mailchimp errors as JSON
    return res
      .status(err.status || 500)
      .json({ error: err.message });
  }
};

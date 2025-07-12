import mailchimp from "@mailchimp/mailchimp_marketing";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end("Method Not Allowed");
  }
  const { email } = JSON.parse(req.body || "{}");
  if (!email) {
    return res.status(400).end("Missing email address");
  }

  // Pull your key & list from Vercel environments
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
    return res
      .status(err.status || 500)
      .json({ error: err.message });
  }
}

import { createTransport } from "nodemailer";

const transporter = createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendMilestoneEmail(
  taskName: string,
  dashboardUrl: string
) {
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; background: #0f0808; color: #fff; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; background: #111118; border-radius: 8px; }
        h1 { color: #ff3355; }
        a { color: #ff3355; text-decoration: none; }
        .cta { display: inline-block; padding: 10px 20px; background: #ff3355; color: white; border-radius: 4px; margin-top: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>✓ ${taskName} Completed</h1>
        <p>A major milestone has been completed: <strong>${taskName}</strong></p>
        <p>Check the full progress dashboard to see all active and completed work:</p>
        <a href="${dashboardUrl}" class="cta">View Dashboard</a>
        <p style="margin-top: 30px; color: #8888aa; font-size: 12px;">Progress Dashboard • Your parallel work tracker</p>
      </div>
    </body>
    </html>
  `;

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: "karlmarx9193@gmail.com",
    subject: `✓ ${taskName} Completed`,
    html: htmlContent,
  });
}

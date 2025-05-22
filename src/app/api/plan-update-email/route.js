import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req) {
  try {
    const { name, email, plan } = await req.json();

    // Create a nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE || "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SWAGGER_URL}/subscription_plan/list/`
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch plan list: ${response.status}`);
    }
    const data = await response.json();
    let planDetails;
    if (Array.isArray(data)) {
      planDetails = data.find((item) => item.id == plan); // loose equality for type safety
    } else {
      throw new Error("Plan list response is not an array");
    }
    if (!planDetails) {
      throw new Error(`Plan with id ${plan} not found`);
    }

    // Format the email content for plan upgrade notification
    const emailContent = `
      <div style="background: #f5f7fa; padding: 40px 0; min-height: 100vh; font-family: 'Segoe UI', 'Roboto', 'Arial', sans-serif;">
        <div style="max-width: 480px; margin: 0 auto; background: #fff; border-radius: 18px; box-shadow: 0 4px 24px rgba(0,0,0,0.07); overflow: hidden;">
          <div style="background: linear-gradient(90deg, #6C63FF 0%, #48C6EF 100%); padding: 32px 0 20px 0; text-align: center;">
            <div style="font-size: 2rem; font-weight: bold; color: #fff; letter-spacing: 2px; margin-bottom: 8px;">SCANDOQ</div>
            <h1 style="color: #fff; font-size: 1.6rem; margin: 0; letter-spacing: 1px;">Your Plan Has Been Upgraded!</h1>
          </div>
          <div style="padding: 28px 32px 32px 32px;">
            <p style="font-size: 1.1rem; color: #222; margin-bottom: 18px;">Hi <b>${name}</b>,</p>
            <p style="color: #444; margin-bottom: 18px;">We're excited to let you know that your subscription plan has been successfully upgraded. Here are your new plan details:</p>
            <div style="background: #f3f6fd; border-radius: 10px; padding: 18px 16px; margin-bottom: 18px;">
              <p style="margin: 0 0 8px 0; color: #6C63FF;"><b>Plan Name:</b></p>
              <div style="font-size: 1.2rem; font-weight: bold; color: #222;">${
                planDetails.name
              }</div>
              <p style="margin: 8px 0 0 0; color: #6C63FF;"><b>Price:</b> <span style="color: #222; font-weight: 500;">$${
                planDetails.price
              } / ${"1 month"}</span></p>
            </div>
            <p style="color: #444; margin-bottom: 0;">If you have any questions or need help, please contact us at <a href="mailto:support@adaptivenexus.com" style="color: #6C63FF; text-decoration: underline;">support@adaptivenexus.com</a>.</p>
            <p style="color: #aaa; font-size: 0.95rem; margin-top: 24px;">&mdash; SCANDOQ Team</p>
          </div>
        </div>
      </div>
    `;

    // Mail optionst
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: `Your Plan Has Been Upgraded!`,
      html: emailContent,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      { success: true, message: "Email sent successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

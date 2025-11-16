import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail', // You can use other services or SMTP
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const sendOtpEmail = async (email, otp) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Your OTP for TryOn Registration',
        html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <h2 style="color: #0056b3;">Welcome to TryOn!</h2>
                <p>Thank you for registering with us. To complete your registration, please use the following One-Time Password (OTP):</p>
                <p style="font-size: 24px; font-weight: bold; color: #0056b3; background-color: #f0f0f0; padding: 10px 20px; border-radius: 5px; display: inline-block;">${otp}</p>
                <p>This OTP is valid for 5 minutes. Please do not share this code with anyone.</p>
                <p>If you did not request this, please ignore this email.</p>
                <p>Best regards,</p>
                <p>The TryOn Team</p>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('OTP email sent successfully');
    } catch (error) {
        console.error('Error sending OTP email:', error);
        throw new Error('Failed to send OTP email');
    }
};

export { sendOtpEmail };

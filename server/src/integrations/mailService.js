import nodemailer from 'nodemailer';
import logger from '../config/logger.js';

const transporter = nodemailer.createTransport({
  host: 'smtp.resend.com',
  port: 465,
  secure: true,
  auth: {
    user: 'resend',
    pass: process.env.RESEND_API_KEY,
  },
});

const from = `AdminSphere <${process.env.APP_EMAIL}>`;

export const sendWelcomeEmail = async ({ firstName, lastName, email, username, password, role }) => {
  const mailOptions = {
    from,
    to: email,
    subject: 'Welcome to AdminSphere',
    html: `
                <h2>Welcome to AdminSphere</h2>
                <p>Hello <strong>${firstName} ${lastName}</strong>,</p>
                <p>Your account has been created successfully.</p>
    
                <h3>Login Details:</h3>
                <p><strong>Username:</strong> ${username}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Password:</strong> ${password}</p>
                <p><strong>Role:</strong> ${role}</p>
    
                <p>Please log in and change your password immediately.</p>

                <p>
                  <a href="${process.env.CLIENT_URL}">AdminSphere</a>
                </p>
    
                <br>
                <p>Regards,</p>
                <p><strong>AdminSphere Team</strong></p>
            `,
  };

  await transporter.sendMail(mailOptions);
};

export const sendPasswordResetEmail = async (email, token) => {
  try {
    const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${token}`;

    const mailOptions = {
      from,
      to: email,
      subject: 'Password Reset Request',
      html: `
                <h2>Password Reset Requested</h2>
                <p>If you requested a password reset, click the link below:</p>
                <a href="${resetLink}">Reset Password</a>
                <br/><br/>
                <p>If you did NOT request this, ignore this email.</p>
            `,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    logger.error('Failed to send password reset email:', error);
  }
};

export const sendEmailWithAttachment = async ({ to, subject, html, attachments }) => {
  try {
    await transporter.sendMail({
      from,
      to,
      subject,
      html,
      attachments,
    });
  } catch (error) {
    logger.error('Failed to send users report:', error);
    throw error;
  }
};

export const sendTaskUpdatesEmail = async (data) => {
  try {
    const update = data.update;

    const appUrl = process.env.CLIENT_URL;

    const updatedBy = `${data.updatedBy.firstName}${data.updatedBy.lastName ? ` ${data.updatedBy.lastName}` : ''}`;

    let subject = 'Task Updated';
    let html;

    if (update === 'TASK_ASSIGNED') {
      subject = 'New Task Assigned';

      html = `
        <h2>New Task Assigned</h2>

        <p>Hello <strong>${data.assignedTo.firstName}</strong>,</p>

        <p>You have been assigned a new task.</p>

        <p><strong>Task:</strong> ${data.title}</p>
        <p><strong>Assigned By:</strong> ${updatedBy}</p>

        <p>
          <a href="${appUrl}/tasks/${data.taskId}">View Task in AdminSphere</a>
        </p>

        <br>

        <p>Regards,</p>
        <p><strong>AdminSphere Team</strong></p>
      `;
    } else if (update === 'TASK_REASSIGNED') {
      subject = 'Task Reassigned';

      html = `
        <h2>Task Reassigned</h2>

        <p>Hello <strong>${data.assignedTo.firstName}</strong>,</p>

        <p>
          The task "<strong>${data.title}</strong>" was reassigned to another user.
        </p>

        <p>
          <a href="${appUrl}">Please log in to AdminSphere for more details.</a>
        </p>

        <br>

        <p>Regards,</p>
        <p><strong>AdminSphere Team</strong></p>
      `;
    } else if (update === 'TASK_UNASSIGNED') {
      subject = 'Task Unassigned';

      html = `
        <h2>Task Unassigned</h2>

        <p>Hello <strong>${data.assignedTo.firstName}</strong>,</p>

        <p>
          The task "<strong>${data.title}</strong>" is no longer assigned to you.
        </p>

        <p>
          <a href="${appUrl}">Please log in to AdminSphere for more details.</a>
        </p>

        <br>

        <p>Regards,</p>
        <p><strong>AdminSphere Team</strong></p>
      `;
    }

    await transporter.sendMail({
      from,
      to: data.assignedTo.email,
      subject,
      html,
    });
  } catch (error) {
    logger.error(`Failed to send ${data.update} email:`, error);
  }
};

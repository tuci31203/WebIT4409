import { Resend } from 'resend'

import EmailTemplate from '@/components/email-template'
import envConfig, { BASE_URL } from '@/config/env.config'
import { findUserByEmail } from '@/service/user.service'

const resend = new Resend(envConfig.RESEND_EMAIL_API_KEY)

export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmationURL = `${BASE_URL}/verify-email?token=${token}`

  await resend.emails.send({
    from: 'DisCode <noreply@tuci31203.id.vn>',
    to: email,
    subject: 'Please verify your email address',
    react: EmailTemplate({
      preview: 'Please verify your email address',
      url: confirmationURL,
      title: 'Final step',
      instruction: 'Click the button below to confirm your email address and complete the setup.',
      contentMode: 'button',
      buttonContent: 'Confirm now',
      footerNote: 'If you didn’t request to verify this address, you can safely ignore this email.'
    })
  })
}

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const user = await findUserByEmail(email)
  const resetPasswordURL = `${BASE_URL}/reset-password?token=${token}`

  await resend.emails.send({
    from: 'DisCode <noreply@resend.dev>',
    to: email,
    subject: 'Reset your password',
    react: EmailTemplate({
      preview: 'Reset your password for DisCode',
      url: resetPasswordURL,
      title: 'Reset your password',
      name: user?.name as string,
      instruction:
        'You requested to reset your password for your DisCode account. Click the button below to reset it. If you didn’t make this request, you can safely ignore this email.',
      contentMode: 'button',
      buttonContent: 'Reset your password',
      footerNote:
        'If you didn’t request a password reset, you can safely ignore this email. This link will expire in 15 minutes.'
    })
  })
}

export const sendTwoFactorEmail = async (email: string, token: string) => {
  const user = await findUserByEmail(email)

  await resend.emails.send({
    from: 'DisCode <noreply@resend.dev>',
    to: email,
    subject: 'Two-factor authentication code',
    react: EmailTemplate({
      preview: 'Two-Factor Authentication Code',
      title: 'Your 2FA Code',
      name: user?.name as string,
      instruction:
        'To help secure your account, we need to verify your identity. Please use the code below to complete the verification process:',
      contentMode: 'text',
      textContent: token,
      footerNote:
        'This code will expire in 5 minutes. If you didn’t request this, please ignore this email or contact our support team for further assistance.'
    })
  })
}

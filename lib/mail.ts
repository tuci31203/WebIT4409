import { Resend } from 'resend'

import envConfig, { BASE_URL } from '@/config/env.config'
import { findUserByEmail } from '@/service/user.service'

const resend = new Resend(envConfig.RESEND_EMAIL_API_KEY)

export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmationURL = `${BASE_URL}/verify-email?token=${token}`

  await resend.emails.send({
    from: 'onboarding@resend.dev',
    to: email,
    subject: 'Please verify your email address',

    html: `
      <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
      <html xmlns="http://www.w3.org/1999/xhtml" lang="">

      <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Please activate your account</title>
      </head>

      <body style="font-family: Helvetica, Arial, sans-serif; margin: 0; padding: 0; background-color: #ffffff;">
        <table role="presentation"
          style="width: 100%; border-collapse: collapse; border: 0; border-spacing: 0; font-family: Arial, Helvetica, sans-serif; background-color: rgb(239, 239, 239);">
          <tbody>
            <tr>
              <td align="center" style="padding: 1rem 2rem; vertical-align: top; width: 100%;">
                <table role="presentation" style="max-width: 600px; border-collapse: collapse; border: 0; border-spacing: 0; text-align: left;">
                  <tbody>
                    <tr>
                      <td style="padding: 40px 0 0;">
                        <div style="text-align: left;">
                        </div>
                        <div style="padding: 20px; background-color: rgb(255, 255, 255);">
                          <div style="color: rgb(0, 0, 0); text-align: left;">
                            <h1 style="margin: 1rem 0">Final step...</h1>
                            <p style="padding-bottom: 16px">Follow this link to verify your email address.</p>
                            <p style="padding-bottom: 16px">
                                <a href="${confirmationURL}" target="_blank"
                                style="padding: 12px 24px; border-radius: 4px; color: #FFF; background: #2B52F5;display: inline-block;margin: 0.5rem 0;">Confirm
                                now</a>
                            </p>
                            <p style="padding-bottom: 16px">If you didn’t ask to verify this address, you can ignore this email.</p>
                            <p style="padding-bottom: 16px">Thanks,<br>The DisCode team</p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      </body>

      </html>
    `
  })
}

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const user = await findUserByEmail(email)
  const resetPasswordURL = `${BASE_URL}/reset-password?token=${token}`

  await resend.emails.send({
    from: 'onboarding@resend.dev',
    to: email,
    subject: 'Reset your password',
    html: `
      <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
      <html xmlns="http://www.w3.org/1999/xhtml" lang="">

      <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset your password</title>
      </head>

      <body style="font-family: Helvetica, Arial, sans-serif; margin: 0; padding: 0; background-color: #ffffff;">
        <table role="presentation"
          style="width: 100%; border-collapse: collapse; border: 0; border-spacing: 0; font-family: Arial, Helvetica, sans-serif; background-color: rgb(239, 239, 239);">
          <tbody>
            <tr>
              <td align="center" style="padding: 1rem 2rem; vertical-align: top; width: 100%;">
                <table role="presentation" style="max-width: 600px; border-collapse: collapse; border: 0; border-spacing: 0; text-align: left;">
                  <tbody>
                    <tr>
                      <td style="padding: 40px 0 0;">
                        <div style="padding: 20px; background-color: rgb(255, 255, 255);">
                          <div style="color: rgb(0, 0, 0); text-align: left;">
                            <h1 style="margin: 1rem 0">Trouble signing in?</h1>
                            <p style="padding-bottom: 16px">Hi ${user?.name},</p>
                            <p style="padding-bottom: 16px">We've received a request to reset the password for this user account.</p>
                            <p style="padding-bottom: 16px"><a href="${resetPasswordURL}" target="_blank"
                                style="padding: 12px 24px; border-radius: 4px; color: #FFF; background: #2B52F5;display: inline-block;margin: 0.5rem 0;">Reset
                                your password</a></p>
                            <p style="padding-bottom: 16px">If you didn't ask to reset your password, you can ignore this email.</p>
                            <p style="padding-bottom: 16px">Thanks,<br>The DisCode team</p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      </body>

      </html>
    `
  })
}

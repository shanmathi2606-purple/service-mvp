// Utility to send email verification after signup
import { sendEmailVerification } from "firebase/auth";

export async function sendVerificationEmail(user) {
  try {
    await sendEmailVerification(user);
    return { success: true };
  } catch (error) {
    return { success: false, error };
  }
}

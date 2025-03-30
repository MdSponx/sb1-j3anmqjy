import React, { useState, useEffect } from 'react';
import { sendEmailVerification } from 'firebase/auth';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/button';

const COOLDOWN_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds
const STORAGE_KEY = 'lastVerificationEmailSent';

export function EmailVerificationBanner() {
  const { language } = useLanguage();
  const { user } = useAuth();
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [cooldownRemaining, setCooldownRemaining] = useState(0);

  // Don't show banner if user is verified or no user
  if (!user || user.emailVerified) {
    return null;
  }

  useEffect(() => {
    // Check last sent time from localStorage
    const lastSentTime = localStorage.getItem(STORAGE_KEY);
    if (lastSentTime) {
      const timeSinceLastSent = Date.now() - parseInt(lastSentTime);
      if (timeSinceLastSent < COOLDOWN_DURATION) {
        setCooldownRemaining(COOLDOWN_DURATION - timeSinceLastSent);
      }
    }

    // Update cooldown timer
    const interval = setInterval(() => {
      setCooldownRemaining(prev => {
        if (prev <= 1000) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1000;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTimeRemaining = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return language === 'th'
      ? `${minutes} นาที ${seconds} วินาที`
      : `${minutes}m ${seconds}s`;
  };

  const handleSendVerification = async () => {
    // Check cooldown
    const lastSentTime = localStorage.getItem(STORAGE_KEY);
    if (lastSentTime) {
      const timeSinceLastSent = Date.now() - parseInt(lastSentTime);
      if (timeSinceLastSent < COOLDOWN_DURATION) {
        const remainingTime = formatTimeRemaining(COOLDOWN_DURATION - timeSinceLastSent);
        setError(
          language === 'th'
            ? `กรุณารอ ${remainingTime} ก่อนส่งอีเมลยืนยันอีกครั้ง`
            : `Please wait ${remainingTime} before requesting another verification email`
        );
        return;
      }
    }

    setIsSending(true);
    setError(null);
    setSuccess(false);

    try {
      await sendEmailVerification(user);
      setSuccess(true);
      localStorage.setItem(STORAGE_KEY, Date.now().toString());
      setCooldownRemaining(COOLDOWN_DURATION);
    } catch (err) {
      console.error('Error sending verification email:', err);
      if (err.code === 'auth/too-many-requests') {
        setError(
          language === 'th'
            ? 'มีการส่งอีเมลยืนยันมากเกินไป กรุณารอสักครู่แล้วลองใหม่อีกครั้ง'
            : 'Too many verification emails sent. Please wait a while and try again.'
        );
      } else {
        setError(
          language === 'th'
            ? 'เกิดข้อผิดพลาดในการส่งอีเมล กรุณาลองใหม่อีกครั้ง'
            : 'Error sending verification email. Please try again.'
        );
      }
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 mb-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-yellow-400 font-medium mb-1">
            {language === 'th'
              ? 'ยืนยันอีเมลของคุณ'
              : 'Verify your email address'}
          </h3>
          <p className="text-sm text-gray-300">
            {language === 'th'
              ? 'กรุณายืนยันอีเมลของคุณเพื่อเข้าถึงฟีเจอร์ทั้งหมด'
              : 'Please verify your email address to access all features'}
          </p>
        </div>

        <Button
          onClick={handleSendVerification}
          disabled={isSending || success || cooldownRemaining > 0}
          className="bg-yellow-500 hover:bg-yellow-600 text-black"
        >
          {isSending
            ? language === 'th'
              ? 'กำลังส่ง...'
              : 'Sending...'
            : cooldownRemaining > 0
            ? language === 'th'
              ? `รอ ${formatTimeRemaining(cooldownRemaining)}`
              : `Wait ${formatTimeRemaining(cooldownRemaining)}`
            : success
            ? language === 'th'
              ? 'ส่งแล้ว'
              : 'Sent'
            : language === 'th'
            ? 'ส่งอีเมลยืนยัน'
            : 'Send Verification Email'}
        </Button>
      </div>

      {error && (
        <p className="text-sm text-red-500 mt-2">{error}</p>
      )}

      {success && (
        <p className="text-sm text-green-400 mt-2">
          {language === 'th'
            ? 'ส่งอีเมลยืนยันแล้ว กรุณาตรวจสอบกล่องจดหมายของคุณ'
            : 'Verification email sent. Please check your inbox.'}
        </p>
      )}
    </div>
  );
}
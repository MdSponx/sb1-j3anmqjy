import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '../../../../../components/ui/button';
import { Input } from '../../../../../components/ui/input';
import { Label } from '../../../../../components/ui/label';
import { useLanguage } from '../../../../../contexts/LanguageContext';
import { useUserData } from '../../../../../hooks/useUserData';
import type { Event } from '../../types';

const registrationSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Invalid phone number'),
  persons: z.number()
    .min(1, 'Minimum 1 person')
    .max(2, 'Maximum 2 persons')
});

type RegistrationFormData = z.infer<typeof registrationSchema>;

interface RegistrationFormProps {
  event: Event;
  onSubmit: (data: RegistrationFormData) => Promise<void>;
  loading: boolean;
  error: string | null;
}

export function RegistrationForm({
  event,
  onSubmit,
  loading,
  error
}: RegistrationFormProps) {
  const { language } = useLanguage();
  const { userData } = useUserData();
  
  const { register, handleSubmit, formState: { errors }, setValue } = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      persons: 1
    }
  });

  // Pre-fill form with user data
  useEffect(() => {
    if (userData) {
      setValue('name', userData.fullname_th || '');
      setValue('email', userData.email || '');
      setValue('phone', userData.phone || '');
    }
  }, [userData, setValue]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        {/* Name */}
        <div>
          <Label htmlFor="name" required>
            {language === 'th' ? 'ชื่อ-นามสกุล' : 'Full Name'}
          </Label>
          <Input
            id="name"
            {...register('name')}
            className="bg-gray-800 border-gray-700"
          />
          {errors.name && (
            <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <Label htmlFor="email" required>
            {language === 'th' ? 'อีเมล' : 'Email'}
          </Label>
          <Input
            id="email"
            type="email"
            {...register('email')}
            className="bg-gray-800 border-gray-700"
          />
          {errors.email && (
            <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* Phone */}
        <div>
          <Label htmlFor="phone" required>
            {language === 'th' ? 'เบอร์โทรศัพท์' : 'Phone Number'}
          </Label>
          <Input
            id="phone"
            type="tel"
            {...register('phone')}
            className="bg-gray-800 border-gray-700"
          />
          {errors.phone && (
            <p className="text-sm text-red-500 mt-1">{errors.phone.message}</p>
          )}
        </div>

        {/* Number of Persons */}
        <div>
          <Label htmlFor="persons" required>
            {language === 'th' ? 'จำนวนผู้เข้าร่วม' : 'Number of Persons'}
          </Label>
          <Input
            id="persons"
            type="number"
            min="1"
            max="2"
            {...register('persons', { valueAsNumber: true })}
            className="bg-gray-800 border-gray-700"
          />
          {errors.persons && (
            <p className="text-sm text-red-500 mt-1">{errors.persons.message}</p>
          )}
          <p className="text-xs text-gray-400 mt-1">
            {language === 'th' 
              ? 'สูงสุด 2 ท่านต่อการลงทะเบียน' 
              : 'Maximum 2 persons per registration'}
          </p>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-lg bg-red-500/10 border border-red-500">
          <p className="text-sm text-red-500">{error}</p>
        </div>
      )}

      <div className="flex justify-end gap-3">
        <Button
          type="submit"
          disabled={loading}
          className="bg-red-500 hover:bg-red-600"
        >
          {loading
            ? language === 'th'
              ? 'กำลังลงทะเบียน...'
              : 'Registering...'
            : language === 'th'
            ? 'ยืนยันการลงทะเบียน'
            : 'Confirm Registration'}
        </Button>
      </div>
    </form>
  );
}
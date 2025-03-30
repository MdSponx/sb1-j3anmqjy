import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '../../../../../components/ui/button';
import { Input } from '../../../../../components/ui/input';
import { Label } from '../../../../../components/ui/label';
import { useLanguage } from '../../../../../contexts/LanguageContext';
import { useUserData } from '../../../../../hooks/useUserData';
import type { Project } from '../../../../../types/project';

const registrationSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Invalid phone number'),
  organization: z.string().optional(),
  special_requirements: z.string().optional()
});

type RegistrationFormData = z.infer<typeof registrationSchema>;

interface RegistrationFormProps {
  project: Project;
  onSubmit: (data: RegistrationFormData) => Promise<void>;
  loading: boolean;
  error: string | null;
}

export function RegistrationForm({
  project,
  onSubmit,
  loading,
  error
}: RegistrationFormProps) {
  const { language } = useLanguage();
  const { userData } = useUserData();
  
  const { register, handleSubmit, formState: { errors }, setValue } = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema)
  });

  // Pre-fill form with user data
  React.useEffect(() => {
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

        {/* Organization */}
        <div>
          <Label htmlFor="organization">
            {language === 'th' ? 'หน่วยงาน/องค์กร' : 'Organization'}
          </Label>
          <Input
            id="organization"
            {...register('organization')}
            className="bg-gray-800 border-gray-700"
          />
        </div>

        {/* Special Requirements */}
        <div>
          <Label htmlFor="special_requirements">
            {language === 'th' ? 'ความต้องการพิเศษ' : 'Special Requirements'}
          </Label>
          <textarea
            id="special_requirements"
            {...register('special_requirements')}
            className="w-full rounded-md border border-gray-700 bg-gray-800 text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
            rows={3}
            placeholder={
              language === 'th'
                ? 'เช่น อาหาร, การเข้าถึง, หรือความต้องการอื่นๆ'
                : 'e.g., dietary, accessibility, or other requirements'
            }
          />
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
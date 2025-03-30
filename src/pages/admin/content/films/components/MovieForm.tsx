import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '../../../../../components/ui/input';
import { Label } from '../../../../../components/ui/label';
import { Button } from '../../../../../components/ui/button';
import { useLanguage } from '../../../../../contexts/LanguageContext';

const movieSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  titleEng: z.string().optional(),
  release_date: z.string().min(1, 'Release date is required'),
  director: z.string().min(1, 'Director is required'),
  poster: z.string().url('Invalid URL').optional(),
  synopsis: z.string().optional()
});

type MovieFormData = z.infer<typeof movieSchema>;

interface MovieFormProps {
  onSubmit: (data: MovieFormData) => Promise<void>;
  initialData?: Partial<MovieFormData>;
  isSubmitting?: boolean;
}

export function MovieForm({ onSubmit, initialData, isSubmitting }: MovieFormProps) {
  const { language } = useLanguage();
  const { register, handleSubmit, formState: { errors } } = useForm<MovieFormData>({
    resolver: zodResolver(movieSchema),
    defaultValues: initialData
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="title" required>
            {language === 'th' ? 'ชื่อภาพยนตร์ (ภาษาไทย)' : 'Movie Title (Thai)'}
          </Label>
          <Input
            id="title"
            {...register('title')}
            className="mt-1"
          />
          {errors.title && (
            <p className="text-sm text-red-500 mt-1">{errors.title.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="titleEng">
            {language === 'th' ? 'ชื่อภาพยนตร์ (ภาษาอังกฤษ)' : 'Movie Title (English)'}
          </Label>
          <Input
            id="titleEng"
            {...register('titleEng')}
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="release_date" required>
            {language === 'th' ? 'วันที่เข้าฉาย' : 'Release Date'}
          </Label>
          <Input
            id="release_date"
            type="date"
            {...register('release_date')}
            className="mt-1"
          />
          {errors.release_date && (
            <p className="text-sm text-red-500 mt-1">{errors.release_date.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="director" required>
            {language === 'th' ? 'ผู้กำกับ' : 'Director'}
          </Label>
          <Input
            id="director"
            {...register('director')}
            className="mt-1"
          />
          {errors.director && (
            <p className="text-sm text-red-500 mt-1">{errors.director.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="poster">
            {language === 'th' ? 'URL โปสเตอร์' : 'Poster URL'}
          </Label>
          <Input
            id="poster"
            {...register('poster')}
            className="mt-1"
          />
          {errors.poster && (
            <p className="text-sm text-red-500 mt-1">{errors.poster.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="synopsis">
            {language === 'th' ? 'เรื่องย่อ' : 'Synopsis'}
          </Label>
          <textarea
            id="synopsis"
            {...register('synopsis')}
            rows={4}
            className="w-full mt-1 rounded-md border border-gray-700 bg-gray-800 text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
          />
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => window.history.back()}
          className="border-gray-600"
        >
          {language === 'th' ? 'ยกเลิก' : 'Cancel'}
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-red-500 hover:bg-red-600"
        >
          {isSubmitting
            ? language === 'th' ? 'กำลังบันทึก...' : 'Saving...'
            : language === 'th' ? 'บันทึก' : 'Save'}
        </Button>
      </div>
    </form>
  );
}
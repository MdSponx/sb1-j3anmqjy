import { Language } from '../../types/language';

const thaiMonths = [
  'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
  'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'
];

const englishMonths = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

export function formatDate(dateString: string, language: Language): string {
  try {
    const date = new Date(dateString);
    const day = date.getDate();
    const monthIndex = date.getMonth();
    const year = date.getFullYear();

    if (language === 'th') {
      // Thai format with Buddhist year
      return `${day} ${thaiMonths[monthIndex]} ${year + 543}`;
    } else {
      // English format with CE year
      return `${englishMonths[monthIndex]} ${day}, ${year}`;
    }
  } catch (error) {
    console.warn('Invalid date format:', dateString);
    return dateString;
  }
}
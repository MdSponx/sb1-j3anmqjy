import React, { useState, useEffect } from 'react';
import { Alert, AlertDescription } from '../ui/alert';
import { Button } from '../ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../ui/card';
import { Checkbox } from '../ui/checkbox';
import { ScrollArea } from '../ui/scroll-area';
import { useLanguage } from '../../contexts/LanguageContext';

interface PDPAConsents {
  necessary: boolean;
  functional: boolean;
  analytics: boolean;
  marketing: boolean;
}

export function PDPAConsentSystem() {
  const { language } = useLanguage();
  const [showConsent, setShowConsent] = useState(true);
  const [activeTab, setActiveTab] = useState('main');
  const [consents, setConsents] = useState<PDPAConsents>({
    necessary: true,
    functional: false,
    analytics: false,
    marketing: false,
  });

  // Load saved consents from localStorage on mount
  useEffect(() => {
    const savedConsents = localStorage.getItem('pdpa_consents');
    if (savedConsents) {
      setConsents(JSON.parse(savedConsents));
      setShowConsent(false);
    }
  }, []);

  const handleAcceptAll = () => {
    const allConsents: PDPAConsents = {
      necessary: true,
      functional: true,
      analytics: true,
      marketing: true,
    };
    setConsents(allConsents);
    localStorage.setItem('pdpa_consents', JSON.stringify(allConsents));
    setShowConsent(false);
  };

  const handleSavePreferences = () => {
    localStorage.setItem('pdpa_consents', JSON.stringify(consents));
    setShowConsent(false);
  };

  const MainConsent = () => (
    <Card className="bg-gray-900/90 backdrop-blur-sm border-gray-800">
      <CardContent className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Description */}
          <div className="space-y-4">
            <Alert className="bg-gray-800/80 border-gray-700">
              <AlertDescription>
                {language === 'th'
                  ? 'เว็บไซต์นี้ใช้คุกกี้เพื่อปรับปรุงประสบการณ์การใช้งานของคุณ ตามพระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562'
                  : 'This website uses cookies to improve your experience in accordance with the Personal Data Protection Act B.E. 2562 (2019)'}
              </AlertDescription>
            </Alert>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* Left - Privacy Policy Link */}
              <button
                className="text-red-500 hover:text-red-400 text-sm transition-colors order-last sm:order-first"
                onClick={() => setActiveTab('privacy-policy')}
              >
                {language === 'th'
                  ? 'อ่านนโยบายความเป็นส่วนตัว'
                  : 'Read Privacy Policy'}
              </button>

              {/* Right - Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  variant="outline"
                  onClick={() => setActiveTab('preferences')}
                  className="w-full sm:w-auto bg-gray-800 hover:bg-gray-700 text-white border-gray-700 px-8 py-3"
                >
                  {language === 'th'
                    ? 'ตั้งค่าความเป็นส่วนตัว'
                    : 'Privacy Settings'}
                </Button>
                <Button
                  onClick={handleAcceptAll}
                  className="w-full sm:w-auto bg-red-500 hover:bg-red-600 text-white px-8 py-3"
                >
                  {language === 'th' ? 'ยอมรับทั้งหมด' : 'Accept All'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const PreferencesTab = () => (
    <Card className="w-full max-w-2xl mx-auto bg-gray-900/90 backdrop-blur-sm border-gray-800">
      <CardHeader>
        <CardTitle>
          {language === 'th' ? 'การตั้งค่าความเป็นส่วนตัว' : 'Privacy Settings'}
        </CardTitle>
        <CardDescription>
          {language === 'th'
            ? 'คุณสามารถเลือกประเภทคุกกี้ที่คุณต้องการยอมรับได้'
            : 'You can choose which types of cookies you want to accept'}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <ScrollArea className="h-72">
          <div className="space-y-6">
            {/* Consent checkboxes */}
            {[
              {
                id: 'necessary',
                title:
                  language === 'th' ? 'คุกกี้ที่จำเป็น' : 'Necessary Cookies',
                description:
                  language === 'th'
                    ? 'คุกกี้เหล่านี้จำเป็นสำหรับการทำงานของเว็บไซต์ ไม่สามารถปิดการใช้งานได้'
                    : 'These cookies are essential for the website to function and cannot be disabled',
              },
              {
                id: 'functional',
                title:
                  language === 'th'
                    ? 'คุกกี้เพื่อการใช้งาน'
                    : 'Functional Cookies',
                description:
                  language === 'th'
                    ? 'ช่วยจดจำการตั้งค่าและการเลือกของคุณบนเว็บไซต์'
                    : 'Help remember your settings and preferences on the website',
              },
              {
                id: 'analytics',
                title:
                  language === 'th'
                    ? 'คุกกี้เพื่อการวิเคราะห์'
                    : 'Analytics Cookies',
                description:
                  language === 'th'
                    ? 'ช่วยให้เราเข้าใจวิธีการใช้งานเว็บไซต์ของคุณเพื่อปรับปรุงประสบการณ์'
                    : 'Help us understand how you use the website to improve the experience',
              },
              {
                id: 'marketing',
                title:
                  language === 'th'
                    ? 'คุกกี้เพื่อการตลาด'
                    : 'Marketing Cookies',
                description:
                  language === 'th'
                    ? 'ใช้เพื่อแสดงโฆษณาที่เกี่ยวข้องกับความสนใจของคุณ'
                    : 'Used to display ads relevant to your interests',
              },
            ].map(({ id, title, description }) => (
              <div key={id} className="flex items-start space-x-4">
                <Checkbox
                  id={id}
                  checked={consents[id as keyof PDPAConsents]}
                  disabled={id === 'necessary'}
                  onCheckedChange={(checked) =>
                    setConsents((prev) => ({
                      ...prev,
                      [id]: checked as boolean,
                    }))
                  }
                />
                <div>
                  <label htmlFor={id} className="font-medium text-white">
                    {title}
                  </label>
                  <p className="text-sm text-gray-400">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>

      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => setActiveTab('main')}
          className="bg-gray-800 hover:bg-gray-700 text-white border-gray-700 px-6 py-2"
        >
          {language === 'th' ? 'ย้อนกลับ' : 'Back'}
        </Button>
        <Button
          onClick={handleSavePreferences}
          className="bg-red-500 hover:bg-red-600 text-white px-6 py-2"
        >
          {language === 'th' ? 'บันทึกการตั้งค่า' : 'Save Preferences'}
        </Button>
      </CardFooter>
    </Card>
  );

  const PrivacyPolicy = () => (
    <Card className="w-full max-w-2xl mx-auto bg-gray-900/90 backdrop-blur-sm border-gray-800">
      <CardHeader>
        <CardTitle>
          {language === 'th' ? 'นโยบายความเป็นส่วนตัว' : 'Privacy Policy'}
        </CardTitle>
        <CardDescription>
          {language === 'th'
            ? 'นโยบายการเก็บและใช้ข้อมูลส่วนบุคคลของเรา'
            : 'Our personal data collection and usage policy'}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <ScrollArea className="h-96">
          <div className="space-y-4 text-gray-300">
            <section>
              <h3 className="font-medium mb-2">
                {language === 'th'
                  ? '1. ข้อมูลที่เราเก็บรวบรวม'
                  : '1. Information We Collect'}
              </h3>
              <p className="text-sm text-gray-400">
                {language === 'th'
                  ? 'เราเก็บรวบรวมข้อมูลต่อไปนี้:'
                  : 'We collect the following information:'}
              </p>
              <ul className="list-disc ml-6 mt-2 text-sm text-gray-400">
                <li>
                  {language === 'th'
                    ? 'ข้อมูลที่คุณให้กับเรา เช่น ชื่อ อีเมล หมายเลขโทรศัพท์'
                    : 'Information you provide us, such as name, email, phone number'}
                </li>
                <li>
                  {language === 'th'
                    ? 'ข้อมูลการใช้งานเว็บไซต์ผ่านคุกกี้'
                    : 'Website usage data through cookies'}
                </li>
                <li>
                  {language === 'th'
                    ? 'ข้อมูลอุปกรณ์และการเชื่อมต่อ'
                    : 'Device and connection information'}
                </li>
              </ul>
            </section>

            <section>
              <h3 className="font-medium mb-2">
                {language === 'th'
                  ? '2. วัตถุประสงค์ในการใช้ข้อมูล'
                  : '2. Purpose of Data Usage'}
              </h3>
              <ul className="list-disc ml-6 text-sm text-gray-400">
                <li>
                  {language === 'th'
                    ? 'เพื่อให้บริการและปรับปรุงประสบการณ์การใช้งาน'
                    : 'To provide and improve user experience'}
                </li>
                <li>
                  {language === 'th'
                    ? 'เพื่อการวิเคราะห์และพัฒนาบริการ'
                    : 'For analysis and service improvement'}
                </li>
                <li>
                  {language === 'th'
                    ? 'เพื่อการสื่อสารและการตลาด (หากได้รับความยินยอม)'
                    : 'For communication and marketing (if consent is given)'}
                </li>
              </ul>
            </section>

            <section>
              <h3 className="font-medium mb-2">
                {language === 'th'
                  ? '3. การเปิดเผยข้อมูล'
                  : '3. Data Disclosure'}
              </h3>
              <p className="text-sm text-gray-400">
                {language === 'th'
                  ? 'เราจะไม่เปิดเผยข้อมูลส่วนบุคคลของคุณให้กับบุคคลที่สาม ยกเว้น:'
                  : 'We will not disclose your personal information to third parties except:'}
              </p>
              <ul className="list-disc ml-6 mt-2 text-sm text-gray-400">
                <li>
                  {language === 'th'
                    ? 'ได้รับความยินยอมจากคุณ'
                    : 'With your consent'}
                </li>
                <li>
                  {language === 'th'
                    ? 'เพื่อปฏิบัติตามกฎหมาย'
                    : 'To comply with legal requirements'}
                </li>
                <li>
                  {language === 'th'
                    ? 'ผู้ให้บริการที่เกี่ยวข้องซึ่งต้องปฏิบัติตามมาตรฐานการคุ้มครองข้อมูล'
                    : 'Service providers who must comply with data protection standards'}
                </li>
              </ul>
            </section>

            <section>
              <h3 className="font-medium mb-2">
                {language === 'th' ? '4. สิทธิของคุณ' : '4. Your Rights'}
              </h3>
              <p className="text-sm text-gray-400">
                {language === 'th'
                  ? 'ตาม พ.ร.บ. คุ้มครองข้อมูลส่วนบุคคล คุณมีสิทธิ:'
                  : 'Under the Personal Data Protection Act, you have the right to:'}
              </p>
              <ul className="list-disc ml-6 mt-2 text-sm text-gray-400">
                <li>
                  {language === 'th'
                    ? 'ขอเข้าถึงและขอรับสำเนาข้อมูลส่วนบุคคล'
                    : 'Access and receive a copy of your personal data'}
                </li>
                <li>
                  {language === 'th'
                    ? 'ขอแก้ไขข้อมูลให้ถูกต้อง'
                    : 'Request corrections to your data'}
                </li>
                <li>
                  {language === 'th'
                    ? 'ขอลบหรือทำลายข้อมูล'
                    : 'Request data deletion or destruction'}
                </li>
                <li>
                  {language === 'th'
                    ? 'ขอให้ระงับการใช้ข้อมูล'
                    : 'Request to suspend data usage'}
                </li>
                <li>
                  {language === 'th'
                    ? 'คัดค้านการเก็บรวบรวม ใช้ หรือเปิดเผยข้อมูล'
                    : 'Object to the collection, use, or disclosure of data'}
                </li>
              </ul>
            </section>

            <section>
              <h3 className="font-medium mb-2">
                {language === 'th'
                  ? '5. การรักษาความปลอดภัย'
                  : '5. Security Measures'}
              </h3>
              <p className="text-sm text-gray-400">
                {language === 'th'
                  ? 'เรามีมาตรการรักษาความปลอดภัยทางเทคนิคและทางกายภาพ เพื่อป้องกันการเข้าถึง ใช้ เปลี่ยนแปลง เปิดเผย หรือทำลายข้อมูลส่วนบุคคลโดยไม่ได้รับอนุญาต'
                  : 'We implement technical and physical security measures to prevent unauthorized access, use, modification, disclosure, or destruction of personal data.'}
              </p>
            </section>

            <section>
              <h3 className="font-medium mb-2">
                {language === 'th' ? '6. การติดต่อเรา' : '6. Contact Us'}
              </h3>
              <p className="text-sm text-gray-400">
                {language === 'th'
                  ? 'หากคุณมีคำถามเกี่ยวกับนโยบายความเป็นส่วนตัวหรือต้องการใช้สิทธิของคุณ สามารถติดต่อเจ้าหน้าที่คุ้มครองข้อมูลส่วนบุคคล (DPO) ของเราได้ที่:'
                  : 'If you have questions about our privacy policy or wish to exercise your rights, you can contact our Data Protection Officer (DPO) at:'}
              </p>
              <p className="text-sm text-gray-400 mt-2">
                {language === 'th' ? 'อีเมล' : 'Email'}: contact@thaifilmdirectors.com
                <br />
                {language === 'th' ? 'โทรศัพท์' : 'Phone'}: +66966593969
              </p>
            </section>
          </div>
        </ScrollArea>
      </CardContent>

      <CardFooter>
        <Button
          variant="outline"
          onClick={() => setActiveTab('main')}
          className="bg-gray-800 hover:bg-gray-700 text-white border-gray-700 px-8 py-3"
        >
          {language === 'th' ? 'ย้อนกลับ' : 'Back'}
        </Button>
      </CardFooter>
    </Card>
  );

  if (!showConsent) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-end z-50">
      <div className="container mx-auto p-4">
        {activeTab === 'main' ? (
          <MainConsent />
        ) : activeTab === 'preferences' ? (
          <PreferencesTab />
        ) : (
          <PrivacyPolicy />
        )}
      </div>
    </div>
  );
}

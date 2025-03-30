import React, { useState } from 'react';
import { Container } from '../../../components/ui/Container';
import { EventsList } from './components/EventsList';
import { EventCalendar } from './components/EventCalendar';
import { useLanguage } from '../../../contexts/LanguageContext';
import { useEvents } from '../../../hooks/useEvents';
import { CameraAnimation } from '../../../components/shared/CameraAnimation';
import type { Event } from '../../../types/event';

export function EventsPage() {
  const { language } = useLanguage();
  const { events, loading, error } = useEvents();
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <CameraAnimation />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-red-500">
          {language === 'th'
            ? 'เกิดข้อผิดพลาดในการโหลดข้อมูล'
            : 'Error loading events'}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="pt-32 pb-16">
        <Container>
          <div className="max-w-[1400px] mx-auto">
            {/* Header */}
            <div className="mb-12">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
                {language === 'th' ? 'กิจกรรมสมาคมฯ' : 'Association Events'}
              </h1>
              <p className="text-lg text-gray-400">
                {language === 'th' 
                  ? 'ติดตามกิจกรรมและงานต่างๆ ของสมาคมผู้กำกับภาพยนตร์ไทย'
                  : 'Stay updated with TFDA events and activities'}
              </p>
            </div>

            {/* Two-column layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Calendar Column */}
              <div className="lg:col-span-5">
                <div className="bg-gray-900/90 backdrop-blur-sm rounded-lg p-6">
                  <h2 className="text-2xl font-bold text-white mb-6">
                    {language === 'th' ? 'ปฏิทินกิจกรรม' : 'Event Calendar'}
                  </h2>
                  <EventCalendar 
                    events={events}
                    selectedEvent={selectedEvent}
                    onEventSelect={setSelectedEvent}
                  />
                </div>
              </div>

              {/* Events List Column */}
              <div className="lg:col-span-7">
                <div className="bg-gray-900/90 backdrop-blur-sm rounded-lg p-6 max-h-[800px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800">
                  <h2 className="text-2xl font-bold text-white mb-6">
                    {language === 'th' ? 'รายการกิจกรรม' : 'Event List'}
                  </h2>
                  <EventsList 
                    events={events}
                    selectedEventId={selectedEvent?.id}
                  />
                </div>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
}
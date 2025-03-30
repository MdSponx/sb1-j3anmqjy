import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent,
  DialogHeader,
  DialogTitle
} from '../../../../components/ui/dialog';
import { Button } from '../../../../components/ui/button';
import { Calendar, MapPin, Clock, X, ExternalLink, Ticket, Users } from 'lucide-react';
import { useLanguage } from '../../../../contexts/LanguageContext';
import { getTagColor } from '../utils/tagColors';
import { RegistrationDialog } from './registration/RegistrationDialog';
import { useEventSeats } from '../hooks/useEventSeats';
import type { Event } from '../types';

interface EventDetailsDialogProps {
  event: Event | null;
  onClose: () => void;
}

export function EventDetailsDialog({ event, onClose }: EventDetailsDialogProps) {
  const { language } = useLanguage();
  const [showRegistrationDialog, setShowRegistrationDialog] = useState(false);
  const { totalSeats, remainingSeats, loading: seatsLoading } = useEventSeats(event?.id || '');

  if (!event) return null;

  const formattedDate = new Date(event.date).toLocaleDateString(
    language === 'th' ? 'th-TH' : 'en-US',
    {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }
  );

  const handleCTAClick = () => {
    if (event.external_reg_url) {
      // Open external registration URL in new tab
      window.open(event.external_reg_url, '_blank', 'noopener,noreferrer');
    } else if (event.requires_registration) {
      // Show internal registration dialog
      setShowRegistrationDialog(true);
    } else if (event.is_paid && event.ticket_purchase_url) {
      // Open ticket purchase URL in new tab
      window.open(event.ticket_purchase_url, '_blank', 'noopener,noreferrer');
    }
  };

  const getCTALabel = () => {
    if (event.external_reg_url) {
      return language === 'th' ? 'ลงทะเบียนภายนอก' : 'External Registration';
    }
    if (event.is_paid) {
      return language === 'th' ? 'ซื้อบัตร' : 'Buy Tickets';
    }
    return language === 'th' ? 'ลงทะเบียน' : 'Register';
  };

  const handleOriginalLinkClick = () => {
    if (event.original_url) {
      window.open(event.original_url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <Dialog open={!!event} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl h-[90vh] flex flex-col p-0 gap-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="sr-only">
            {language === 'th' ? 'รายละเอียดกิจกรรม' : 'Event Details'}
          </DialogTitle>
        </DialogHeader>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 rounded-full hover:bg-gray-700 transition-colors z-10"
        >
          <X className="h-5 w-5 text-gray-400" />
        </button>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Event Image */}
          <div className="aspect-video w-full">
            <img
              src={event.image}
              alt={event.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Event Details */}
          <div className="p-6 space-y-6">
            {/* Title */}
            <h2 className="text-3xl font-bold text-white">{event.title}</h2>

            {/* Date, Time, Location */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                {/* Date */}
                <div className="flex items-center gap-3 text-lg">
                  <Calendar className="w-6 h-6 text-red-500 flex-shrink-0" />
                  <span className="text-white">{formattedDate}</span>
                </div>

                {/* Time */}
                <div className="flex items-center gap-3 text-lg">
                  <Clock className="w-6 h-6 text-red-500 flex-shrink-0" />
                  <span className="text-white">{event.time}</span>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-center gap-3 text-lg">
                <MapPin className="w-6 h-6 text-red-500 flex-shrink-0" />
                {event.locationUrl ? (
                  <a
                    href={event.locationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:text-red-400 transition-colors flex items-center gap-2"
                  >
                    {event.venue}
                    <ExternalLink className="w-4 h-4" />
                  </a>
                ) : (
                  <span className="text-white">{event.venue}</span>
                )}
              </div>
            </div>

            {/* Tags */}
            {(event.tags?.length > 0 || event.custom_tags?.length > 0) && (
              <div className="flex flex-wrap gap-2">
                {event.tags?.map((tag) => {
                  const { bgColor, textColor } = getTagColor(tag);
                  return (
                    <span
                      key={tag}
                      className={`px-3 py-1 text-sm font-medium rounded-full ${bgColor} ${textColor}`}
                    >
                      {tag}
                    </span>
                  );
                })}
                {event.custom_tags?.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 text-sm font-medium rounded-full bg-purple-500/20 text-purple-400"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Admission Details */}
            <div className="space-y-4">
              {/* Free/Paid Status */}
              {event.is_free ? (
                <div className="flex items-center gap-2 text-green-400">
                  <Ticket className="w-5 h-5" />
                  <span>{language === 'th' ? 'เข้าชมฟรี' : 'Free Admission'}</span>
                </div>
              ) : event.is_paid ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-yellow-400">
                    <Ticket className="w-5 h-5" />
                    <span>{language === 'th' ? 'มีค่าใช้จ่าย' : 'Paid Admission'}</span>
                  </div>
                  {event.ticketInfo && (
                    <p className="text-gray-300 ml-7">{event.ticketInfo}</p>
                  )}
                </div>
              ) : null}

              {/* Available Seats */}
              {event.requires_registration && !event.unlimited_participants && (
                <div className="flex items-center gap-2 text-gray-300">
                  <Users className="w-5 h-5 text-gray-400" />
                  {seatsLoading ? (
                    <span className="text-gray-400">
                      {language === 'th' 
                        ? 'กำลังโหลดข้อมูลที่นั่ง...' 
                        : 'Loading seats...'}
                    </span>
                  ) : (
                    totalSeats !== null && remainingSeats !== null ? (
                      <span>
                        {language === 'th' 
                          ? `ที่นั่งว่าง: ${remainingSeats} จาก ${totalSeats} ที่นั่ง`
                          : `Available seats: ${remainingSeats} of ${totalSeats}`}
                      </span>
                    ) : null
                  )}
                </div>
              )}
            </div>

            {/* Description */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">
                  {language === 'th' ? 'รายละเอียด' : 'Description'}
                </h3>
                {event.original_url && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleOriginalLinkClick}
                    className="text-gray-400 hover:text-white"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    {language === 'th' ? 'ลิงค์ต้นทาง' : 'Original Link'}
                  </Button>
                )}
              </div>
              <p className="text-gray-300 whitespace-pre-line">
                {event.fullDescription || event.description}
              </p>
            </div>
          </div>
        </div>

        {/* Fixed Footer with CTA */}
        {(event.is_paid || event.requires_registration || event.external_reg_url) && (
          <div className="p-6 border-t border-gray-800 bg-gray-900">
            <Button 
              onClick={handleCTAClick}
              className="w-full bg-red-500 hover:bg-red-600"
            >
              {event.external_reg_url && <ExternalLink className="w-4 h-4 mr-2" />}
              {getCTALabel()}
            </Button>
          </div>
        )}
      </DialogContent>

      {/* Registration Dialog */}
      {showRegistrationDialog && (
        <RegistrationDialog
          event={event}
          isOpen={showRegistrationDialog}
          onClose={() => setShowRegistrationDialog(false)}
        />
      )}
    </Dialog>
  );
}
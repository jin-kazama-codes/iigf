import React, { useState } from 'react';
import { 
  X, 
  Calendar, 
  MapPin, 
  CheckCircle2, 
  Sparkles, 
  Navigation, 
  MessageSquare, 
  CalendarCheck
} from 'lucide-react';
import { Exhibitor, Meeting } from '../types';

interface MeetingSchedulerModalProps {
  exhibitor: Exhibitor | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmMeeting: (meeting: Meeting) => void;
  onNavigateToDirections?: (hall: string, stall: string) => void;
}

export const MeetingSchedulerModal: React.FC<MeetingSchedulerModalProps> = ({
  exhibitor,
  isOpen,
  onClose,
  onConfirmMeeting,
  onNavigateToDirections
}) => {
  const [selectedDate, setSelectedDate] = useState('14 July 2026');
  const [selectedTime, setSelectedTime] = useState('11:30 AM');
  const [selectedDuration, setSelectedDuration] = useState(30);
  const [purpose, setPurpose] = useState('Review SS27 organic knitwear sample range & private-label MOQ terms');
  const [isBooked, setIsBooked] = useState(false);
  const [bookedMeeting, setBookedMeeting] = useState<Meeting | null>(null);

  if (!isOpen || !exhibitor) return null;

  const availableSlots = [
    '10:00 AM', '10:45 AM', '11:30 AM', '12:15 PM',
    '02:00 PM', '02:45 PM', '03:30 PM', '04:15 PM'
  ];

  const handleBook = () => {
    const meeting: Meeting = {
      id: `meet-${Date.now()}`,
      exhibitorId: exhibitor.id,
      exhibitorName: exhibitor.name,
      hall: exhibitor.hall,
      stall: exhibitor.stall,
      date: selectedDate,
      time: selectedTime,
      durationMinutes: selectedDuration,
      status: 'Confirmed',
      purpose,
      buyerName: 'Sarah Williams',
      buyerCompany: 'Meridian Apparel UK Ltd'
    };
    setBookedMeeting(meeting);
    setIsBooked(true);
    onConfirmMeeting(meeting);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-slate-200 overflow-hidden">
        {/* Header (IIGF Pink Theme) */}
        <div className="bg-[#E6005C] text-white p-5 flex items-center justify-between border-b border-[#C2004D]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-white text-[#E6005C] flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white uppercase">
                {isBooked ? 'Meeting Confirmed' : 'Schedule B2B Meeting'}
              </h3>
              <p className="text-[11px] text-pink-100">
                {isBooked ? 'Synchronized with your personal IIGF agenda' : 'Direct booking with verified manufacturer booth'}
              </p>
            </div>
          </div>

          <button onClick={onClose} className="text-white/80 hover:text-white p-1 rounded cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {!isBooked ? (
            <div className="space-y-4 text-xs">
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold text-[#E6005C] uppercase tracking-wider block">Target Exhibitor</span>
                  <h4 className="text-sm font-bold text-slate-900 mt-0.5">{exhibitor.name}</h4>
                  <div className="flex items-center gap-2 text-slate-500 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-[#E6005C]" />
                    <span className="font-semibold text-slate-800">{exhibitor.hall} — {exhibitor.stall}</span>
                    <span>·</span>
                    <span>{exhibitor.location}</span>
                  </div>
                </div>
                <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {exhibitor.matchScore || 92}% Match
                </span>
              </div>

              {/* Date Selection */}
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">Select Fair Date</label>
                <div className="grid grid-cols-3 gap-2">
                  {['14 July 2026', '15 July 2026', '16 July 2026'].map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setSelectedDate(d)}
                      className={`py-2 px-2 rounded-lg border text-center transition-colors cursor-pointer ${
                        selectedDate === d
                          ? 'bg-[#E6005C] text-white border-[#E6005C] font-bold shadow-xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Slots */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="font-bold text-slate-700">Select Time Slot</label>
                  <span className="text-emerald-700 font-semibold flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-[#E6005C]" />
                    AI Conflict Free
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {availableSlots.map((time) => (
                    <button
                      key={time}
                      type="button"
                      onClick={() => setSelectedTime(time)}
                      className={`py-1.5 px-2 rounded border text-center transition-colors cursor-pointer ${
                        selectedTime === time
                          ? 'bg-[#E6005C] text-white border-[#E6005C] font-bold shadow-xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>

              {/* Meeting Objective */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Meeting Objective / Agenda</label>
                <input
                  type="text"
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-[#E6005C]"
                />
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleBook}
                  className="w-full py-2.5 bg-[#E6005C] hover:bg-[#C2004D] text-white font-bold rounded-lg shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <CalendarCheck className="w-4 h-4" />
                  <span>Confirm Slot & Add to Agenda</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4 text-center">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto border border-emerald-300">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-900">Meeting Confirmed</h4>
              <p className="text-xs text-slate-500">
                Notification dispatched to {exhibitor.contactPerson} at {exhibitor.name}
              </p>

              <div className="bg-[#FDF2F4] p-4 rounded-xl border border-pink-200 text-left text-xs space-y-2">
                <div className="flex items-center justify-between pb-2 border-b border-pink-200">
                  <span className="font-bold text-slate-900">{selectedDate} · {selectedTime}</span>
                  <span className="font-bold text-[#E6005C]">{exhibitor.hall} — {exhibitor.stall}</span>
                </div>
                <div className="text-slate-700">
                  <strong>Agenda: </strong> {purpose}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 text-xs font-bold">
                <button
                  onClick={() => alert('Calendar invite exported!')}
                  className="py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg border border-slate-300 cursor-pointer"
                >
                  Add to Calendar
                </button>
                <button
                  onClick={() => {
                    onClose();
                    if (onNavigateToDirections) {
                      onNavigateToDirections(exhibitor.hall, exhibitor.stall);
                    }
                  }}
                  className="py-2 bg-[#E6005C] hover:bg-[#C2004D] text-white rounded-lg cursor-pointer"
                >
                  Get Directions
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

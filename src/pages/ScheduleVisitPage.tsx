import React, { useState } from 'react';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { projectsData } from '../data/projectsData';
import { EditableText } from '../components/admin/EditableText';
import { ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';

export const ScheduleVisitPage: React.FC = () => {
  const [step, setStep] = useState(1);
  const [selectedProject, setSelectedProject] = useState(projectsData[0].id);
  const [visitDate, setVisitDate] = useState('');
  const [visitTime, setVisitTime] = useState('10:00 AM');
  const [numVisitors, setNumVisitors] = useState('2');
  const [visitorName, setVisitorName] = useState('');
  const [visitorEmail, setVisitorEmail] = useState('');
  const [visitorPhone, setVisitorPhone] = useState('');

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
    }
  };

  return (
    <div className="space-y-xl py-sm">
      <div className="container-custom space-y-md">
        <Breadcrumbs items={[{ label: 'Schedule a Site Visit' }]} />

        {/* Page Header */}
        <div className="space-y-xs">
          <EditableText 
            contentKey="schedule_title"
            tag="h1"
            className="font-headline-xl-mobile md:font-headline-xl text-headline-xl-mobile md:text-headline-xl text-primary font-bold"
          />
          <EditableText 
            contentKey="schedule_subtitle"
            tag="p"
            className="font-body-lg text-body-lg text-on-surface-variant max-w-3xl leading-relaxed"
          />
        </div>

      </div>

      {/* Booking flow — banded so the form reads as a distinct step away from the page header */}
      <div className="section-band section-dots py-16">
        <div className="container-custom space-y-md">
        {/* Step Indicator */}
        <div className="max-w-2xl mx-auto flex items-center justify-between border-b border-outline-variant/30 pb-4">
          <div className={`flex items-center gap-2 font-label-lg text-label-lg font-bold ${step >= 1 ? 'text-primary' : 'text-on-surface-variant'}`}>
            <span className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${step >= 1 ? 'bg-primary' : 'bg-surface-container-high text-on-surface-variant'}`}>1</span>
            <EditableText contentKey="schedule_step1_label" value="Select Project" tag="span" inline />
          </div>

          <div className={`flex items-center gap-2 font-label-lg text-label-lg font-bold ${step >= 2 ? 'text-primary' : 'text-on-surface-variant'}`}>
            <span className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${step >= 2 ? 'bg-primary' : 'bg-surface-container-high text-on-surface-variant'}`}>2</span>
            <EditableText contentKey="schedule_step2_label" value="Visitor Info" tag="span" inline />
          </div>

          <div className={`flex items-center gap-2 font-label-lg text-label-lg font-bold ${step >= 3 ? 'text-primary' : 'text-on-surface-variant'}`}>
            <span className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${step >= 3 ? 'bg-primary' : 'bg-surface-container-high text-on-surface-variant'}`}>3</span>
            <EditableText contentKey="schedule_step3_label" value="Confirmation" tag="span" inline />
          </div>
        </div>

        {/* Multi-Step Form */}
        <div className="interactive-panel max-w-2xl mx-auto bg-surface-container-lowest p-8 rounded-2xl border border-outline-variant/20 shadow-md">
          {step === 1 && (
            <form onSubmit={handleNext} className="space-y-6">
              <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                <EditableText contentKey="schedule_step1_title" value="Step 1: Choose Estate &amp; Preferred Date" tag="span" inline />
              </h2>

              <div>
                <label className="block font-label-lg text-label-lg text-on-surface-variant mb-2 font-bold uppercase"><EditableText contentKey="schedule_label_project" value="Select Project Site" tag="span" inline /></label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {projectsData.map(p => (
                    <div 
                      key={p.id}
                      onClick={() => setSelectedProject(p.id)}
                      className={`interactive-panel p-4 rounded-xl border cursor-pointer transition-all ${
                        selectedProject === p.id 
                          ? 'border-primary bg-primary-container/20 ring-2 ring-primary' 
                          : 'border-outline-variant hover:border-primary/50'
                      }`}
                    >
                      <div className="font-headline-sm text-sm text-on-surface font-bold">{p.name}</div>
                      <div className="text-body-sm text-on-surface-variant mt-1">{p.location}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-label-lg text-label-lg text-on-surface-variant mb-1"><EditableText contentKey="schedule_label_date" value="Preferred Date" tag="span" inline /></label>
                  <input 
                    type="date" 
                    required 
                    value={visitDate}
                    onChange={(e) => setVisitDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded border border-outline-variant bg-surface text-body-md focus:ring-1 focus:ring-primary focus:border-primary outline-none"
                  />
                </div>
                <div>
                  <label className="block font-label-lg text-label-lg text-on-surface-variant mb-1"><EditableText contentKey="schedule_label_time" value="Preferred Time Slot" tag="span" inline /></label>
                  <select 
                    value={visitTime}
                    onChange={(e) => setVisitTime(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded border border-outline-variant bg-surface text-body-md focus:ring-1 focus:ring-primary focus:border-primary outline-none"
                  >
                    <option value="9:00 AM">9:00 AM Morning Tour</option>
                    <option value="10:30 AM">10:30 AM Morning Tour</option>
                    <option value="2:00 PM">2:00 PM Afternoon Tour</option>
                    <option value="4:00 PM">4:00 PM Sunset Tour</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-3 bg-primary text-on-primary font-label-lg text-label-lg rounded flex items-center gap-2 hover:bg-primary-container hover:text-on-primary-container transition-colors cursor-pointer h-[48px]"
                >
                  <EditableText contentKey="schedule_cta_continue" value="Continue" tag="span" inline />
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleNext} className="space-y-6">
              <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                <EditableText contentKey="schedule_step2_title" value="Step 2: Enter Visitor Information" tag="span" inline />
              </h2>

              <div>
                <label className="block font-label-lg text-label-lg text-on-surface-variant mb-1"><EditableText contentKey="schedule_label_name" value="Full Name" tag="span" inline /></label>
                <input 
                  type="text" 
                  required 
                  value={visitorName}
                  onChange={(e) => setVisitorName(e.target.value)}
                  placeholder="e.g. Maria Santos"
                  className="w-full px-3.5 py-2.5 rounded border border-outline-variant bg-surface text-body-md focus:ring-1 focus:ring-primary focus:border-primary outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-label-lg text-label-lg text-on-surface-variant mb-1"><EditableText contentKey="schedule_label_email" value="Email Address" tag="span" inline /></label>
                  <input 
                    type="email" 
                    required 
                    value={visitorEmail}
                    onChange={(e) => setVisitorEmail(e.target.value)}
                    placeholder="maria@example.com"
                    className="w-full px-3.5 py-2.5 rounded border border-outline-variant bg-surface text-body-md focus:ring-1 focus:ring-primary focus:border-primary outline-none"
                  />
                </div>
                <div>
                  <label className="block font-label-lg text-label-lg text-on-surface-variant mb-1"><EditableText contentKey="schedule_label_mobile" value="Mobile Number" tag="span" inline /></label>
                  <input 
                    type="tel" 
                    required 
                    value={visitorPhone}
                    onChange={(e) => setVisitorPhone(e.target.value)}
                    placeholder="+63 917 000 0000"
                    className="w-full px-3.5 py-2.5 rounded border border-outline-variant bg-surface text-body-md focus:ring-1 focus:ring-primary focus:border-primary outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-label-lg text-label-lg text-on-surface-variant mb-1"><EditableText contentKey="schedule_label_visitors" value="Number of Visitors" tag="span" inline /></label>
                <select 
                  value={numVisitors}
                  onChange={(e) => setNumVisitors(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded border border-outline-variant bg-surface text-body-md focus:ring-1 focus:ring-primary focus:border-primary outline-none"
                >
                  <option value="1">1 Person</option>
                  <option value="2">2 Persons</option>
                  <option value="3-5">Family Group (3-5 Persons)</option>
                </select>
              </div>

              <div className="flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2.5 border border-outline-variant text-on-surface-variant font-label-lg text-label-lg rounded flex items-center gap-1 hover:bg-surface-container-low cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <EditableText contentKey="schedule_cta_back" value="Back" tag="span" inline />
                </button>

                <button
                  type="submit"
                  className="px-6 py-3 bg-primary text-on-primary font-label-lg text-label-lg rounded flex items-center gap-2 hover:bg-primary-container hover:text-on-primary-container transition-colors cursor-pointer h-[48px]"
                >
                  <EditableText contentKey="schedule_cta_complete" value="Complete Reservation" tag="span" inline />
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {step === 3 && (
            <div className="text-center py-6 space-y-4">
              <CheckCircle className="w-16 h-16 text-primary mx-auto" />
              <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface font-bold">
                <EditableText contentKey="schedule_success_title" value="Site Visit Booked Successfully!" tag="span" inline />
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant max-w-[448px] mx-auto">
                Thank you <strong>{visitorName}</strong>. Your complimentary estate tour for {visitDate || 'your chosen date'} at {visitTime} has been logged. Our site tour coordinator will contact you at {visitorPhone} to confirm gate access passes.
              </p>

              <div className="p-4 bg-surface-container-low rounded-xl border border-outline-variant/30 text-left text-body-sm space-y-1.5 max-w-[448px] mx-auto mt-4 shadow-sm">
                <div><strong><EditableText contentKey="schedule_project_label" value="Project Site:" tag="span" inline /></strong> {projectsData.find(p => p.id === selectedProject)?.name}</div>
                <div><strong><EditableText contentKey="schedule_meeting_label" value="Meeting Point:" tag="span" inline /></strong> <EditableText contentKey="schedule_meeting_value" value="Main Gatehouse &amp; Clubhouse" tag="span" inline /></div>
                <div><strong><EditableText contentKey="schedule_hotline_label" value="Contact Hotline:" tag="span" inline /></strong> <EditableText contentKey="schedule_hotline_value" value="+63 917 123 4567" tag="span" inline /></div>
              </div>

              <button
                onClick={() => setStep(1)}
                className="mt-4 px-6 py-2.5 bg-primary text-on-primary font-label-lg text-label-lg rounded hover:bg-primary-container hover:text-on-primary-container transition-colors cursor-pointer h-[44px]"
              >
                <EditableText contentKey="schedule_cta_again" value="Book Another Visit" tag="span" inline />
              </button>
            </div>
          )}
        </div>
        </div>
      </div>
    </div>
  );
};
export default ScheduleVisitPage;

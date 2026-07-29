import React, { useState } from 'react';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import { projectsData } from '../data/projectsData';
import { EditableText } from '../components/admin/EditableText';

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

        {/* Step Indicator */}
        <div className="max-w-2xl mx-auto flex items-center justify-between border-b border-outline-variant/30 pb-4">
          <div className={`flex items-center gap-2 font-label-lg text-label-lg font-bold ${step >= 1 ? 'text-primary' : 'text-on-surface-variant'}`}>
            <span className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${step >= 1 ? 'bg-primary' : 'bg-surface-container-high text-on-surface-variant'}`}>1</span>
            <span>Select Project</span>
          </div>

          <div className={`flex items-center gap-2 font-label-lg text-label-lg font-bold ${step >= 2 ? 'text-primary' : 'text-on-surface-variant'}`}>
            <span className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${step >= 2 ? 'bg-primary' : 'bg-surface-container-high text-on-surface-variant'}`}>2</span>
            <span>Visitor Info</span>
          </div>

          <div className={`flex items-center gap-2 font-label-lg text-label-lg font-bold ${step >= 3 ? 'text-primary' : 'text-on-surface-variant'}`}>
            <span className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${step >= 3 ? 'bg-primary' : 'bg-surface-container-high text-on-surface-variant'}`}>3</span>
            <span>Confirmation</span>
          </div>
        </div>

        {/* Multi-Step Form */}
        <div className="max-w-2xl mx-auto bg-surface-container-lowest p-8 rounded-2xl border border-outline-variant/20 shadow-md">
          {step === 1 && (
            <form onSubmit={handleNext} className="space-y-6">
              <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">Step 1: Choose Estate & Preferred Date</h2>

              <div>
                <label className="block font-label-lg text-label-lg text-on-surface-variant mb-2 font-bold uppercase">Select Project Site</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {projectsData.map(p => (
                    <div 
                      key={p.id}
                      onClick={() => setSelectedProject(p.id)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all ${
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
                  <label className="block font-label-lg text-label-lg text-on-surface-variant mb-1">Preferred Date</label>
                  <input 
                    type="date" 
                    required 
                    value={visitDate}
                    onChange={(e) => setVisitDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded border border-outline-variant bg-surface text-body-md focus:ring-1 focus:ring-primary focus:border-primary outline-none"
                  />
                </div>
                <div>
                  <label className="block font-label-lg text-label-lg text-on-surface-variant mb-1">Preferred Time Slot</label>
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
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleNext} className="space-y-6">
              <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">Step 2: Enter Visitor Information</h2>

              <div>
                <label className="block font-label-lg text-label-lg text-on-surface-variant mb-1">Full Name</label>
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
                  <label className="block font-label-lg text-label-lg text-on-surface-variant mb-1">Email Address</label>
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
                  <label className="block font-label-lg text-label-lg text-on-surface-variant mb-1">Mobile Number</label>
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
                <label className="block font-label-lg text-label-lg text-on-surface-variant mb-1">Number of Visitors</label>
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
                  <span>Back</span>
                </button>

                <button
                  type="submit"
                  className="px-6 py-3 bg-primary text-on-primary font-label-lg text-label-lg rounded flex items-center gap-2 hover:bg-primary-container hover:text-on-primary-container transition-colors cursor-pointer h-[48px]"
                >
                  <span>Complete Reservation</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {step === 3 && (
            <div className="text-center py-6 space-y-4">
              <CheckCircle className="w-16 h-16 text-primary mx-auto" />
              <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface font-bold">Site Visit Booked Successfully!</h2>
              <p className="font-body-md text-body-md text-on-surface-variant max-w-[448px] mx-auto">
                Thank you <strong>{visitorName}</strong>. Your complimentary estate tour for {visitDate || 'your chosen date'} at {visitTime} has been logged. Our site tour coordinator will contact you at {visitorPhone} to confirm gate access passes.
              </p>

              <div className="p-4 bg-surface-container-low rounded-xl border border-outline-variant/30 text-left text-body-sm space-y-1.5 max-w-[448px] mx-auto mt-4 shadow-sm">
                <div><strong>Project Site:</strong> {projectsData.find(p => p.id === selectedProject)?.name}</div>
                <div><strong>Meeting Point:</strong> Main Gatehouse & Clubhouse</div>
                <div><strong>Contact Hotline:</strong> +63 917 123 4567</div>
              </div>

              <button
                onClick={() => setStep(1)}
                className="mt-4 px-6 py-2.5 bg-primary text-on-primary font-label-lg text-label-lg rounded hover:bg-primary-container hover:text-on-primary-container transition-colors cursor-pointer h-[44px]"
              >
                Book Another Visit
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default ScheduleVisitPage;

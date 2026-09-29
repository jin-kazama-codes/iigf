import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  Building2, 
  Globe, 
  Layers, 
  ShieldCheck, 
  Calendar,
  Check
} from 'lucide-react';
import { BuyerProfile } from '../types';

interface BuyerRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCompleteRegistration: (profile: BuyerProfile) => void;
}

export const BuyerRegistrationModal: React.FC<BuyerRegistrationModalProps> = ({
  isOpen,
  onClose,
  onCompleteRegistration
}) => {
  const [step, setStep] = useState(1);
  const totalSteps = 4;

  // Form State (Matching Screenshot 5 exact layout)
  const [email, setEmail] = useState('sarah.williams@meridianapparel.co.uk');
  const [companyName, setCompanyName] = useState('Meridian Apparel UK Ltd');
  const [title, setTitle] = useState('Ms.');
  const [firstName, setFirstName] = useState('Sarah');
  const [lastName, setLastName] = useState('Williams');
  const [position, setPosition] = useState('Head of Sustainable Sourcing');
  const [country, setCountry] = useState('United Kingdom');
  const [address, setAddress] = useState('42 Regent Street, London, W1B 5RL');
  const [categories, setCategories] = useState<string[]>(["Women's Wear", 'Casualwear', 'Sustainable Fashion']);
  const [targetMoq, setTargetMoq] = useState('300–500 units');
  const [annualVolume, setAnnualVolume] = useState('£2.4M / 180,000 units');
  const [certifications, setCertifications] = useState<string[]>(['GOTS', 'OEKO-TEX Standard 100', 'SEDEX SMETA']);
  const [isGenerated, setIsGenerated] = useState(false);

  if (!isOpen) return null;

  const toggleCategory = (cat: string) => {
    setCategories(prev => 
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const toggleCert = (cert: string) => {
    setCertifications(prev => 
      prev.includes(cert) ? prev.filter(c => c !== cert) : [...prev, cert]
    );
  };

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      setIsGenerated(true);
    }
  };

  const handleFinish = () => {
    const profile: BuyerProfile = {
      name: `${firstName} ${lastName}`,
      company: companyName,
      country,
      flag: country === 'United Kingdom' ? '🇬🇧' : '🌍',
      role: position,
      productCategories: categories,
      targetMoq,
      targetMarket: 'UK & Europe',
      annualVolume,
      buyingIntent: 'HIGH',
      intentScore: 94,
      certificationsNeeded: certifications,
      sustainabilityPriority: 'GOTS organic cotton, ethical supply chain audits',
      visitDates: ['14 July 2026', '15 July 2026', '16 July 2026']
    };
    onCompleteRegistration(profile);
    onClose();
  };

  const categoryOptions = [
    "Women's Wear", 'Casualwear', 'Sustainable Fashion', 'Knitwear',
    'Eco-Denim', 'Childrenswear', 'Resortwear', 'Outerwear'
  ];

  const certOptions = [
    'GOTS', 'OEKO-TEX Standard 100', 'SEDEX SMETA', 'BSCI Audited',
    'Fair Trade', 'WRAP Certified', 'GRS Recycled', 'HIGG Index'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden my-6">
        {/* Header Ribbon (Exact IIGF Pink Header) */}
        <div className="bg-[#E6005C] text-white p-4 sm:p-5 flex items-center justify-between border-b border-[#C2004D]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-white text-[#E6005C] flex items-center justify-center font-bold">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white uppercase tracking-tight">
                Buyer & Consultant Registration (75th IIGF)
              </h3>
              <p className="text-[11px] text-pink-100">
                AI Automated Qualification & Exporter Matchmaking
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        {!isGenerated && (
          <div className="bg-pink-100 h-1.5 w-full">
            <div 
              className="bg-[#E6005C] h-1.5 transition-all duration-300"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            />
          </div>
        )}

        <div className="p-6">
          {!isGenerated ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-2">
                <span>Step {step} of {totalSteps}</span>
                <span className="text-[#E6005C]">Accreditation & Matchmaking Protocol</span>
              </div>

              {/* Step 1: Contact Details (Matching Screenshot 5) */}
              {step === 1 && (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-xs text-slate-900 focus:outline-none focus:border-[#E6005C]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Company Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-xs text-slate-900 focus:outline-none focus:border-[#E6005C]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Title <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full px-2 py-2 bg-slate-50 border border-slate-300 rounded text-xs text-slate-900 focus:outline-none focus:border-[#E6005C]"
                      >
                        <option value="Ms.">Ms.</option>
                        <option value="Mr.">Mr.</option>
                        <option value="Dr.">Dr.</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        First Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-xs text-slate-900 focus:outline-none focus:border-[#E6005C]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Last Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-xs text-slate-900 focus:outline-none focus:border-[#E6005C]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Position / Designation <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={position}
                        onChange={(e) => setPosition(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-xs text-slate-900 focus:outline-none focus:border-[#E6005C]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Country <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-xs text-slate-900 focus:outline-none focus:border-[#E6005C]"
                      >
                        <option value="United Kingdom">United Kingdom (UK)</option>
                        <option value="United States">United States (USA)</option>
                        <option value="Germany">Germany</option>
                        <option value="France">France</option>
                        <option value="UAE">United Arab Emirates (UAE)</option>
                        <option value="Japan">Japan</option>
                        <option value="Australia">Australia</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Business Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-xs text-slate-900 focus:outline-none focus:border-[#E6005C]"
                    />
                  </div>
                </div>
              )}

              {/* Step 2: Product Categories */}
              {step === 2 && (
                <div className="space-y-3">
                  <span className="text-xs font-bold text-slate-700 block">
                    Select Target Sourcing Categories:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {categoryOptions.map((cat) => {
                      const isSelected = categories.includes(cat);
                      return (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => toggleCategory(cat)}
                          className={`px-3 py-1.5 rounded text-xs font-medium border transition-colors flex items-center gap-1.5 cursor-pointer ${
                            isSelected
                              ? 'bg-[#E6005C] text-white border-[#E6005C]'
                              : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-400'
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3 text-white" />}
                          <span>{cat}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Step 3: MOQ & Volume */}
              {step === 3 && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Target Minimum Order Quantity (MOQ)</label>
                    <select
                      value={targetMoq}
                      onChange={(e) => setTargetMoq(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-xs text-slate-900 focus:outline-none focus:border-[#E6005C]"
                    >
                      <option value="100–300 units">100–300 units (Artisanal / Boutique)</option>
                      <option value="300–500 units">300–500 units (Private Label Retail)</option>
                      <option value="500–1,000 units">500–1,000 units (Mid-Volume)</option>
                      <option value="1,000+ units">1,000+ units (Volume Department Store)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Annual Sourcing Procurement Budget</label>
                    <input
                      type="text"
                      value={annualVolume}
                      onChange={(e) => setAnnualVolume(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-xs text-slate-900 focus:outline-none focus:border-[#E6005C]"
                    />
                  </div>
                </div>
              )}

              {/* Step 4: Certifications */}
              {step === 4 && (
                <div className="space-y-3">
                  <span className="text-xs font-bold text-slate-700 block">
                    Mandatory Social & Sustainability Audits:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {certOptions.map((cert) => {
                      const isSelected = certifications.includes(cert);
                      return (
                        <button
                          key={cert}
                          type="button"
                          onClick={() => toggleCert(cert)}
                          className={`px-3 py-1.5 rounded text-xs font-medium border transition-colors flex items-center gap-1.5 cursor-pointer ${
                            isSelected
                              ? 'bg-[#E6005C] text-white border-[#E6005C]'
                              : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-400'
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3 text-white" />}
                          <span>{cert}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Navigation Actions */}
              <div className="mt-6 pt-4 border-t border-slate-200 flex items-center justify-between">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={() => setStep(step - 1)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
                  >
                    Back
                  </button>
                ) : (
                  <div />
                )}

                <button
                  type="button"
                  onClick={handleNext}
                  className="px-5 py-2 bg-[#E6005C] hover:bg-[#C2004D] text-white text-xs font-bold rounded shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span>{step === totalSteps ? 'Complete & Generate AI Profile' : 'Continue'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            /* GENERATED PROFILE CARD */
            <div className="space-y-4 text-center">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto border border-emerald-300">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-900">AI Buyer Profile Verified</h4>
              <p className="text-xs text-slate-500">
                Accreditation confirmed for {firstName} {lastName} ({companyName})
              </p>

              <div className="bg-[#FDF2F4] border border-pink-200 rounded-xl p-4 text-left text-xs space-y-2">
                <div className="flex items-center justify-between pb-2 border-b border-pink-200">
                  <span className="font-bold text-slate-900">{companyName} ({country})</span>
                  <span className="text-[10px] font-extrabold bg-[#E6005C] text-white px-2 py-0.5 rounded">
                    HIGH INTENT (94)
                  </span>
                </div>
                <div className="text-slate-700">
                  <strong className="text-slate-900">Categories: </strong> {categories.join(', ')}
                </div>
                <div className="text-slate-700">
                  <strong className="text-slate-900">MOQ: </strong> {targetMoq} · {annualVolume}
                </div>
              </div>

              <button
                type="button"
                onClick={handleFinish}
                className="w-full py-2.5 bg-[#E6005C] hover:bg-[#C2004D] text-white text-xs font-bold rounded-lg shadow transition-colors cursor-pointer"
              >
                Go to Buyer Dashboard & View Top Matches
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

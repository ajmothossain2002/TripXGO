import React, { useEffect, useState } from 'react';
import { User, Users, Home, DollarSign, LucideIcon } from 'lucide-react';

// Type definitions
interface FormData {
  destination: string;
  duration: string;
  budget: string;
  travelCompanion: string;
}

interface FormErrors {
  destination?: string;
  duration?: string;
  budget?: string;
  travelCompanion?: string;
}

interface SavedData extends Omit<FormData, 'duration'> {
  duration: number;
  timestamp: string;
}

interface BudgetOption {
  value: string;
  label: string;
  range: string;
  icon: LucideIcon;
}

interface CompanionOption {
  value: string;
  label: string;
  icon: LucideIcon;
}

interface BudgetCardProps {
  option: BudgetOption;
  selected: boolean;
  onClick: (value: string) => void;
}

interface CompanionCardProps {
  option: CompanionOption;
  selected: boolean;
  onClick: (value: string) => void;
}

const TravelPreferencesForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    destination: '',
    duration: '',
    budget: '',
    travelCompanion: ''
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [savedData, setSavedData] = useState<SavedData | null>(null);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);

  const handleInputChange = (name: keyof FormData, value: string): void => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };
  useEffect(()=>{
    console.log(formData)

  },[formData])
  

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.destination.trim()) {
      newErrors.destination = 'Destination is required';
    }
    
    if (!formData.duration.trim()) {
      newErrors.duration = 'Trip duration is required';
    } else if (!/^\d+$/.test(formData.duration)) {
      newErrors.duration = 'Please enter a valid number of days';
    }
    
    if (!formData.budget) {
      newErrors.budget = 'Budget selection is required';
    }
    
    if (!formData.travelCompanion) {
      newErrors.travelCompanion = 'Travel companion selection is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (): void => {
    if (!validateForm()) {
      return;
    }

    const formattedData: SavedData = {
      ...formData,
      duration: parseInt(formData.duration, 10),
      timestamp: new Date().toISOString()
    };

    // In a real environment, you would use:
    // localStorage.setItem('travelPreferences', JSON.stringify(formattedData));
    
    // For this demo, we'll store in state
    setSavedData(formattedData);
    setShowSuccess(true);
    
    console.log('Travel Preferences Saved:', JSON.stringify(formattedData, null, 2));
    
    // Hide success message after 3 seconds
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const resetForm = (): void => {
    setFormData({
      destination: '',
      duration: '',
      budget: '',
      travelCompanion: ''
    });
    setErrors({});
    setSavedData(null);
    setShowSuccess(false);
  };

  const budgetOptions: BudgetOption[] = [
    { value: 'low', label: 'Low', range: '0 - 1000 USD', icon: DollarSign },
    { value: 'medium', label: 'Medium', range: '1000 - 2500 USD', icon: DollarSign },
    { value: 'high', label: 'High', range: '2500+ USD', icon: DollarSign }
  ];

  const companionOptions: CompanionOption[] = [
    { value: 'solo', label: 'Solo', icon: User },
    { value: 'couple', label: 'Couple', icon: Users },
    { value: 'family', label: 'Family', icon: Home }
  ];

  const BudgetCard: React.FC<BudgetCardProps> = ({ option, selected, onClick }) => {
    const IconComponent = option.icon;
    return (

        
      <div
      
        onClick={() => onClick(option.value)}
        className={`flex-1 p-4 bg-white border-2 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md hover:-translate-y-1 ${
          selected ? 'border-blue-500 shadow-lg' : 'border-gray-200'
        }`}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onClick(option.value);
          }
        }}
      >
        <br /><br />
        <div className="flex flex-col items-center space-y-2">
          <IconComponent className={`w-6 h-6 ${selected ? 'text-blue-500' : 'text-gray-500'}`} />
          <h3 className="font-semibold text-lg">{option.label}</h3>
          <p className="text-sm text-gray-600 text-center">{option.range}</p>
        </div>
      </div>
    );
  };

  const CompanionCard: React.FC<CompanionCardProps> = ({ option, selected, onClick }) => {
    const IconComponent = option.icon;
    return (
      <div
        onClick={() => onClick(option.value)}
        className={`flex-1 p-4 bg-white border-2 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md hover:-translate-y-1 ${
          selected ? 'border-blue-500 shadow-lg' : 'border-gray-200'
        }`}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onClick(option.value);
          }
        }}
      >
        <div className="flex flex-col items-center space-y-2">
          <IconComponent className={`w-6 h-6 ${selected ? 'text-blue-500' : 'text-gray-500'}`} />
          <h3 className="font-semibold text-lg">{option.label}</h3>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-7 bg-gray-50 py-30">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Tell us your travel preferences
            </h1>
            <p className="text-gray-600 text-lg">
              Just provide some basic information, and our trip planner will generate a 
              customized itinerary based on your preferences.
            </p>
          </div>

          <div className="space-y-8">
            {/* Destination Field */}
            <div>
              <label 
                htmlFor="destination" 
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                What is destination of choice?
              </label>
              <input
                id="destination"
                type="text"
                value={formData.destination}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                  handleInputChange('destination', e.target.value)
                }
                className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                  errors.destination ? 'border-red-500' : 'border-gray-200'
                }`}
                placeholder="Enter your dream destination"
                aria-describedby={errors.destination ? 'destination-error' : undefined}
              />
              {errors.destination && (
                <p 
                  id="destination-error" 
                  className="text-red-500 text-sm mt-1" 
                  role="alert"
                >
                  {errors.destination}
                </p>
              )}
            </div>

            {/* Duration Field */}
            <div>
              <label 
                htmlFor="duration" 
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                How many days are you planning your trip
              </label>
              <input
                id="duration"
                type="number"
                value={formData.duration}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                  handleInputChange('duration', e.target.value)
                }
                className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                  errors.duration ? 'border-red-500' : 'border-gray-200'
                }`}
                placeholder="Number of days"
                min="1"
                aria-describedby={errors.duration ? 'duration-error' : undefined}
              />
              {errors.duration && (
                <p 
                  id="duration-error" 
                  className="text-red-500 text-sm mt-1" 
                  role="alert"
                >
                  {errors.duration}
                </p>
              )}
            </div>

            {/* Budget Selection */}
            <fieldset>
              <legend className="block text-sm font-medium text-gray-700 mb-2">
                What is Your Budget?
              </legend>
              <p className="text-gray-600 text-sm mb-4">
                The budget is exclusively allocated for activities and dining purposes.
              </p>
              <div className="flex flex-col sm:flex-row gap-4" role="radiogroup">
                {budgetOptions.map((option) => (
                  <BudgetCard
                    key={option.value}
                    option={option}
                    selected={formData.budget === option.value}
                    onClick={(value: string) => handleInputChange('budget', value)}
                  />
                ))}
              </div>
              {errors.budget && (
                <p className="text-red-500 text-sm mt-2" role="alert">
                  {errors.budget}
                </p>
              )}
            </fieldset>

            {/* Travel Companion Selection */}
            <fieldset>
              <legend className="block text-sm font-medium text-gray-700 mb-4">
                Who do you plan on traveling with on your next adventure?
              </legend>
              <div className="flex flex-col sm:flex-row gap-4" role="radiogroup">
                {companionOptions.map((option) => (
                  <CompanionCard
                    key={option.value}
                    option={option}
                    selected={formData.travelCompanion === option.value}
                    onClick={(value: string) => handleInputChange('travelCompanion', value)}
                  />
                ))}
              </div>
              {errors.travelCompanion && (
                <p className="text-red-500 text-sm mt-2" role="alert">
                  {errors.travelCompanion}
                </p>
              )}
            </fieldset>

            {/* Submit Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <button
                type="button"
                onClick={handleSubmit}
                className="flex-1 bg-blue-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors focus:ring-4 focus:ring-blue-200 focus:outline-none"
              >
                Generate My Itinerary
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-4 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors focus:ring-4 focus:ring-gray-200 focus:outline-none"
              >
                Reset
              </button>
            </div>
          </div>

          {/* Success Message */}
          {showSuccess && (
            <div className="mt-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg" role="alert">
              ✅ Travel preferences saved successfully!
            </div>
          )}

          {/* Display saved data for demo purposes */}
          {savedData && (
            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4">Saved Preferences (JSON Format):</h3>
              <div className="bg-gray-100 p-4 rounded-lg overflow-auto">
                <pre className="text-sm text-gray-800">
                  {JSON.stringify(savedData, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TravelPreferencesForm;
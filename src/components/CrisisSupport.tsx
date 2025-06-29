import React from 'react';
import { AlertTriangle, Phone, MessageCircle, Globe, Heart } from 'lucide-react';

interface CrisisSupportProps {
  onContinue?: () => void;
  onEndSession?: () => void;
}

export default function CrisisSupport({ onContinue, onEndSession }: CrisisSupportProps) {
  return (
    <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 space-y-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
          <AlertTriangle size={20} className="text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-red-800">
            I'm concerned about your safety
          </h3>
          <p className="text-sm text-red-700">
            You're not alone, and help is available right now
          </p>
        </div>
      </div>

      <div className="bg-white/70 p-4 rounded-xl space-y-4">
        <h4 className="font-medium text-gray-800 mb-3">Immediate Support Resources:</h4>
        
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
            <Phone size={18} className="text-blue-600" />
            <div>
              <div className="font-medium text-blue-800">Crisis Lifeline</div>
              <div className="text-sm text-blue-700">Call or text 988 (US)</div>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
            <MessageCircle size={18} className="text-green-600" />
            <div>
              <div className="font-medium text-green-800">Crisis Text Line</div>
              <div className="text-sm text-green-700">Text HOME to 741741</div>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
            <Globe size={18} className="text-purple-600" />
            <div>
              <div className="font-medium text-purple-800">International Support</div>
              <div className="text-sm text-purple-700">
                <a 
                  href="https://www.befrienders.org" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="underline hover:no-underline"
                >
                  befrienders.org
                </a> for local helplines
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-amber-50 p-4 rounded-xl">
        <h4 className="font-medium text-amber-800 mb-2">Right Now:</h4>
        <ul className="text-sm text-amber-700 space-y-1">
          <li>• Can you reach out to a trusted friend or family member?</li>
          <li>• Are you in a safe place?</li>
          <li>• Consider going to your nearest emergency room if you're in immediate danger</li>
        </ul>
      </div>

      <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-4 rounded-xl">
        <div className="flex items-center gap-2 mb-2">
          <Heart size={16} className="text-pink-600" />
          <span className="font-medium text-gray-800">Remember:</span>
        </div>
        <p className="text-sm text-gray-700 leading-relaxed">
          Your life has value. This pain you're feeling right now - it can change. 
          You deserve support, care, and the chance to feel better. Please reach out for help.
        </p>
      </div>

      {(onContinue || onEndSession) && (
        <div className="flex gap-3 pt-4 border-t border-red-200">
          {onContinue && (
            <button
              onClick={onContinue}
              className="
                flex-1 px-4 py-3 
                bg-white hover:bg-gray-50
                border border-gray-300 hover:border-gray-400
                text-gray-700 font-medium rounded-xl
                transition-all duration-200
              "
            >
              Continue talking with Bloom
            </button>
          )}
          {onEndSession && (
            <button
              onClick={onEndSession}
              className="
                flex-1 px-4 py-3
                bg-red-500 hover:bg-red-600
                text-white font-medium rounded-xl
                transition-all duration-200
              "
            >
              End session safely
            </button>
          )}
        </div>
      )}
    </div>
  );
}
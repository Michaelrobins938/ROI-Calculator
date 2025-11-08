
import React, { useState, useCallback, useEffect } from 'react';
import { Industry, AllInputs, RoiResult } from '../types';
import { generateAutomationInsights, generateSalesEmail, generateVideoPitch } from '../services/geminiService';

// Fix: Define the AIStudio interface to avoid conflicts with other global declarations
// and to satisfy the type hinted at in the compiler error.
declare global {
  // Fix: The AIStudio interface was moved inside `declare global`.
  // When defined in a module (a file with imports), it becomes a local type. Using a local
  // type for global augmentation can cause type conflicts. Placing it inside `declare global`
  // makes it a true global type, resolving the "Subsequent property declarations" error.
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }

  interface Window {
    aistudio?: AIStudio;
  }
}

interface GeminiInsightsProps {
  industry: Industry;
  inputs: AllInputs;
  results: RoiResult;
}

type ActiveTab = 'insights' | 'email' | 'video';

const GeminiOutput: React.FC<{ content: string }> = ({ content }) => {
    const paragraphs = content.split('\n').filter(p => p.trim() !== '');

    return (
        <div className="prose prose-invert prose-slate text-slate-300 space-y-4 text-left">
            {paragraphs.map((paragraph, pIndex) => {
                if (paragraph.trim().startsWith('* ')) {
                    const itemContent = paragraph.trim().substring(2);
                    const parts = itemContent.split('**').map((part, index) => 
                        index % 2 !== 0 ? <strong key={index}>{part}</strong> : part
                    );
                    return (
                        <div key={pIndex} className="flex items-start">
                            <span className="text-indigo-400 mr-3 mt-1 text-lg leading-none">◆</span>
                            <p className="flex-1 m-0">{parts}</p>
                        </div>
                    );
                }

                const parts = paragraph.split('**').map((part, index) => 
                    index % 2 !== 0 ? <strong key={index}>{part}</strong> : part
                );
                return <p key={pIndex} className="m-0">{parts}</p>;
            })}
        </div>
    );
};


const GeminiInsights: React.FC<GeminiInsightsProps> = ({ industry, inputs, results }) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('insights');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [content, setContent] = useState({
    insights: '',
    email: '',
    videoUrl: ''
  });
  
  const [apiKeySelected, setApiKeySelected] = useState(false);

  useEffect(() => {
    if (activeTab === 'video') {
      window.aistudio?.hasSelectedApiKey?.().then(setApiKeySelected);
    }
  }, [activeTab]);

  const handleSelectApiKey = async () => {
    if (window.aistudio?.openSelectKey) {
        await window.aistudio.openSelectKey();
        setApiKeySelected(true);
    }
  };

  const handleGenerate = useCallback(async (tab: ActiveTab) => {
    setIsLoading(true);
    setError(null);

    try {
      if (tab === 'insights') {
        const result = await generateAutomationInsights(industry, inputs, results);
        setContent(c => ({ ...c, insights: result }));
      } else if (tab === 'email') {
        const result = await generateSalesEmail(industry, results);
        setContent(c => ({ ...c, email: result }));
      } else if (tab === 'video') {
         if (!apiKeySelected) {
            setError("Please select an API key to generate videos.");
            setIsLoading(false);
            return;
         }
        const result = await generateVideoPitch(industry, results, '9:16');
        setContent(c => ({ ...c, videoUrl: result }));
      }
    } catch (err: any) {
      console.error(`Error generating ${tab}:`, err);
      let errorMessage = `An error occurred while generating the ${tab}.`;
       if (err.message && err.message.includes("Requested entity was not found")) {
         errorMessage = "API Key not found or invalid. Please select your API key again.";
         setApiKeySelected(false);
       }
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [industry, inputs, results, apiKeySelected]);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[200px] text-center">
            <svg className="animate-spin -ml-1 mr-3 h-8 w-8 text-indigo-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="mt-4 text-slate-400 font-semibold">
                {activeTab === 'video' ? 'Generating your custom video pitch... this can take a few minutes.' : `Generating ${activeTab}...`}
            </p>
            {activeTab === 'video' && <p className="text-sm text-slate-500 mt-2">Feel free to grab a coffee while our AI works its magic!</p>}
        </div>
      );
    }

    if (error) {
      return <div className="text-red-400 bg-red-900/20 p-4 rounded-md text-center">{error}</div>;
    }

    switch (activeTab) {
      case 'insights':
        return content.insights ? (
            <GeminiOutput content={content.insights} />
        ) : (
          <div className="text-center text-slate-400 py-8">Click "Generate Analysis" to see what automation can do for you.</div>
        );
      case 'email':
        return content.email ? (
          <div>
             <div className="bg-slate-950 p-4 rounded-md border border-slate-700 text-left">
               <pre className="text-sm text-slate-300 whitespace-pre-wrap font-sans">{content.email}</pre>
             </div>
             <button
                onClick={() => navigator.clipboard.writeText(content.email)}
                className="mt-4 px-4 py-2 text-sm font-medium rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
            >
                Copy to Clipboard
            </button>
          </div>
        ) : (
           <div className="text-center text-slate-400 py-8">Click "Generate Email" to get a shareable draft.</div>
        );
       case 'video':
        if (!apiKeySelected) {
            return (
                <div className="text-center py-8">
                    <h3 className="text-lg font-semibold text-indigo-300 mb-2">Video Pitch Generation</h3>
                    <p className="text-slate-400 mb-4">To generate videos with Veo, you need to select your API key.</p>
                    <p className="text-xs text-slate-500 mb-4">
                        For more information on billing, please see the{' '}
                        <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="underline hover:text-indigo-400">
                        billing documentation
                        </a>.
                    </p>
                    <button onClick={handleSelectApiKey} className="px-6 py-2 font-bold rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition-colors">
                        Select API Key
                    </button>
                </div>
            );
        }
        return content.videoUrl ? (
          <div className="flex flex-col items-center">
            <h3 className="text-lg font-semibold text-indigo-300 mb-4">Your Custom Video Pitch</h3>
            <video
              key={content.videoUrl}
              src={content.videoUrl}
              controls
              autoPlay
              loop
              className="rounded-lg shadow-2xl w-full max-w-sm border-2 border-indigo-500/50"
            />
          </div>
        ) : (
          <div className="text-center text-slate-400 py-8">Click "Generate Video" to create a personalized pitch.</div>
        );
      default:
        return null;
    }
  };
  
  const hasContentForTab = (tab: ActiveTab) => {
      switch(tab) {
          case 'insights': return !!content.insights;
          case 'email': return !!content.email;
          case 'video': return !!content.videoUrl;
          default: return false;
      }
  };
  
  const getButtonText = () => {
    const verb = hasContentForTab(activeTab) ? "Regenerate" : "Generate";
    let noun = '';
    switch(activeTab) {
        case 'insights': noun = 'Analysis'; break;
        case 'email': noun = 'Email'; break;
        case 'video': noun = 'Video'; break;
    }
    return `${verb} ${noun}`;
  };

  return (
    <div className="bg-slate-900/70 p-6 rounded-xl shadow-2xl border border-slate-800 backdrop-blur-sm card-glow">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
            <h2 className="text-3xl font-bold text-white">Gemini-Powered Insights</h2>
             <div className="flex-shrink-0 p-1 bg-slate-800 rounded-lg flex gap-1">
                {(['insights', 'email', 'video'] as ActiveTab[]).map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors duration-200 capitalize ${
                            activeTab === tab ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-700'
                        }`}
                    >
                        {tab === 'insights' ? 'AI Analysis' : tab === 'email' ? 'Draft Email' : 'Video Pitch'}
                    </button>
                ))}
            </div>
        </div>
      
        <div className="min-h-[250px] bg-slate-800/50 p-6 rounded-lg border border-slate-700/50 flex items-center justify-center">
           {renderContent()}
        </div>
        
        <div className="mt-6 text-center">
            <button
                onClick={() => handleGenerate(activeTab)}
                disabled={isLoading || (activeTab === 'video' && !apiKeySelected)}
                className="px-8 py-3 font-bold rounded-lg bg-gradient-to-r from-indigo-500 to-cyan-400 text-white shadow-lg transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
            >
                {isLoading ? 'Generating...' : getButtonText()}
            </button>
        </div>
    </div>
  );
};

export default GeminiInsights;
'use client';

import React, { useState } from 'react';
import { X, Info, PlayCircle, BookOpen, History, Link as LinkIcon } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import helpContent from '@/data/helpContent.json';

interface HelpCenterProps {
  onClose: () => void;
  initialTab?: string;
}

type TabType = 'welcome' | 'tutorials' | 'features' | 'resources' | 'versions';

const HelpCenter: React.FC<HelpCenterProps> = ({
  onClose,
  initialTab = 'welcome',
}) => {
  const [activeTab, setActiveTab] = useState<TabType>(initialTab as TabType);
  const [visible, setVisible] = useState(false);

  // Fade-in animation
  React.useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Handle tab change
  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
  };

  // YouTube video player
  const VideoPlayer = ({
    videoId,
    title,
  }: {
    videoId: string;
    title: string;
  }) => (
    <div className='relative aspect-video bg-gray-100 rounded-lg overflow-hidden mb-3'>
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${videoId}?playsinline=1&rel=0`}
        title={title}
        className='absolute inset-0 w-full h-full'
        allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
        allowFullScreen
        loading='lazy'
        referrerPolicy='no-referrer-when-downgrade'
      ></iframe>
    </div>
  );

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50'>
      <div
        className={`bg-white rounded-lg shadow-xl w-full max-w-2xl transform transition-all duration-300 max-h-[90vh] flex flex-col ${
          visible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        }`}
      >
        {/* Header */}
        <div className='flex items-center justify-between p-4 border-b'>
          <h2 className='text-xl font-semibold flex items-center text-brand-blue'>
            <Info className='w-5 h-5 mr-2' />
            Help Center
          </h2>
          <button
            onClick={onClose}
            className='text-gray-500 hover:text-gray-700 focus:outline-none'
          >
            <X className='w-5 h-5' />
          </button>
        </div>

        {/* Tabs - grid for mobile, flex for desktop */}
        <div className='grid grid-cols-5 sm:flex border-b'>
          <button
            className={`px-2 sm:px-4 py-2 font-medium text-xs sm:text-sm flex flex-col sm:flex-row items-center justify-center ${
              activeTab === 'welcome'
                ? 'text-brand-blue border-b-2 border-brand-blue'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => handleTabChange('welcome')}
          >
            <Info className='w-4 h-4 sm:mr-1 mb-1 sm:mb-0' />
            <span>About</span>
          </button>
          <button
            className={`px-2 sm:px-4 py-2 font-medium text-xs sm:text-sm flex flex-col sm:flex-row items-center justify-center ${
              activeTab === 'tutorials'
                ? 'text-brand-blue border-b-2 border-brand-blue'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => handleTabChange('tutorials')}
          >
            <PlayCircle className='w-4 h-4 sm:mr-1 mb-1 sm:mb-0' />
            <span>Tutorials</span>
          </button>
          <button
            className={`px-2 sm:px-4 py-2 font-medium text-xs sm:text-sm flex flex-col sm:flex-row items-center justify-center ${
              activeTab === 'features'
                ? 'text-brand-blue border-b-2 border-brand-blue'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => handleTabChange('features')}
          >
            <BookOpen className='w-4 h-4 sm:mr-1 mb-1 sm:mb-0' />
            <span>Features</span>
          </button>
          <button
            className={`px-2 sm:px-4 py-2 font-medium text-xs sm:text-sm flex flex-col sm:flex-row items-center justify-center ${
              activeTab === 'resources'
                ? 'text-brand-blue border-b-2 border-brand-blue'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => handleTabChange('resources')}
          >
            <LinkIcon className='w-4 h-4 sm:mr-1 mb-1 sm:mb-0' />
            <span>Resources</span>
          </button>
          <button
            className={`px-2 sm:px-4 py-2 font-medium text-xs sm:text-sm flex flex-col sm:flex-row items-center justify-center ${
              activeTab === 'versions'
                ? 'text-brand-blue border-b-2 border-brand-blue'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => handleTabChange('versions')}
          >
            <History className='w-4 h-4 sm:mr-1 mb-1 sm:mb-0' />
            <span>Versions</span>
          </button>
        </div>

        {/* Content - scrollable */}
        <div className='flex-1 overflow-y-auto p-5'>
          {/* Welcome Tab */}
          {activeTab === 'welcome' && (
            <div>
              <h3 className='text-lg font-medium text-gray-800 mb-3'>
                {helpContent.welcome.title}
              </h3>
              <p className='text-gray-700 mb-4'>
                {helpContent.welcome.description}
              </p>

              <h4 className='font-medium text-gray-800 mb-2'>Key Benefits:</h4>
              <ul className='list-disc pl-5 space-y-1 mb-5 text-gray-700'>
                {helpContent.welcome.keyBenefits.map((benefit, index) => (
                  <li key={index}>{benefit}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Tutorials Tab */}
          {activeTab === 'tutorials' && (
            <div>
              <h3 className='text-lg font-medium text-gray-800 mb-3'>
                Tutorial Videos
              </h3>

              <div className='space-y-6'>
                {/* Desktop Tutorial */}
                <div className='bg-gray-50 p-4 rounded-lg'>
                  <h4 className='font-medium text-gray-800 mb-2'>
                    {helpContent.tutorials.desktop.title}
                  </h4>
                  <VideoPlayer
                    videoId='B0V24-WaYH0'
                    title={helpContent.tutorials.desktop.title}
                  />
                  <p className='text-gray-700'>
                    {helpContent.tutorials.desktop.description}
                  </p>
                </div>

                {/* Mobile Tutorial */}
                <div className='bg-gray-50 p-4 rounded-lg'>
                  <h4 className='font-medium text-gray-800 mb-2'>
                    {helpContent.tutorials.mobile.title}
                  </h4>
                  <VideoPlayer
                    videoId='B0V24-WaYH0'
                    title={helpContent.tutorials.mobile.title}
                  />
                  <p className='text-gray-700'>
                    {helpContent.tutorials.mobile.description}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Features Tab */}
          {activeTab === 'features' && (
            <div>
              <h3 className='text-lg font-medium text-gray-800 mb-3'>
                Features & How-To
              </h3>

              <div className='space-y-6'>
                {helpContent.features.map((feature, index) => (
                  <div key={index} className='bg-gray-50 p-4 rounded-lg'>
                    <h4 className='font-medium text-gray-800 mb-2'>
                      {feature.title}
                    </h4>
                    <p className='text-gray-700 mb-3'>{feature.description}</p>
                    {feature.details && (
                      <p className='text-gray-700 mb-3'>{feature.details}</p>
                    )}
                    {feature.steps && (
                      <>
                        <h5 className='font-medium text-gray-800 mb-1'>
                          Steps:
                        </h5>
                        <ol className='list-decimal pl-5 space-y-1 text-gray-700'>
                          {feature.steps.map((step, stepIndex) => (
                            <li key={stepIndex}>{step}</li>
                          ))}
                        </ol>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Resources Tab */}
          {activeTab === 'resources' && (
            <div>
              <h3 className='text-lg font-medium text-gray-800 mb-3'>
                Helpful Resources
              </h3>
              
              <div className='space-y-4'>
                {helpContent.resources.map((resource, index) => (
                  <div key={index} className='bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors'>
                    <a 
                      href={resource.link} 
                      target='_blank' 
                      rel='noopener noreferrer'
                      className='block'
                    >
                      <h4 className='font-medium text-brand-blue mb-1 flex items-center'>
                        <LinkIcon className='w-4 h-4 mr-2' />
                        {resource.title}
                      </h4>
                      <p className='text-gray-700 text-sm'>
                        {resource.description}
                      </p>
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Versions Tab */}
          {activeTab === 'versions' && (
            <div>
              <h3 className='text-lg font-medium text-gray-800 mb-3'>
                Version History
              </h3>

              <div className='space-y-6'>
                {helpContent.versions.map((version, index) => (
                  <div key={index} className='bg-gray-50 p-4 rounded-lg'>
                    <h4 className='font-medium text-gray-800 mb-2'>
                      Version {version.version}{' '}
                      <span className='text-gray-500 font-normal'>
                        ({version.date})
                      </span>
                    </h4>
                    <ul className='space-y-1'>
                      {version.changes.map((change, changeIndex) => (
                        <li
                          key={changeIndex}
                          className='flex items-start gap-2'
                        >
                          <span
                            className={`inline-block px-2 py-0.5 text-xs rounded ${
                              change.type === 'feature'
                                ? 'bg-green-100 text-green-800'
                                : change.type === 'fix'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {change.type}
                          </span>
                          <span className='text-gray-700'>
                            {change.description}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className='border-t p-4 flex justify-end'>
          <Button variant='outline' onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HelpCenter;

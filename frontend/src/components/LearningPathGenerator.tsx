import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockAuthService } from '../services/mockData';
import { useTheme } from '../contexts/ThemeContext';

export default function LearningPathGenerator() {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPath, setGeneratedPath] = useState(null);
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsGenerating(true);
    try {
      const result = await mockAuthService.generateLearningPath(prompt);
      if (result.success) {
        setGeneratedPath(result.path);
        // Navigate to the generated path after a short delay
        setTimeout(() => {
          navigate(`/dashboard/learning-path/${result.path.id}`);
        }, 2000);
      }
    } catch (error) {
      console.error('Failed to generate learning path:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCustomize = () => {
    if (generatedPath) {
      navigate(`/dashboard/learning-path/${generatedPath.id}/customize`);
    }
  };

  return (
    <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-lg p-8 mb-8`}>
      <div className="text-center mb-8">
        <h2 className={`text-3xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          🚀 AI Learning Path Generator
        </h2>
        <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} max-w-2xl mx-auto`}>
          Describe what you want to learn, and our AI will create a personalized learning path just for you.
          Get started with any topic, skill level, or career goal.
        </p>
      </div>

      <form onSubmit={handleGenerate} className="max-w-3xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="flex-1">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., 'I want to become a full-stack developer' or 'Learn machine learning for beginners'"
              className={`w-full px-6 py-4 text-lg border-2 rounded-xl transition-all duration-300 focus:outline-none focus:ring-4 ${
                isDarkMode
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500/20'
                  : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500/20'
              }`}
              disabled={isGenerating}
            />
          </div>
          <button
            type="submit"
            disabled={!prompt.trim() || isGenerating}
            className={`px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold text-lg rounded-xl transition-all duration-300 hover:from-blue-700 hover:to-purple-700 hover:shadow-lg hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${
              isDarkMode ? 'focus:ring-blue-500/40' : ''
            }`}
          >
            {isGenerating ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Generating...</span>
              </div>
            ) : (
              'Generate Path'
            )}
          </button>
        </div>
      </form>

      {/* Generated Path Preview */}
      {generatedPath && (
        <div className={`max-w-3xl mx-auto p-6 rounded-xl border-2 ${
          isDarkMode 
            ? 'bg-gray-700 border-green-500/30' 
            : 'bg-green-50 border-green-200'
        }`}>
          <div className="text-center mb-4">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-white text-2xl">✨</span>
            </div>
            <h3 className={`text-xl font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Path Generated Successfully!
            </h3>
            <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Redirecting to your new learning path...
            </p>
          </div>
          
          <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <h4 className={`font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {generatedPath.title}
            </h4>
            <p className={`text-sm mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {generatedPath.description}
            </p>
            <div className="flex flex-wrap gap-2 mb-3">
              {generatedPath.tags.map((tag, index) => (
                <span
                  key={index}
                  className={`px-3 py-1 text-xs font-medium rounded-full ${
                    isDarkMode
                      ? 'bg-blue-900/50 text-blue-200'
                      : 'bg-blue-100 text-blue-800'
                  }`}
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Difficulty: <span className="font-medium">{generatedPath.difficulty}</span>
              </span>
              <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Duration: <span className="font-medium">{generatedPath.duration}</span>
              </span>
              <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Modules: <span className="font-medium">{generatedPath.modules}</span>
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Tips Section */}
      <div className="mt-8 text-center">
        <h4 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          💡 Tips for Better Results
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
          <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <div className="text-2xl mb-2">🎯</div>
            <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Be specific about your goals and current skill level
            </p>
          </div>
          <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <div className="text-2xl mb-2">⏱️</div>
            <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Mention your preferred timeline and learning pace
            </p>
          </div>
          <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <div className="text-2xl mb-2">🔧</div>
            <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Include specific technologies or tools you want to learn
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useTheme } from '../contexts/ThemeContext';
import { mockPopularModules } from '../services/mockData';

export default function PopularLearningModules() {
  const { isDarkMode } = useTheme();

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'Intermediate':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'Advanced':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Frontend Development': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
      'Backend Development': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
      'Programming Languages': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300',
      'Database': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300',
      'Design': 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300',
      'DevOps': 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300'
    };
    return colors[category] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  };

  return (
    <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-lg p-8 mb-8`}>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className={`text-3xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            📚 Popular Learning Modules
          </h2>
          <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Trending courses loved by thousands of learners
          </p>
        </div>
        <button className={`px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl transition-all duration-300 hover:from-blue-700 hover:to-purple-700 hover:shadow-lg hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-blue-500/30 ${
          isDarkMode ? 'focus:ring-blue-500/40' : ''
        }`}>
          View All Modules
        </button>
      </div>

      {/* Horizontal Scroll Container */}
      <div className="relative">
        <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
          {mockPopularModules.map((module) => (
            <div
              key={module.id}
              className={`flex-shrink-0 w-80 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-2`}
            >
              {/* Thumbnail */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={module.thumbnail}
                  alt={module.title}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                />
                <div className="absolute top-3 right-3">
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${getCategoryColor(module.category)}`}>
                    {module.category}
                  </span>
                </div>
                <div className="absolute bottom-3 left-3">
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${getDifficultyColor(module.difficulty)}`}>
                    {module.difficulty}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className={`text-xl font-bold mb-2 line-clamp-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {module.title}
                </h3>
                <p className={`text-sm mb-4 line-clamp-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {module.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {module.tags.slice(0, 3).map((tag, index) => (
                    <span
                      key={index}
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        isDarkMode
                          ? 'bg-gray-600 text-gray-200'
                          : 'bg-gray-200 text-gray-700'
                      }`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-1">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(module.rating)
                              ? 'text-yellow-400'
                              : 'text-gray-300 dark:text-gray-600'
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {module.rating}
                    </span>
                  </div>
                  <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {module.students.toLocaleString()} students
                  </span>
                </div>

                {/* Duration and CTA */}
                <div className="flex items-center justify-between">
                  <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    ⏱️ {module.duration}
                  </span>
                  <button className={`px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium rounded-lg transition-all duration-300 hover:from-blue-700 hover:to-purple-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    isDarkMode ? 'focus:ring-offset-gray-700' : 'focus:ring-offset-white'
                  }`}>
                    Start Learning
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Scroll Indicators */}
        <div className="flex justify-center mt-6 space-x-2">
          {mockPopularModules.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === 0
                  ? 'bg-blue-600 w-6'
                  : isDarkMode
                  ? 'bg-gray-600'
                  : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

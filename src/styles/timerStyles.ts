export const getThemeClasses = (isBreak: boolean) => {
  if (isBreak) {
    return {
      background: 'bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900 dark:to-indigo-900',
      timer: 'text-blue-500 dark:text-blue-300',
      title: 'text-blue-600 dark:text-blue-400',
      button: 'bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700',
      icon: 'text-blue-500 dark:text-blue-400',
    };
  }
  return {
    background: 'bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900 dark:to-orange-900',
    timer: 'text-red-500 dark:text-red-300',
    title: 'text-red-600 dark:text-red-400',
    button: 'bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700',
    icon: 'text-red-500 dark:text-red-400',
  };
};

export const layoutStyles = {
  container: 'flex flex-col lg:flex-row min-h-screen relative bg-gray-50 dark:bg-gray-900',
  historyPanel: 'lg:fixed lg:left-0 lg:top-0 lg:h-full lg:w-80 w-full lg:border-r border-gray-200 dark:border-gray-700 overflow-y-auto bg-white dark:bg-gray-800 shadow-lg lg:shadow-none z-10',
  mainContent: 'flex-1 flex items-center justify-center p-4 lg:p-8 lg:ml-80',
  timerContainer: 'w-full max-w-md mx-auto',
  timerCard: 'bg-white dark:bg-gray-800 rounded-xl shadow-lg transform hover:scale-[1.02] transition-all duration-300 p-6 border border-gray-100 dark:border-gray-700',
  header: 'flex items-center justify-between mb-6',
  titleContainer: 'flex items-center space-x-3',
  settingsButton: 'p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors relative focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400',
  timerDisplay: 'text-7xl font-bold mb-8 text-center font-mono tracking-tight',
  buttonContainer: 'flex gap-4 justify-center',
  startButton: 'px-8 py-3 rounded-full text-white transition-all text-base font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-opacity-50 shadow-sm hover:shadow-md',
  resetButton: 'px-8 py-3 bg-gray-500 dark:bg-gray-600 text-white rounded-full hover:bg-gray-600 dark:hover:bg-gray-700 transition-all text-base font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 shadow-sm hover:shadow-md',
  greenButton: 'bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700',
}; 
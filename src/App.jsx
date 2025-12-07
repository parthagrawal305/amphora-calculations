import ROICalculator from './components/ROICalculator'
import ThemeToggle from './components/ThemeToggle'
import { ThemeProvider, useTheme } from './context/ThemeContext'
import { Code2 } from 'lucide-react'

function AppContent() {
  const { theme } = useTheme();

  return (
    <div className={`min-h-screen py-4 sm:py-8 md:py-12 px-0 sm:px-4 transition-colors duration-300 ${
      theme === 'premium' ? 'bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-50/30' : 'bg-white'
    }`}>
      <div className="max-w-7xl mx-auto">
        <ROICalculator />
      </div>
      
      {/* Footer */}
      <div className="max-w-7xl mx-auto mt-8 sm:mt-12 px-4 sm:px-6 md:px-8 pb-6 sm:pb-8">
        <div className={`pt-4 sm:pt-6 transition-colors duration-300 ${
          theme === 'premium' ? 'border-t border-gray-100' : 'border-t border-gray-200'
        }`}>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 text-xs text-gray-500">
            <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-start">
              <span className={theme === 'premium' ? 'font-sans' : 'font-mono'}>// Powered by</span>
              <a 
                href="https://amphora.ad" 
                target="_blank" 
                rel="noopener noreferrer" 
                className={`font-semibold transition-colors ${
                  theme === 'premium' 
                    ? 'text-gray-900 hover:text-gray-600' 
                    : 'text-purple-600 hover:text-purple-700'
                }`}
              >
                Amphora Ads
              </a>
            </div>
            <div className={`flex items-center gap-2 ${theme === 'premium' ? 'font-sans' : 'font-mono'} text-center sm:text-left`}>
              <Code2 className="w-3 h-3 flex-shrink-0" />
              <span className="hidden sm:inline">Designed for teams who care about unit economics</span>
              <span className="sm:hidden">For teams who care about unit economics</span>
            </div>
          </div>
        </div>
      </div>
      
      <ThemeToggle />
    </div>
  )
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  )
}

export default App


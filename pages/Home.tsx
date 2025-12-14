import React from 'react';
import { Link } from 'react-router-dom';
import { Server, ShieldCheck, Cpu, ArrowRight } from 'lucide-react';

const Home: React.FC = () => {
  return (
    <div className="flex flex-col min-h-[calc(100vh-64px)]">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-100 to-white dark:from-dark dark:to-darklighter py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 dark:text-white mb-6">
            Master DevOps by <span className="text-so-orange">Building</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto">
            OpsNexus is a community-driven platform to practice real-world DevOps scenarios. 
            Solve tasks, share solutions, and climb the leaderboard.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/tasks"
              className="px-8 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-blue-600 transition shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2"
            >
              Explore Tasks <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              to="/submit"
              className="px-8 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition"
            >
              Submit Solution
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-4 bg-white dark:bg-darklighter flex-1 border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-[#F8F9F9] dark:bg-dark border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
              <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-4">
                <Server className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Real-World Scenarios</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Tasks range from setting up simple Docker containers to complex Kubernetes clusters and CI/CD pipelines.
              </p>
            </div>
            
            <div className="p-6 rounded-2xl bg-[#F8F9F9] dark:bg-dark border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
              <div className="h-12 w-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center mb-4">
                <Cpu className="h-6 w-6 text-so-orange" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">AI Assistance</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Stuck on a configuration? Use our built-in AI agent OpsBot to get hints and explain boilerplate code.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#F8F9F9] dark:bg-dark border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
              <div className="h-12 w-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mb-4">
                <ShieldCheck className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Earn Reputation</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Submit valid solutions, earn points, collect badges, and showcase your profile on the leaderboard.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
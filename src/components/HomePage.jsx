'use client';
import { 
  Zap, 
  Sparkles,
  ArrowRight,
  Globe,
  Rocket,
  Star,
  Code,
  Palette,
  MessageSquare
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
    const router = useRouter();
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const onStartBuilding = () => {
    router.push('/builder');
  };

  return (
    <div className="min-h-screen bg-black overflow-hidden relative">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-pink-900/20"></div>
        
        {/* Floating orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
        
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="w-full h-full" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)`,
            backgroundSize: '50px 50px'
          }}></div>
        </div>
      </div>

      {/* Mouse follower effect */}
      <div 
        className="fixed w-96 h-96 pointer-events-none z-0 transition-opacity duration-300"
        style={{
          left: mousePosition.x - 192,
          top: mousePosition.y - 192,
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)',
          opacity: isHovered ? 0.8 : 0.3
        }}
      ></div>

      {/* Hero Section */}
      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="text-center">
            {/* Logo */}
            <div className="flex justify-center mb-12">
              <div className="group relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full blur-sm opacity-75 group-hover:opacity-100 animate-pulse"></div>
                <div className="relative flex items-center gap-4 px-8 py-4 bg-black rounded-full border border-gray-800">
                  <div className="relative">
                    <Zap className="text-blue-400 animate-pulse" size={36} />
                    <div className="absolute inset-0 animate-ping">
                      <Zap className="text-blue-400 opacity-20" size={36} />
                    </div>
                  </div>
                  <span className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                    Bolt Clone
                  </span>
                </div>
              </div>
            </div>
            
            {/* Main heading */}
            <div className="mb-8">
              <h1 className="text-7xl md:text-8xl font-black text-white mb-6 leading-tight tracking-tight">
                Build websites with
                <br />
                <span className="relative inline-block">
                  <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-pulse">
                    AI magic
                  </span>
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 blur-xl animate-pulse"></div>
                </span>
              </h1>
            </div>
            
            {/* Subtitle */}
            <p className="text-2xl text-gray-300 mb-16 max-w-4xl mx-auto leading-relaxed">
              Create stunning, responsive websites in seconds. Just describe what you want, 
              and our AI will generate the complete code for you.
            </p>
            
            {/* CTA Button */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
              <button 
                onClick={onStartBuilding}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="group relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white px-12 py-6 rounded-2xl text-xl font-bold transition-all duration-500 shadow-2xl hover:shadow-blue-500/25 transform hover:scale-105 hover:-translate-y-1"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-700 via-purple-700 to-pink-700 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500">
                  <div className="w-full h-full bg-white animate-pulse"></div>
                </div>
                <span className="relative flex items-center gap-4">
                  <Sparkles className="animate-spin" size={24} />
                  Start Building Now
                  <ArrowRight className="group-hover:translate-x-2 transition-transform duration-300" size={24} />
                </span>
              </button>
              
              <button className="group flex items-center gap-3 text-gray-300 hover:text-white px-8 py-6 rounded-2xl border border-gray-700 hover:border-gray-500 transition-all duration-300 hover:bg-gray-800/50">
                <MessageSquare size={20} />
                See Demo
                <ArrowRight className="group-hover:translate-x-1 transition-transform" size={16} />
              </button>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-12 text-center mb-24">
              <div className="group">
                <div className="text-4xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">1M+</div>
                <div className="text-gray-400">Websites Created</div>
              </div>
              <div className="group">
                <div className="text-4xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">50K+</div>
                <div className="text-gray-400">Happy Developers</div>
              </div>
              <div className="group">
                <div className="text-4xl font-bold text-white mb-2 group-hover:text-pink-400 transition-colors">99.9%</div>
                <div className="text-gray-400">Uptime</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full border border-blue-500/20 mb-8">
            <Star className="text-blue-400" size={20} />
            <span className="text-blue-400 font-semibold">Why Choose Us</span>
          </div>
          <h2 className="text-5xl font-bold text-white mb-8">
            Experience the future of 
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"> web development</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Our cutting-edge AI technology transforms your ideas into stunning websites with unprecedented speed and precision
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              icon: Sparkles,
              title: "AI-Powered Generation",
              description: "Advanced AI understands your requirements and generates clean, production-ready code instantly.",
              color: "blue",
              delay: "0"
            },
            {
              icon: Globe,
              title: "Modern Tech Stack",
              description: "Built with React, Next.js, and modern frameworks for optimal performance and scalability.",
              color: "purple",
              delay: "200"
            },
            {
              icon: Rocket,
              title: "Lightning Fast",
              description: "From concept to deployment in minutes. No more waiting hours or days for results.",
              color: "pink",
              delay: "400"
            },
            {
              icon: Code,
              title: "Clean Code",
              description: "Generated code follows best practices and is ready for production deployment.",
              color: "green",
              delay: "600"
            }
          ].map((feature, index) => (
            <div 
              key={index}
              className="group relative"
              style={{ animationDelay: `${feature.delay}ms` }}
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-3xl blur-lg opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
              <div className="relative bg-gray-900/50 backdrop-blur-xl border border-gray-800 p-8 rounded-3xl hover:bg-gray-800/70 transition-all duration-500 hover:transform hover:scale-105 hover:-translate-y-2">
                <div className={`bg-${feature.color}-500/20 w-20 h-20 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className={`text-${feature.color}-400`} size={36} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-blue-400 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-400 group-hover:text-gray-300 transition-colors leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-24">
        <div className="text-center bg-gradient-to-r from-gray-900/50 to-gray-800/50 backdrop-blur-xl rounded-3xl p-16 border border-gray-700">
          <h3 className="text-4xl font-bold text-white mb-6">
            Ready to revolutionize your workflow?
          </h3>
          <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
            Join thousands of developers who have already transformed their web development process
          </p>
          <button 
            onClick={onStartBuilding}
            className="group bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white px-10 py-5 rounded-2xl text-lg font-bold transition-all duration-300 shadow-2xl hover:shadow-purple-500/25 transform hover:scale-105"
          >
            <span className="flex items-center gap-3">
              <Palette size={20} />
              Get Started Free
              <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
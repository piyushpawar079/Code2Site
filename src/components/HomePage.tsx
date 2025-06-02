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
  MessageSquare,
  Play,
  Shield,
  Layers
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const onStartBuilding = () => {
    router.push('/builder');
  };

  return (
    <div className="min-h-screen bg-black overflow-hidden relative">
      {/* Enhanced Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 via-purple-900/20 to-pink-900/30"></div>
        
        {/* Dynamic floating orbs with parallax */}
        <div className="absolute top-20 left-10 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" style={{ transform: `translateY(${scrollY * 0.2}px)` }}></div>
        <div className="absolute top-40 right-20 w-[500px] h-[500px] bg-purple-500/15 rounded-full blur-3xl animate-pulse delay-1000" style={{ transform: `translateY(${scrollY * 0.15}px)` }}></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-2000" style={{ transform: `translateY(${scrollY * 0.25}px)` }}></div>
        <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-cyan-500/15 rounded-full blur-3xl animate-pulse delay-3000" style={{ transform: `translateY(${scrollY * 0.1}px)` }}></div>

        {/* Grid pattern */}
        {/* <div className="absolute inset-0 opacity-10"> */}
          {/* <div className="w-full h-full" style={{
            backgroundImage: `
              radial-gradient(circle at 2px 2px, rgba(59, 130, 246, 0.4) 1px, transparent 0),
              radial-gradient(circle at 50px 50px, rgba(147, 51, 234, 0.3) 1px, transparent 0)
            `,
            backgroundSize: '100px 100px, 150px 150px'
          }}>

          </div> */}
        {/* </div> */}

        {/* Lines */}
        {/* <div className="absolute inset-0 overflow-hidden">
          <div className="absolute h-px w-full bg-gradient-to-r from-transparent via-blue-500/50 to-transparent top-1/4 animate-pulse"></div>
          <div className="absolute h-px w-full bg-gradient-to-r from-transparent via-purple-500/30 to-transparent top-3/4 animate-pulse delay-1000"></div>
          <div className="absolute w-px h-full bg-gradient-to-b from-transparent via-pink-500/40 to-transparent left-1/4 animate-pulse delay-500"></div>
        </div> */}
      </div>

      {/* Mouse Follower */}
      <div 
        className="fixed w-[600px] h-[600px] pointer-events-none z-0 transition-all duration-500 ease-out"
        style={{
          left: mousePosition.x - 300,
          top: mousePosition.y - 300,
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, rgba(147, 51, 234, 0.1) 40%, transparent 70%)',
          opacity: isHovered ? 1 : 0.4,
          transform: `scale(${isHovered ? 1.2 : 1})`
        }}
      ></div>

      {/* Hero Section */}
      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-6 py-20 text-center">
          {/* Logo */}
          <div className="flex justify-center mb-16">
            <div className="group relative">
              <div className="absolute -inset-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full blur-lg opacity-60 group-hover:opacity-100 animate-pulse transition-all duration-500"></div>
              <div className="relative flex items-center gap-4 px-7 py-5 bg-black rounded-full border border-gray-700 hover:border-gray-500 transition-all duration-300 backdrop-blur-xl">
                <div className="relative">
                  <Zap className="text-blue-400 animate-pulse drop-shadow-lg" size={40} />
                  <div className="absolute inset-0 animate-ping">
                    <Zap className="text-blue-400 opacity-30" size={40} />
                  </div>
                </div>
                <span className="text-3xl font-black bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Code2Site</span>
              </div>
            </div>
          </div>

          {/* Heading */}
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-black text-white mb-8 leading-tight tracking-tight">
            Build websites with<br />
            <span className="relative inline-block group">
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-pulse">AI magic</span>
              <div className="absolute -inset-2 bg-gradient-to-r from-blue-500/30 via-purple-500/30 to-pink-500/30 blur-2xl animate-pulse group-hover:blur-3xl transition-all duration-500"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 via-purple-400/10 to-pink-400/10 rounded-lg animate-pulse"></div>
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-gray-300 mb-20 max-w-5xl mx-auto leading-relaxed font-light">
            Create stunning, responsive websites in seconds. Just describe what you want, and our AI will generate the complete code for you with pixel-perfect precision.
          </p>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-8 justify-center items-center mb-20">
            <button 
              onClick={onStartBuilding}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className="group relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white px-16 py-8 rounded-3xl text-2xl font-bold transition-all duration-500 shadow-2xl hover:shadow-blue-500/40 transform hover:scale-110 hover:-translate-y-2"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-700 via-purple-700 to-pink-700 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-500">
                <div className="w-full h-full bg-white animate-pulse rounded-3xl"></div>
              </div>
              <span className="relative flex items-center gap-4">
                <Sparkles className="animate-spin group-hover:animate-bounce" size={28} />
                Start Building Now
                <ArrowRight className="group-hover:translate-x-3 transition-transform duration-300" size={28} />
              </span>
            </button>

            <button className="group flex items-center gap-4 text-gray-300 hover:text-white px-12 py-8 rounded-3xl border-2 border-gray-700 hover:border-gray-500 transition-all duration-300 hover:bg-gray-800/50 backdrop-blur-xl text-xl font-semibold">
              <Play size={24} />
              Watch Demo
              <ArrowRight className="group-hover:translate-x-2 transition-transform duration-300" size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-32">
        <div className="text-center mb-24">
          <div className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full border border-blue-500/30 mb-12 backdrop-blur-xl">
            <Star className="text-blue-400 animate-pulse" size={24} />
            <span className="text-blue-400 font-bold text-lg">Why Choose Us</span>
          </div>
          <h2 className="text-3xl md:text-7xl font-black text-white mb-12 leading-tight">
            Experience the future of<br />
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">web development</span>
          </h2>
          <p className="text-2xl text-gray-400 max-w-4xl mx-auto font-light leading-relaxed">
            Our cutting-edge AI technology transforms your ideas into stunning websites with unprecedented speed and precision
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
          {[
            {
              icon: Sparkles,
              title: "AI-Powered Generation",
              description: "Advanced AI understands your requirements and generates clean, production-ready code instantly with intelligent optimization.",
              color: "blue",
              gradient: "from-blue-500/20 to-blue-600/20"
            },
            {
              icon: Globe,
              title: "Modern Tech Stack",
              description: "Built with React, Next.js, and cutting-edge frameworks for optimal performance, scalability, and future-proof architecture.",
              color: "purple",
              gradient: "from-purple-500/20 to-purple-600/20"
            },
            {
              icon: Rocket,
              title: "Lightning Fast",
              description: "From concept to deployment in minutes. Revolutionary speed that transforms your workflow and accelerates development.",
              color: "pink",
              gradient: "from-pink-500/20 to-pink-600/20"
            },
            {
              icon: Shield,
              title: "Enterprise Grade",
              description: "Production-ready code that follows industry best practices with built-in security, accessibility, and performance optimization.",
              color: "cyan",
              gradient: "from-cyan-500/20 to-cyan-600/20"
            }
          ].map((feature, index) => (
            <div 
              key={index}
              className="group relative transform hover:scale-105 transition-all duration-500"
            >
              <div className={`absolute -inset-2 bg-gradient-to-r ${feature.gradient} rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500`}></div>
              <div className="relative bg-gray-900/60 backdrop-blur-2xl border border-gray-800 p-10 rounded-3xl hover:bg-gray-800/80 transition-all duration-500 hover:-translate-y-4 h-full">
                <div className={`bg-gradient-to-br ${feature.gradient} w-24 h-24 rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 border border-gray-700`}>
                  <feature.icon className={`text-${feature.color}-400 drop-shadow-lg`} size={40} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-6 group-hover:text-blue-400 transition-colors leading-tight">
                  {feature.title}
                </h3>
                <p className="text-gray-400 group-hover:text-gray-300 transition-colors leading-relaxed text-lg">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-32">
        <div className="relative">
          <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-3xl blur-2xl animate-pulse"></div>
          <div className="relative text-center bg-gradient-to-br from-gray-900/80 to-gray-800/60 backdrop-blur-2xl rounded-3xl p-20 border border-gray-700 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 animate-pulse"></div>
            <div className="relative">
              <h3 className="text-4xl md:text-6xl font-black text-white mb-8 leading-tight">
                Ready to revolutionize <br />
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">your workflow?</span>
              </h3>
              <p className="text-2xl text-gray-300 mb-16 max-w-3xl mx-auto font-light leading-relaxed">
                Join the future of web development and experience the power of AI-driven website creation
              </p>
              <button 
                onClick={onStartBuilding}
                className="group bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white px-16 py-8 rounded-3xl text-2xl font-bold transition-all duration-500 shadow-2xl hover:shadow-purple-500/40 transform hover:scale-110 hover:-translate-y-2"
              >
                <span className="flex items-center gap-4">
                  <Palette size={28} />
                  Get Started Free
                  <ArrowRight className="group-hover:translate-x-2 transition-transform duration-300" size={28} />
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

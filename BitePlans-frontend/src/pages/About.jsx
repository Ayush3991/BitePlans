import React from 'react';
import { Link } from 'react-router-dom';

const About = () => {
  // Team details
  const team = [
    {
      name: 'Darakshan Imteyaz',
      role: 'Frontend Engineer',
      image: '/daraksha.jpg',
      bio: 'Frontend developer with a passion for UI/UX',
    },
    {
      name: 'Ayush Jaiswal',
      role: 'Backend Engineer',
      image: '/ayush.jpg',
      bio: 'Backend specialist with a focus on scalable systems',
    },
    {
      name: 'Sifat Jahan',
      role: 'Database Engineer',
      image: '/sifat.jpg',
      bio: 'Database architect with expertise in MongoDB and SQL',
    },
  ];

  // Company values list
  const values = [
    {
      icon: '🎯',
      title: 'Developer-First',
      description:
        'Every decision we make is centered around making developers more productive and happy.',
    },
    {
      icon: '💡',
      title: 'Innovation',
      description:
        'We constantly push the boundaries of what developer tools can achieve.',
    },
    {
      icon: '🤝',
      title: 'Community',
      description:
        'We believe in building tools together with our developer community.',
    },
    {
      icon: '⚡',
      title: 'Performance',
      description:
        'Speed and reliability are non-negotiable in everything we build.',
    },
  ];

  // Key business stats
  const stats = [
    { number: '50,000+', label: 'Active Developers' },
    { number: '1M+', label: 'Tools Used Monthly' },
    { number: '99.9%', label: 'Uptime SLA' },
    { number: '24/7', label: 'Support Available' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* About Intro */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            About BitePlans
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            We're on a mission to make powerful developer tools accessible to everyone through our
            innovative credit-based marketplace. No more expensive subscriptions or unused licenses.
          </p>
        </div>

        {/* Our Story & Credit System */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Our Story</h2>
            <div className="space-y-4 text-gray-600 dark:text-gray-300">
              <p>
                BitePlans was born from a simple frustration: paying for expensive developer tools
                that we only used occasionally. Why should developers pay monthly subscriptions for
                tools they might use once a week?
              </p>
              <p>
                Founded in 2024 by a team of experienced developers and product managers, we set out
                to create a better way. Our credit-based system lets you pay only for what you
                actually use, making premium tools accessible to independent developers, startups,
                and enterprises alike.
              </p>
              <p>
                Today, over 50,000 developers trust BitePlans to enhance their workflow with our
                curated collection of professional-grade tools. From code formatting to API testing
                to resume building, we're building the infrastructure for the next generation of
                developer productivity.
              </p>
            </div>
          </div>

          {/* Credit Highlights */}
          <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl p-8 border border-blue-500/20">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Why Credits?</h3>
            <ul className="space-y-4">
              {[
                { color: 'bg-blue-500', label: 'Pay Per Use', desc: 'Only pay for tools you actually use' },
                { color: 'bg-purple-500', label: 'No Waste', desc: 'No unused subscriptions or forgotten licenses' },
                { color: 'bg-green-500', label: 'Flexible', desc: 'Scale up or down based on your needs' },
                { color: 'bg-orange-500', label: 'Transparent', desc: 'Clear pricing with no hidden fees' },
              ].map((item, index) => (
                <li key={index} className="flex items-start space-x-3">
                  <div className={`w-2 h-2 ${item.color} rounded-full mt-2`} />
                  <div>
                    <strong className="text-gray-900 dark:text-white">{item.label}:</strong>
                    <span className="text-gray-600 dark:text-gray-300 ml-1">{item.desc}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          {stats.map((item, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                {item.number}
              </div>
              <div className="text-gray-600 dark:text-gray-300">{item.label}</div>
            </div>
          ))}
        </div>

        {/* Values Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Our Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl mb-4">{value.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {value.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">{value.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Team Members */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Meet Our Team
          </h2>
          <div className="flex justify-center">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-5xl">
              {team.map((member, index) => (
                <div
                  key={index}
                  className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-6 text-center hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300"
                >
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-4 border-white shadow-md"
                  />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                    {member.name}
                  </h3>
                  <p className="text-blue-600 dark:text-blue-400 mb-3 font-medium">{member.role}</p>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">{member.bio}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mission */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 text-center text-white mb-16">
          <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
            To democratize access to premium developer tools by creating a fair, transparent, and
            developer-friendly marketplace where everyone can afford the tools they need to build
            amazing software.
          </p>
        </div>

        {/* Final CTA */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Ready to Join Our Community?
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of developers who are already using BitePlans to enhance their workflow.
            Start with 100 free credits today.
          </p>
          <Link
            to="/signup"
            className="inline-block px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-xl hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
          >
            Start Your Free Trial
          </Link>
        </div>
      </div>
    </div>
  );
};

export default About;
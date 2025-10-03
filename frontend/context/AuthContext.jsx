import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  // Demo users for testing
  const demoUsers = [
    {
      id: '1',
      name: 'User-1',
      email: 'user1@example.com',
      avatar: '/api/placeholder/40/40',
      createdAt: new Date('2023-01-15'),
      bio: 'Experienced member with 2 projects and participation in 1 project',
      role: 'Full Stack Developer',
      title: 'Full Stack Developer',
      skills: [
        {
          name: "React",
          level: "EXPERT",
          years: 4
        },
        {
          name: "Node.js",
          level: "ADVANCED",
          years: 3
        },
        {
          name: "JavaScript",
          level: "EXPERT",
          years: 5
        },
        {
          name: "Python",
          level: "INTERMEDIATE",
          years: 2
        },
        {
          name: "MongoDB",
          level: "ADVANCED",
          years: 3
        },
        {
          name: "AWS",
          level: "INTERMEDIATE",
          years: 2
        },
        {
          name: "Docker",
          level: "ADVANCED",
          years: 3
        },
        {
          name: "UI/UX Design",
          level: "INTERMEDIATE",
          years: 2
        }
      ],
      location: 'Mumbai, India',
      interests: ['AI/ML', 'Web Development', 'IoT'],
      projectsCreated: 9,
      hackathonsWon: 3,
      connectionsHelped: 2,
      phone: '+91 98765 43210',
      website: 'https://user1-portfolio.com',
      githubUrl: 'https://github.com/user1',
      linkedinUrl: 'https://linkedin.com/in/user1',
      portfolioUrl: 'https://user1-portfolio.com',
      twitterUrl: 'https://twitter.com/user1',
      experience: [
        {
          id: 1,
          title: "Senior Full Stack Developer",
          company: "Tech Solutions Inc.",
          duration: "2022 - Present",
          description: "Leading development of enterprise-scale web applications using React, Node.js, and AWS. Managing a team of 5 developers and implementing microservices architecture.",
          technologies: ["React", "Node.js", "AWS", "MongoDB", "Docker"]
        },
        {
          id: 2,
          title: "Full Stack Developer",
          company: "Digital Innovations Ltd",
          duration: "2020 - 2022",
          description: "Developed and maintained multiple client projects. Implemented responsive web designs and RESTful APIs.",
          technologies: ["Vue.js", "Python", "PostgreSQL", "Redis"]
        }
      ],
      education: [
        {
          degree: "Master of Computer Science",
          institution: "Tech University",
          duration: "2016 - 2018",
          description: "Specialized in Software Engineering and Cloud Computing. Graduated with distinction."
        },
        {
          degree: "Bachelor of Computer Science",
          institution: "State University",
          duration: "2012 - 2016",
          description: "Major in Computer Science with minor in Mathematics. Dean's List all semesters."
        }
      ]
    },
    {
      id: '2',
      name: 'User-2',
      email: 'user2@example.com',
      avatar: '/api/placeholder/40/40',
      createdAt: new Date('2023-02-20'),
      bio: 'Project owner with similar access as User-1. Currently owns Smart Home IoT System project',
      role: 'Project Owner',
      title: 'IoT Solutions Architect',
      skills: [
        {
          name: "IoT Development",
          level: "EXPERT",
          years: 5
        },
        {
          name: "Python",
          level: "EXPERT",
          years: 4
        },
        {
          name: "Arduino",
          level: "ADVANCED",
          years: 3
        },
        {
          name: "Raspberry Pi",
          level: "ADVANCED",
          years: 3
        },
        {
          name: "MQTT",
          level: "ADVANCED",
          years: 2
        },
        {
          name: "Node.js",
          level: "INTERMEDIATE",
          years: 2
        },
        {
          name: "React",
          level: "INTERMEDIATE",
          years: 2
        },
        {
          name: "AWS IoT",
          level: "ADVANCED",
          years: 3
        }
      ],
      location: 'Bangalore, India',
      interests: ['IoT', 'Smart Home', 'Automation', 'AI/ML'],
      projectsCreated: 5,
      hackathonsWon: 2,
      connectionsHelped: 3,
      phone: '+91 87654 32109',
      website: 'https://user2-iot.com',
      githubUrl: 'https://github.com/user2',
      linkedinUrl: 'https://linkedin.com/in/user2',
      portfolioUrl: 'https://user2-iot.com',
      twitterUrl: 'https://twitter.com/user2',
      experience: [
        {
          id: 1,
          title: "IoT Solutions Architect",
          company: "Smart Tech Innovations",
          duration: "2021 - Present",
          description: "Leading IoT project development and architecture design. Specializing in smart home automation systems and industrial IoT solutions.",
          technologies: ["Python", "Arduino", "Raspberry Pi", "AWS IoT", "MQTT"]
        },
        {
          id: 2,
          title: "Embedded Systems Developer",
          company: "TechFlow Solutions",
          duration: "2019 - 2021",
          description: "Developed embedded systems for various IoT applications. Worked on sensor integration and data collection systems.",
          technologies: ["C++", "Arduino", "ESP32", "LoRaWAN"]
        }
      ],
      education: [
        {
          degree: "Master of Electronics Engineering",
          institution: "Indian Institute of Technology",
          duration: "2017 - 2019",
          description: "Specialized in Embedded Systems and IoT. Thesis on Smart Home Automation Systems."
        },
        {
          degree: "Bachelor of Electronics and Communication",
          institution: "National Institute of Technology",
          duration: "2013 - 2017",
          description: "Major in Electronics with focus on Embedded Systems. Final year project on Home Automation."
        }
      ]
    }
  ];

  useEffect(() => {
    // Check for existing user session
    const savedUser = localStorage.getItem('solvearn_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (userData) => {
    // Store profile data if it's a new user or has extended profile info
    const storedUser = await storeUserProfile(userData);
    setUser(storedUser);
    localStorage.setItem('solvearn_user', JSON.stringify(storedUser));
    setShowAuthModal(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('solvearn_user');
  };

  const signup = async (userData) => {
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        const result = await response.json();
        const newUser = result.data;
        await login(newUser);
        return { success: true, user: newUser };
      } else {
        const error = await response.json();
        return { success: false, error: error.message };
      }
    } catch (error) {
      console.error('Signup error:', error);
      return { success: false, error: 'Network error occurred' };
    }
  };

  const updateProfile = async (profileData) => {
    try {
      // Update locally first for immediate UI feedback
      const updatedUser = { ...user, ...profileData };
      setUser(updatedUser);
      localStorage.setItem('solvearn_user', JSON.stringify(updatedUser));

      // Sync with backend if user has an ID
      if (user?.id) {
        const response = await fetch(`/api/users/${user.id}/profile`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(profileData),
        });

        if (response.ok) {
          const result = await response.json();
          const backendUser = result.data;
          setUser(backendUser);
          localStorage.setItem('solvearn_user', JSON.stringify(backendUser));
          return { success: true, user: backendUser };
        } else {
          console.error('Failed to sync profile with backend');
          return { success: true, user: updatedUser }; // Still return success for local update
        }
      }

      return { success: true, user: updatedUser };
    } catch (error) {
      console.error('Profile update error:', error);
      return { success: false, error: 'Failed to update profile' };
    }
  };

  // Store new user profile data on signup/signin
  const storeUserProfile = async (userData) => {
    try {
      if (userData.id) {
        // If user has ID, sync with backend
        const response = await fetch(`/api/users/${userData.id}/profile`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData),
        });

        if (response.ok) {
          const result = await response.json();
          return result.data;
        }
      }
      return userData;
    } catch (error) {
      console.error('Error storing user profile:', error);
      return userData; // Return original data if backend fails
    }
  };
  
  // Login as demo user
  const loginAsDemoUser = (userId) => {
    const demoUser = demoUsers.find(u => u.id === userId);
    if (demoUser) {
      login(demoUser);
      return true;
    }
    return false;
  };

  const value = {
    user,
    login,
    logout,
    signup,
    updateProfile,
    storeUserProfile,
    loading,
    isAuthenticated: !!user,
    demoUsers,
    loginAsDemoUser,
    showAuthModal,
    setShowAuthModal
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
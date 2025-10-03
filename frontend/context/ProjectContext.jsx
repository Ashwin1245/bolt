import { createContext, useContext, useState, useEffect } from 'react';

const ProjectContext = createContext();

export const useProjects = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProjects must be used within a ProjectProvider');
  }
  return context;
};

export const ProjectProvider = ({ children }) => {
  const [projects, setProjects] = useState([]);
  const [hackathons, setHackathons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userProjectMap, setUserProjectMap] = useState({});
  const [bookmarkedProjects, setBookmarkedProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [projectToEdit, setProjectToEdit] = useState(null);
  const [showCreateProjectModal, setShowCreateProjectModal] = useState(false);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [applications, setApplications] = useState([
    // Sample applications for demonstration
    {
      id: 'app1',
      applicantId: 'user2',
      applicantName: 'John Smith',
      applicantAvatar: 'JS',
      applicantColor: '#4f46e5',
      position: 'Frontend Developer',
      skills: ['React', 'TypeScript', 'CSS'],
      projectId: 'p1',
      projectName: 'AI Image Recognition App',
      appliedDate: '2024-06-10',
      status: 'PENDING',
      message: 'I have 3 years of experience with React and would love to contribute to this project.',
      hasResume: true,
      resumeUrl: '/resumes/john-smith-resume.pdf',
      userDetails: {
        name: 'John Smith',
        title: 'Frontend Developer',
        email: 'john.smith@example.com',
        location: 'San Francisco, CA',
        bio: 'Passionate frontend developer with 3+ years of experience building responsive web applications.',
        skills: ['React', 'TypeScript', 'JavaScript', 'CSS', 'HTML5', 'Redux'],
        experiences: [
          {
            title: 'Frontend Developer',
            company: 'TechStart Inc.',
            duration: 'Jan 2022 - Present',
            description: 'Developing and maintaining client-facing web applications using React and TypeScript.'
          }
        ],
        education: [
          {
            degree: 'B.S. Computer Science',
            institution: 'University of California, Berkeley',
            duration: '2017 - 2021',
            description: 'Focus on web technologies and software engineering principles.'
          }
        ]
      }
    },
    {
      id: 'app2',
      applicantId: 'user3',
      applicantName: 'Emily Davis',
      applicantAvatar: 'ED',
      applicantColor: '#2563eb',
      position: 'UI/UX Designer',
      skills: ['Figma', 'UI/UX', 'Prototyping'],
      projectId: 'p2',
      projectName: 'Smart Home IoT System',
      appliedDate: '2024-06-05',
      status: 'PENDING',
      message: 'I specialize in IoT UX and have designed several smart home interfaces.',
      hasResume: true,
      resumeUrl: '/resumes/emily-davis-resume.pdf',
      userDetails: {
        name: 'Emily Davis',
        title: 'UI/UX Designer',
        email: 'emily.davis@example.com',
        location: 'New York, NY',
        bio: 'Creative UI/UX designer with a passion for creating intuitive user experiences.',
        skills: ['Figma', 'UI/UX Design', 'Wireframing', 'Prototyping', 'User Research'],
        experiences: [
          {
            title: 'Senior UI/UX Designer',
            company: 'DesignHub Co.',
            duration: 'Jun 2022 - Present',
            description: 'Lead designer for IoT and smart home applications.'
          }
        ],
        education: [
          {
            degree: 'B.F.A. Graphic Design',
            institution: 'Parsons School of Design',
            duration: '2016 - 2020',
            description: 'Focus on digital design and user experience.'
          }
        ]
      }
    }
  ]);

  useEffect(() => {
    // Initialize with sample data
    const sampleProjects = [
      // User-1's owned projects
      {
        id: 'p1',
        title: "AI Image Recognition App",
        description: "An application that uses machine learning to identify objects in images",
        stage: "Beta Testing",
        industry: "Technology",
        requiredSkills: ["Python", "TensorFlow", "React Native"],
        teamMembers: [
          { id: '1', name: "User-1", role: "Founder", avatar: "/api/placeholder/40/40" },
          { id: '3', name: "Alex Johnson", role: "ML Engineer", avatar: "/api/placeholder/40/40" }
        ],
        openPositions: [
          { role: "Frontend Developer", skills: ["React Native", "TypeScript"], isPaid: true },
          { role: "UX Designer", skills: ["UI/UX", "Figma"], isPaid: false }
        ],
        funding: "₹30,00,000",
        applications: 8,
        createdAt: "2023-05-20",
        ownerId: '1'
      },
      {
        id: 'p2',
        title: "Smart Home IoT System",
        description: "A comprehensive IoT system for home automation and energy efficiency",
        stage: "MVP Development",
        industry: "IoT",
        requiredSkills: ["IoT", "Node.js", "React", "Embedded Systems"],
        teamMembers: [
          { id: '1', name: "User-1", role: "Founder", avatar: "/api/placeholder/40/40" },
          { id: '4', name: "Sarah Lee", role: "IoT Specialist", avatar: "/api/placeholder/40/40" }
        ],
        openPositions: [
          { role: "Backend Developer", skills: ["Node.js", "MongoDB"], isPaid: true },
          { role: "Hardware Engineer", skills: ["Arduino", "Raspberry Pi"], isPaid: false }
        ],
        funding: "₹25,00,000",
        applications: 5,
        createdAt: "2023-09-15",
        ownerId: '1'
      },
      // Project where User-1 is participating
      {
        id: 'p3',
        title: "Healthcare Monitoring Platform",
        description: "A platform for remote patient monitoring and health data analysis",
        stage: "Market Ready",
        industry: "Healthcare",
        requiredSkills: ["React", "Node.js", "Data Analysis", "Healthcare"],
        teamMembers: [
          { id: '5', name: "Dr. Emily Wong", role: "Founder", avatar: "/api/placeholder/40/40" },
          { id: '1', name: "User-1", role: "Developer", avatar: "/api/placeholder/40/40" },
          { id: '6', name: "Michael Brown", role: "Healthcare Expert", avatar: "/api/placeholder/40/40" }
        ],
        openPositions: [
          { role: "Data Scientist", skills: ["Python", "Machine Learning"], isPaid: true }
        ],
        funding: "₹50,00,000",
        applications: 15,
        createdAt: "2023-11-10",
        ownerId: '5'
      },
      // Additional project where User-1 is participating
      {
        id: 'p4',
        title: "E-Learning Mobile App",
        description: "An interactive mobile application for personalized learning experiences",
        stage: "Beta Testing",
        industry: "Education",
        requiredSkills: ["React Native", "Firebase", "UI/UX", "Education"],
        teamMembers: [
          { id: '7', name: "Priya Mehta", role: "Founder", avatar: "/api/placeholder/40/40" },
          { id: '1', name: "User-1", role: "Mobile Developer", avatar: "/api/placeholder/40/40" },
          { id: '8', name: "Rahul Singh", role: "Education Specialist", avatar: "/api/placeholder/40/40" }
        ],
        openPositions: [
          { role: "Backend Developer", skills: ["Node.js", "MongoDB"], isPaid: false },
          { role: "Content Creator", skills: ["Education", "Writing"], isPaid: false }
        ],
        funding: "₹35,00,000",
        applications: 10,
        createdAt: "2023-12-05",
        ownerId: '7'
      },
      // Other existing projects
      // {
      //   id: 4,
      //   title: "AI-Powered Healthcare Assistant",
      //   description: "Building an intelligent healthcare assistant that helps patients manage their health tutors adaptive learning experiences....",
      //   stage: "Ideation Stage",
      //   industry: "Healthcare",
      //   requiredSkills: ["React", "Python", "Machine Learning"],
      //   teamMembers: [
      //     { id: 1, name: "Anita Patel", role: "Founder", avatar: "/api/placeholder/40/40" },
      //     { id: 2, name: "Mike Chen", role: "CTO", avatar: "/api/placeholder/40/40" }
      //   ],
      //   openPositions: [
      //     { role: "Frontend Developer", skills: ["React", "TypeScript"], isPaid: true },
      //     { role: "ML Engineer", skills: ["Python", "TensorFlow"], isPaid: true }
      //   ],
      //   funding: "₹25,00,000",
      //   applications: 12,
      //   createdAt: "2024-01-15",
      //   ownerId: '1'
      // },
      {
        id: 5,
        title: "Sustainable Fashion Marketplace",
        description: "Creating a platform that connects sustainable fashion brands with conscious consumers.",
        stage: "Idea Validation",
        industry: "E-commerce",
        requiredSkills: ["Node.js", "React", "MongoDB", "Payment Integration"],
        teamMembers: [
          { id: 3, name: "Priya Sharma", role: "Founder", avatar: "/api/placeholder/40/40" }
        ],
        openPositions: [
          { role: "Full Stack Developer", skills: ["MERN Stack"], isPaid: false },
          { role: "Marketing Lead", skills: ["Digital Marketing", "SEO"], isPaid: false }
        ],
        funding: "₹15,00,000",
        applications: 8,
        createdAt: "2024-01-20",
        ownerId: '3'
      },
      {
        id: 6,
        title: "EdTech Learning Platform",
        description: "Revolutionizing online education with interactive learning experiences and AI-driven personalization.",
        stage: "Beta Testing",
        industry: "Education",
        requiredSkills: ["React", "Node.js", "AI/ML", "Video Streaming"],
        teamMembers: [
          { id: 4, name: "Rahul Gupta", role: "Founder", avatar: "/api/placeholder/40/40" },
          { id: 5, name: "Anita Patel", role: "Head of Product", avatar: "/api/placeholder/40/40" },
          { id: 6, name: "Dev Kumar", role: "Lead Developer", avatar: "/api/placeholder/40/40" }
        ],
        openPositions: [
          { role: "Mobile Developer", skills: ["React Native", "Flutter"], isPaid: true },
          { role: "DevOps Engineer", skills: ["AWS", "Docker", "Kubernetes"], isPaid: true }
        ],
        funding: "₹50,00,000",
        applications: 25,
        createdAt: "2024-01-10",
        ownerId: '4'
      },
      {
        id: 7,
        title: "Smart Home IoT Platform",
        description: "Creating an integrated IoT platform for smart home devices with focus on energy efficiency and user privacy.",
        stage: "MVP Development",
        industry: "IoT",
        requiredSkills: ["IoT", "React", "Node.js", "AWS"],
        teamMembers: [
          { id: 7, name: "Vikram Mehta", role: "Founder", avatar: "/api/placeholder/40/40" },
          { id: 8, name: "Neha Singh", role: "IoT Engineer", avatar: "/api/placeholder/40/40" }
        ],
        openPositions: [
          { role: "Backend Developer", skills: ["Node.js", "AWS"], isPaid: false },
          { role: "Mobile Developer", skills: ["React Native"], isPaid: true }
        ],
        funding: "₹35,00,000",
        applications: 15,
        createdAt: "2024-01-05",
        ownerId: '7'
      },
      {
        id: 8,
        title: "FinTech Payment Solution",
        description: "Building a secure and efficient payment gateway for small businesses with lower transaction fees and faster settlements.",
        stage: "Market Ready",
        industry: "Finance",
        requiredSkills: ["Payment Integration", "Security", "React", "Node.js"],
        teamMembers: [
          { id: 9, name: "Arjun Reddy", role: "Founder", avatar: "/api/placeholder/40/40" },
          { id: 10, name: "Sanjay Kumar", role: "Finance Expert", avatar: "/api/placeholder/40/40" },
          { id: 11, name: "Tanya Gupta", role: "Security Specialist", avatar: "/api/placeholder/40/40" }
        ],
        openPositions: [
          { role: "Full Stack Developer", skills: ["React", "Node.js"], isPaid: true }
        ],
        funding: "₹75,00,000",
        applications: 30,
        createdAt: "2023-12-15",
        ownerId: '9'
      },
      {
        id: 9,
        title: "AR Shopping Experience",
        description: "Enhancing retail shopping with augmented reality to allow customers to virtually try products before purchasing.",
        stage: "Idea Validation",
        industry: "Retail",
        requiredSkills: ["AR/VR", "React Native", "3D Modeling", "UI/UX"],
        teamMembers: [
          { id: 12, name: "Riya Kapoor", role: "Founder", avatar: "/api/placeholder/40/40" }
        ],
        openPositions: [
          { role: "AR Developer", skills: ["Unity", "ARKit", "ARCore"], isPaid: false },
          { role: "3D Artist", skills: ["Blender", "Maya"], isPaid: false },
          { role: "Mobile Developer", skills: ["React Native"], isPaid: true }
        ],
        funding: "₹18,00,000",
        applications: 5,
        createdAt: "2024-01-25",
        ownerId: '12'
      },
      {
        id: 10,
        title: "Mental Health Support App",
        description: "Creating a supportive platform for mental health with AI-guided meditation, therapy connections, and community support.",
        stage: "Beta Testing",
        industry: "Healthcare",
        requiredSkills: ["React Native", "Node.js", "AI", "Psychology"],
        teamMembers: [
          { id: 13, name: "Nisha Verma", role: "Founder", avatar: "/api/placeholder/40/40" },
          { id: 14, name: "Dr. Raj Malhotra", role: "Mental Health Expert", avatar: "/api/placeholder/40/40" }
        ],
        openPositions: [
          { role: "Frontend Developer", skills: ["React Native"], isPaid: true },
          { role: "AI Specialist", skills: ["Python", "NLP"], isPaid: true },
          { role: "Content Creator", skills: ["Psychology", "Writing"], isPaid: false }
        ],
        funding: "₹40,00,000",
        applications: 18,
        createdAt: "2024-01-03",
        ownerId: '13'
      },
      {
        id: 11,
        title: "Sustainable Agriculture Platform",
        description: "Connecting farmers with technology solutions for sustainable farming practices, crop monitoring, and direct market access.",
        stage: "Ideation Stage",
        industry: "Agriculture",
        requiredSkills: ["IoT", "Mobile Development", "Data Analytics", "Agriculture"],
        teamMembers: [
          { id: 15, name: "Karan Patel", role: "Founder", avatar: "/api/placeholder/40/40" }
        ],
        openPositions: [
          { role: "IoT Developer", skills: ["Arduino", "Sensors", "Embedded Systems"], isPaid: false },
          { role: "Mobile Developer", skills: ["React Native"], isPaid: true },
          { role: "Agriculture Expert", skills: ["Farming", "Sustainability"], isPaid: false }
        ],
        funding: "₹20,00,000",
        applications: 7,
        createdAt: "2024-01-28",
        ownerId: '15'
      },
      {
        id: 12,
        title: "Electric Vehicle Charging Network",
        description: "Building a nationwide network of smart EV charging stations with real-time availability tracking and seamless payment.",
        stage: "MVP Development",
        industry: "Automotive",
        requiredSkills: ["IoT", "Mobile Development", "Payment Integration", "Maps API"],
        teamMembers: [
          { id: 16, name: "Rohan Sharma", role: "Founder", avatar: "/api/placeholder/40/40" },
          { id: 17, name: "Aditya Verma", role: "Hardware Engineer", avatar: "/api/placeholder/40/40" }
        ],
        openPositions: [
          { role: "Backend Developer", skills: ["Node.js", "MongoDB"], isPaid: true },
          { role: "Mobile Developer", skills: ["React Native", "Maps Integration"], isPaid: true }
        ],
        funding: "₹60,00,000",
        applications: 22,
        createdAt: "2023-12-20",
        ownerId: '16'
      },
      // User-2's project for testing notifications
      {
        id: 'user2-project1',
        title: "User-2's Test Project",
        description: "A test project owned by User-2 to verify notification functionality when users apply to positions.",
        stage: "MVP Development",
        industry: "Technology",
        requiredSkills: ["React", "Node.js", "JavaScript"],
        teamMembers: [
          { id: '2', name: "User-2", role: "Founder", avatar: "/api/placeholder/40/40" }
        ],
        openPositions: [
          { role: "Frontend Developer", skills: ["React", "JavaScript", "CSS"], isPaid: true },
          { role: "Backend Developer", skills: ["Node.js", "Express", "MongoDB"], isPaid: false }
        ],
        funding: "₹20,00,000",
        applications: 0,
        createdAt: "2024-02-01",
        ownerId: '2'
      }
    ];

    // Create user project mapping
    const projectMap = {
      '1': {
        ownedProjects: ['p1', 'p2', '4'],
        participatingProjects: ['p3', 'p4']
      },
      '2': {
        ownedProjects: ['user2-project1'],
        participatingProjects: []
      },
      '3': {
        ownedProjects: ['5'],
        participatingProjects: []
      },
      '4': {
        ownedProjects: ['6'],
        participatingProjects: []
      },
      '7': {
        ownedProjects: ['7'],
        participatingProjects: []
      },
      '9': {
        ownedProjects: ['8'],
        participatingProjects: []
      },
      '12': {
        ownedProjects: ['9'],
        participatingProjects: []
      },
      '13': {
        ownedProjects: ['10'],
        participatingProjects: []
      },
      '15': {
        ownedProjects: ['11'],
        participatingProjects: []
      },
      '16': {
        ownedProjects: ['12'],
        participatingProjects: []
      }
    };

    setProjects(sampleProjects);
    setUserProjectMap(projectMap);
    setHackathons(sampleHackathons);
    setLoading(false);

    // Load bookmarked projects from localStorage if available
    const savedBookmarks = localStorage.getItem('bookmarkedProjects');
    if (savedBookmarks) {
      setBookmarkedProjects(JSON.parse(savedBookmarks));
    }
  }, []);

  const createProject = (projectData) => {
    // Get the founder ID from team members (first member should be the founder)
    const founderId = projectData.teamMembers && projectData.teamMembers.length > 0 
      ? projectData.teamMembers[0].id 
      : null;

    const newProject = {
      id: Date.now().toString(),
      ...projectData,
      ownerId: founderId, // Set the ownerId for notifications
      applications: 0,
      createdAt: new Date().toISOString().split('T')[0]
    };

    console.log('Creating new project with ownerId:', founderId, 'Project:', newProject);

    setProjects(prev => [newProject, ...prev]);

    // Update user project mapping
    if (founderId) {
      setUserProjectMap(prev => {
        const userProjects = prev[founderId] || { ownedProjects: [], participatingProjects: [] };
        return {
          ...prev,
          [founderId]: {
            ...userProjects,
            ownedProjects: [...userProjects.ownedProjects, newProject.id]
          }
        };
      });
    }

    return newProject;
  };

  // Edit an existing project
  const editProject = (projectId, projectData) => {
    // Find the project to edit
    const projectIndex = projects.findIndex(p => p.id === projectId);

    if (projectIndex === -1) return false;

    // Get the original project to preserve founder information
    const originalProject = projects[projectIndex];
    const founder = originalProject.teamMembers.find(member => member.role === "Founder");

    // Create updated project object, preserving the original ID, creation date, and applications
    const updatedProject = {
      ...originalProject,
      ...projectData,
      id: originalProject.id,
      createdAt: originalProject.createdAt,
      applications: originalProject.applications,
      ownerId: originalProject.ownerId
    };

    // Ensure the founder remains in the team members list
    if (updatedProject.teamMembers && updatedProject.teamMembers.length > 0) {
      // Check if the founder is already in the team members
      const founderIndex = updatedProject.teamMembers.findIndex(
        member => founder && member.id === founder.id
      );

      // If founder is not in the team members, add them as the first member
      if (founderIndex === -1 && founder) {
        updatedProject.teamMembers = [founder, ...updatedProject.teamMembers];
      }
    }

    // Update the projects array
    setProjects(prev => prev.map(project =>
      project.id === projectId ? updatedProject : project
    ));

    return true;
  };

  // Delete a project and update user mappings
  const deleteProject = (projectId) => {
    // Find the project to be deleted
    const projectToDelete = projects.find(p => p.id === projectId);

    if (!projectToDelete) return false;

    // Remove project from projects array
    setProjects(prev => prev.filter(project => project.id !== projectId));

    // Update user project mappings for all users involved in the project
    setUserProjectMap(prev => {
      const updatedMap = { ...prev };

      // Get all user IDs involved in the project
      const userIds = new Set();

      // Add owner ID
      if (projectToDelete.ownerId) {
        userIds.add(projectToDelete.ownerId);
      }

      // Add all team members' IDs
      projectToDelete.teamMembers?.forEach(member => {
        if (member.id) userIds.add(member.id.toString());
      });

      // Update each user's project mapping
      userIds.forEach(userId => {
        if (updatedMap[userId]) {
          // Remove from owned projects
          if (updatedMap[userId].ownedProjects) {
            updatedMap[userId].ownedProjects = updatedMap[userId].ownedProjects.filter(
              id => id !== projectId.toString()
            );
          }

          // Remove from participating projects
          if (updatedMap[userId].participatingProjects) {
            updatedMap[userId].participatingProjects = updatedMap[userId].participatingProjects.filter(
              id => id !== projectId.toString()
            );
          }
        }
      });

      return updatedMap;
    });

    // Remove from bookmarks if it was bookmarked
    if (bookmarkedProjects.includes(projectId)) {
      setBookmarkedProjects(prev => {
        const updatedBookmarks = prev.filter(id => id !== projectId);
        localStorage.setItem('bookmarkedProjects', JSON.stringify(updatedBookmarks));
        return updatedBookmarks;
      });
    }

    return true;
  };

  const applyToProject = (projectId, applicationData) => {
    // Create a new application
    const newApplication = {
      id: Date.now().toString(),
      applicantId: applicationData.userId,
      applicantName: applicationData.applicantName || 'Unknown User',
      applicantAvatar: applicationData.applicantAvatar || 'U',
      applicantColor: applicationData.applicantColor || '#4f46e5',
      position: applicationData.position,
      skills: applicationData.skills || [],
      projectId: projectId,
      projectName: applicationData.projectName || 'Unknown Project',
      appliedDate: new Date().toISOString().split('T')[0],
      status: 'PENDING',
      message: applicationData.message || '',
      hasResume: !!applicationData.resume,
      resumeUrl: applicationData.resumeUrl || null,
      userDetails: applicationData.userDetails || null
    };

    // Add application to the applications list
    setApplications(prev => [...prev, newApplication]);

    // Update project application count
    setProjects(prev => prev.map(project =>
      project.id === projectId
        ? { ...project, applications: project.applications + 1 }
        : project
    ));
  };

  // Add a user to a project's team members
  const addUserToProject = (projectId, userData) => {
    console.log('Adding user to project:', projectId, 'User:', userData.name);
    
    // Check if project exists
    const projectIndex = projects.findIndex(p => p.id === projectId);

    if (projectIndex === -1) {
      console.log('Project not found:', projectId);
      return false;
    }

    console.log('Found project at index:', projectIndex, 'Current team members:', projects[projectIndex].teamMembers.length);

    // Check if user is already a team member
    const isAlreadyMember = projects[projectIndex].teamMembers.some(
      member => member.id === userData.id
    );

    if (isAlreadyMember) {
      console.log('User is already a team member');
      return false;
    }

    // Add user to the project's team members
    const updatedProjects = [...projects];
    updatedProjects[projectIndex] = {
      ...updatedProjects[projectIndex],
      teamMembers: [
        ...updatedProjects[projectIndex].teamMembers,
        userData
      ]
    };

    console.log('Updated project team members count:', updatedProjects[projectIndex].teamMembers.length);
    setProjects(updatedProjects);

    // Update user project mapping to add user to participating projects
    setUserProjectMap(prev => {
      const userProjects = prev[userData.id] || { ownedProjects: [], participatingProjects: [] };
      if (!userProjects.participatingProjects.includes(projectId.toString())) {
        return {
          ...prev,
          [userData.id]: {
            ...userProjects,
            participatingProjects: [...userProjects.participatingProjects, projectId.toString()]
          }
        };
      }
      return prev;
    });

    return true;
  };

  // Accept an application
  const acceptApplication = (applicationId) => {
    const application = applications.find(app => app.id === applicationId);
    if (!application) return false;

    console.log('Accepting application:', applicationId, 'for project:', application.projectId);
    console.log('Adding user:', application.applicantName, 'with position:', application.position);

    // Update application status
    setApplications(prev => prev.map(app =>
      app.id === applicationId ? { ...app, status: 'ACCEPTED' } : app
    ));

    // Add user to project team with position name and color
    const userData = {
      id: application.applicantId,
      name: application.applicantName,
      role: application.position, // This will be the position name (e.g., "Frontend Developer")
      avatar: application.applicantAvatar,
      applicantColor: application.applicantColor || '#4f46e5',
      email: application.userDetails?.email || undefined
    };

    console.log('User data to add:', userData);
    const result = addUserToProject(application.projectId, userData);
    console.log('Add user result:', result);
    
    return result;
  };

  // Reject an application
  const rejectApplication = (applicationId) => {
    setApplications(prev => prev.map(app =>
      app.id === applicationId ? { ...app, status: 'REJECTED' } : app
    ));
    return true;
  };

  // Get applications for a specific project
  const getProjectApplications = (projectId) => {
    return applications.filter(app => app.projectId === projectId);
  };

  // Get applications received by a user (for their projects)
  const getReceivedApplications = (userId) => {
    // Get projects owned by the user
    const userProjects = userProjectMap[userId] || { ownedProjects: [], participatingProjects: [] };
    const ownedProjectIds = userProjects.ownedProjects;

    // Return applications for projects owned by the user
    return applications.filter(app => ownedProjectIds.includes(app.projectId));
  };

  // Get applications sent by a user
  const getSentApplications = (userId) => {
    return applications.filter(app => app.applicantId === userId);
  };

  // Get projects for a specific user
  const getUserProjects = (userId) => {
    const userProjects = userProjectMap[userId] || { ownedProjects: [], participatingProjects: [] };

    const owned = projects.filter(project =>
      userProjects.ownedProjects.includes(project.id.toString())
    );

    const participating = projects.filter(project =>
      userProjects.participatingProjects.includes(project.id.toString())
    );

    return { owned, participating };
  };

  // Update project stage
  const updateProjectStage = (projectId, newStage) => {
    setProjects(prev => prev.map(project =>
      project.id === projectId
        ? { ...project, stage: newStage }
        : project
    ));
    return true;
  };

  // Function to toggle bookmark status for a project
  const toggleBookmark = (projectId) => {
    setBookmarkedProjects(prevBookmarks => {
      let newBookmarks;
      if (prevBookmarks.includes(projectId)) {
        // Remove bookmark
        newBookmarks = prevBookmarks.filter(id => id !== projectId);
      } else {
        // Add bookmark
        newBookmarks = [...prevBookmarks, projectId];
      }

      // Save to localStorage
      localStorage.setItem('bookmarkedProjects', JSON.stringify(newBookmarks));
      return newBookmarks;
    });
  };

  // Function to check if a project is bookmarked
  const isProjectBookmarked = (projectId) => {
    return bookmarkedProjects.includes(projectId);
  };

  // Leave a project the user is participating in
  const leaveProject = (projectId, userId) => {
    // First verify the user is participating in the project (not the owner)
    const userProjects = userProjectMap[userId] || { ownedProjects: [], participatingProjects: [] };
    const isParticipating = userProjects.participatingProjects.includes(projectId.toString());
    const isOwner = userProjects.ownedProjects.includes(projectId.toString());

    // If user is the owner or not participating, they can't leave
    if (!isParticipating || isOwner) return false;

    // Find the project
    const projectIndex = projects.findIndex(p => p.id.toString() === projectId.toString());
    if (projectIndex === -1) return false;

    // Remove user from the project's team members
    const project = projects[projectIndex];
    const updatedTeamMembers = project.teamMembers.filter(member =>
      member.id.toString() !== userId.toString()
    );

    // Update the project
    setProjects(prev => prev.map(p =>
      p.id.toString() === projectId.toString()
        ? { ...p, teamMembers: updatedTeamMembers }
        : p
    ));

    // Update the user's participating projects
    setUserProjectMap(prev => {
      const updatedUserProjects = { ...prev };
      if (updatedUserProjects[userId]) {
        updatedUserProjects[userId] = {
          ...updatedUserProjects[userId],
          participatingProjects: updatedUserProjects[userId].participatingProjects.filter(
            id => id.toString() !== projectId.toString()
          )
        };
      }
      return updatedUserProjects;
    });

    return true;
  };

  const value = {
    projects,
    hackathons,
    loading,
    applications,
    createProject,
    editProject,
    deleteProject,
    leaveProject,
    applyToProject,
    addUserToProject,
    acceptApplication,
    rejectApplication,
    getProjectApplications,
    getReceivedApplications,
    getSentApplications,
    getUserProjects,
    updateProjectStage,
    userProjectMap,
    bookmarkedProjects,
    toggleBookmark,
    isProjectBookmarked
  };

  return (
    <ProjectContext.Provider value={value}>
      {children}
    </ProjectContext.Provider>
  );
};

// Sample hackathon data
const sampleHackathons = [
  {
    id: 1,
    title: "FinTech Innovation Challenge 2024",
    description: "Build the next generation of financial technology solutions",
    startDate: "2024-02-15",
    endDate: "2024-02-17",
    prize: "₹5,00,000",
    participants: 150,
    status: "upcoming",
    categories: ["Blockchain", "AI/ML", "Mobile Apps"]
  },
  {
    id: 2,
    title: "Sustainable Tech Hackathon",
    description: "Create technology solutions for environmental challenges",
    startDate: "2024-01-20",
    endDate: "2024-01-22",
    prize: "₹3,00,000",
    participants: 89,
    status: "ongoing",
    categories: ["IoT", "Clean Energy", "Data Analytics"]
  }
];
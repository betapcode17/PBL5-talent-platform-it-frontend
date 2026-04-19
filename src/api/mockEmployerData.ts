import type {
  EmployerCandidatesResponse,
  EmployerDashboardResponse,
  EmployerInterviewsResponse,
  EmployerJobsResponse,
  EmployerProfileResponse
} from '@/@types/employer'

const now = new Date()

export const mockEmployerProfile: EmployerProfileResponse = {
  employeeId: 1001,
  role: 'EMPLOYER',
  joinedDate: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 365).toISOString(),
  user: {
    user_id: 501,
    full_name: 'Nguyen Van A',
    email: 'employer@company.com',
    phone: '0912345678',
    user_image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=NguenVanA'
  },
  company: {
    company_id: 201,
    company_name: 'ITJob Recruitment Co.',
    company_email: 'hr@itjob.com',
    company_image: 'https://api.dicebear.com/7.x/icons/svg?scale=80&seed=ITJob',
    city: 'Ho Chi Minh',
    company_website_url: 'https://itjob.com',
    company_industry: 'Technology',
    company_size: '50-100 employees'
  }
}

export const mockEmployerDashboard: EmployerDashboardResponse = {
  profile: {
    employeeId: mockEmployerProfile.employeeId,
    role: mockEmployerProfile.role,
    user: mockEmployerProfile.user,
    company: mockEmployerProfile.company
  },
  metrics: {
    openJobsCount: 5,
    totalApplicants: 85,
    activeChatsCount: 12,
    scheduledInterviewsCount: 8,
    hiredCount: 3,
    newCandidatesCount: 15
  },
  pipeline: {
    newApplicants: 15,
    shortlisted: 23,
    interviews: 8,
    hired: 3,
    rejected: 36
  },
  jobs: [
    {
      id: 9001,
      title: 'Senior Product Designer',
      salary: '35 - 45 million',
      workLocation: 'Da Nang',
      level: 'Senior',
      experience: '3+ years',
      isActive: true,
      createdDate: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 7).toISOString(),
      updatedDate: now.toISOString(),
      applicantCount: 14,
      category: { category_id: 1, name: 'Design' },
      jobType: { job_type_id: 1, job_type: 'Full-time' }
    },
    {
      id: 9002,
      title: 'QA Automation Engineer',
      salary: '28 - 38 million',
      workLocation: 'Hybrid - Ho Chi Minh',
      level: 'Middle',
      experience: '2+ years',
      isActive: true,
      createdDate: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 14).toISOString(),
      updatedDate: now.toISOString(),
      applicantCount: 9,
      category: { category_id: 2, name: 'Quality Assurance' },
      jobType: { job_type_id: 1, job_type: 'Full-time' }
    },
    {
      id: 9003,
      title: 'Backend Engineer (Node.js)',
      salary: '32 - 42 million',
      workLocation: 'Remote',
      level: 'Senior',
      experience: '4+ years',
      isActive: true,
      createdDate: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 3).toISOString(),
      updatedDate: now.toISOString(),
      applicantCount: 22,
      category: { category_id: 3, name: 'Engineering' },
      jobType: { job_type_id: 1, job_type: 'Full-time' }
    },
    {
      id: 9004,
      title: 'Frontend Developer (React)',
      salary: '24 - 32 million',
      workLocation: 'Da Nang / Remote',
      level: 'Middle',
      experience: '2+ years',
      isActive: true,
      createdDate: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 2).toISOString(),
      updatedDate: now.toISOString(),
      applicantCount: 31,
      category: { category_id: 3, name: 'Engineering' },
      jobType: { job_type_id: 1, job_type: 'Full-time' }
    }
  ],
  candidates: [
    {
      applicationId: 9101,
      appliedAt: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 3).toISOString(),
      stage: 'Shortlisted',
      status: 'PASSED',
      seeker: {
        id: 3001,
        fullName: 'Pham Gia Huy',
        email: 'huy.frontend@example.com',
        phone: '0905001122',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=PhamGiaHuy',
        skills: ['React', 'TypeScript', 'Figma', 'Storybook']
      },
      job: {
        id: 9001,
        title: 'Senior Product Designer'
      },
      nextInterview: {
        id: 9201,
        interview_date: new Date(now.getTime() + 1000 * 60 * 60 * 24).toISOString(),
        interview_type: 'Online',
        status: 'SCHEDULED'
      }
    },
    {
      applicationId: 9102,
      appliedAt: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 5).toISOString(),
      stage: 'New CV',
      status: 'PENDING',
      seeker: {
        id: 3002,
        fullName: 'Ngo Bao Tram',
        email: 'tram.qa@example.com',
        phone: '0911223344',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=NgoBaoTram',
        skills: ['Cypress', 'Playwright', 'API Testing']
      },
      job: {
        id: 9002,
        title: 'QA Automation Engineer'
      },
      nextInterview: null
    },
    {
      applicationId: 9103,
      appliedAt: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 1).toISOString(),
      stage: 'Interview Scheduled',
      status: 'PASSED',
      seeker: {
        id: 3003,
        fullName: 'Tran Minh Duc',
        email: 'duc.backend@example.com',
        phone: '0912345678',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=TranMinhDuc',
        skills: ['Node.js', 'Express', 'PostgreSQL', 'MongoDB', 'Docker']
      },
      job: {
        id: 9003,
        title: 'Backend Engineer (Node.js)'
      },
      nextInterview: {
        id: 9202,
        interview_date: new Date(now.getTime() + 1000 * 60 * 60 * 24 * 2).toISOString(),
        interview_type: 'Online',
        status: 'SCHEDULED'
      }
    }
  ],
  todayInterviews: [
    {
      id: 9201,
      interviewDate: new Date(now.getTime() + 1000 * 60 * 60 * 2).toISOString(),
      interviewType: 'Online',
      status: 'SCHEDULED',
      candidateName: 'Pham Gia Huy',
      jobTitle: 'Senior Product Designer',
      jobId: 9001
    },
    {
      id: 9202,
      interviewDate: new Date(now.getTime() + 1000 * 60 * 60 * 5).toISOString(),
      interviewType: 'Offline',
      status: 'SCHEDULED',
      candidateName: 'Vu Thanh Hoa',
      jobTitle: 'QA Automation Engineer',
      jobId: 9002
    }
  ]
}

export const mockEmployerJobs: EmployerJobsResponse = {
  total: 5,
  jobs: [
    {
      id: 9001,
      title: 'Senior Product Designer',
      salary: '35 - 45 million',
      workLocation: 'Da Nang',
      level: 'Senior',
      experience: '3+ years',
      isActive: true,
      createdDate: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 7).toISOString(),
      updatedDate: now.toISOString(),
      applicantCount: 14,
      category: { category_id: 1, name: 'Design' },
      jobType: { job_type_id: 1, job_type: 'Full-time' }
    },
    {
      id: 9002,
      title: 'QA Automation Engineer',
      salary: '28 - 38 million',
      workLocation: 'Hybrid - Ho Chi Minh',
      level: 'Middle',
      experience: '2+ years',
      isActive: true,
      createdDate: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 14).toISOString(),
      updatedDate: now.toISOString(),
      applicantCount: 9,
      category: { category_id: 2, name: 'Quality Assurance' },
      jobType: { job_type_id: 1, job_type: 'Full-time' }
    },
    {
      id: 9003,
      title: 'Backend Engineer (Node.js)',
      salary: '32 - 42 million',
      workLocation: 'Remote',
      level: 'Senior',
      experience: '4+ years',
      isActive: true,
      createdDate: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 3).toISOString(),
      updatedDate: now.toISOString(),
      applicantCount: 22,
      category: { category_id: 3, name: 'Engineering' },
      jobType: { job_type_id: 1, job_type: 'Full-time' }
    },
    {
      id: 9004,
      title: 'Frontend Developer (React)',
      salary: '24 - 32 million',
      workLocation: 'Da Nang / Remote',
      level: 'Middle',
      experience: '2+ years',
      isActive: true,
      createdDate: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 2).toISOString(),
      updatedDate: now.toISOString(),
      applicantCount: 31,
      category: { category_id: 3, name: 'Engineering' },
      jobType: { job_type_id: 1, job_type: 'Full-time' }
    },
    {
      id: 9005,
      title: 'DevOps Engineer',
      salary: '30 - 40 million',
      workLocation: 'Ho Chi Minh',
      level: 'Senior',
      experience: '3+ years',
      isActive: false,
      createdDate: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 30).toISOString(),
      updatedDate: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 5).toISOString(),
      applicantCount: 5,
      category: { category_id: 4, name: 'Infrastructure' },
      jobType: { job_type_id: 1, job_type: 'Full-time' }
    }
  ]
}

export const mockEmployerCandidates: EmployerCandidatesResponse = {
  total: 6,
  candidates: [
    {
      applicationId: 9101,
      appliedAt: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 3).toISOString(),
      stage: 'Shortlisted',
      status: 'PASSED',
      seeker: {
        id: 3001,
        fullName: 'Pham Gia Huy',
        email: 'huy.frontend@example.com',
        phone: '0905001122',
        skills: ['React', 'TypeScript', 'Figma', 'Storybook']
      },
      job: {
        id: 9001,
        title: 'Senior Product Designer'
      },
      nextInterview: {
        id: 9201,
        interview_date: new Date(now.getTime() + 1000 * 60 * 60 * 24).toISOString(),
        interview_type: 'Online',
        status: 'SCHEDULED'
      }
    },
    {
      applicationId: 9102,
      appliedAt: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 5).toISOString(),
      stage: 'New CV',
      status: 'PENDING',
      seeker: {
        id: 3002,
        fullName: 'Ngo Bao Tram',
        email: 'tram.qa@example.com',
        phone: '0911223344',
        skills: ['Cypress', 'Playwright', 'API Testing']
      },
      job: {
        id: 9002,
        title: 'QA Automation Engineer'
      },
      nextInterview: null
    },
    {
      applicationId: 9103,
      appliedAt: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 1).toISOString(),
      stage: 'Interview Scheduled',
      status: 'PASSED',
      seeker: {
        id: 3003,
        fullName: 'Tran Minh Duc',
        email: 'duc.backend@example.com',
        phone: '0912345678',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=TranMinhDuc',
        skills: ['Node.js', 'Express', 'PostgreSQL', 'MongoDB', 'Docker']
      },
      job: {
        id: 9003,
        title: 'Backend Engineer (Node.js)'
      },
      nextInterview: {
        id: 9202,
        interview_date: new Date(now.getTime() + 1000 * 60 * 60 * 24 * 2).toISOString(),
        interview_type: 'Online',
        status: 'SCHEDULED'
      }
    },
    {
      applicationId: 9104,
      appliedAt: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 2).toISOString(),
      stage: 'New CV',
      status: 'PENDING',
      seeker: {
        id: 3004,
        fullName: 'Le Thi Yen',
        email: 'yen.frontend@example.com',
        phone: '0901122334',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=LeThiYen',
        skills: ['React', 'Vue.js', 'JavaScript', 'CSS']
      },
      job: {
        id: 9004,
        title: 'Frontend Developer (React)'
      },
      nextInterview: null
    },
    {
      applicationId: 9105,
      appliedAt: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 7).toISOString(),
      stage: 'Hired',
      status: 'PASSED',
      seeker: {
        id: 3005,
        fullName: 'Doan Khanh Linh',
        email: 'linh.design@example.com',
        phone: '0987654321',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=DoanKhanhLinh',
        skills: ['UI/UX Design', 'Figma', 'Adobe XD', 'Prototyping']
      },
      job: {
        id: 9001,
        title: 'Senior Product Designer'
      },
      nextInterview: null
    },
    {
      applicationId: 9106,
      appliedAt: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 4).toISOString(),
      stage: 'Shortlisted',
      status: 'PENDING',
      seeker: {
        id: 3006,
        fullName: 'Vu Thanh Hoa',
        email: 'hoa.qa@example.com',
        phone: '0923456789',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=VuThanhHoa',
        skills: ['Selenium', 'TestNG', 'Postman', 'Manual Testing']
      },
      job: {
        id: 9002,
        title: 'QA Automation Engineer'
      },
      nextInterview: {
        id: 9203,
        interview_date: new Date(now.getTime() + 1000 * 60 * 60 * 24 * 3).toISOString(),
        interview_type: 'Offline',
        status: 'SCHEDULED'
      }
    }
  ]
}

export const mockEmployerInterviews: EmployerInterviewsResponse = {
  total: 4,
  interviews: [
    {
      id: 9201,
      round: 1,
      interviewType: 'Online',
      interviewDate: new Date(now.getTime() + 1000 * 60 * 60 * 24).toISOString(),
      startTime: '14:00',
      endTime: '15:00',
      location: 'Google Meet',
      status: 'SCHEDULED',
      note: 'Portfolio review + collaboration',
      candidate: {
        id: 3001,
        fullName: 'Pham Gia Huy',
        email: 'huy.frontend@example.com',
        phone: '0905001122'
      },
      interviewer: {
        id: 1001,
        fullName: 'Nguyen Minh Recruiter',
        role: 'Lead Recruiter'
      },
      job: {
        id: 9001,
        title: 'Senior Product Designer'
      },
      applicationStatus: 'PASSED'
    },
    {
      id: 9202,
      round: 2,
      interviewType: 'Online',
      interviewDate: new Date(now.getTime() + 1000 * 60 * 60 * 24 * 2).toISOString(),
      startTime: '10:00',
      endTime: '11:00',
      location: 'Zoom',
      status: 'SCHEDULED',
      note: 'Technical round - Backend systems',
      candidate: {
        id: 3003,
        fullName: 'Tran Minh Duc',
        email: 'duc.backend@example.com',
        phone: '0912345678'
      },
      interviewer: {
        id: 1002,
        fullName: 'Le Van Tuan',
        role: 'Senior Backend Lead'
      },
      job: {
        id: 9003,
        title: 'Backend Engineer (Node.js)'
      },
      applicationStatus: 'PASSED'
    },
    {
      id: 9203,
      round: 1,
      interviewType: 'Offline',
      interviewDate: new Date(now.getTime() + 1000 * 60 * 60 * 24 * 3).toISOString(),
      startTime: '15:30',
      endTime: '16:30',
      location: 'Office 3F - Meeting Room A',
      status: 'SCHEDULED',
      note: 'Initial screening - QA assessment',
      candidate: {
        id: 3006,
        fullName: 'Vu Thanh Hoa',
        email: 'hoa.qa@example.com',
        phone: '0923456789'
      },
      interviewer: {
        id: 1003,
        fullName: 'Tran Thi Mai',
        role: 'QA Manager'
      },
      job: {
        id: 9002,
        title: 'QA Automation Engineer'
      },
      applicationStatus: 'PENDING'
    },
    {
      id: 9204,
      round: 1,
      interviewType: 'Online',
      interviewDate: new Date(now.getTime() - 1000 * 60 * 60 * 24).toISOString(),
      startTime: '09:00',
      endTime: '10:00',
      location: 'Zoom',
      status: 'COMPLETED',
      note: 'Completed - Great potential',
      candidate: {
        id: 3007,
        fullName: 'Ngo Quoc An',
        email: 'an.backend@example.com',
        phone: '0934567890'
      },
      interviewer: {
        id: 1002,
        fullName: 'Le Van Tuan',
        role: 'Senior Backend Lead'
      },
      job: {
        id: 9003,
        title: 'Backend Engineer (Node.js)'
      },
      applicationStatus: 'PASSED'
    }
  ]
}

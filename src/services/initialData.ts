/**
 * Initial Scenario Data for StudyFlow
 * Student Persona: "Krishna"
 * College: Poornima College of Engineering
 * Target GPA: 3.8 / 4.0
 * Available Study Time: 3.5 Hours / Day
 */

import {
  UserProfile,
  Subject,
  Exam,
  Topic,
  Task,
  StudyPlan,
  RiskAssessment,
  ProgressMetrics,
  AgentAction,
  NotificationItem,
  DailyBriefing
} from '../types';

export const INITIAL_USER: UserProfile = {
  id: 'user_krishna_1',
  name: 'Krishna Sharma',
  email: 'krishna@college.edu',
  college: 'Poornima College of Engineering',
  university: 'Rajasthan Technical University',
  major: 'B.Tech AI & Data Science',
  semester: 4,
  currentCgpa: 8.4,
  targetCgpa: 9.2,
  targetGpa: 9.2,
  expectedGraduationYear: 2026,
  availableHoursPerDay: 3.5,
  preferredStudyTimes: ['morning', 'evening'],
  studyGoals: [
    'Score > 90% in Physics Mid-Term (Exam in 4 days)',
    'Master Dynamic Programming & Graph Algorithms',
    'Maintain daily study consistency without cramming'
  ],
  createdDate: '2026-08-20'
};

export const INITIAL_SUBJECTS: Subject[] = [
  {
    id: 'subj_physics',
    name: 'Engineering Physics',
    code: 'PHY-201',
    color: '#ef4444', // Red-orange (High urgency)
    currentConfidence: 2, // Struggling
    totalEstimatedHours: 28,
    completedHours: 10,
    topicsCount: 8,
    completedTopicsCount: 3,
    examDate: '2026-08-30'
  },
  {
    id: 'subj_dsa',
    name: 'Data Structures & Algorithms',
    code: 'CS-202',
    color: '#3b82f6', // Blue
    currentConfidence: 4, // Strong
    totalEstimatedHours: 32,
    completedHours: 18,
    topicsCount: 10,
    completedTopicsCount: 6,
    examDate: '2026-09-08'
  },
  {
    id: 'subj_dbms',
    name: 'Database Management Systems',
    code: 'CS-204',
    color: '#10b981', // Emerald
    currentConfidence: 3, // Moderate
    totalEstimatedHours: 24,
    completedHours: 12,
    topicsCount: 7,
    completedTopicsCount: 4,
    examDate: '2026-09-14'
  },
  {
    id: 'subj_math',
    name: 'Discrete Mathematics',
    code: 'MAT-203',
    color: '#8b5cf6', // Violet
    currentConfidence: 3, // Moderate
    totalEstimatedHours: 20,
    completedHours: 8,
    topicsCount: 6,
    completedTopicsCount: 2,
    examDate: '2026-09-20'
  }
];

export const INITIAL_EXAMS: Exam[] = [
  {
    id: 'exam_physics_midterm',
    subjectId: 'subj_physics',
    subjectName: 'Engineering Physics',
    title: 'Physics Mid-Term Examination',
    examDate: '2026-08-30',
    weightPercentage: 30,
    targetScore: 92,
    daysRemaining: 4
  },
  {
    id: 'exam_dsa_midterm',
    subjectId: 'subj_dsa',
    subjectName: 'Data Structures & Algorithms',
    title: 'DSA Mid-Term Theory & Lab',
    examDate: '2026-09-08',
    weightPercentage: 25,
    targetScore: 95,
    daysRemaining: 13
  },
  {
    id: 'exam_dbms_quiz',
    subjectId: 'subj_dbms',
    subjectName: 'Database Management Systems',
    title: 'DBMS SQL & Normalization Quiz',
    examDate: '2026-09-14',
    weightPercentage: 15,
    targetScore: 90,
    daysRemaining: 19
  }
];

export const INITIAL_TOPICS: Topic[] = [
  {
    id: 'topic_phy_1',
    subjectId: 'subj_physics',
    subjectName: 'Engineering Physics',
    title: 'Electromagnetic Induction & Faradays Laws',
    difficulty: 'hard',
    estimatedHours: 4,
    completedHours: 4,
    isHighPriority: true,
    examWeight: 'high',
    completed: true,
    subtopics: [
      { id: 'sub_phy_1_1', title: 'Magnetic Flux & Lenzs Law', completed: true, estimatedMinutes: 60 },
      { id: 'sub_phy_1_2', title: 'Self and Mutual Inductance Derivations', completed: true, estimatedMinutes: 90 }
    ]
  },
  {
    id: 'topic_phy_2',
    subjectId: 'subj_physics',
    subjectName: 'Engineering Physics',
    title: 'Maxwells Equations & EM Waves',
    difficulty: 'advanced',
    estimatedHours: 6,
    completedHours: 0,
    isHighPriority: true,
    examWeight: 'high',
    completed: false,
    subtopics: [
      { id: 'sub_phy_2_1', title: 'Displacement Current & Maxwells Equations in Differential Form', completed: false, estimatedMinutes: 90 },
      { id: 'sub_phy_2_2', title: 'EM Wave Equation in Free Space & Poynting Vector', completed: false, estimatedMinutes: 90 }
    ]
  },
  {
    id: 'topic_phy_3',
    subjectId: 'subj_physics',
    subjectName: 'Engineering Physics',
    title: 'Wave Optics & Interference',
    difficulty: 'medium',
    estimatedHours: 4,
    completedHours: 2,
    isHighPriority: true,
    examWeight: 'medium',
    completed: false,
    subtopics: [
      { id: 'sub_phy_3_1', title: 'Youngs Double Slit Analytical Formulation', completed: true, estimatedMinutes: 60 },
      { id: 'sub_phy_3_2', title: 'Thin Film Interference & Newtons Rings', completed: false, estimatedMinutes: 60 }
    ]
  },
  {
    id: 'topic_dsa_1',
    subjectId: 'subj_dsa',
    subjectName: 'Data Structures & Algorithms',
    title: 'Dynamic Programming: Knapsack & Subsequences',
    difficulty: 'hard',
    estimatedHours: 5,
    completedHours: 3,
    isHighPriority: true,
    examWeight: 'high',
    completed: false,
    subtopics: [
      { id: 'sub_dsa_1_1', title: '0/1 Knapsack memoization & tabulation', completed: true, estimatedMinutes: 90 },
      { id: 'sub_dsa_1_2', title: 'Longest Common Subsequence (LCS)', completed: false, estimatedMinutes: 60 }
    ]
  },
  {
    id: 'topic_dbms_1',
    subjectId: 'subj_dbms',
    subjectName: 'Database Management Systems',
    title: 'Normalization & Normal Forms (1NF, 2NF, 3NF, BCNF)',
    difficulty: 'medium',
    estimatedHours: 4,
    completedHours: 4,
    isHighPriority: true,
    examWeight: 'high',
    completed: true,
    subtopics: [
      { id: 'sub_dbms_1_1', title: 'Functional Dependencies & Closure', completed: true, estimatedMinutes: 60 },
      { id: 'sub_dbms_1_2', title: 'Lossless Decomposition into BCNF', completed: true, estimatedMinutes: 60 }
    ]
  }
];

const today = new Date().toISOString().split('T')[0];

const getOffsetDate = (days: number): string => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
};

export const INITIAL_TASKS: Task[] = [
  // Today's Scheduled Tasks
  {
    id: 'task_phy_em_1',
    planId: 'plan_krishna_sprint_1',
    subjectId: 'subj_physics',
    subjectName: 'Engineering Physics',
    topicId: 'topic_phy_2',
    topicTitle: 'Maxwells Equations & EM Waves',
    subtopicTitle: 'Displacement Current & Differential Equations',
    title: 'Maxwells Equations Derivation & Problem Solving',
    description: 'Crucial 15-mark exam topic. Complete mathematical derivations for differential and integral forms.',
    date: today,
    startTime: '14:00',
    durationMinutes: 90,
    priority: 'urgent',
    difficulty: 'advanced',
    status: 'pending',
    assignedAgent: 'planner'
  },
  {
    id: 'task_dsa_lcs',
    planId: 'plan_krishna_sprint_1',
    subjectId: 'subj_dsa',
    subjectName: 'Data Structures & Algorithms',
    topicId: 'topic_dsa_1',
    topicTitle: 'Dynamic Programming: Knapsack & Subsequences',
    subtopicTitle: 'Longest Common Subsequence (LCS)',
    title: 'LCS Tabulation & Space Optimization',
    description: 'Solve 3 LeetCode medium questions on longest common subsequence and print the string.',
    date: today,
    startTime: '17:00',
    durationMinutes: 60,
    priority: 'high',
    difficulty: 'hard',
    status: 'pending',
    assignedAgent: 'planner'
  },
  {
    id: 'task_math_discrete',
    planId: 'plan_krishna_sprint_1',
    subjectId: 'subj_math',
    subjectName: 'Discrete Mathematics',
    topicId: 'topic_math_1',
    topicTitle: 'Graph Theory & Trees',
    subtopicTitle: 'Spanning Trees & Euler Paths',
    title: 'Discrete Math: Graph Coloring & Euler Circuits',
    description: 'Review theorem proofs and solve problem set 4.',
    date: today,
    startTime: '20:00',
    durationMinutes: 45,
    priority: 'medium',
    difficulty: 'medium',
    status: 'pending',
    assignedAgent: 'planner'
  },

  // Tomorrow's Tasks
  {
    id: 'task_phy_poynting',
    planId: 'plan_krishna_sprint_1',
    subjectId: 'subj_physics',
    subjectName: 'Engineering Physics',
    topicId: 'topic_phy_2',
    topicTitle: 'Maxwells Equations & EM Waves',
    subtopicTitle: 'Poynting Vector & Energy Flow',
    title: 'Poynting Vector & Wave Equation in Free Space',
    description: 'Derive wave equations in dielectric media and calculate energy flux density.',
    date: getOffsetDate(1),
    startTime: '14:00',
    durationMinutes: 90,
    priority: 'urgent',
    difficulty: 'advanced',
    status: 'pending',
    assignedAgent: 'planner'
  },
  {
    id: 'task_dsa_graphs',
    planId: 'plan_krishna_sprint_1',
    subjectId: 'subj_dsa',
    subjectName: 'Data Structures & Algorithms',
    topicId: 'topic_dsa_2',
    topicTitle: 'Graph Traversals (BFS / DFS)',
    subtopicTitle: 'Bipartite graph verification',
    title: 'Graph BFS/DFS & Cycle Detection',
    description: 'Practice directed and undirected cycle detection algorithms.',
    date: getOffsetDate(1),
    startTime: '17:00',
    durationMinutes: 60,
    priority: 'medium',
    difficulty: 'medium',
    status: 'pending',
    assignedAgent: 'planner'
  },

  // Past Completed Tasks
  {
    id: 'task_phy_faraday_done',
    planId: 'plan_krishna_sprint_1',
    subjectId: 'subj_physics',
    subjectName: 'Engineering Physics',
    topicId: 'topic_phy_1',
    topicTitle: 'Electromagnetic Induction & Faradays Laws',
    subtopicTitle: 'Magnetic Flux & Lenzs Law',
    title: 'Faradays Experiments & Lenzs Law Verification',
    description: 'Completed analytical derivation of induced EMF in a moving conductor.',
    date: getOffsetDate(-1),
    startTime: '14:00',
    durationMinutes: 90,
    priority: 'high',
    difficulty: 'hard',
    status: 'completed',
    completedAt: `${getOffsetDate(-1)}T15:30:00Z`,
    assignedAgent: 'planner'
  },
  {
    id: 'task_dbms_bcnf_done',
    planId: 'plan_krishna_sprint_1',
    subjectId: 'subj_dbms',
    subjectName: 'Database Management Systems',
    topicId: 'topic_dbms_1',
    topicTitle: 'Normalization & Normal Forms',
    subtopicTitle: 'Lossless Decomposition into BCNF',
    title: 'BCNF Decomposition Practice',
    description: 'Solved 5 university exam problems on functional dependency closure and 3NF/BCNF test.',
    date: getOffsetDate(-1),
    startTime: '17:00',
    durationMinutes: 60,
    priority: 'high',
    difficulty: 'medium',
    status: 'completed',
    completedAt: `${getOffsetDate(-1)}T18:00:00Z`,
    assignedAgent: 'planner'
  }
];

export const INITIAL_PLAN: StudyPlan = {
  id: 'plan_krishna_sprint_1',
  title: 'Semester Mid-Term Sprint Plan',
  userId: 'user_krishna_1',
  startDate: getOffsetDate(-3),
  endDate: getOffsetDate(20),
  totalTasks: 18,
  completedTasks: 8,
  totalStudyHours: 42,
  completedStudyHours: 19.5,
  status: 'active',
  createdAt: '2026-08-20T10:00:00Z',
  updatedAt: new Date().toISOString(),
  adaptationCount: 1
};

export const INITIAL_RISK: RiskAssessment = {
  overallRiskLevel: 'HIGH',
  overallRiskScore: 72,
  assessedAt: new Date().toISOString(),
  criticalIssuesCount: 1,
  subjectRisks: [
    {
      subjectId: 'subj_physics',
      subjectName: 'Engineering Physics',
      riskLevel: 'HIGH',
      riskScore: 78,
      remainingSyllabusPercent: 62,
      daysUntilExam: 4,
      availableStudyHours: 14,
      requiredStudyHours: 18,
      missedTasksCount: 0,
      reasonSummary: 'Engineering Physics is HIGH RISK because 62% of the syllabus remains and only 4 study days are available before the Mid-Term exam.',
      explanation: 'Engineering Physics is HIGH RISK because 62% of the syllabus remains and only 4 study days are available before the Mid-Term exam.',
      suggestedActions: [
        'Prioritize 90-minute Maxwells Equations session today',
        'Temporarily reallocate 30 minutes from strong DSA topics to Physics practice',
        'Schedule focused 2-hour derivation review on Saturday'
      ],
      mitigationSuggestions: [
        'Prioritize 90-minute Maxwells Equations session today',
        'Temporarily reallocate 30 minutes from strong DSA topics to Physics practice'
      ]
    },
    {
      subjectId: 'subj_dsa',
      subjectName: 'Data Structures & Algorithms',
      riskLevel: 'LOW',
      riskScore: 22,
      remainingSyllabusPercent: 40,
      daysUntilExam: 13,
      availableStudyHours: 24,
      requiredStudyHours: 14,
      missedTasksCount: 0,
      reasonSummary: 'DSA is on a healthy trajectory with high student confidence and 13 days to exam.',
      explanation: 'DSA is on a healthy trajectory with high student confidence and 13 days to exam.',
      suggestedActions: [
        'Maintain steady 60-minute daily coding sessions',
        'Safe to donate buffer time to Physics if needed'
      ],
      mitigationSuggestions: [
        'Maintain steady 60-minute daily coding sessions'
      ]
    },
    {
      subjectId: 'subj_dbms',
      subjectName: 'Database Management Systems',
      riskLevel: 'LOW',
      riskScore: 28,
      remainingSyllabusPercent: 48,
      daysUntilExam: 19,
      availableStudyHours: 30,
      requiredStudyHours: 12,
      missedTasksCount: 0,
      reasonSummary: 'DBMS velocity is optimal. Normalization modules completed ahead of schedule.',
      explanation: 'DBMS velocity is optimal. Normalization modules completed ahead of schedule.',
      suggestedActions: [
        'Continue standard syllabus progression next week'
      ],
      mitigationSuggestions: [
        'Continue standard syllabus progression next week'
      ]
    },
    {
      subjectId: 'subj_math',
      subjectName: 'Discrete Mathematics',
      riskLevel: 'MEDIUM',
      riskScore: 45,
      remainingSyllabusPercent: 60,
      daysUntilExam: 25,
      availableStudyHours: 35,
      requiredStudyHours: 12,
      missedTasksCount: 0,
      reasonSummary: 'Moderate pace required. Sufficient runway before final exam.',
      explanation: 'Moderate pace required. Sufficient runway before final exam.',
      suggestedActions: [
        'Keep 45-minute evening review slots active'
      ],
      mitigationSuggestions: [
        'Keep 45-minute evening review slots active'
      ]
    }
  ],
  overloadedDays: ['Thursday (4.0 hrs scheduled)', 'Friday (3.5 hrs scheduled)'],
  summaryExplanation: 'Engineering Physics is HIGH RISK because 62% of the syllabus remains and only 4 study days are available before the Mid-Term exam.',
  recommendedAgentActions: [
    'Orchestrator Agent prepared to relocate 30 mins from DSA to Physics upon missed task',
    'Planner Agent assigned priority badges to Maxwell Equations and Poynting Vector'
  ]
};

export const INITIAL_PROGRESS: ProgressMetrics = {
  totalTasks: 18,
  completedTasks: 8,
  missedTasks: 0,
  rescheduledTasks: 1,
  pendingTasks: 9,
  completionRate: 44,
  missedRate: 0,
  completedStudyHours: 19.5,
  studyStreakDays: 3,
  totalHoursPlanned: 42,
  totalHoursCompleted: 19.5,
  estimatedCompletionDate: 'Aug 29, 2026',
  syllabusCoveredPercent: 44,
  subjectBreakdown: [
    { subjectId: 'subj_physics', subjectName: 'Engineering Physics', progressPercent: 36, hoursCompleted: 10, hoursTotal: 28, color: '#ef4444' },
    { subjectId: 'subj_dsa', subjectName: 'Data Structures & Algorithms', progressPercent: 56, hoursCompleted: 18, hoursTotal: 32, color: '#3b82f6' },
    { subjectId: 'subj_dbms', subjectName: 'Database Management Systems', progressPercent: 50, hoursCompleted: 12, hoursTotal: 24, color: '#10b981' },
    { subjectId: 'subj_math', subjectName: 'Discrete Mathematics', progressPercent: 40, hoursCompleted: 8, hoursTotal: 20, color: '#8b5cf6' }
  ]
};

export const INITIAL_ACTIONS: AgentAction[] = [
  {
    id: 'act_init_1',
    timestamp: '2026-08-26T09:41:00Z',
    timeFormatted: '09:41',
    agentModule: 'PLANNER',
    agentType: 'planner',
    toolName: 'analyze_syllabus',
    title: 'Syllabus Analyzed',
    description: 'Planner Agent parsed uploaded Engineering Physics syllabus into 6 core modules.',
    status: 'completed',
    payload: { course: 'PHY-201', modules: 6 }
  },
  {
    id: 'act_init_2',
    timestamp: '2026-08-26T09:42:00Z',
    timeFormatted: '09:42',
    agentModule: 'PLANNER',
    agentType: 'planner',
    toolName: 'extract_topics',
    title: '31 topics identified',
    description: 'Extracted 31 subtopics across 4 active enrolled courses.',
    status: 'completed',
    payload: { totalTopics: 31 }
  },
  {
    id: 'act_init_3',
    timestamp: '2026-08-26T09:42:30Z',
    timeFormatted: '09:42',
    agentModule: 'RISK',
    agentType: 'risk',
    toolName: 'detect_risk',
    title: '12 high-priority topics detected',
    description: 'Identified 12 exam-weighted topics carrying 65% of upcoming mid-term score.',
    status: 'completed',
    payload: { highPriorityCount: 12, examProximityDays: 4 }
  },
  {
    id: 'act_init_4',
    timestamp: '2026-08-26T09:43:00Z',
    timeFormatted: '09:43',
    agentModule: 'ORCHESTRATOR',
    agentType: 'orchestrator',
    toolName: 'create_study_plan',
    title: '28 study tasks created',
    description: 'Synthesized optimal study schedule matching 3.5 hrs/day available capacity.',
    status: 'completed',
    payload: { totalTasks: 28, capacity: '3.5 hrs/day' }
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif_1',
    type: 'risk',
    title: 'Physics Exam in 4 Days',
    message: 'Physics is currently HIGH RISK (62% syllabus remaining). 3 urgent topics require attention.',
    timestamp: '10 mins ago',
    read: false,
    priority: 'high',
    relatedSubjectId: 'subj_physics'
  },
  {
    id: 'notif_2',
    type: 'daily',
    title: 'Morning AI Briefing Ready',
    message: '3 priority tasks scheduled for today totaling 3.2 hours. Physics Mid-Term safeguarded.',
    timestamp: '07:00 AM',
    read: true,
    priority: 'low'
  }
];

export const INITIAL_DAILY_BRIEFING: DailyBriefing = {
  date: today,
  studentGreeting: 'Good morning, Krishna.',
  priorityTasksCount: 3,
  highRiskSubject: 'Engineering Physics',
  autonomousAdjustmentSummary: 'Physics is currently high risk (exam in 4 days). I moved 30 mins from Java/DSA to Physics to protect your deadline.',
  suggestedFocus: 'Maxwells Equations & Differential Derivations (14:00 - 15:30)',
  motivationalNote: 'Consistent 90-minute deep work blocks will secure all derivations before Saturday.'
};

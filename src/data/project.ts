import { Lightbulb } from "lucide-react";

export interface Project {
  id: number;
  type: string;
  title: string;
  description: string;
  metadata: {
    funding: string;
    duration: string;
    collaborators: string;
    status: string;
  };
  category: string;
}

export const projectsData: Project[] = [
  {
    id: 1,
    type: "Research Project",
    title: "Smart City Security Infrastructure",
    description:
      "NSF-funded project developing AI-powered cybersecurity solutions for municipal systems.",
    metadata: {
      funding: "$450K",
      duration: "2 years",
      collaborators: "3 departments",
      status: "Active",
    },
    category: "projects",
  },
  {
    id: 2,
    type: "Research Project",
    title: "Data Analytics for Environmental Monitoring",
    description:
      "Collaborative project using sensor networks and ML for real-time environmental data analysis.",
    metadata: {
      funding: "$320K",
      duration: "18 months",
      collaborators: "2 departments",
      status: "Active",
    },
    category: "projects",
  },
  {
    id: 3,
    type: "Research Project",
    title: "Renewable Energy Optimization",
    description:
      "Project focusing on optimizing solar and wind energy production using predictive algorithms.",
    metadata: {
      funding: "$500K",
      duration: "3 years",
      collaborators: "Engineering, Environmental Science",
      status: "Active",
    },
    category: "projects",
  },
  {
    id: 4,
    type: "Research Project",
    title: "Urban Traffic Flow Analysis",
    description:
      "Study using IoT sensors and AI models to improve urban traffic efficiency and reduce congestion.",
    metadata: {
      funding: "$250K",
      duration: "1.5 years",
      collaborators: "Computer Science, Civil Engineering",
      status: "Active",
    },
    category: "projects",
  },
  {
    id: 5,
    type: "Research Project",
    title: "AI for Health Diagnostics",
    description:
      "Machine learning project to enhance early detection of diseases through image and data analysis.",
    metadata: {
      funding: "$600K",
      duration: "2 years",
      collaborators: "Medical, Computer Science",
      status: "Active",
    },
    category: "projects",
  },
];

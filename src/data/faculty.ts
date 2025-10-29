export interface Faculty {
  id: number;
  type: string;
  name: string;
  title: string;
  department: string;
  office: string;
  phone: string;
  email: string;
  description: string;
  aiKeywords: string[];
  facultyKeywords: string[];
  photo: string;
  availability: string;
  projects: string;
  category: string;
}

export const facultyData: Faculty[] = [
  {
    id: 1,
    type: "Faculty Expert",
    name: "Dr. Sarah Chen",
    title: "Associate Professor",
    department: "Computer Science",
    office: "Room 204, Science Building",
    phone: "(123) 456-7890",
    email: "schen@salisbury.edu",
    description:
      "Specializes in cybersecurity, machine learning applications for threat detection, and privacy-preserving analytics.",
    aiKeywords: [
      "cybersecurity",
      "machine learning",
      "privacy-preserving analytics",
    ],
    facultyKeywords: ["cybersecurity", "AI", "data analytics"],
    photo: "/images/faculty/schen.png",
    availability: "Available",
    projects: "8 active",
    category: "faculty",
  },
  {
    id: 2,
    type: "Faculty Expert",
    name: "Dr. Michael Johnson",
    title: "Professor",
    department: "Electrical Engineering",
    office: "Room 101, Engineering Building",
    phone: "(123) 987-6543",
    email: "mjohnson@salisbury.edu",
    description: "Research in smart grids, energy systems, and IoT security.",
    aiKeywords: ["IoT", "energy systems", "smart grids"],
    facultyKeywords: ["IoT", "energy", "sensors"],
    photo: "/images/faculty/mjohnson.png",
    availability: "Available",
    projects: "5 active",
    category: "faculty",
  },
  {
    id: 3,
    type: "Faculty Expert",
    name: "Abdul Samad",
    title: "Lecturer",
    department: "Chemistry",
    office: "Room 302, Chemistry Building",
    phone: "(555) 123-4567",
    email: "asamad@salisbury.edu",
    description:
      "Lecturer in general and organic chemistry with focus on lab techniques.",
    aiKeywords: [
      "chemical analysis",
      "organic chemistry",
      "laboratory methods",
    ],
    facultyKeywords: ["chemistry", "experiments", "research supervision"],
    photo: "/images/faculty/abdul_samad.png",
    availability: "Available",
    projects: "3 active",
    category: "faculty",
  },
  {
    id: 4,
    type: "Faculty Expert",
    name: "Noah Marston",
    title: "Dr.",
    department: "G.I.S.",
    office: "Room 210, Geography Building",
    phone: "(555) 234-5678",
    email: "nmarston@salisbury.edu",
    description:
      "Specializes in geographic information systems, mapping, and spatial analysis.",
    aiKeywords: ["GIS analysis", "mapping", "spatial data"],
    facultyKeywords: ["GIS", "cartography", "remote sensing"],
    photo: "/images/faculty/noah_marston.png",
    availability: "Available",
    projects: "4 active",
    category: "faculty",
  },
  {
    id: 5,
    type: "Faculty Expert",
    name: "Lindsay Faulkner",
    title: "Associate Professor",
    department: "Mathematics",
    office: "Room 115, Math Building",
    phone: "(555) 345-6789",
    email: "lfaulkner@salisbury.edu",
    description:
      "Lecturer in calculus, algebra, and statistics with focus on applied math.",
    aiKeywords: ["algebra", "statistics", "calculus"],
    facultyKeywords: ["mathematics", "applied math", "problem solving"],
    photo: "/images/faculty/lindsay_faulkner.png",
    availability: "Available",
    projects: "2 active",
    category: "faculty",
  },
  {
    id: 6,
    type: "Faculty Expert",
    name: "Ray Glenfield",
    title: "Dr.",
    department: "Geography",
    office: "Room 408, Geography Building",
    phone: "(555) 456-7890",
    email: "rglenfield@salisbury.edu",
    description:
      "Lecturer in physical and human geography, with focus on urban studies.",
    aiKeywords: ["urban geography", "physical geography", "GIS"],
    facultyKeywords: ["geography", "mapping", "fieldwork"],
    photo: "/images/faculty/ray_glenfield.png",
    availability: "Available",
    projects: "3 active",
    category: "faculty",
  },
  {
    id: 7,
    type: "Faculty Expert",
    name: "Malik Lentil",
    title: "Lecturer",
    department: "Information Systems",
    office: "Room 512, IT Building",
    phone: "(555) 567-8901",
    email: "mlentil@salisbury.edu",
    description:
      "Lecturer in information systems, focusing on database management and analytics.",
    aiKeywords: ["databases", "information systems", "analytics"],
    facultyKeywords: ["IS", "data management", "systems analysis"],
    photo: "/images/faculty/malik_lentil.png",
    availability: "Available",
    projects: "5 active",
    category: "faculty",
  },
];

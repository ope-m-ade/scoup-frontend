// src/mockUsers.ts

export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  role: "faculty" | "admin";
}

// Faculty users
export const facultyUsers: User[] = [
  {
    id: 1,
    name: "Dr. Alice Johnson",
    email: "alice.johnson@su.edu",
    password: "password123",
    role: "faculty",
  },
  {
    id: 2,
    name: "Prof. Bob Smith",
    email: "bob.smith@su.edu",
    password: "securepass",
    role: "faculty",
  },
  {
    id: 3,
    name: "Dr. Carol Davis",
    email: "carol.davis@su.edu",
    password: "mypassword",
    role: "faculty",
  },
  {
    id: 4,
    name: "Prof. Daniel Lee",
    email: "daniel.lee@su.edu",
    password: "pass1234",
    role: "faculty",
  },
];

// Admin users
export const adminUsers: User[] = [
  {
    id: 1,
    name: "Admin Emma Taylor",
    email: "emma.taylor@su.edu",
    password: "adminpass",
    role: "admin",
  },
  {
    id: 2,
    name: "Admin Frank Wilson",
    email: "frank.wilson@su.edu",
    password: "admin123",
    role: "admin",
  },
  {
    id: 3,
    name: "Admin Grace Kim",
    email: "grace.kim@su.edu",
    password: "supersecret",
    role: "admin",
  },
  {
    id: 4,
    name: "Admin Henry Brown",
    email: "henry.brown@su.edu",
    password: "passadmin",
    role: "admin",
  },
];

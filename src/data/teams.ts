import { TeamMember } from "@/types";



export const teamMembers: TeamMember[] = [
  {
    id: 1,
    name: "John Rick Dominguez",                    // edit name here
    role: "Frontend Developer",               // edit position here
    avatar: "/images/teams/JURIK.jpg",  // replace with new avatar file/path (use public/ as web root)
    objectPosition: "center 30%",
    bio: "Passionate about delivering exceptional streaming experiences.", // edit bio here
  },
  {
    id: 2,
    name: "Edmar Sanchez",
    role: "Chief Technology Officer",
    avatar: "/images/teams/SIR_EDMAR.jpg",
    bio: "Leading innovation in streaming technology.",
  },
  {
    id: 3,
    name: "Aidriane Carl Esmeña",
    role: "Frontend Developer",
    avatar: "/images/teams/AIDRIANE.jpg",
    bio: "Curating the best entertainment for our viewers.",
  },
];



export const SERVICE_GROUPS = [
  {
    name: "Therapy",
    color: "#D3C4B5",
    services: ["Special Education", "Behavior Therapy", "Speech Therapy", "Occupational Therapy", "Early Intervention", "Play Therapy", "Physiotherapy"]
  },
  {
    name: "Counselling",
    color: "#C8C4DB",
    services: ["Children's Counselling", "Online Counselling", "Family Counselling", "Career Counselling", "Parental Guidance", "Support Groups"]
  },
  {
    name: "Tutoring",
    color: "#BACCB3",
    services: [
      "English", "Maths", "Science", "Social Studies", "Hindi", "Kannada", "French", "German",
      "Pre-Primary", "Junior", "High School", "Graduation", "CBSE", "ICSE", "IB", "State Board", "Cambridge board", "NIOS", "Homework Support"
    ]
  },
  {
    name: "Extra Curricular",
    color: "#D3C4B5",
    services: ["Dance", "Music", "Yoga", "Drawing or Painting", "Singing", "Sports Trainer", "General Physical Training"]
  },
  {
    name: "Modern Skills",
    color: "#BACCB3",
    services: ["Coding (C/C++, Python, JAVA)", "Digital Art", "Soft Skills", "Public Speaking", "Other Language"]
  },
  {
    name: "Specialist Roles",
    color: "#C8C4DB",
    services: ["Special Educator", "Shadow Teacher", "Home Tutor", "Therapist"]
  }
];

export const ALL_CATEGORIES = [
  "All",
  ...SERVICE_GROUPS.flatMap(group => group.services)
];

export const TOP_LEVEL_FILTERS = [
  "All",
  "Therapy",
  "Counselling",
  "Tutoring",
  "Extra Curricular",
  "Modern Skills",
  "Specialist Roles"
];

export const AGE_GROUPS = [
  "Toddlers (2-4)",
  "Pre-Primary (4-6)",
  "Primary (6-10)",
  "Adolescents (10+)",
  "Young Adults (19+)"
];

import { useParams, useNavigate } from "react-router-dom";
import "./CompanyPage.css";

function CompanyPage() {
  const { companyName } = useParams();
  const navigate = useNavigate();
  const companies = {
  google: {
    name: "Google",
    salary: "₹18-35 LPA",
    locations: ["Bangalore", "Hyderabad", "Gurgaon", "Pune"],
    rounds: [
      "Online Assessment",
      "Coding Interview",
      "DSA Round",
      "System Design",
      "Googliness + HR"
    ],
    topics: ["DSA", "System Design", "OOPs", "DBMS", "OS", "Networking"]
  },

  amazon: {
    name: "Amazon",
    salary: "₹15-45 LPA",
    locations: ["Bangalore", "Hyderabad", "Chennai"],
    rounds: [
      "Online Assessment",
      "Coding Round",
      "Technical Round",
      "Leadership Principles",
      "HR Round"
    ],
    topics: ["DSA", "OOPs", "DBMS", "OS", "Leadership Principles"]
  },

  microsoft: {
    name: "Microsoft",
    salary: "₹20-50 LPA",
    locations: ["Hyderabad", "Bangalore", "Noida"],
    rounds: [
      "Online Assessment",
      "Technical Round 1",
      "Technical Round 2",
      "System Design",
      "HR Round"
    ],
    topics: ["DSA", "LLD", "DBMS", "OS", "Networking"]
  },

  adobe: {
    name: "Adobe",
    salary: "₹20-45 LPA",
    locations: ["Noida", "Bangalore"],
    rounds: [
      "Online Assessment (Aptitude + Coding)",
      "Technical Round 1",
      "Technical Round 2",
      "System Design",
      "HR Round"
    ],
    topics: ["DSA", "SQL", "OS", "DBMS", "Networking", "System Design"]
  },

  uber: {
    name: "Uber",
    salary: "₹25-60 LPA",
    locations: ["Bangalore", "Hyderabad"],
    rounds: [
      "Online Assessment",
      "Coding Round (DSA)",
      "Hiring Manager Round",
      "System Design",
      "Bar Raiser / HR"
    ],
    topics: ["DSA", "System Design", "OOPs", "DBMS", "OS"]
  },

  flipkart: {
    name: "Flipkart",
    salary: "₹12-28 LPA",
    locations: ["Bangalore"],
    rounds: [
      "Phone Screening",
      "Machine Coding",
      "Problem Solving & DSA",
      "System Design",
      "Managerial Round"
    ],
    topics: ["DSA", "LLD", "System Design", "OOPs", "DBMS"]
  },

  oracle: {
    name: "Oracle",
    salary: "₹12-25 LPA",
    locations: ["Bangalore", "Hyderabad"],
    rounds: [
      "Online Assessment",
      "Technical Round 1",
      "Technical Round 2",
      "HR Round"
    ],
    topics: ["DSA", "OOPs", "DBMS", "SQL", "OS"]
  },

  walmart: {
    name: "Walmart",
    salary: "₹18-32 LPA",
    locations: ["Bangalore", "Chennai"],
    rounds: [
      "Online Assessment",
      "Technical Round 1",
      "Technical Round 2",
      "System Design",
      "HR Round"
    ],
    topics: ["DSA", "System Design", "OOPs", "DBMS", "OS"]
  },

  phonepe: {
    name: "PhonePe",
    salary: "₹15-30 LPA",
    locations: ["Bangalore"],
    rounds: [
      "Online Assessment (DSA)",
      "Technical Round 1 (DSA)",
      "Technical Round 2 (System Design)",
      "Hiring Manager / HR Round"
    ],
    topics: ["DSA", "System Design", "OOPs", "DBMS"]
  },

  paytm: {
    name: "Paytm",
    salary: "₹10-22 LPA",
    locations: ["Noida", "Bangalore"],
    rounds: [
      "Online Assessment (DSA + MCQs)",
      "Technical Round 1",
      "Technical Round 2",
      "HR Round"
    ],
    topics: ["DSA", "OOPs", "DBMS", "System Design"]
  },

  razorpay: {
    name: "Razorpay",
    salary: "₹14-28 LPA",
    locations: ["Bangalore"],
    rounds: [
      "Online Assessment / Aptitude",
      "Technical Round 1 (DSA)",
      "Technical Round 2 (System Design / Machine Coding)",
      "Managerial Round",
      "HR Round"
    ],
    topics: ["DSA", "System Design", "LLD", "OOPs", "DBMS"]
  },

  cred: {
    name: "CRED",
    salary: "₹18-35 LPA",
    locations: ["Bangalore"],
    rounds: [
      "Online Assessment",
      "Technical Round 1 (DSA)",
      "Technical Round 2 (System Design)",
      "Hiring Manager Round",
      "HR Round"
    ],
    topics: ["DSA", "System Design", "OOPs", "DBMS"]
  },

  meesho: {
    name: "Meesho",
    salary: "₹15-28 LPA",
    locations: ["Bangalore"],
    rounds: [
      "Online Assessment",
      "Technical Round 1 (DSA)",
      "Technical Round 2 (System Design)",
      "Hiring Manager / HR Round"
    ],
    topics: ["DSA", "System Design", "OOPs", "DBMS"]
  },

  zomato: {
    name: "Zomato",
    salary: "₹12-25 LPA",
    locations: ["Gurgaon", "Bangalore"],
    rounds: [
      "Online Coding Test",
      "Technical Round 1 (DSA)",
      "Technical Round 2 (DSA + Problem Solving)",
      "Managerial Round",
      "HR Round"
    ],
    topics: ["DSA", "System Design", "OOPs", "DBMS"]
  },

  swiggy: {
    name: "Swiggy",
    salary: "₹12-24 LPA",
    locations: ["Bangalore"],
    rounds: [
      "Online Test",
      "Technical Round 1",
      "Technical Round 2",
      "Design Interview",
      "HR Round"
    ],
    topics: ["DSA", "System Design", "OOPs", "DBMS"]
  },

  zoho: {
    name: "Zoho",
    salary: "₹8-18 LPA",
    locations: ["Chennai"],
    rounds: [
      "Written Test (Aptitude + Coding)",
      "Technical Round 1",
      "Technical Round 2",
      "HR Round"
    ],
    topics: ["DSA", "OOPs", "DBMS", "OS", "Networking"]
  },

  tcs: {
    name: "TCS",
    salary: "₹3.5-8 LPA",
    locations: ["Pan India"],
    rounds: [
      "Online Assessment (Aptitude + Coding)",
      "Technical Interview",
      "HR Interview"
    ],
    topics: ["DSA Basics", "OOPs", "DBMS", "Aptitude", "Communication"]
  },

  infosys: {
    name: "Infosys",
    salary: "₹4-8 LPA",
    locations: ["Pan India"],
    rounds: [
      "Online Assessment (Aptitude + Coding)",
      "Technical Interview",
      "HR Interview"
    ],
    topics: ["DSA Basics", "OOPs", "DBMS", "Aptitude", "Communication"]
  },

  wipro: {
    name: "Wipro",
    salary: "₹4-8 LPA",
    locations: ["Pan India"],
    rounds: [
      "Online Assessment (Aptitude + Coding)",
      "Technical Interview",
      "HR Interview"
    ],
    topics: ["DSA Basics", "OOPs", "DBMS", "Aptitude", "Communication"]
  },

  hcl: {
    name: "HCL",
    salary: "₹4-8 LPA",
    locations: ["Pan India"],
    rounds: [
      "Online Assessment (Aptitude + Coding)",
      "Technical Interview",
      "HR Interview"
    ],
    topics: ["DSA Basics", "OOPs", "DBMS", "Aptitude", "Communication"]
  },

  accenture: {
    name: "Accenture",
    salary: "₹4-10 LPA",
    locations: ["Pan India"],
    rounds: [
      "Cognitive & Technical Assessment",
      "Coding Assessment",
      "Technical Interview",
      "HR Interview"
    ],
    topics: ["DSA Basics", "OOPs", "DBMS", "Aptitude", "Communication"]
  },

  capgemini: {
    name: "Capgemini",
    salary: "₹4-9 LPA",
    locations: ["Pan India"],
    rounds: [
      "Online Assessment (Aptitude + Coding + English)",
      "Technical Interview",
      "HR Interview"
    ],
    topics: ["DSA Basics", "OOPs", "DBMS", "Aptitude", "Communication"]
  },

  cognizant: {
    name: "Cognizant",
    salary: "₹4-8 LPA",
    locations: ["Pan India"],
    rounds: [
      "Online Assessment (Aptitude + Coding)",
      "Technical Interview",
      "HR Interview"
    ],
    topics: ["DSA Basics", "OOPs", "DBMS", "Aptitude", "Communication"]
  },

  techmahindra: {
    name: "Tech Mahindra",
    salary: "₹4-8 LPA",
    locations: ["Pan India"],
    rounds: [
      "Online Assessment (Aptitude + Coding)",
      "Technical Interview",
      "HR Interview"
    ],
    topics: ["DSA Basics", "OOPs", "DBMS", "Aptitude", "Communication"]
  },
  devstringxtechnology:{
    name :"Devstringx technology",
    salary: "₹4-8 LPA",
    locations: ["Pan India"],
    rounds: [
      "Online Assessment (Aptitude + Coding)",
      "Technical Interview",
      "HR Interview"
    ],
    topics: ["DSA Basics", "OOPs", "DBMS", "Aptitude", "Communication"]
  }

  };

  const company = companies[companyName];

  if (!company) {
    return <h1>Company Not Found</h1>;
  }

  return (
    <div className="company-page">

      <div className="company-header">
  <div>
    <h1>{company.name} Interview Guide</h1>
  </div>

  <button
          className="main-start-btn"
          onClick={() =>
  navigate(`/practice/${companyName}/questions`)
}
        >
          🚀 Start Practice
        </button>
</div>

      <div className="info-grid">

        <div className="info-card">
          <h2>💰 Salary</h2>
          <p>{company.salary}</p>
        </div>

        <div className="info-card">
          <h2>📍 Locations</h2>

          <ul>
            {company.locations.map((loc) => (
              <li key={loc}>{loc}</li>
            ))}
          </ul>
        </div>

      </div>

      <div className="process-card">
        <h2>Interview Process</h2>

        {company.rounds.map((round, index) => (
          <div className="round" key={index}>
            <h3>Round {index + 1}</h3>
            <p>{round}</p>
          </div>
        ))}
      </div>

      <div className="track-section">
  <h2>Preparation Tracks</h2>

  {company.topics.map((topic) => (
    <button key={topic}>
      {topic}
    </button>
  ))}
</div>

    </div>
  );
}

export default CompanyPage;
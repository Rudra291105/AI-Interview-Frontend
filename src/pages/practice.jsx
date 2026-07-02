import "./practice.css";
import { useNavigate } from "react-router-dom";

function Practice() {
  const navigate = useNavigate();

  const startPractice = (company) => {
    // Strip spaces so multi-word company names (e.g. "Tech Mahindra")
    // match the slug keys used in CompanyPage / PracticeQuestions.
    navigate(`/practice/${company.toLowerCase().replace(/\s+/g, "")}`);
  };

  const companySections = [
    {
      title: "🔥 Top Product Companies",
      companies: [
        { name: "Google", salary: "₹18-35 LPA", questions: 120, time: "5 Hours" },
        { name: "Amazon", salary: "₹15-45 LPA", questions: 140, time: "6 Hours" },
        { name: "Microsoft", salary: "₹20-50 LPA", questions: 130, time: "5 Hours" },
        { name: "Adobe", salary: "₹20-45 LPA", questions: 100, time: "4 Hours" },
        { name: "Uber", salary: "₹25-60 LPA", questions: 160, time: "8 Hours" },
        { name: "Flipkart", salary: "₹12-28 LPA", questions: 90, time: "4 Hours" },
        { name: "Oracle", salary: "₹12-25 LPA", questions: 95, time: "4 Hours" },
        { name: "Walmart", salary: "₹18-32 LPA", questions: 110, time: "5 Hours" }
      ]
    },

    {
      title: "🇮🇳 Indian Startups",
      companies: [
        { name: "PhonePe", salary: "₹15-30 LPA", questions: 100, time: "5 Hours" },
        { name: "Paytm", salary: "₹10-22 LPA", questions: 85, time: "4 Hours" },
        { name: "Razorpay", salary: "₹14-28 LPA", questions: 100, time: "5 Hours" },
        { name: "CRED", salary: "₹18-35 LPA", questions: 110, time: "5 Hours" },
        { name: "Meesho", salary: "₹15-28 LPA", questions: 95, time: "5 Hours" },
        { name: "Zomato", salary: "₹12-25 LPA", questions: 90, time: "4 Hours" },
        { name: "Swiggy", salary: "₹12-24 LPA", questions: 90, time: "4 Hours" },
        { name: "Zoho", salary: "₹8-18 LPA", questions: 95, time: "4 Hours" }
      ]
    },

    {
      title: "🏢 Service-Based Companies",
      companies: [
        { name: "TCS", salary: "₹3.5-8 LPA", questions: 70, time: "3 Hours" },
        { name: "Infosys", salary: "₹4-8 LPA", questions: 70, time: "3 Hours" },
        { name: "Wipro", salary: "₹4-8 LPA", questions: 70, time: "3 Hours" },
        { name: "HCL", salary: "₹4-8 LPA", questions: 65, time: "3 Hours" },
        { name: "Accenture", salary: "₹4-10 LPA", questions: 80, time: "4 Hours" },
        { name: "Capgemini", salary: "₹4-9 LPA", questions: 75, time: "3 Hours" },
        { name: "Cognizant", salary: "₹4-8 LPA", questions: 70, time: "3 Hours" },
        { name: "Tech Mahindra", salary: "₹4-8 LPA", questions: 65, time: "3 Hours" },
        {name: "Devstringx technology",salary :"₹4-8 LPA", questions: 65, time: "3 Hours"}
      ]
    }
  ];

  return (
    <div className="practice-page">
      <h1>💻 Interview Practice Hub</h1>

      <p className="practice-subtitle">
        Choose a company and start preparing for interviews
      </p>

      {companySections.map((section) => (
        <div key={section.title}>
          <h2 className="section-title">{section.title}</h2>

          <div className="company-grid">
            {section.companies.map((company) => (
              <div className="company-card" key={company.name}>
                <h3>{company.name}</h3>

                <p>
                  <strong>Role:</strong> SDE-1
                </p>

                <p>
                  <strong>Salary:</strong> {company.salary}
                </p>

                <p>
                  <strong>Questions:</strong> {company.questions}
                </p>

                <p>
                  <strong>Practice Time:</strong> {company.time}
                </p>

                <button
                  className="start-btn"
                  onClick={() => startPractice(company.name)}
                >
                  Start Practice
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default Practice;
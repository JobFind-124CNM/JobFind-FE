import JobItem from "@/components/Job/JobItem";
import { Post } from "@/models/post.interface";

const jobs: Post[] = [
  {
    id: 1,
    title: "Software Engineer",
    description: "Responsible for developing and maintaining web applications.",
    status: "Active",
    created_at: "2024-11-18T09:00:00Z",
    updated_at: "2024-11-18T09:00:00Z",
    benefit: "Health insurance, remote work options, and annual bonuses.",
    company: "TechCorp Inc.",
    formOfWork: "Full-time",
    salary: "80,000 - 100,000 USD/year",
    caterory: "IT",
    amount: 3,
    due_at: "2024-12-31T23:59:59Z",
    area: "San Francisco, CA",
  },
  {
    id: 2,
    title: "Marketing Specialist",
    description:
      "Develop and execute marketing strategies to boost brand visibility.",
    status: "Open",
    created_at: "2024-11-10T08:30:00Z",
    updated_at: "2024-11-15T10:45:00Z",
    benefit: "Flexible working hours and paid vacation.",
    company: "MarketPros LLC",
    formOfWork: "Part-time",
    salary: "30,000 - 40,000 USD/year",
    caterory: "Marketing",
    amount: 2,
    due_at: "2024-12-15T23:59:59Z",
    area: "New York, NY",
  },
  {
    id: 3,
    title: "Graphic Designer",
    description: "Create engaging visuals and graphics for various media.",
    status: "Closed",
    created_at: "2024-10-01T14:00:00Z",
    updated_at: "2024-10-20T16:00:00Z",
    benefit: "Training programs and career growth opportunities.",
    company: "DesignStudio Co.",
    formOfWork: "Freelance",
    salary: "25 USD/hour",
    caterory: "Design",
    amount: 1,
    due_at: "2024-11-01T23:59:59Z",
    area: "Remote",
  },
  {
    id: 4,
    title: "Project Manager",
    description: "Manage projects and coordinate teams to meet deadlines.",
    status: "Active",
    created_at: "2024-11-01T09:00:00Z",
    updated_at: "2024-11-18T10:00:00Z",
    benefit: "Leadership training and performance bonuses.",
    company: "BuildRight Inc.",
    formOfWork: "Full-time",
    salary: "90,000 - 120,000 USD/year",
    caterory: "Management",
    amount: 1,
    due_at: "2024-12-25T23:59:59Z",
    area: "Chicago, IL",
  },
  {
    id: 5,
    title: "Customer Support Representative",
    description: "Provide exceptional customer service and resolve inquiries.",
    status: "Open",
    created_at: "2024-11-05T10:00:00Z",
    updated_at: "2024-11-15T12:00:00Z",
    benefit: "Work-from-home options and wellness programs.",
    company: "SupportPlus Co.",
    formOfWork: "Internship",
    salary: "18 USD/hour",
    caterory: "Customer Service",
    amount: 5,
    due_at: "2024-12-20T23:59:59Z",
    area: "Remote",
  },
];

export default function JobList() {
  return (
    <section className="py-16">
      <div className="max-w-[1320px] mx-auto px-6">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Recent Jobs</h2>
        </div>

        <div className="space-y-4">
          {jobs.map((job, index) => (
            <JobItem key={index} {...job} />
          ))}
        </div>
      </div>
    </section>
  );
}

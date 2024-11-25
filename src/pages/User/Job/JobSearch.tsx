import JobItem from "@/components/Job/JobItem";
import JobList from "@/components/Job/JobList";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Post } from "@/models/post.interface";
import { ListFilter } from "lucide-react";
import { useState } from "react";

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

export default function JobSearch() {
  const [range, setRange] = useState<number[]>([50]);

  return (
    <div className="max-w-[1320px] mx-auto px-6 py-24">
      <div className="grid min-h-screen grid-cols-[2.5fr,7.5fr] gap-4">
        <section className="flex flex-col bg-white max-w-full">
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <ListFilter className="text-[#1BCF6B]" /> Job Filter
                </CardTitle>
                <CardDescription>
                  Filter the most suitable job for you
                </CardDescription>
              </CardHeader>

              <Separator className="my-2" />

              <CardContent>
                <div className="pb-6">
                  <CardTitle className="text-xl pb-4">Job Category</CardTitle>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Fruits</SelectLabel>
                        <SelectItem value="apple">Apple</SelectItem>
                        <SelectItem value="banana">Banana</SelectItem>
                        <SelectItem value="blueberry">Blueberry</SelectItem>
                        <SelectItem value="grapes">Grapes</SelectItem>
                        <SelectItem value="pineapple">Pineapple</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>

                <div className="pb-6">
                  <CardTitle className="text-xl pb-4">Job Type</CardTitle>
                  <div className="pb-4 flex items-center gap-2">
                    <Checkbox className="w-6 h-6" id="full-time" />
                    <label
                      htmlFor="full-time"
                      className="text-md font-semibold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Full time
                    </label>
                  </div>

                  <div className="pb-4 flex items-center gap-2">
                    <Checkbox className="w-6 h-6" id="part-time" />
                    <label
                      htmlFor="part-time"
                      className="text-md font-semibold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Part time
                    </label>
                  </div>
                  <div className="pb-4 flex items-center gap-2">
                    <Checkbox className="w-6 h-6" id="remote" />
                    <label
                      htmlFor="remote"
                      className="text-md font-semibold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Remote
                    </label>
                  </div>
                </div>

                <div className="pb-6">
                  <CardTitle className="text-xl pb-4">Job Location</CardTitle>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Fruits</SelectLabel>
                        <SelectItem value="apple">Apple</SelectItem>
                        <SelectItem value="banana">Banana</SelectItem>
                        <SelectItem value="blueberry">Blueberry</SelectItem>
                        <SelectItem value="grapes">Grapes</SelectItem>
                        <SelectItem value="pineapple">Pineapple</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>

                <div className="pb-6">
                  <CardTitle className="text-xl pb-4">Posted Within</CardTitle>
                  <div className="pb-4 flex items-center gap-2">
                    <Checkbox className="w-6 h-6" id="any" />
                    <label
                      htmlFor="any"
                      className="text-md font-semibold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Any
                    </label>
                  </div>

                  <div className="pb-4 flex items-center gap-2">
                    <Checkbox className="w-6 h-6" id="Today" />
                    <label
                      htmlFor="Today"
                      className="text-md font-semibold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Today
                    </label>
                  </div>
                  <div className="pb-4 flex items-center gap-2">
                    <Checkbox className="w-6 h-6" id="last-2-days" />
                    <label
                      htmlFor="last-2-days"
                      className="text-md font-semibold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Last-2-days
                    </label>
                  </div>
                  <div className="pb-4 flex items-center gap-2">
                    <Checkbox className="w-6 h-6" id="last-3-days" />
                    <label
                      htmlFor="last-3-days"
                      className="text-md font-semibold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Last-3-days
                    </label>
                  </div>
                  <div className="pb-4 flex items-center gap-2">
                    <Checkbox className="w-6 h-6" id="last-5-days" />
                    <label
                      htmlFor="last-5-days"
                      className="text-md font-semibold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Last-5-days
                    </label>
                  </div>
                  <div className="pb-4 flex items-center gap-2">
                    <Checkbox className="w-6 h-6" id="last-10-days" />
                    <label
                      htmlFor="last-10-days"
                      className="text-md font-semibold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Last-10-days
                    </label>
                  </div>
                </div>

                <div className="">
                  <CardTitle className="text-xl pb-4">Salary range</CardTitle>
                  <Slider
                    defaultValue={[50]}
                    max={100}
                    step={1}
                    onValueChange={(value) => setRange(value)}
                  />
                  <div className="pt-2 text-md">
                    Salary range:{" "}
                    {`0 to ${(range[0] * 1000000).toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    })}`}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="flex flex-col">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold">39, 782 Jobs found</h4>
            </div>
            <div>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="oldest">Oldest</SelectItem>
                  <SelectItem value="salary">Salary</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="pt-8">
            <div className="space-y-4">
              {jobs.map((job, index) => (
                <JobItem key={index} {...job} />
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

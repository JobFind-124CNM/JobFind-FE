import JobItem from "@/components/Job/JobItem";
import { Post } from "@/models/post.interface";
import api from "@/utils/api";
import { useEffect, useState } from "react";

export default function JobList() {
  const [jobs, setJobs] = useState<Post[]>([]);

  const getJobs = async () => {
    const response = await api.get("/posts/newest");

    if (response.status === 200) {
      setJobs(response.data.data);
    }
  };

  useEffect(() => {
    getJobs();
  }, []);

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

import JobItem from "@/components/Job/JobItem";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { DualRangeSlider } from "@/components/ui/dual-range-slider";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Area } from "@/models/area.interface";
import { Category } from "@/models/category.interface";
import { Post } from "@/models/post.interface";
import api from "@/utils/api";
import { ListFilter } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function JobSearch() {
  const [jobs, setJobs] = useState<Post[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [range, setRange] = useState([0, 100]);

  const [categories, setCategories] = useState<Category[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get("q") || "";
    const category = params.get("category_id") || "";
    const area = params.get("area_id") || "";

    setSearchQuery(query);
    setSelectedCategory(category);
    setLocationFilter(area);

    fetchJobs(query, +category, +area);

    getCategories();
    getLocations();
  }, [location.search]);

  const fetchJobs = async (
    query: string,
    category: number,
    location: number
  ) => {
    try {
      const response = await api.get("/posts", {
        params: {
          q: query,
          category_id: category,
          area_id: location,
        },
      });
      setJobs(response.data.data);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  };

  const getCategories = async () => {
    const response = await api.get("/categories");

    if (response.status === 200) {
      setCategories(response.data.data);
    }
  };

  const getLocations = async () => {
    const response = await api.get("/areas");

    if (response.status === 200) {
      setAreas(response.data.data);
    }
  };

  const handleSearch = () => {
    const queryParams = new URLSearchParams();
    if (searchQuery.trim()) {
      queryParams.append("s", searchQuery);
    }
    if (selectedCategory) {
      queryParams.append("category_id", selectedCategory);
    }
    if (locationFilter) {
      queryParams.append("area_id", locationFilter);
    }
    navigate(`/jobs?${queryParams.toString()}`);
  };

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
                  <CardTitle className="text-xl pb-4">Search</CardTitle>
                  <Input
                    type="text"
                    placeholder="Search for a job"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="pb-6">
                  <CardTitle className="text-xl pb-4">Job Category</CardTitle>
                  <Select onValueChange={(value) => setSelectedCategory(value)}>
                    <SelectTrigger value={selectedCategory}>
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem
                          key={category.id}
                          value={category.id.toString()}
                        >
                          {category.name}
                        </SelectItem>
                      ))}
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
                  <Select
                    value={locationFilter}
                    onValueChange={(value) => setLocationFilter(value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Location" />
                    </SelectTrigger>
                    <SelectContent>
                      {areas.map((area) => (
                        <SelectItem key={area.id} value={area.id.toString()}>
                          {area.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="pb-6">
                  <CardTitle className="text-xl pb-4">Experience</CardTitle>
                  <div className="pb-4 flex items-center gap-2">
                    <Checkbox className="w-6 h-6" id="no-experience" />
                    <label
                      htmlFor="no-experience"
                      className="text-md font-semibold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      No experience
                    </label>
                  </div>

                  <div className="pb-4 flex items-center gap-2">
                    <Checkbox className="w-6 h-6" id="1-2" />
                    <label
                      htmlFor="1-2"
                      className="text-md font-semibold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      1-2 years
                    </label>
                  </div>
                  <div className="pb-4 flex items-center gap-2">
                    <Checkbox className="w-6 h-6" id="3-6" />
                    <label
                      htmlFor="3-6"
                      className="text-md font-semibold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      3-6 years
                    </label>
                  </div>
                  <div className="pb-4 flex items-center gap-2">
                    <Checkbox className="w-6 h-6" id="6+" />
                    <label
                      htmlFor="6+"
                      className="text-md font-semibold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      6-more...
                    </label>
                  </div>
                </div>

                <div className="">
                  <CardTitle className="text-xl pb-4">Salary range</CardTitle>
                  <DualRangeSlider
                    value={range}
                    onValueChange={(value) => setRange(value)}
                    min={0}
                    max={100}
                    step={5}
                  />
                  <div className="pt-2 text-md">
                    Salary range: <br />{" "}
                    {` ${(range[0] * 1000000).toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    })} to ${(range[1] * 1000000).toLocaleString("vi-VN", {
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
              <h4 className="font-semibold">{`${jobs.length} Job(s) found`}</h4>
            </div>
            <div>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent align="end">
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="oldest">Oldest</SelectItem>
                  <SelectItem value="salary">Salary</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="pt-8">
            <div className="space-y-4">
              {jobs.map((job) => (
                <JobItem key={job.id} {...job} />
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

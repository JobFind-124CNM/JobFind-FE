import JobItem from "@/components/Job/JobItem";
import { Button } from "@/components/ui/button";
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
import { FormOfWork } from "@/models/form-of-work.interface";
import { Post } from "@/models/post.interface";
import api from "@/utils/api";
import {
  ListFilter,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Search,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function JobSearch() {
  const [jobs, setJobs] = useState<Post[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [range, setRange] = useState([0, 100]);
  const [formOfWorkIds, setFormOfWorkIds] = useState<string[]>([]);
  const [postedWithin, setPostedWithin] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const [categories, setCategories] = useState<Category[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [formOfWorks, setFormOfWorks] = useState<FormOfWork[]>([]);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get("q") || "";
    const category = params.get("category_id") || "";
    const area = params.get("area_id") || "";
    const formOfWorkIdsParam = params.get("form_of_work_ids") || "";
    const postedWithinParam = params.get("posted_within") || "";
    const salaryMin = params.get("salary_min") || "0";
    const salaryMax = params.get("salary_max") || "100";
    const page = params.get("p") || "1";

    setSearchQuery(query);
    setSelectedCategory(category);
    setLocationFilter(area);
    setFormOfWorkIds(formOfWorkIdsParam ? formOfWorkIdsParam.split(",") : []);
    setPostedWithin(postedWithinParam ? postedWithinParam.split(",") : []);
    setRange([parseInt(salaryMin), parseInt(salaryMax)]);
    setCurrentPage(parseInt(page));

    fetchJobs(
      query,
      +category,
      +area,
      formOfWorkIdsParam,
      postedWithinParam,
      salaryMin,
      salaryMax,
      parseInt(page)
    );
  }, [location.search]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [formOfWorksRes, categoriesRes, areasRes] = await Promise.all([
          api.get("form-of-works"),
          api.get("categories"),
          api.get("areas"),
        ]);

        setFormOfWorks(formOfWorksRes.data.data);
        setCategories(categoriesRes.data.data);
        setAreas(areasRes.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const fetchJobs = async (
    query: string,
    category: number,
    location: number,
    formOfWorkIdsParam: string,
    postedWithinParam: string,
    salaryMin: string,
    salaryMax: string,
    page: number
  ) => {
    setLoading(true);
    try {
      const response = await api.get("/posts", {
        params: {
          q: query,
          category_id: category,
          area_id: location,
          form_of_work_ids: formOfWorkIdsParam
            ? formOfWorkIdsParam.split(",")
            : undefined,
          posted_within: postedWithinParam
            ? postedWithinParam.split(",")
            : undefined,
          salary_min: parseInt(salaryMin) * 1000000,
          salary_max: parseInt(salaryMax) * 1000000,
          p: page,
        },
      });
      setJobs(response.data.data);
      setTotalPages(response.data.pagination.last_page);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (page = 1) => {
    const queryParams = new URLSearchParams();
    if (searchQuery.trim()) {
      queryParams.append("q", searchQuery);
    }
    if (selectedCategory) {
      queryParams.append("category_id", selectedCategory);
    }
    if (locationFilter) {
      queryParams.append("area_id", locationFilter);
    }
    if (formOfWorkIds.length > 0) {
      queryParams.append("form_of_work_ids", formOfWorkIds.join(","));
    }
    if (postedWithin.length > 0) {
      queryParams.append("posted_within", postedWithin.join(","));
    }
    queryParams.append("salary_min", range[0].toString());
    queryParams.append("salary_max", range[1].toString());
    queryParams.append("p", page.toString());

    console.log(queryParams.toString());

    navigate(`/jobs?${queryParams.toString()}`);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    handleSearch(page);
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
                <div className="pt-4">
                  <Button onClick={() => handleSearch()}>
                    {" "}
                    <Search /> Search
                  </Button>
                </div>
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
                  <Select
                    value={selectedCategory}
                    onValueChange={(value) => setSelectedCategory(value)}
                  >
                    <SelectTrigger value={selectedCategory}>
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">All</SelectItem>
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
                  {formOfWorks.map((formOfWork) => (
                    <div
                      className="pb-4 flex items-center gap-2"
                      key={formOfWork.id}
                    >
                      <Checkbox
                        checked={formOfWorkIds.includes(
                          formOfWork.id.toString()
                        )}
                        className="w-6 h-6"
                        id={`type-${formOfWork.id.toString()}`}
                        value={formOfWork.id}
                        onCheckedChange={(checked) => {
                          setFormOfWorkIds((prev) =>
                            checked
                              ? [...prev, formOfWork.id.toString()]
                              : prev.filter(
                                  (id) => id !== formOfWork.id.toString()
                                )
                          );
                        }}
                      />
                      <label
                        htmlFor={`type-${formOfWork.id.toString()}`}
                        className="text-md font-semibold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {formOfWork.name}
                      </label>
                    </div>
                  ))}
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
                      <SelectItem value="0">All</SelectItem>
                      {areas.map((area) => (
                        <SelectItem key={area.id} value={area.id.toString()}>
                          {area.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="pb-6">
                  <CardTitle className="text-xl pb-4">Posted within</CardTitle>

                  {[
                    { id: "today", label: "Today" },
                    { id: "1-2", label: "Last 2 days" },
                    { id: "3-7", label: "Last 7 days" },
                    { id: "1-month", label: "Last 1 month" },
                  ].map((option) => (
                    <div
                      className="pb-4 flex items-center gap-2"
                      key={option.id}
                    >
                      <Checkbox
                        className="w-6 h-6"
                        id={option.id}
                        checked={postedWithin.includes(option.id)}
                        onCheckedChange={(checked) => {
                          setPostedWithin((prev) =>
                            checked
                              ? [...prev, option.id]
                              : prev.filter((item) => item !== option.id)
                          );
                        }}
                      />
                      <label
                        htmlFor={option.id}
                        className="text-md font-semibold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {option.label}
                      </label>
                    </div>
                  ))}
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

          {jobs.length === 0 && (
            <div className="text-center text-gray-500">
              Không tìm thấy công việc phù hợp.
            </div>
          )}

          <div className="pt-8">
            {loading ? (
              <div className="flex justify-center items-center">
                <Loader2 className="animate-spin h-8 w-8 text-gray-500" />
              </div>
            ) : (
              <div className="space-y-4">
                {jobs.map((job) => (
                  <JobItem key={job.id} {...job} />
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-center gap-2 mt-8">
            <Button
              variant="outline"
              onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft />
            </Button>

            {Array.from({ length: totalPages }, (_, index) => index + 1).map(
              (page) => (
                <Button
                  variant="outline"
                  key={page}
                  className={`${
                    currentPage === page
                      ? "bg-primary text-white hover:bg-primary/90 hover:text-white"
                      : ""
                  }`}
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </Button>
              )
            )}

            <Button
              variant="outline"
              onClick={() =>
                handlePageChange(Math.min(currentPage + 1, totalPages))
              }
              disabled={currentPage === totalPages}
            >
              <ChevronRight />
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}

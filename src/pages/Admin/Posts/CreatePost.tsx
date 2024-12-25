import { useState, useEffect } from "react";
import AdminLayout from "@/components/Layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MultiSelect } from "@/components/ui/multi-select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import "react-quill/dist/quill.snow.css";
import ReactQuill from "react-quill";
import api from "@/utils/api";
import { Company } from "@/models/company.interface";
import { FormOfWork } from "@/models/form-of-work.interface";
import { Category } from "@/models/category.interface";
import { Area } from "@/models/area.interface";
import { Level } from "@/models/level.interface";
import { Tag } from "@/models/tag.interface";
import { Position } from "@/models/position.interface";
import { Calendar } from "@/components/ui/calendar";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { showToast, ToastContainer } from "@/utils/toastConfig";
import { useNavigate } from "react-router-dom";

export default function CreatePost() {
  const [formOfWorks, setFormOfWorks] = useState<FormOfWork[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [levels, setLevels] = useState<Level[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [salaryFormated, setSalaryFormated] = useState<string>("");

  const [selectedLevels, setSelectedLevels] = useState<Level[]>([]);
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [selectedPositions, setSelectedPositions] = useState<Position[]>([]);
  const [dueDate, setDueDate] = useState<Date>();
  const user = useSelector((state: RootState) => state.user.user);

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    company_id: user?.company?.id || "",
    form_of_work_id: "",
    salary: "",
    category_id: "",
    amount: 0,
    area_id: "",
    qualification: "",
    status: "published",
    description: "",
    benefit: "",
    due_at: "",
  });

  const [errors, setErrors] = useState({
    title: "",
    company_id: "",
    form_of_work_id: "",
    salary: "",
    category_id: "",
    amount: "",
    area_id: "",
    qualification: "",
    description: "",
    benefit: "",
    status: "",
    dueDate: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          formOfWorksRes,
          categoriesRes,
          areasRes,
          levelsRes,
          tagsRes,
          positionsRes,
        ] = await Promise.all([
          api.get("form-of-works"),
          api.get("categories"),
          api.get("areas"),
          api.get("levels"),
          api.get("tags/all"),
          api.get("positions"),
        ]);

        setFormOfWorks(formOfWorksRes.data.data);
        setCategories(categoriesRes.data.data);
        setAreas(areasRes.data.data);
        setLevels(levelsRes.data.data);
        setTags(tagsRes.data.data);
        setPositions(positionsRes.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors = {
      title: formData.title ? "" : "Title is required",
      company_id: formData.company_id ? "" : "Company is required",
      form_of_work_id: formData.form_of_work_id
        ? ""
        : "Form of work is required",
      salary: formData.salary ? "" : "Salary is required",
      category_id: formData.category_id ? "" : "Category is required",
      amount: formData.amount > 0 ? "" : "Amount must be greater than 0",
      area_id: formData.area_id ? "" : "Area is required",
      qualification: formData.qualification ? "" : "Qualification is required",
      description: formData.description ? "" : "Description is required",
      benefit: formData.benefit ? "" : "Benefit is required",
      dueDate: dueDate ? "" : "Due date is required",
      status: formData.status ? "" : "Status is required",
    };

    setErrors(newErrors);

    if (Object.values(newErrors).some((error) => error !== "")) {
      console.log("Validation errors:", newErrors);

      return;
    }

    try {
      const postData = {
        ...formData,
        due_at: dueDate?.toISOString().slice(0, 10),
        levels: selectedLevels.map((level) => level.id),
        tags: selectedTags.map((tag) => tag.id),
        positions: selectedPositions.map((position) => position.id),
      };

      console.log(postData);

      const response = await api.post("/posts", postData);

      showToast("Post created succefully!", "success");

      navigate(-1);
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  const formatCurrency = (value: string) => {
    const numericValue = value.replace(/\D/g, "");
    const number = parseInt(numericValue, 10);
    if (isNaN(number)) return "";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(number);
  };

  const handleSalaryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const rawValue = value.replace(/\D/g, "");
    const formattedValue = formatCurrency(rawValue);
    setSalaryFormated(formattedValue);
    handleInputChange("salary", rawValue);
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData({ ...formData, [field]: value });
    setErrors({ ...errors, [field]: "" });
  };

  return (
    <AdminLayout>
      <div className="space-y-6 bg-white p-6 rounded-lg">
        <h1 className="text-2xl font-bold">Create New Post</h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                />
                {errors.title && (
                  <p className="text-red-500 text-sm mt-2">{errors.title}</p>
                )}
              </div>

              <div>
                <Label htmlFor="company">Company</Label>
                <Input readOnly id="company" value={user?.company?.name} />
                {errors.company_id && (
                  <p className="text-red-500 text-sm mt-2">
                    {errors.company_id}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="formOfWork">Form of Work</Label>
                <Select
                  value={formData.form_of_work_id}
                  onValueChange={(value) =>
                    handleInputChange("form_of_work_id", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select form of work" />
                  </SelectTrigger>
                  <SelectContent>
                    {formOfWorks.map((formOfWork) => (
                      <SelectItem
                        key={formOfWork.id}
                        value={formOfWork.id.toString()}
                      >
                        {formOfWork.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.form_of_work_id && (
                  <p className="text-red-500 text-sm mt-2">
                    {errors.form_of_work_id}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="salary">Salary</Label>
                <Input
                  id="salary"
                  value={salaryFormated}
                  onChange={handleSalaryChange}
                />
                {errors.salary && (
                  <p className="text-red-500 text-sm mt-2">{errors.salary}</p>
                )}
              </div>
              <div>
                <Label>Positions</Label>
                <MultiSelect
                  options={positions.map((position) => ({
                    label: position.name,
                    value: position.id.toString(),
                  }))}
                  onValueChange={(values) => {
                    const selected = positions.filter((position) =>
                      values.includes(position.id.toString())
                    );
                    setSelectedPositions(selected);
                  }}
                  defaultValue={selectedPositions.map((position) =>
                    position.id.toString()
                  )}
                  placeholder="Select positions"
                  variant="inverted"
                />
              </div>
            </div>

            {/* Additional Information */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.category_id}
                  onValueChange={(value) =>
                    handleInputChange("category_id", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
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
                {errors.category_id && (
                  <p className="text-red-500 text-sm mt-2">
                    {errors.category_id}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="area">Area</Label>
                <Select
                  value={formData.area_id}
                  onValueChange={(value) => handleInputChange("area_id", value)}
                >
                  <SelectTrigger className={errors.area_id && "border-red-500"}>
                    <SelectValue placeholder="Select area" />
                  </SelectTrigger>
                  <SelectContent>
                    {areas.map((area) => (
                      <SelectItem key={area.id} value={area.id.toString()}>
                        {area.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.area_id && (
                  <p className="text-red-500 text-sm mt-2">{errors.area_id}</p>
                )}
              </div>

              <div className="flex items-center gap-4">
                <div>
                  <Label htmlFor="amount">Amount</Label>
                  <Input
                    className={`${errors.amount && "border-red-500"}`}
                    id="amount"
                    type="number"
                    value={formData.amount}
                    onChange={(e) =>
                      handleInputChange("amount", parseInt(e.target.value))
                    }
                  />
                  {errors.amount && (
                    <p className="text-red-500 text-sm mt-2">{errors.amount}</p>
                  )}
                </div>

                <div className="w-full">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) =>
                      handleInputChange("status", value)
                    }
                  >
                    <SelectTrigger
                      className={errors.area_id && "border-red-500"}
                    >
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem key={1} value="draft">
                        Draft
                      </SelectItem>
                      <SelectItem key={2} value="published">
                        Published
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {errors.status && (
                  <p className="text-red-500 text-sm mt-2">{errors.status}</p>
                )}
              </div>

              <div>
                <Label>Due Date</Label>
                <Popover>
                  <PopoverTrigger
                    asChild
                    className={errors.dueDate && "border-red-500"}
                  >
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !dueDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dueDate ? (
                        format(dueDate, "yyyy-MM-dd")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={dueDate}
                      onSelect={setDueDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                {errors.dueDate && (
                  <p className="text-red-500 text-sm mt-2">{errors.dueDate}</p>
                )}
              </div>
              <div>
                <Label>Levels</Label>
                <MultiSelect
                  options={levels.map((level) => ({
                    label: level.name,
                    value: level.id.toString(),
                  }))}
                  onValueChange={(values) => {
                    const selected = levels.filter((level) =>
                      values.includes(level.id.toString())
                    );
                    setSelectedLevels(selected);
                  }}
                  defaultValue={selectedLevels.map((level) =>
                    level.id.toString()
                  )}
                  placeholder="Select levels"
                  variant="inverted"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label>Tags</Label>
              <MultiSelect
                maxCount={5}
                options={tags.map((tag) => ({
                  label: tag.name,
                  value: tag.id.toString(),
                }))}
                onValueChange={(values) => {
                  const selected = tags.filter((tag) =>
                    values.includes(tag.id.toString())
                  );
                  setSelectedTags(selected);
                }}
                defaultValue={selectedTags.map((tag) => tag.id.toString())}
                placeholder="Select tags"
                variant="inverted"
              />
            </div>
          </div>

          {/* Rich text editors */}
          <div className="space-y-4">
            <div>
              <Label>Description</Label>
              <div className="border rounded-md p-4">
                <ReactQuill
                  theme="snow"
                  value={formData.description}
                  onChange={(value) => handleInputChange("description", value)}
                  className="h-[200px] mb-12"
                  modules={{
                    toolbar: [
                      [{ header: [1, 2, false] }],
                      ["bold", "italic", "underline", "strike"],
                      [{ list: "ordered" }, { list: "bullet" }],
                      ["link", "image", "code-block"],
                      ["clean"],
                    ],
                  }}
                />
                {errors.description && (
                  <p className="text-red-500 text-sm mt-2">
                    {errors.description}
                  </p>
                )}
              </div>
            </div>

            <div>
              <Label>Benefits</Label>
              <div className="border rounded-md p-4">
                <ReactQuill
                  theme="snow"
                  value={formData.benefit}
                  onChange={(value) => handleInputChange("benefit", value)}
                  className="h-[200px] mb-12"
                  modules={{
                    toolbar: [
                      [{ header: [1, 2, false] }],
                      ["bold", "italic", "underline", "strike"],
                      [{ list: "ordered" }, { list: "bullet" }],
                      ["link", "image", "code-block"],
                      ["clean"],
                    ],
                  }}
                />
                {errors.benefit && (
                  <p className="text-red-500 text-sm mt-2">{errors.benefit}</p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="qualification">Qualification</Label>
              <ReactQuill
                theme="snow"
                value={formData.qualification}
                onChange={(value) => handleInputChange("qualification", value)}
                className="h-[200px] mb-12"
                modules={{
                  toolbar: [
                    [{ header: [1, 2, false] }],
                    ["bold", "italic", "underline", "strike"],
                    [{ list: "ordered" }, { list: "bullet" }],
                    ["link", "image", "code-block"],
                    ["clean"],
                  ],
                }}
              />
              {errors.qualification && (
                <p className="text-red-500 text-sm mt-2">
                  {errors.qualification}
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(-1)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-[#4540E1] hover:bg-[#4540E1]/90"
            >
              Create Post
            </Button>
          </div>
        </form>
      </div>

      <ToastContainer />
    </AdminLayout>
  );
}

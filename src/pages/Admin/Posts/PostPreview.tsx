import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Post } from "@/models/post.interface";
import { formatCurrency } from "@/utils/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CalendarIcon,
  MapPinIcon,
  BriefcaseIcon,
  TagIcon,
  PencilIcon,
  Loader2,
  ChevronLeft,
} from "lucide-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import api from "@/utils/api";
import DOMPurify from "dompurify";
import parse from "html-react-parser";
import { MultiSelect } from "@/components/ui/multi-select";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatDate, set } from "date-fns";
import { Input } from "@/components/ui/input";
import { Area } from "@/models/area.interface";
import { Category } from "@/models/category.interface";
import { FormOfWork } from "@/models/form-of-work.interface";
import { Level } from "@/models/level.interface";
import { Tag } from "@/models/tag.interface";
import { Position } from "@/models/position.interface";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { showToast, ToastContainer } from "@/utils/toastConfig";
import { useNavigate } from "react-router-dom";

interface PostPreviewProps {
  post: Post;
  onCancel: () => void;
}

type TabKey = "description" | "qualification" | "benefit" | "tags" | "details";

export default function PostPreview({ post, onCancel }: PostPreviewProps) {
  const [activeTab, setActiveTab] = useState<TabKey>("description");
  const [formOfWorks, setFormOfWorks] = useState<FormOfWork[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [levels, setLevels] = useState<Level[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState<Record<TabKey, boolean>>({
    description: false,
    qualification: false,
    benefit: false,
    tags: false,
    details: false,
  });
  const [formData, setFormData] = useState({
    title: post.title,
    description: post.description,
    qualification: post.qualification,
    benefit: post.benefit,
    tags: post.tags || [],
    positions: post.positions || [],
    levels: post.levels || [],
    form_of_work_id: post.form_of_work.id,
    area_id: post.area?.id,
    category_id: post.category.id,
    status: post.status,
    salary: post.salary,
    amount: post.amount,
    dueDate: post.due_at,
    details: "",
  });

  const fetchAllValue = async () => {
    try {
      setIsLoading(true);
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
      console.error("Error fetching areas:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllValue();
  }, []);

  const handleEditClick = (tab: TabKey) => {
    setIsEditing((prev) => ({ ...prev, [tab]: !prev[tab] }));
  };

  const handleInputChange = (field: TabKey, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSave = (tab: TabKey) => {
    setFormData((prev) => ({ ...prev, [tab]: formData[tab] }));
    setIsEditing((prev) => ({ ...prev, [tab]: false }));
  };

  const handleSaveAll = async () => {
    try {
      setIsLoading(true);
      const updatedPost = {
        id: post.id,
        title: formData.title,
        area_id: formData.area_id,
        category_id: formData.category_id,
        salary: formData.salary,
        status: formData.status,
        description: formData.description,
        qualification: formData.qualification,
        benefit: formData.benefit,
        tags: formData.tags.map((tag) => tag.id),
        positions: formData.positions.map((pos) => pos.id),
        levels: formData.levels.map((level) => level.id),
        company_id: post.company.id,
        due_at: formData.dueDate.toString().slice(0, 10),
        form_of_work_id: formData.form_of_work_id,
        amount: formData.amount,
      };

      const respose = await api.put(`/posts/${post.id}`, updatedPost);

      if (respose.status === 200) {
        showToast("Post updated successfully", "success");
      }

      setIsEditing({
        description: false,
        qualification: false,
        benefit: false,
        tags: false,
        details: false,
      });

      navigate("/admin/posts");
    } catch (error) {
      showToast("Error updating post: " + error, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const sanitizeHtml = (content: string) => {
    return DOMPurify.sanitize(content, {
      ADD_TAGS: [
        "ul",
        "ol",
        "li",
        "p",
        "h1",
        "h2",
        "h3",
        "h4",
        "h5",
        "h6",
        "br",
        "strong",
        "em",
        "a",
      ],
      ADD_ATTR: ["href", "target", "rel"],
    });
  };

  const renderContent = (content: string) => {
    const sanitizedContent = sanitizeHtml(content);
    return (
      <div className="prose prose-slate max-w-none">
        {parse(sanitizedContent)}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center h-screen">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      <Card>
        <CardHeader className="flex flex-row items-center gap-4">
          <img
            src={post.company?.logo || "/placeholder.svg?height=64&width=64"}
            alt="Company logo"
            className="w-16 h-16 rounded-lg border p-2"
          />
          <div className="flex-1">
            <div className="flex justify-between items-center">
              {isEditingTitle ? (
                <Input
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="text-2xl font-bold text-primary mb-2"
                />
              ) : (
                <CardTitle className="text-2xl font-bold text-primary mb-2">
                  {formData.title}
                </CardTitle>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditingTitle(!isEditingTitle)}
              >
                <PencilIcon className="w-4 h-4 mr-2" />
                {isEditingTitle ? "Save" : "Edit"}
              </Button>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
              <span className="flex items-center">
                <BriefcaseIcon className="w-4 h-4 mr-1" />
                {categories
                  .filter((c) => c.id === formData.category_id)
                  .map((c) => c.name)
                  .join(", ")}
              </span>
              <span className="flex items-center">
                <MapPinIcon className="w-4 h-4 mr-1" />
                {areas
                  .filter((c) => c.id === formData.area_id)
                  .map((c) => c.name)
                  .join(", ")}
              </span>
              <span className="flex items-center">
                <CalendarIcon className="w-4 h-4 mr-1" />
                {formatCurrency(post.salary)}
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs
            defaultValue="description"
            className="w-full"
            onValueChange={(value) => setActiveTab(value as TabKey)}
          >
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="qualification">Requirements</TabsTrigger>
              <TabsTrigger value="benefit">Benefits</TabsTrigger>
              <TabsTrigger value="tags">Technology</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
            </TabsList>
            <TabsContent value="description">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Job Description</CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditClick("description")}
                  >
                    <PencilIcon className="w-4 h-4 mr-2" />
                    {isEditing.description ? "Cancel" : "Edit"}
                  </Button>
                </CardHeader>
                <CardContent>
                  {isEditing.description ? (
                    <>
                      <ReactQuill
                        theme="snow"
                        value={formData.description}
                        onChange={(value) =>
                          handleInputChange("description", value)
                        }
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
                      <Button
                        className="mt-4"
                        variant="default"
                        size="sm"
                        onClick={() => handleSave("description")}
                      >
                        Save
                      </Button>
                    </>
                  ) : (
                    renderContent(formData.description)
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="qualification">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>
                    Required Knowledge, Skills, and Abilities
                  </CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditClick("qualification")}
                  >
                    <PencilIcon className="w-4 h-4 mr-2" />
                    {isEditing.qualification ? "Cancel" : "Edit"}
                  </Button>
                </CardHeader>
                <CardContent>
                  {isEditing.qualification ? (
                    <>
                      <ReactQuill
                        theme="snow"
                        value={formData.qualification}
                        onChange={(value) =>
                          handleInputChange("qualification", value)
                        }
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
                      <Button
                        className="mt-4"
                        variant="default"
                        size="sm"
                        onClick={() => handleSave("qualification")}
                      >
                        Save
                      </Button>
                    </>
                  ) : (
                    renderContent(formData.qualification)
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="benefit">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Benefits</CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditClick("benefit")}
                  >
                    <PencilIcon className="w-4 h-4 mr-2" />
                    {isEditing.benefit ? "Cancel" : "Edit"}
                  </Button>
                </CardHeader>
                <CardContent>
                  {isEditing.benefit ? (
                    <>
                      <ReactQuill
                        theme="snow"
                        value={formData.benefit}
                        onChange={(value) =>
                          handleInputChange("benefit", value)
                        }
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
                      <Button
                        className="mt-4"
                        variant="default"
                        size="sm"
                        onClick={() => handleSave("benefit")}
                      >
                        Save
                      </Button>
                    </>
                  ) : (
                    renderContent(formData.benefit)
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="tags">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Technology</CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditClick("tags")}
                  >
                    <PencilIcon className="w-4 h-4 mr-2" />
                    {isEditing.tags ? "Cancel" : "Edit"}
                  </Button>
                </CardHeader>
                <CardContent>
                  {isEditing.tags ? (
                    <>
                      <div>
                        <Label htmlFor="tags">Technology</Label>
                        <MultiSelect
                          options={tags.map((tag) => ({
                            label: tag.name,
                            value: tag.id.toString(),
                          }))}
                          onValueChange={(values) => {
                            const selected = tags.filter((tag) =>
                              values.includes(tag.id.toString())
                            );
                            setFormData({ ...formData, tags: selected });
                          }}
                          defaultValue={formData.tags.map((tag) =>
                            tag.id.toString()
                          )}
                          placeholder="Select tags"
                          variant="inverted"
                        />
                      </div>
                      <div className="mt-4">
                        <Label htmlFor="tags">Position</Label>
                        <MultiSelect
                          options={positions.map((pos) => ({
                            label: pos.name,
                            value: pos.id.toString(),
                          }))}
                          onValueChange={(values) => {
                            const selected = positions.filter((pos) =>
                              values.includes(pos.id.toString())
                            );
                            setFormData({ ...formData, positions: selected });
                          }}
                          defaultValue={formData.positions.map((pos) =>
                            pos.id.toString()
                          )}
                          placeholder="Select tags"
                          variant="inverted"
                        />
                      </div>

                      <div className="mt-4">
                        <Label htmlFor="tags">Level</Label>
                        <MultiSelect
                          options={levels.map((level) => ({
                            label: level.name,
                            value: level.id.toString(),
                          }))}
                          onValueChange={(values) => {
                            const selected = levels.filter((level) =>
                              values.includes(level.id.toString())
                            );
                            setFormData({ ...formData, levels: selected });
                          }}
                          defaultValue={formData.levels.map((level) =>
                            level.id.toString()
                          )}
                          placeholder="Select tags"
                          variant="inverted"
                        />
                      </div>
                      <Button
                        className="mt-4"
                        variant="default"
                        size="sm"
                        onClick={() => handleSave("tags")}
                      >
                        Save
                      </Button>
                    </>
                  ) : (
                    <div className="flex flex-wrap gap-16">
                      <div>
                        <Label htmlFor="tags">Technology</Label>
                        {formData.tags?.map((tag) => (
                          <Badge
                            key={tag.id}
                            variant="secondary"
                            className="flex items-center mt-4"
                          >
                            <TagIcon className="w-3 h-3 mr-1" />
                            {tag.name}
                          </Badge>
                        ))}
                      </div>
                      <div>
                        <Label htmlFor="tags">Position</Label>
                        {formData.positions?.map((pos) => (
                          <Badge
                            key={pos.id}
                            variant="secondary"
                            className="flex items-center mt-4"
                          >
                            <TagIcon className="w-3 h-3 mr-1" />
                            {pos.name}
                          </Badge>
                        ))}
                      </div>
                      <div>
                        <Label htmlFor="tags">Level</Label>
                        {formData.levels?.map((level) => (
                          <Badge
                            key={level.id}
                            variant="secondary"
                            className="flex items-center mt-4"
                          >
                            <TagIcon className="w-3 h-3 mr-1" />
                            {level.name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="details">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Details</CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditClick("details")}
                  >
                    <PencilIcon className="w-4 h-4 mr-2" />
                    {isEditing.details ? "Cancel" : "Edit"}
                  </Button>
                </CardHeader>
                <CardContent>
                  {isEditing.details ? (
                    <>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="area">Area</Label>
                          <Select
                            value={formData.area_id + ""}
                            onValueChange={(value) =>
                              setFormData({
                                ...formData,
                                area_id: Number(value),
                              })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select area" />
                            </SelectTrigger>
                            <SelectContent>
                              {areas.map((a) => (
                                <SelectItem key={a.id} value={a.id.toString()}>
                                  {a.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="category">Category</Label>
                          <Select
                            value={formData.category_id + ""}
                            onValueChange={(value) =>
                              setFormData({
                                ...formData,
                                category_id: Number(value),
                              })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              {categories.map((a) => (
                                <SelectItem key={a.id} value={a.id.toString()}>
                                  {a.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="category">Work Types</Label>
                          <Select
                            value={formData.form_of_work_id + ""}
                            onValueChange={(value) =>
                              setFormData({
                                ...formData,
                                form_of_work_id: Number(value),
                              })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              {formOfWorks.map((a) => (
                                <SelectItem key={a.id} value={a.id.toString()}>
                                  {a.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="status">Status</Label>
                          <Select
                            value={formData.status}
                            onValueChange={(value) =>
                              setFormData({ ...formData, status: value })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="draft">Draft</SelectItem>
                              <SelectItem value="published">
                                Published
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="salary">Salary</Label>
                          <Input
                            id="salary"
                            value={formData.salary}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                salary: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div>
                          <Label htmlFor="amount">Amount</Label>
                          <Input
                            id="amount"
                            type="number"
                            value={formData.amount}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                amount: Number(e.target.value),
                              })
                            }
                          />
                        </div>
                        <div>
                          <Label>Due Date</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full justify-start text-left font-normal",
                                  !formData.dueDate && "text-muted-foreground"
                                )}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {formData.dueDate ? (
                                  formatDate(formData.dueDate, "yyyy-MM-dd")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar
                                mode="single"
                                selected={
                                  formData.dueDate
                                    ? new Date(formData.dueDate)
                                    : undefined
                                }
                                onSelect={(date) =>
                                  setFormData({
                                    ...formData,
                                    dueDate: date ? date.toISOString() : "",
                                  })
                                }
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                      </div>
                      <Button
                        variant="default"
                        size="sm"
                        className="mt-4"
                        onClick={() => handleSave("details")}
                      >
                        Save
                      </Button>
                    </>
                  ) : (
                    <div className="space-y-4 flex justify-start items-end gap-16">
                      <div>
                        <Label htmlFor="area">Area</Label>
                        <p>
                          {areas
                            .filter((a) => a.id === formData.area_id)
                            .map((a) => a.name)
                            .join(", ")}
                        </p>
                      </div>
                      <div>
                        <Label htmlFor="category">Category</Label>
                        <p>
                          {categories
                            .filter((a) => a.id === formData.category_id)
                            .map((a) => a.name)
                            .join(", ")}
                        </p>
                      </div>
                      <div>
                        <Label htmlFor="category">Work Type</Label>
                        <p>
                          {formOfWorks
                            .filter((a) => a.id === formData.form_of_work_id)
                            .map((a) => a.name)
                            .join(", ")}
                        </p>
                      </div>
                      <div>
                        <Label htmlFor="status">Status</Label>
                        <p>{post.status}</p>
                      </div>
                      <div>
                        <Label htmlFor="salary">Salary</Label>
                        <p>{formatCurrency(formData.salary)}</p>
                      </div>
                      <div>
                        <Label htmlFor="salary">Amount</Label>
                        <p>{formData.amount}</p>
                      </div>
                      <div>
                        <Label htmlFor="salary">Due Date</Label>
                        <p>
                          {formData.dueDate
                            ? formatDate(
                                new Date(formData.dueDate),
                                "dd/MM/yyyy HH:mm"
                              )
                            : "Not set"}
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      <div className="flex justify-end gap-4 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          type="button"
          className="bg-[#4540E1] hover:bg-[#4540E1]/90"
          onClick={handleSaveAll}
        >
          Save All
        </Button>
      </div>
      <ToastContainer />
    </div>
  );
}

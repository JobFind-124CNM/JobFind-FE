import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Post } from "@/models/post.interface";
import { FileText } from "lucide-react";
import api from "@/utils/api";
import { format } from "date-fns";
import { showToast, ToastContainer } from "@/utils/toastConfig";
import { formatCurrency } from "@/utils/utils";

export default function JobDetail() {
  const { id } = useParams<{ id: string }>();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [subject, setSubject] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [cvPreview, setCvPreview] = useState<File | null>(null);
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    getPost();
  }, [id]);

  const getPost = async () => {
    try {
      const response = await api.get(`/posts/${id}`);
      console.log("Post:", response.data.data);

      setPost(response.data.data);
    } catch (error) {
      console.error("Error fetching post:", error);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const file = event.target.files[0];
      setCvPreview(file);
      setSelectedFile(file);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    if (!selectedFile) {
      console.error("CV file is required");
      return;
    }

    const formData = new FormData();
    formData.append("cv", selectedFile);
    formData.append("cover_letter", coverLetter);
    formData.append("subject", post?.title || "");

    try {
      const response = await api.post(`posts/${post?.id}/apply`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      console.log("Application submitted:", response.data.data);

      setIsDialogOpen(false);
      showToast("Submitted successfully", "success");
    } catch (error) {
      console.error("Error submitting application:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!post) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-[1320px] mx-auto px-6 py-24">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="lg:col-span-2">
          <div className="flex items-start gap-6 mb-8">
            <img
              src={post.company?.logo}
              alt="Company logo"
              className="w-16 h-16 rounded-lg border p-2"
            />
            <div>
              <h1 className="text-2xl font-bold text-[#1a2b6d] mb-2">
                {post.title}
              </h1>
              <div className="flex items-center gap-4 text-gray-500">
                <span>{post.category.name}</span>
                <span>•</span>
                <span>{post.area?.name}</span>
                <span>•</span>
                <span>{formatCurrency(post.salary)}</span>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Job Description</h2>
            <div
              className="text-gray-600"
              dangerouslySetInnerHTML={{ __html: post.description }}
            />
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">
              Required Knowledge, Skills, and Abilities
            </h2>
            <div
              className="text-gray-600"
              dangerouslySetInnerHTML={{ __html: post.qualification }}
            />
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Benefits</h2>
            <div
              className="text-gray-600"
              dangerouslySetInnerHTML={{ __html: post.benefit }}
            />
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Technology</h2>
            <div className="flex flex-wrap gap-2">
              {post.tags?.map((tag) => (
                <span
                  key={tag.id}
                  className="px-2 py-1 bg-gray-100 text-sm rounded-lg"
                >
                  {tag.name}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Job Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Posted date :</span>
                  <span>{format(new Date(post.created_at), "dd/MM/yyyy")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Location :</span>
                  <span>{post.area.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Vacancy :</span>
                  <span>{post.amount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Job nature :</span>
                  <span>{post.form_of_work?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Salary :</span>
                  <span>{formatCurrency(post.salary)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Due date :</span>
                  <span>{format(new Date(post.due_at), "dd/MM/yyyy")}</span>
                </div>
              </div>
              <div className="mt-4">
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="default" className="w-full">
                      Apply Now
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[600px] h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="text-2xl font-bold">
                        Apply for {post.title}
                      </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-6 mt-4">
                      <div className="space-y-2">
                        <Label
                          htmlFor="subject"
                          className="text-lg font-semibold"
                        >
                          Subject
                        </Label>

                        <Input
                          id="subject"
                          type="text"
                          placeholder="Enter subject"
                          className="w-full"
                          value={subject}
                          onChange={(e: any) => setSubject(e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label
                          htmlFor="cover-letter"
                          className="text-lg font-semibold"
                        >
                          Cover Letter
                        </Label>
                        <Textarea
                          id="cover-letter"
                          placeholder="Write your cover letter here..."
                          className="min-h-[200px]"
                          value={coverLetter}
                          onChange={(e: any) => setCoverLetter(e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cv" className="text-lg font-semibold">
                          Upload CV
                        </Label>
                        <Input
                          id="cv"
                          type="file"
                          onChange={handleFileChange}
                          accept=".pdf,.doc,.docx"
                          className="cursor-pointer"
                        />
                        <Card>
                          <div className="px-2">
                            {cvPreview && (
                              <div className="mt-2">
                                <p className="text-sm text-gray-500 mb-2">
                                  Selected file: {cvPreview.name}
                                </p>
                                {URL.createObjectURL(cvPreview) && (
                                  <div className="border rounded-lg p-4">
                                    {cvPreview.type === "application/pdf" ? (
                                      <iframe
                                        src={URL.createObjectURL(cvPreview)}
                                        className="w-full h-[400px]"
                                        title="CV Preview"
                                      />
                                    ) : (
                                      <div className="flex items-center justify-center h-[400px] bg-gray-100">
                                        <a
                                          href={URL.createObjectURL(cvPreview)}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="flex items-center text-blue-500 hover:underline"
                                        >
                                          <FileText className="mr-2" />
                                          View CV
                                        </a>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </Card>
                      </div>
                      <Button
                        type="submit"
                        className="w-full"
                        disabled={isLoading}
                      >
                        {isLoading ? "Submitting..." : "Submit"}
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>

          {/* Company Information */}
          <Card>
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
            </CardHeader>
            <CardContent>
              <Link to={`/company/${post.company.id}`}>
                <h3 className="font-semibold mb-2 underline">
                  {post.company.name}
                </h3>
              </Link>
              <p className="text-gray-600 mb-4">{post.company.description}</p>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <span className="text-gray-600">Name:</span>

                  <span>{post.company.name}</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-gray-600">Web:</span>
                  <a
                    href={post.company.website}
                    className="text-primary hover:underline"
                  >
                    {post.company.website}
                  </a>
                </div>
                {/* <div className="flex gap-2">
                  <span className="text-gray-600">Email:</span>
                  <a
                    href={`mailto:${post.company.email}`}
                    className="text-primary hover:underline"
                  >
                    {post.company.email}
                  </a>
                </div> */}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

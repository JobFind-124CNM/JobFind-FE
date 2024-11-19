import { useState } from "react";
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

const post: Post = {
  id: 1,
  title: "Digital Marketer",
  description:
    "It is a long established fact that a reader will beff distracted by vbthe creadable content of a page when looking at its layout. The pointf of using Lorem Ipsum is that it has ahf mcore or-lgess normal distribution of letters, as opposed to using, Content here content here making it look like readable.",
  status: "Full Time",
  created_at: "12 Aug 2019",
  updated_at: "12 Aug 2019",
  benefit:
    "It is a long established fact that a reader will beff distracted by vbthe creadable content of a page when looking at its layout.",
  company: "Creative Agency",
  formOfWork: "Full Time",
  salary: "$3500 - $4000",
  caterory: "Digital Marketing",
  amount: 2,
  due_at: "12 Sep 2020",
  area: "Athens, Greece",
  qualification: "3 or more years of professional design experience",
};

export default function JobDetail() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [coverLetter, setCoverLetter] = useState("");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Here you would typically send the application data to your backend
    console.log("Cover Letter:", coverLetter);
    console.log("CV:", selectedFile);
    setIsDialogOpen(false);
  };

  return (
    <div className="max-w-[1320px] mx-auto px-6 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="lg:col-span-2">
          <div className="flex items-start gap-6 mb-8">
            <img
              src="/company-logo.webp"
              alt="Ziggo"
              className="w-16 h-16 rounded-lg border p-2"
            />
            <div>
              <h1 className="text-2xl font-bold text-[#1a2b6d] mb-2">
                {post.title}
              </h1>
              <div className="flex items-center gap-4 text-gray-500">
                <span>{post.caterory}</span>
                <span>•</span>
                <span>{post.area}</span>
                <span>•</span>
                <span>{post.salary}</span>
              </div>
            </div>
          </div>

          {/* Job Description */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Job Description</h2>
            <p className="text-gray-600">{post.description}</p>
          </div>

          {/* Required Knowledge */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">
              Required Knowledge, Skills, and Abilities
            </h2>
            <ul className="list-disc list-inside space-y-2 text-gray-600">
              <li>{post.qualification}</li>
            </ul>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Job Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Job Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Posted date :</span>
                  <span>{post.created_at}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Location :</span>
                  <span>{post.area}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Vacancy :</span>
                  <span>{post.amount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Job nature :</span>
                  <span>{post.formOfWork}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Salary :</span>
                  <span>{post.salary}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Application date :</span>
                  <span>{post.due_at}</span>
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
                        {selectedFile && (
                          <p className="text-sm text-gray-500 mt-2">
                            Selected file: {selectedFile.name}
                          </p>
                        )}
                      </div>
                      <Button type="submit" className="w-full">
                        Submit Application
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
              <h3 className="font-semibold mb-2">Colorlib</h3>
              <p className="text-gray-600 mb-4">
                It is a long established fact that a reader will be distracted
                by the readable content of a page when looking at its layout.
              </p>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <span className="text-gray-600">Name:</span>
                  <span>Colorlib</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-gray-600">Web:</span>
                  <a
                    href="http://colorlib.com"
                    className="text-primary hover:underline"
                  >
                    colorlib.com
                  </a>
                </div>
                <div className="flex gap-2">
                  <span className="text-gray-600">Email:</span>
                  <a
                    href="mailto:carrier.colorlib@gmail.com"
                    className="text-primary hover:underline"
                  >
                    carrier.colorlib@gmail.com
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

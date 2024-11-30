import { useNavigate, useLocation } from "react-router-dom";
import AdminLayout from "@/components/Layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, ArrowLeft, FileText, Download } from "lucide-react";
import { UserPost } from "@/models/user-post.interface";
import { formatDate } from "date-fns";

export default function CandidateDetail() {
  const navigate = useNavigate();
  const location = useLocation();
  const userPost = location.state?.userPost as UserPost;
  console.log(userPost);

  if (!userPost) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-screen">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="container">
        <Button variant="outline" className="mb-4" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Candidates
        </Button>

        <Card className="w-full h-auto">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              Candidate Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Name</h3>
                <p className="mt-1 text-sm text-gray-900">
                  {userPost.user.username}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Email</h3>
                <p className="mt-1 text-sm text-gray-900">
                  {userPost.user.email}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Phone</h3>
                <p className="mt-1 text-sm text-gray-900">
                  {userPost.user?.phone}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Applied At
                </h3>
                <p className="mt-1 text-sm text-gray-900">
                  {formatDate(userPost.pivot.created_at, "dd/MM/yyyy HH:mm")}
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">Subject</h3>
              <p className="mt-1 text-sm text-gray-900">
                {userPost.pivot.subject}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">
                Cover Letter
              </h3>
              <div className="mt-1 p-4 bg-gray-50 rounded-md">
                <p className="text-sm text-gray-900 whitespace-pre-wrap">
                  {userPost.pivot.cover_letter}
                </p>
              </div>
            </div>

            <div className="">
              {userPost.pivot.cv && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-gray-500 pb-2">
                    Preview CV
                  </h3>
                  <iframe
                    src={userPost.pivot.cv}
                    width="100%"
                    height="500"
                    frameBorder="0"
                    title="CV Preview"
                  />
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}

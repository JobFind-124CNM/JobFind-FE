import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminLayout from "@/components/Layout/AdminLayout";
import { Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import api from "@/utils/api";
import { Post } from "@/models/post.interface";
import { UserPost } from "@/models/user-post.interface";
import AppliedUsersTable from "@/components/Tables/AppliedUsersTable";

export default function PostDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [appliedUsers, setAppliedUsers] = useState<UserPost[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [postRes, appliedUsersRes] = await Promise.all([
          api.get(`posts/${id}`),
          api.get(`posts/${id}/candidates`),
        ]);

        console.log(appliedUsersRes.data.data);

        setPost(postRes.data.data);
        setAppliedUsers(appliedUsersRes.data.data || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-screen">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  if (!post) {
    return (
      <AdminLayout>
        <div className="text-center">
          <h1 className="text-2xl font-bold">Post not found</h1>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6 bg-white p-6 rounded-lg">
        <h1 className="text-2xl font-bold">Post Details</h1>

        <Tabs defaultValue="preview" className="w-full">
          <TabsList>
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="edit">Edit Post</TabsTrigger>
          </TabsList>
          <TabsContent value="preview">
            <AppliedUsersTable appliedUsers={appliedUsers} post={post} />
          </TabsContent>
          <TabsContent value="edit">
            {/* <PostForm post={post} onCancel={() => navigate(-1)} /> */}
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}

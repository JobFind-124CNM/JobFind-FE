import { useState, useEffect } from "react";
import AdminLayout from "@/components/Layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { Label } from "@/components/ui/label";
import {
  Edit,
  Trash,
  Plus,
  Search,
  ChevronRight,
  ChevronLeft,
  Eye,
  Loader2,
} from "lucide-react";
import api from "@/utils/api";
import { Tag } from "@/models/tag.interface";
import { format } from "date-fns";
import { PaginationInfo } from "@/models/PaginationInfo.interface";
import { Post } from "@/models/post.interface";
import { showToast, ToastContainer } from "@/utils/toastConfig";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

export default function PostManagement() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [sortField, setSortField] = useState<keyof Tag>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [newTag, setNewTag] = useState({ name: "" });
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingPost, setDeletingPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    getUserCompanyPost();
  }, []);

  const getUserCompanyPost = async (
    page = 1,
    size = 5,
    search = "",
    area_id = ""
  ) => {
    try {
      const response = await api.get(
        `posts/user-company-posts?q=${search}&p=${page}&s=${size}&area_id=${area_id}`
      );
      setPosts(response.data.data);
      setPagination(response.data.pagination);

      setLoading(false);
    } catch (error) {
      console.error("Error fetching tags:", error);
    }
  };

  const handleSort = (field: keyof Tag) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
    // You might want to call an API endpoint here to sort on the server-side
  };

  const handleAddTag = async () => {
    // try {
    //   const response = await api.post("tags", newTag);
    //   setPosts([...tags, response.data.data]);
    //   setIsAddDialogOpen(false);
    //   setNewTag({ name: "" });
    //   getUserCompanyPost(pagination?.current_page, pagination?.size);
    // } catch (error) {
    //   console.error("Error adding tag:", error);
    // }
  };

  const handleUpdatePost = async () => {
    if (!editingPost) return;
    try {
      const response = await api.put(`posts/${editingPost.id}`, editingPost);
      setPosts(
        posts.map((tag) =>
          tag.id === editingPost.id ? response.data.data : tag
        )
      );
      setIsEditDialogOpen(false);
      setEditingPost(null);
      getUserCompanyPost(pagination?.current_page, pagination?.size);
    } catch (error) {
      console.error("Error updating tag:", error);
    }
  };

  const handleDeletePost = async (id: number) => {
    try {
      await api.delete(`posts/${id}`);
      setPosts(posts.filter((tag) => tag.id !== id));
      setIsDeleteDialogOpen(false);
      getUserCompanyPost(pagination?.current_page, pagination?.size);

      showToast("Posts deleted successfully", "success");
    } catch (error) {
      console.error("Error deleting tag:", error);
    }
  };

  const handleSearch = () => {
    getUserCompanyPost(1, pagination?.size, searchTerm);
  };

  const handlePageChange = (page: number) => {
    getUserCompanyPost(page, pagination?.size);
  };

  const handlePageSizeChange = (size: number) => {
    getUserCompanyPost(1, size);
  };

  const getStatusVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case "published":
        return "active";
      case "draft":
        return "outline";
      default:
        return "outline";
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-screen">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  if (!posts) {
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
      <div className="space-y-6 bg-white p-4 rounded">
        <h1 className="text-2xl font-bold">Post Management</h1>

        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Input
              placeholder="Search by title, description"
              className="max-w-md"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button
              className="bg-[#4540E1] hover:bg-[#4540E1]/90"
              onClick={handleSearch}
            >
              <Search />
            </Button>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus /> Add new
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Thêm tag mới</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Tên
                  </Label>
                  <Input
                    id="name"
                    value={newTag.name}
                    onChange={(e) =>
                      setNewTag({ ...newTag, name: e.target.value })
                    }
                    className="col-span-3"
                  />
                </div>
              </div>
              <Button onClick={handleAddTag}>Thêm</Button>
            </DialogContent>
          </Dialog>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>No.</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Work type</TableHead>
              <TableHead>Area</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Post date</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts.length > 0 ? (
              posts.map((post, index) => (
                <TableRow key={post.id}>
                  <TableCell>
                    {pagination ? pagination.from + index : index + 1}
                  </TableCell>
                  <TableCell>{post.company.name}</TableCell>
                  <TableCell>
                    {post.title.length > 30
                      ? `${post.title.slice(0, 30)}...`
                      : post.title}
                  </TableCell>

                  <TableCell>{post.form_of_work.name}</TableCell>
                  <TableCell>{post.area.name}</TableCell>
                  <TableCell>{post.category.name}</TableCell>
                  <TableCell>{post.amount}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(post.status)}>
                      {post.status.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {format(post.created_at, "dd/MM/yyyy HH:mm")}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      className="mr-2 bg-blue-600 hover:bg-blue-700"
                      onClick={() => navigate(`/admin/posts/${post.id}`)}
                    >
                      <Eye />
                    </Button>
                    <Button
                      variant="default"
                      onClick={() => {
                        setIsDeleteDialogOpen(true);
                        setDeletingPost(post);
                      }}
                    >
                      <Trash />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3}>
                  <span className="text-center py-4">No data</span>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span>Hiển thị</span>
            <Select
              value={pagination?.size.toString()}
              onValueChange={(value) => handlePageSizeChange(Number(value))}
            >
              <SelectTrigger className="w-[70px]">
                <SelectValue>{pagination?.size}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
            <span>trên trang</span>
          </div>
          <div className="flex justify-center gap-2">
            <Button
              variant="outline"
              onClick={() =>
                handlePageChange(
                  Math.max((pagination?.current_page || 1) - 1, 1)
                )
              }
              disabled={pagination?.current_page === 1}
            >
              <ChevronLeft />
            </Button>

            {Array.from(
              { length: pagination?.last_page || 1 },
              (_, index) => index + 1
            ).map((page) => (
              <Button
                variant="outline"
                key={page}
                className={`${
                  pagination?.current_page === page
                    ? "bg-primary text-white hover:bg-primary/90 hover:text-white"
                    : ""
                }`}
                onClick={() => handlePageChange(page)}
              >
                {page}
              </Button>
            ))}

            <Button
              variant="outline"
              onClick={() =>
                handlePageChange(
                  Math.min(
                    (pagination?.current_page || 1) + 1,
                    pagination?.last_page || 1
                  )
                )
              }
              disabled={pagination?.current_page === pagination?.last_page}
            >
              <ChevronRight />
            </Button>
          </div>
        </div>
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{`Cập nhật tag ${editingPost?.id}`}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-name" className="text-right">
                Tên
              </Label>
              <Input
                id="edit-name"
                value={editingPost?.title || ""}
                onChange={(e) =>
                  setEditingPost((prev) =>
                    prev ? { ...prev, name: e.target.value } : null
                  )
                }
                className="col-span-3"
              />
            </div>
          </div>
          <Button onClick={handleUpdatePost}>Cập nhật</Button>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{`Delete ${
              deletingPost?.title ?? ""
            }`}</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this tag?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletingPost && handleDeletePost(deletingPost.id)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <ToastContainer />
    </AdminLayout>
  );
}

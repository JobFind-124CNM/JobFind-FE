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
  ChevronUp,
  ChevronDown,
  Edit,
  Trash,
  Plus,
  Search,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import api from "@/utils/api";
import { Category } from "@/models/category.interface";
import { format } from "date-fns";
import { PaginationInfo } from "@/models/PaginationInfo.interface";

export default function CategoryManagement() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [sortField, setSortField] = useState<keyof Category>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [newCategory, setNewCategory] = useState({ name: "", description: "" });
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(
    null
  );

  useEffect(() => {
    getCategories();
  }, []);

  const getCategories = async (page = 1, size = 5, search = "") => {
    try {
      const response = await api.get(
        `categories?q=${search}&p=${page}&s=${size}`
      );
      setCategories(response.data.data);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleSort = (field: keyof Category) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
    // You might want to call an API endpoint here to sort on the server-side
  };

  const handleAddCategory = async () => {
    try {
      const response = await api.post("/categories", newCategory);
      setCategories([...categories, response.data.data]);
      setIsAddDialogOpen(false);
      setNewCategory({ name: "", description: "" });
      getCategories(pagination?.current_page, pagination?.size);
    } catch (error) {
      console.error("Error adding category:", error);
    }
  };

  const handleUpdateCategory = async () => {
    if (!editingCategory) return;
    try {
      const response = await api.put(
        `categories/${editingCategory.id}`,
        editingCategory
      );
      setCategories(
        categories.map((category) =>
          category.id === editingCategory.id ? response.data.data : category
        )
      );
      setIsEditDialogOpen(false);
      setEditingCategory(null);
      getCategories(pagination?.current_page, pagination?.size);
    } catch (error) {
      console.error("Error updating category:", error);
    }
  };

  const handleDeleteCategory = async (id: number) => {
    try {
      await api.delete(`categories/${id}`);
      setCategories(categories.filter((categories) => categories.id !== id));
      setIsDeleteDialogOpen(false);
      getCategories(pagination?.current_page, pagination?.size);
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  const handleSearch = () => {
    getCategories(1, pagination?.size, searchTerm);
  };

  const handlePageChange = (page: number) => {
    getCategories(page, pagination?.size);
  };

  const handlePageSizeChange = (size: number) => {
    getCategories(1, size);
  };

  return (
    <AdminLayout>
      <div className="space-y-6 bg-white p-4 rounded">
        <h1 className="text-2xl font-bold">Category Management</h1>

        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Input
              placeholder="Nhập danh mục"
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
                <Plus /> Thêm mới
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Thêm danh mục mới</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Tên
                  </Label>
                  <Input
                    id="name"
                    value={newCategory.name}
                    onChange={(e) =>
                      setNewCategory({ ...newCategory, name: e.target.value })
                    }
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Mô tả
                  </Label>
                  <Input
                    id="description"
                    value={newCategory.description}
                    onChange={(e) =>
                      setNewCategory({
                        ...newCategory,
                        description: e.target.value,
                      })
                    }
                    className="col-span-3"
                  />
                </div>
              </div>
              <Button onClick={handleAddCategory}>Thêm</Button>
            </DialogContent>
          </Dialog>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>No.</TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("name")}
              >
                Category name{" "}
                {sortField === "name" &&
                  (sortDirection === "asc" ? (
                    <ChevronUp className="inline" />
                  ) : (
                    <ChevronDown className="inline" />
                  ))}
              </TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Created at</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.length > 0 ? (
              categories.map((category, index) => (
                <TableRow key={category.id}>
                  <TableCell>
                    {pagination ? pagination.from + index : index + 1}
                  </TableCell>
                  <TableCell>{category.name}</TableCell>
                  <TableCell>{category.description}</TableCell>
                  <TableCell>
                    {category.created_at
                      ? format(
                          new Date(category.created_at),
                          "dd/MM/yyyy HH:mm"
                        )
                      : "N/A"}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      className="mr-2"
                      onClick={() => {
                        setEditingCategory(category);
                        setIsEditDialogOpen(true);
                      }}
                    >
                      <Edit />
                    </Button>
                    <Button
                      variant="default"
                      onClick={() => {
                        setIsDeleteDialogOpen(true);
                        setDeletingCategory(category);
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
            <DialogTitle>{`Cập nhật danh mục ${editingCategory?.name}`}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-name" className="text-right">
                Tên
              </Label>
              <Input
                id="edit-name"
                value={editingCategory?.name || ""}
                onChange={(e) =>
                  setEditingCategory((prev) =>
                    prev ? { ...prev, name: e.target.value } : null
                  )
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-name" className="text-right">
                Mô tả
              </Label>
              <Input
                id="edit-name"
                value={editingCategory?.description || ""}
                onChange={(e) =>
                  setEditingCategory((prev) =>
                    prev ? { ...prev, description: e.target.value } : null
                  )
                }
                className="col-span-3"
              />
            </div>
          </div>
          <Button onClick={handleUpdateCategory}>Cập nhật</Button>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{`Delete ${
              deletingCategory?.name ?? ""
            }`}</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this category?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                deletingCategory && handleDeleteCategory(deletingCategory.id)
              }
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}
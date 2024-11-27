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
import { format } from "date-fns";
import { PaginationInfo } from "@/models/PaginationInfo.interface";
import { Role } from "@/models/role.interface";
import { Textarea } from "@/components/ui/textarea";

export default function RoleManagement() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [sortField, setSortField] = useState<keyof Role>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [newRole, setNewRole] = useState({ name: "", description: "" });
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingRole, setDeletingRole] = useState<Role | null>(null);

  useEffect(() => {
    getRoles();
  }, []);

  const getRoles = async (page = 1, size = 5, search = "") => {
    try {
      const response = await api.get(`roles?q=${search}&p=${page}&s=${size}`);
      setRoles(response.data.data);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error("Error fetching tags:", error);
    }
  };

  const handleSort = (field: keyof Role) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
    // You might want to call an API endpoint here to sort on the server-side
  };

  const handleAddRole = async () => {
    try {
      const response = await api.post("roles", newRole);
      setRoles([...roles, response.data.data]);
      setIsAddDialogOpen(false);
      setNewRole({ name: "", description: "" });
      getRoles(pagination?.current_page, pagination?.size);
    } catch (error) {
      console.error("Error adding tag:", error);
    }
  };

  const handleUpdateRole = async () => {
    if (!editingRole) return;
    try {
      const response = await api.put(`roles/${editingRole.id}`, editingRole);
      setRoles(
        roles.map((role) =>
          role.id === editingRole.id ? response.data.data : role
        )
      );
      setIsEditDialogOpen(false);
      setEditingRole(null);
      getRoles(pagination?.current_page, pagination?.size);
    } catch (error) {
      console.error("Error updating tag:", error);
    }
  };

  const handleDeleteRole = async (id: number) => {
    try {
      await api.delete(`roles/${id}`).then(() => {
        setRoles(roles.filter((role) => role.id !== id));
        setIsDeleteDialogOpen(false);
        getRoles(pagination?.current_page, pagination?.size);
      });
    } catch (error) {
      console.error("Error deleting tag:", error);
    }
  };

  const handleSearch = () => {
    getRoles(1, pagination?.size, searchTerm);
  };

  const handlePageChange = (page: number) => {
    getRoles(page, pagination?.size);
  };

  const handlePageSizeChange = (size: number) => {
    getRoles(1, size);
  };

  return (
    <AdminLayout>
      <div className="space-y-6 bg-white p-4 rounded">
        <h1 className="text-2xl font-bold">Quản lý Tag</h1>

        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Input
              placeholder="Search by name"
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
                <DialogTitle>Add new tag</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="name"
                    value={newRole.name}
                    onChange={(e) =>
                      setNewRole({ ...newRole, name: e.target.value })
                    }
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    value={newRole.description}
                    onChange={(e) =>
                      setNewRole({ ...newRole, description: e.target.value })
                    }
                    className="col-span-3"
                  />
                </div>
              </div>
              <Button onClick={handleAddRole}>Add</Button>
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
                Role name{" "}
                {sortField === "name" &&
                  (sortDirection === "asc" ? (
                    <ChevronUp className="inline" />
                  ) : (
                    <ChevronDown className="inline" />
                  ))}
              </TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Created at</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {roles.length > 0 ? (
              roles.map((role, index) => (
                <TableRow key={role.id}>
                  <TableCell>
                    {pagination ? pagination.from + index : index + 1}
                  </TableCell>
                  <TableCell>{role.name}</TableCell>
                  <TableCell>{role.description}</TableCell>
                  <TableCell>
                    {format(role.created_at, "dd/MM/yyyy HH:mm")}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      className="mr-2"
                      onClick={() => {
                        setEditingRole(role);
                        setIsEditDialogOpen(true);
                      }}
                    >
                      <Edit />
                    </Button>
                    <Button
                      variant="default"
                      onClick={() => {
                        setIsDeleteDialogOpen(true);
                        setDeletingRole(role);
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
            <span>Show</span>
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
            <span>items per page</span>
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
            <DialogTitle>{`Role update with id ${editingRole?.id}`}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-name" className="text-right">
                Role name
              </Label>
              <Input
                id="edit-name"
                value={editingRole?.name || ""}
                onChange={(e) =>
                  setEditingRole((prev) =>
                    prev ? { ...prev, name: e.target.value } : null
                  )
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-description" className="text-right">
                Description
              </Label>
              <Textarea
                id="edit-description"
                value={editingRole?.description || ""}
                onChange={(e) =>
                  setEditingRole((prev) =>
                    prev ? { ...prev, description: e.target.value } : null
                  )
                }
                className="col-span-3"
              />
            </div>
          </div>
          <Button onClick={handleUpdateRole}>Cập nhật</Button>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{`Delete ${
              deletingRole?.name ?? ""
            }`}</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this tag?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletingRole && handleDeleteRole(deletingRole.id)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}

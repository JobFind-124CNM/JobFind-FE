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
  Search,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import api from "@/utils/api";
import { format } from "date-fns";
import { PaginationInfo } from "@/models/PaginationInfo.interface";
import { User } from "@/models/user.interface";
import { Badge } from "@/components/ui/badge";
import { Role } from "@/models/role.interface";
import { MultiSelect } from "@/components/ui/multi-select";
import { showToast, ToastContainer } from "@/utils/toastConfig";
import { Switch } from "@/components/ui/switch";

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [sortField, setSortField] = useState<keyof User>("username");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);
  const [selectedRoles, setSelectedRoles] = useState<Role[]>([]);

  useEffect(() => {
    getUsers();
    getRoles();
  }, []);

  const getRoles = async () => {
    try {
      const response = await api.get("roles/all");
      setRoles(response.data.data);
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

  const getUsers = async (page = 1, size = 5, search = "") => {
    try {
      const response = await api.get(`users?q=${search}&p=${page}&s=${size}`);
      setUsers(response.data.data);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleSort = (field: keyof User) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
    // You might want to call an API endpoint here to sort on the server-side
  };

  const handleDeleteUser = async (id: number) => {
    try {
      await api.delete(`users/${id}`).then(() => {
        setUsers(users.filter((user) => user.id !== id));
        setIsDeleteDialogOpen(false);
        getUsers(pagination?.current_page, pagination?.size);
      });
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleUpdateUser = async () => {
    if (!editingUser) return;

    try {
      const roleNames = selectedRoles.map((role) => role.name);
      await api
        .post(`users/${editingUser.id}/roles`, {
          role_names: roleNames,
        })
        .then(() => {
          setUsers((prevUsers) =>
            prevUsers.map((user) =>
              user.id === editingUser.id
                ? { ...editingUser, roles: selectedRoles }
                : user
            )
          );
          setIsEditDialogOpen(false);
          showToast("Updated user roles successfully", "success");
        });
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const handleSearch = () => {
    getUsers(1, pagination?.size, searchTerm);
  };

  const handlePageChange = (page: number) => {
    getUsers(page, pagination?.size);
  };

  const handlePageSizeChange = (size: number) => {
    getUsers(1, size);
  };

  const getStatusVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "active";
      case "inactive":
        return "inactive";
      case "banned":
        return "destructive";
      default:
        return "outline";
    }
  };

  const handleSelectUser = (user: User) => {
    setEditingUser(user);
    setSelectedRoles(user.roles || []);
    setIsEditDialogOpen(true);
  };

  return (
    <AdminLayout>
      <div className="space-y-6 bg-white p-4 rounded">
        <h1 className="text-2xl font-bold">User Management</h1>

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
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>No.</TableHead>
              <TableHead>Avatar</TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("username")}
              >
                Username{" "}
                {sortField === "username" &&
                  (sortDirection === "asc" ? (
                    <ChevronUp className="inline" />
                  ) : (
                    <ChevronDown className="inline" />
                  ))}
              </TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Roles</TableHead>
              <TableHead>Created at</TableHead>
              <TableHead>Updated at</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length > 0 ? (
              users.map((user, index) => (
                <TableRow key={user.id}>
                  <TableCell>
                    {pagination ? pagination.from + index : index + 1}
                  </TableCell>
                  <TableCell>
                    <img
                      src={user.avatar ? user.avatar : "/default_avatar.png"}
                      alt={user.username}
                      className="w-10 h-10 rounded-full"
                    />
                  </TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(user.status)}>
                      {user.status.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {user.roles?.map((role) => role.name).join(", ")}
                  </TableCell>
                  <TableCell>
                    {format(new Date(user.created_at), "dd/MM/yyyy HH:mm")}
                  </TableCell>
                  <TableCell>
                    {format(new Date(user.updated_at), "dd/MM/yyyy HH:mm")}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      className="mr-2"
                      onClick={() => {
                        handleSelectUser(user);
                      }}
                    >
                      <Edit />
                    </Button>
                    <Button
                      variant="default"
                      onClick={() => {
                        setIsDeleteDialogOpen(true);
                        setDeletingUser(user);
                      }}
                    >
                      <Trash />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={9}>
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
            <DialogTitle>{`User ${editingUser?.email}`}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-username" className="text-right">
                Username
              </Label>
              <Input
                id="edit-username"
                value={editingUser?.username || ""}
                onChange={(e) =>
                  setEditingUser((prev) =>
                    prev ? { ...prev, username: e.target.value } : null
                  )
                }
                disabled
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-email" className="text-right">
                Email
              </Label>
              <Input
                type="email"
                id="edit-email"
                value={editingUser?.email || ""}
                onChange={(e) =>
                  setEditingUser((prev) =>
                    prev ? { ...prev, email: e.target.value } : null
                  )
                }
                disabled
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-status" className="text-right">
                Status
              </Label>
              <Switch
                id="edit-status"
                checked={editingUser?.status === "active"}
                onCheckedChange={() =>
                  setEditingUser((prev) =>
                    prev
                      ? {
                          ...prev,
                          status:
                            prev.status === "active" ? "inactive" : "active",
                        }
                      : null
                  )
                }
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-roles" className="text-right">
                Roles
              </Label>
              <MultiSelect
                className="col-span-3"
                options={roles.map((role) => ({
                  label: role.name,
                  value: role.id.toString(),
                }))}
                onValueChange={(values) => {
                  const selected = roles.filter((role) =>
                    values.includes(role.id.toString())
                  );
                  setSelectedRoles(selected);
                }}
                defaultValue={selectedRoles.map((role) => role.id.toString())}
                placeholder="Select roles"
                variant="inverted"
              />
            </div>
          </div>
          <Button onClick={handleUpdateUser}>Update</Button>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{`Delete ${
              deletingUser?.email ?? ""
            }`}</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this user?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletingUser && handleDeleteUser(deletingUser.id)}
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

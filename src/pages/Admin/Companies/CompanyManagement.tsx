import { useState, useEffect } from "react";
import AdminLayout from "@/components/Layout/AdminLayout";
import { Button } from "@/components/ui/button";
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
  DialogFooter,
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
import { ChevronLeft, ChevronRight, Edit, Trash } from "lucide-react";
import api from "@/utils/api";
import { Company } from "@/models/company.interface";
import { format } from "date-fns";
import { PaginationInfo } from "@/models/PaginationInfo.interface";

export default function CompanyManagement() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingCompany, setDeletingCompany] = useState<Company | null>(null);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [editingStatusCompany, setEditingStatusCompany] =
    useState<Company | null>(null);

  useEffect(() => {
    getCompanies();
  }, []);

  const getCompanies = async (page = 1, size = 5) => {
    try {
      const response = await api.get(`companies?p=${page}&s=${size}`);
      setCompanies(response.data.data);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error("Error fetching companies:", error);
    }
  };

  const handleDeleteCompany = async (id: number) => {
    try {
      await api.delete(`companies/${id}`);
      setCompanies(companies.filter((company) => company.id !== id));
      setIsDeleteDialogOpen(false);
      getCompanies(pagination?.current_page, pagination?.size);
    } catch (error) {
      console.error("Error deleting company:", error);
    }
  };

  const handleUpdateStatus = async () => {
    if (!editingStatusCompany) return;

    try {
      await api.put(`companies/${editingStatusCompany.id}/status`, {
        status: editingStatusCompany.status,
      });
      setCompanies(
        companies.map((company) =>
          company.id === editingStatusCompany.id
            ? { ...company, status: editingStatusCompany.status }
            : company
        )
      );
      setIsStatusDialogOpen(false);
      setEditingStatusCompany(null);

      getCompanies(pagination?.current_page, pagination?.size);
    } catch (error) {
      console.error("Error updating company status:", error);
    }
  };

  const handleStatusChange = (company: Company, status: string) => {
    setEditingStatusCompany({ ...company, status });
    setIsStatusDialogOpen(true);
  };

  const handlePageChange = (page: number) => {
    getCompanies(page, pagination?.size);
  };

  const handlePageSizeChange = (size: number) => {
    getCompanies(1, size);
  };

  return (
    <AdminLayout>
      <div className="space-y-6 bg-white p-4 rounded">
        <h1 className="text-2xl font-bold">Company Management</h1>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>No.</TableHead>
              <TableHead>Company name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Created at</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {companies.length > 0 ? (
              companies.map((company, index) => (
                <TableRow key={company.id}>
                  <TableCell>
                    {pagination ? pagination.from + index : index + 1}
                  </TableCell>
                  <TableCell>{company.name}</TableCell>
                  <TableCell>{company.description}</TableCell>{" "}
                  <TableCell>
                    {format(company.created_at, "dd/MM/yyyy HH:mm")}
                  </TableCell>
                  <TableCell>{company.status}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      className="mr-2"
                      onClick={() =>
                        handleStatusChange(
                          company,
                          company.status === "Active"
                            ? "Active"
                            : company.status === "Inactive"
                            ? "Inactive"
                            : "Pending"
                        )
                      }
                    >
                      <Edit />
                    </Button>
                    <Button
                      variant="default"
                      onClick={() => {
                        setIsDeleteDialogOpen(true);
                        setDeletingCompany(company);
                      }}
                    >
                      <Trash />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7}>
                  {" "}
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
            <span>per page</span>
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

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{`Delete ${
              deletingCompany?.name ?? ""
            }`}</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this company?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                deletingCompany && handleDeleteCompany(deletingCompany.id)
              }
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
        <DialogContent className="max-w-[900px] max-h-[100vh]">
          <DialogHeader>
            <DialogTitle>Company</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Company Name
              </Label>
              <TableCell className="w-[200px]">
                {editingStatusCompany?.name}
              </TableCell>{" "}
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="logo" className="text-right">
                Logo
              </Label>
              <img
                src={editingStatusCompany?.logo}
                alt="Logo"
                className="w-16 h-16 object-contain"
              />{" "}
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <TableCell className="w-[400px]">
                {editingStatusCompany?.description}
              </TableCell>{" "}
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="website" className="text-right">
                Website
              </Label>
              <TableCell className="w-[400px]">
                {editingStatusCompany?.website}
              </TableCell>{" "}
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="amountOfEmployees" className="text-right">
                Number of Employees
              </Label>
              <TableCell className="w-[400px]">
                {editingStatusCompany?.amountOfEmployees}
              </TableCell>{" "}
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="taxNumber" className="text-right">
                Tax Number
              </Label>
              <TableCell className="w-[400px]">
                {editingStatusCompany?.taxNumber}
              </TableCell>{" "}
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="created_at" className="text-right">
                Created At
              </Label>
              <TableCell className="w-[400px]">
                {editingStatusCompany?.created_at
                  ? format(
                      new Date(editingStatusCompany.created_at),
                      "dd/MM/yyyy HH:mm"
                    )
                  : "-"}
              </TableCell>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="updated_at" className="text-right">
                Updated At
              </Label>
              <TableCell className="w-[400px]">
                {editingStatusCompany?.updated_at
                  ? format(
                      new Date(editingStatusCompany.updated_at),
                      "dd/MM/yyyy HH:mm"
                    )
                  : "-"}
              </TableCell>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Status
              </Label>
              <Select
                value={editingStatusCompany?.status}
                onValueChange={(status: string) =>
                  setEditingStatusCompany((prev) =>
                    prev ? { ...prev, status } : null
                  )
                }
              >
                <SelectTrigger>
                  <SelectValue>{editingStatusCompany?.status}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsStatusDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdateStatus}
              disabled={!editingStatusCompany}
            >
              Update
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}

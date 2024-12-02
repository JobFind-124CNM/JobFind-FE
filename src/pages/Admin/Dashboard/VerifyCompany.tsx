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
  Plus,
  Search,
  ChevronRight,
  ChevronLeft,
  Loader2,
  Eye,
  Globe,
  Users,
  MapPin,
  FileText,
  CircleX,
  CircleCheckBig,
} from "lucide-react";
import api from "@/utils/api";
import { format } from "date-fns";
import { PaginationInfo } from "@/models/PaginationInfo.interface";
import { Company } from "@/models/company.interface";
import parse from "html-react-parser";
import { showToast, ToastContainer } from "@/utils/toastConfig";
import DOMPurify from "dompurify";
import { Badge } from "@/components/ui/badge";

export default function PendingCompanyManagement() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [confirmAction, setConfirmAction] = useState<
    "verify" | "reject" | null
  >(null);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);

  useEffect(() => {
    getPendingCompanies();
  }, []);

  const getPendingCompanies = async (page = 1, size = 5, search = "") => {
    try {
      setLoading(true);
      const response = await api.get(
        `companies/pending?q=${search}&p=${page}&s=${size}`
      );
      setCompanies(response.data.data);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error("Error fetching companies:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    try {
      const response = await api.put(
        `/companies/${editingCompany?.id}/verify`,
        {
          status: "Verified",
        }
      );

      if (response.status === 200) {
        showToast("Company verified successfully", "success");
        setIsEditDialogOpen(false);

        getPendingCompanies();
      } else {
        showToast("Failed to verify company", "error");
      }
    } catch (error) {
      console.error("Error verifying company:", error);
      showToast("Failed to verify company", "error");
    }
  };

  const handleReject = async () => {
    try {
      const response = await api.put(
        `/companies/${editingCompany?.id}/verify`,
        {
          status: "Rejected",
        }
      );

      if (response.status === 200) {
        showToast("Company rejected successfully", "success");
        setIsEditDialogOpen(false);

        getPendingCompanies();
      } else {
        showToast("Failed to reject company", "error");
      }
    } catch (error) {
      console.error("Error rejecting company:", error);
      showToast("Failed to reject company", "error");
    }
  };

  const handleConfirm = () => {
    if (confirmAction === "verify") {
      handleVerify();
    } else if (confirmAction === "reject") {
      handleReject();
    }
    setIsConfirmDialogOpen(false);
  };

  const handleCancel = () => {
    setIsEditDialogOpen(false);
  };

  const handleSearch = () => {
    getPendingCompanies(1, pagination?.size, searchTerm);
  };

  const handlePageChange = (page: number) => {
    getPendingCompanies(page, pagination?.size);
  };

  const handlePageSizeChange = (size: number) => {
    getPendingCompanies(1, size);
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "Pending":
        return "default";
      case "Rejected":
        return "outline";
      default:
        return "outline";
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

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-screen">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  if (!companies) {
    return (
      <AdminLayout>
        <div className="text-center">
          <h1 className="text-2xl font-bold">Page not found</h1>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6 bg-white p-4 rounded">
        <h1 className="text-2xl font-bold">Pending Company Management</h1>

        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Input
              placeholder="Nhập Tag"
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
              <TableHead>Logo</TableHead>
              <TableHead>Company name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Tax Number</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created at</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {companies.length > 0 ? (
              companies.map((tag, index) => (
                <TableRow key={tag.id}>
                  <TableCell>
                    {pagination ? pagination.from + index : index + 1}
                  </TableCell>
                  <TableCell>
                    <img
                      src={tag.logo}
                      alt={tag.name}
                      className="w-10 h-10 object-cover rounded-full"
                    />
                  </TableCell>
                  <TableCell>{tag.name}</TableCell>
                  <TableCell>{tag.email}</TableCell>
                  <TableCell>{tag.tax_number}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(tag.status)}>
                      {tag.status.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {format(tag.created_at, "dd/MM/yyyy HH:mm")}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="default"
                      className="mr-2"
                      onClick={() => {
                        setEditingCompany(tag);
                        setIsEditDialogOpen(true);
                      }}
                    >
                      <Eye />
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
        <DialogContent className="max-w-6xl h-full">
          <DialogHeader>
            <DialogTitle>{`Xác nhận công ty ${editingCompany?.name}`}</DialogTitle>
            <div className="flex justify-end gap-4 mt-8">
              <Button variant="outline" onClick={handleCancel}>
                Hủy
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setConfirmAction("reject");
                  setIsConfirmDialogOpen(true);
                }}
              >
                <CircleX />
                Từ chối
              </Button>
              <Button
                onClick={() => {
                  setConfirmAction("verify");
                  setIsConfirmDialogOpen(true);
                }}
              >
                <CircleCheckBig />
                Xác nhận
              </Button>
            </div>
          </DialogHeader>
          <div className="relative">
            <div className="h-[200px] w-full overflow-hidden">
              <img
                src={editingCompany?.thumbnail}
                alt="Company banner"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute left-8 -bottom-10 flex items-end gap-6">
              <div className="w-24 h-24 rounded-full bg-white p-2 shadow-lg">
                <img
                  src={editingCompany?.logo}
                  alt={editingCompany?.name}
                  className="w-full h-full rounded-full object-contain"
                />
              </div>
            </div>
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-8">
                      <h1 className="text-2xl font-bold text-gray-900">
                        {editingCompany?.name}
                      </h1>
                      <div className="flex items-center gap-2">
                        <Badge variant="default" className="text-lg">
                          {editingCompany?.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="mt-2 flex items-center gap-6 text-sm text-gray-500">
                      <a
                        href={editingCompany?.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 hover:text-primary"
                      >
                        <Globe className="w-4 h-4" />
                        {editingCompany?.website?.replace("https://", "")}
                      </a>
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {editingCompany?.amount_of_employee} nhân viên
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-lg font-semibold">Giới thiệu công ty</div>
                <div className="prose max-w-none">
                  <div className="max-h-96 overflow-y-auto">
                    {renderContent(editingCompany?.description as string)}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="text-lg font-semibold">Thông tin liên hệ</div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-medium flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Địa chỉ công ty
                    </h3>
                    <p className="text-sm text-gray-600">
                      {editingCompany?.address}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-medium flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Email
                    </h3>
                    <p className="text-sm text-gray-600">
                      {editingCompany?.email}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-medium flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Hợp đồng
                    </h3>
                    <Button
                      variant="outline"
                      onClick={() => {
                        if (editingCompany?.contract) {
                          window.open(
                            editingCompany.contract as string,
                            "_blank"
                          );
                        }
                      }}
                    >
                      <FileText className="mr-2 h-4 w-4" />
                      Xem hợp đồng
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận hành động</DialogTitle>
          </DialogHeader>
          <p>
            Bạn có chắc chắn muốn{" "}
            {confirmAction === "verify" ? "xác nhận" : "từ chối"} công ty này?
          </p>
          <div className="flex justify-end gap-4 mt-4">
            <Button
              variant="outline"
              onClick={() => setIsConfirmDialogOpen(false)}
            >
              Hủy
            </Button>
            <Button onClick={handleConfirm}>Xác nhận</Button>
          </div>
        </DialogContent>
      </Dialog>
      <ToastContainer />
    </AdminLayout>
  );
}

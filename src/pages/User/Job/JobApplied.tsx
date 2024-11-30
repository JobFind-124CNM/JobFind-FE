import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChevronDown,
  ChevronUp,
  Search,
  Calendar,
  Building2,
  Briefcase,
} from "lucide-react";
import { UserPost } from "@/models/user-post.interface";
import api from "@/utils/api";

export default function JobApplicationHistory() {
  const [applications, setApplications] = useState<UserPost[]>([]);

  useEffect(() => {
    getApplications();
  }, []);

  const getApplications = async () => {
    const response = await api.get("/posts/applied", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    });

    console.log(response.data.data);

    if (response.status === 200) {
      setApplications(response.data.data);
    }
  };

  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);

  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");

  function getValueByPath<T>(obj: T, path: string): any {
    return path.split(".").reduce((acc, part) => {
      return (acc as Record<string, any>)?.[part];
    }, obj);
  }

  const sortedApplications = [...applications].sort((a, b) => {
    if (!sortConfig) return 0;
    const { key, direction } = sortConfig;

    const aValue = getValueByPath(a, key);
    const bValue = getValueByPath(b, key);

    if (aValue == null) return direction === "asc" ? 1 : -1;
    if (bValue == null) return direction === "asc" ? -1 : 1;

    if (aValue < bValue) return direction === "asc" ? -1 : 1;
    if (aValue > bValue) return direction === "asc" ? 1 : -1;
    return 0;
  });

  const filteredApplications = sortedApplications.filter(
    (app) =>
      (filterStatus === "all" || app.status === filterStatus) &&
      (app.post?.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.post.company.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleSort = (key: string) => {
    setSortConfig((current) => {
      if (current?.key === key) {
        return { key, direction: current.direction === "asc" ? "desc" : "asc" };
      }
      return { key, direction: "asc" };
    });
  };

  const renderSortIcon = (key: string) => {
    if (sortConfig?.key === key) {
      return sortConfig.direction === "asc" ? (
        <ChevronUp className="w-4 h-4" />
      ) : (
        <ChevronDown className="w-4 h-4" />
      );
    }
    return null;
  };

  const getStatusColor = (status: UserPost["status"]) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-500";
      case "Submitted":
        return "bg-blue-500";
      case "Rejected":
        return "bg-red-500";
      case "Offered":
        return "bg-green-500";
      case "Applied":
        return "bg-orange-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="max-w-[1320px] mx-auto px-6 py-24">
      <h1 className="text-3xl font-bold mb-6">Job Applied</h1>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="flex-1 w-full md:w-auto">
          <Label htmlFor="search" className="sr-only">
            Tìm kiếm
          </Label>
          <div className="relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              id="search"
              placeholder="Enter job title or company name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <div className="w-full md:w-auto">
          <Label htmlFor="status-filter" className="sr-only">
            Lọc theo trạng thái
          </Label>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Lọc theo trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Applied">Applied</SelectItem>
              <SelectItem value="Rejected">Rejected</SelectItem>
              <SelectItem value="Offered">Offered</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort("post.title")}
                  className="font-bold"
                >
                  Job Title {renderSortIcon("post.title")}
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort("post.company")}
                  className="font-bold"
                >
                  Comapany {renderSortIcon("post.company")}
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort("created_at")}
                  className="font-bold"
                >
                  Apply Date {renderSortIcon("created_at")}
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort("status")}
                  className="font-bold"
                >
                  Status {renderSortIcon("status")}
                </Button>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredApplications.map((application) => (
              <TableRow key={`${application.user.id}-${application.post.id}`}>
                <TableCell className="font-medium">
                  <div className="flex items-center">
                    <Briefcase className="mr-2 h-4 w-4 text-gray-400" />
                    {application.post.title}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Building2 className="mr-2 h-4 w-4 text-gray-400" />
                    {application.post.company.name}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Calendar className="mr-2 h-4 w-4 text-gray-400" />
                    {new Date(application.created_at).toLocaleDateString()}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    className={`${getStatusColor(
                      application.status
                    )} text-white`}
                  >
                    {application.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {filteredApplications.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          Không tìm thấy kết quả phù hợp.
        </div>
      )}
    </div>
  );
}

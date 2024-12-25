import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { UserPost } from "@/models/user-post.interface";
import { format } from "date-fns";
import {
  ChevronLeft,
  CircleChevronLeft,
  CircleChevronRight,
  Eye,
} from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Post } from "@/models/post.interface";

interface AppliedUsersTableProps {
  appliedUsers: UserPost[];
  post: Post;
}

export default function AppliedUsersTable({
  appliedUsers,
  post,
}: AppliedUsersTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const itemsPerPage = 10;
  const navigate = useNavigate();

  const totalPages = Math.ceil(appliedUsers.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const filteredUsers = appliedUsers
    .filter((user) => user.pivot.status === "Applied")
    .filter((user) =>
      user.user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (!filteredUsers || filteredUsers.length === 0) {
    return (
      <div className="text-center text-gray-500">
        No users have applied to this post yet.
      </div>
    );
  }

  return (
    <div className="space-y-4 pt-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Applied Users</h2>
        <Button onClick={() => navigate(-1)}>
          <ChevronLeft />
          Back to Posts
        </Button>
      </div>
      <Input
        type="text"
        placeholder="Search by email"
        value={searchQuery}
        onChange={handleSearchChange}
        className="mb-4 w-1/3"
      />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>No.</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Subject</TableHead>
            <TableHead>Applied At</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedUsers.map((app, index) => (
            <TableRow key={app.user.id}>
              <TableCell>
                {(currentPage - 1) * itemsPerPage + index + 1}
              </TableCell>
              <TableCell>{app.user.username}</TableCell>
              <TableCell>{app.user.email}</TableCell>
              <TableCell>
                {app.pivot.subject?.length > 30
                  ? `${app.pivot.subject.slice(0, 30)}...`
                  : app.pivot.subject}
              </TableCell>
              <TableCell>
                {format(new Date(app.pivot.created_at), "yyyy-MM-dd")}
              </TableCell>
              <TableCell>
                <button
                  className="text-blue-500"
                  onClick={() =>
                    navigate(`candidates/${app.user.id}`, {
                      state: { userPost: app },
                    })
                  }
                >
                  <Eye />
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded disabled:opacity-50"
        >
          <CircleChevronLeft />
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded disabled:opacity-50"
        >
          <CircleChevronRight />
        </button>
      </div>
    </div>
  );
}

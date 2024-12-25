import { createBrowserRouter } from "react-router-dom";
import MainLayout from "@/components/Layout/MainLayout";
import JobDetail from "@/pages/User/Job/JobDetail";
import Register from "@/components/Auth/Register/Register.tsx";
import Login from "@/components/Auth/Login/Login.tsx";
import App from "@/App";
import Otp from "@/components/Auth/OTP/Otp";
import JobApplicationHistory from "@/pages/User/Job/JobApplied";
import CompanyRegister from "@/pages/User/Company/Company-Register";
import Profile from "@/pages/User/Profile/Profile";
import SocialCallback from "@/components/Auth/SocialCallback/SocialCallback";
import AuthGuard from "@/guards/AuthGuard";
import TagManagement from "@/pages/Admin/Tags/TagManagement";
import RoleManagement from "@/pages/Admin/Roles/RoleManagement";
import JobSearch from "@/pages/User/Job/JobSearch";
import UserManagement from "@/pages/Admin/Users/UserManagement";
import CreatePost from "@/pages/Admin/Posts/CreatePost";
import PostManagement from "@/pages/Admin/Posts/HRPostManagemet";
import PostDetail from "@/pages/Admin/Posts/PostDetail";
import CandidateDetail from "@/pages/Admin/Posts/CandidateApplied";
import CompanyManagement from "@/pages/Admin/Companies/CompanyManagement";
import LevelManagement from "@/pages/Admin/Levels/LevelManagement";
import AreaManagement from "@/pages/Admin/Areas/AreaManagement";
import CategoryManagement from "@/pages/Admin/Categories/CategoryManagement";
import FormOfWorkManagement from "@/pages/Admin/FormOfWorks/FormOfWorkManagement";
import Forbidden from "@/pages/Forbidden";
import MyCompany from "@/pages/User/Company/MyCompany";
import PendingCompanyManagement from "@/pages/Admin/Dashboard/VerifyCompany";
import AdminPostManagement from "@/pages/Admin/Posts/AdminPostManagement";
import HRMyCompany from "@/pages/Admin/Companies/MyCompany";
import CompanyDetail from "@/pages/User/Company/CompanyDetail";
import PositionManagement from "@/pages/Admin/Positions/PositionManagement";
import CompanyList from "@/pages/User/Company/ListCompany";

const routers = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        children: [
          { path: "/", element: <App /> },
          { path: "posts/:id", element: <JobDetail /> },
          { path: "/profile", element: <Profile /> },
          { path: "/applicaiton-history", element: <JobApplicationHistory /> },
          { path: "/company-register", element: <CompanyRegister /> },
          { path: "/my-company", element: <MyCompany /> },
          { path: "/jobs", element: <JobSearch /> },
          { path: "/company/:id", element: <CompanyDetail /> },
          { path: "/companies", element: <CompanyList /> },
        ],
      },
    ],
  },
  {
    path: "/auth",
    children: [
      { path: "register", element: <Register /> },
      { path: "login", element: <Login /> },
      { path: "verify", element: <Otp /> },
      {
        path: "social/callback/:loginType",
        element: <SocialCallback />,
      },
    ],
  },
  {
    path: "/admin",
    element: <AuthGuard />,
    children: [
      { path: "dashboard", element: <PendingCompanyManagement /> },
      { path: "tags", element: <TagManagement /> },
      { path: "positions", element: <PositionManagement /> },
      { path: "roles", element: <RoleManagement /> },
      { path: "users", element: <UserManagement /> },
      {
        path: "hr",
        children: [
          { path: "posts", element: <PostManagement /> },
          { path: "my-company", element: <HRMyCompany /> },
        ],
      },
      {
        path: "posts",
        children: [
          { path: "", element: <AdminPostManagement /> },
          {
            path: ":id",
            element: <PostDetail />,
          },
          {
            path: ":postId/candidates/:candidateId",
            element: <CandidateDetail />,
          },
          { path: "create", element: <CreatePost /> },
        ],
      },
      { path: "companies", element: <CompanyManagement /> },
      { path: "levels", element: <LevelManagement /> },
      { path: "areas", element: <AreaManagement /> },
      { path: "categories", element: <CategoryManagement /> },
      { path: "form-of-works", element: <FormOfWorkManagement /> },
    ],
  },
  {
    path: "/forbidden",
    element: <Forbidden />,
  },
]);

export default routers;

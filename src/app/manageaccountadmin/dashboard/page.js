"use client";
import { useRouter } from "next/navigation";
import "../../Styles/DashBoard.css";
import { AdminLayout } from "@/app/components/AdminLayout";

export default function Dashboard() {
  const router = useRouter();

  // const handleNavigate = (title) => {
  //   const path = routes[title];
  //   if (path) router.push(path);
  // };

  return (
    <AdminLayout>
      <div className="Dashboard-container">
        <h1 className="Dashboard-heading">Welcome to DashBoard</h1>
        <h3 className="Dashboard-subheading">Manage your Photos and Posts .</h3>
        <div className="cards-grid">
          <div className="card">
            <h4>Manage Welcome/Cover/Profile Photo</h4>
            <button
              onClick={(e) => {
                e.preventDefault();
                router.push("/manageaccountadmin/manageprofileimages");
              }}
            >
              Manage
            </button>
          </div>

          <div className="card">
            <h4>Create New Post</h4>
            <button
              onClick={(e) => {
                e.preventDefault();
                router.push("/manageaccountadmin/manageposts");
              }}
            >
              Create
            </button>
          </div>
          <div className="card">
            <h4>Post History</h4>
            <button
              onClick={(e) => {
                e.preventDefault();
                router.push("/manageaccountadmin/posthistory");
              }}
            >
              Manage
            </button>
          </div>
          <div className="card">
            <h4>Edit About Me</h4>
            <button
              onClick={(e) => {
                e.preventDefault();
                router.push("/manageaccountadmin/manageabout");
              }}
            >
              Manage
            </button>
          </div>
          <div className="card">
            <h4>Messages</h4>
            <button
              onClick={(e) => {
                e.preventDefault();
                router.push("/manageaccountadmin/messagesforme");
              }}
            >
              View Messages
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

import React, { useState, useEffect } from "react";
import AdminNav from "../../components/nav/AdminNav";
import { getUsers, updateUserRole } from "../../functions/admin";
import { getRoles } from "../../functions/role";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const { user } = useSelector((state) => ({ ...state }));

  useEffect(() => {
    loadUsers();
    loadRoles();
  }, []);

  const loadUsers = () =>
    getUsers(user.token).then((res) => {
      setUsers(res.data);
    });

  const loadRoles = () =>
    getRoles().then((res) => {
      setRoles(res.data);
    });

  const handleRoleChange = (userId, roleId) => {
    updateUserRole(userId, roleId, user.token).then((res) => {
      toast.success("User role updated");
      loadUsers();
    });
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-2">
          <AdminNav />
        </div>

        <div className="col-md-10">
          <h4>Admin Dashboard</h4>
          <hr />
          <h4>Manage Users</h4>
          <table className="table table-bordered">
            <thead className="thead-light">
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Current Role</th>
                <th>Change Role</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.role}</td>
                  <td>
                    <select
                      className="form-control"
                      value={u.roleRef ? u.roleRef._id : ""}
                      onChange={(e) => handleRoleChange(u._id, e.target.value)}
                    >
                      <option value="">Please select</option>
                      {roles.map((r) => (
                        <option key={r._id} value={r._id}>
                          {r.name}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

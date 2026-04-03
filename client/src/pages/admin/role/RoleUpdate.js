import React, { useState, useEffect } from "react";
import AdminNav from "../../../components/nav/AdminNav";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { getRole, updateRole } from "../../../functions/role";
import CategoryForm from "../../../components/forms/CategoryForm";

const RoleUpdate = ({ match, history }) => {
  const { user } = useSelector((state) => ({ ...state }));

  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadRole();
  }, []);

  const loadRole = () =>
    getRole(match.params.slug).then((r) => {
      setName(r.data.name);
    });

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    updateRole(match.params.slug, { name }, user.token)
      .then((res) => {
        setLoading(false);
        toast.success(`"${res.data.name}" is updated`);
        history.push("/admin/role");
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
        if (err.response.status === 400) toast.error(err.response.data);
      });
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-2">
          <AdminNav />
        </div>
        <div className="col">
          {loading ? (
            <h4 className="text-danger">Loading..</h4>
          ) : (
            <h4>Update role</h4>
          )}

          <CategoryForm
            handleSubmit={handleSubmit}
            name={name}
            setName={setName}
          />
        </div>
      </div>
    </div>
  );
};

export default RoleUpdate;

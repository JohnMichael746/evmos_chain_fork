import { useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";

import Button from "../../components/Button";
import { SERVER_URL } from "../../config";

import "./style.css";

const Login = () => {
  const navigate = useNavigate();

  const [state, setState] = useState({ error: null, loading: false });

  const onSubmit = async (e) => {
    e.preventDefault();
    setState({ error: null, loading: true });

    axios({
      baseURL: SERVER_URL,
      method: "post",
      headers: { "Content-Type": "application/json" },
      url: `/user/login`,
      data: {
        address: "123123123"
      },
    }).then(res => {
      localStorage.setItem("user", JSON.stringify(res.data.token));
      setState({ error: null, loading: false });
      navigate("/accounts");
    }).catch(err => {
      setState({ error: err.response.data.message, loading: false });
    });
  };

  return (
    <div className="center-box w-full h-full">
      <div className="form-box login-container">
        <h1 className="title">Digital Dollar</h1>
        <form onSubmit={onSubmit}>
          <Button type="submit" label={state.loading ? "Connecting..." : "Connect Wallet"} disabled={(state.loading)} />
          <div className="server-error">{state.error && state.error}</div>
        </form>
      </div>
    </div>
  );
};

export default Login;

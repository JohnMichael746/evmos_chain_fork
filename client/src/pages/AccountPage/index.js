import { useEffect, useState } from "react";
import axios from "axios";
import Table from "../../components/Table";
import Header from "../Header";

import "./style.css";
import { SERVER_URL } from "../../config";

const AccountPage = () => {
  const [data, setData] = useState([]);
  const [keyword, setKeyword] = useState("");

  const fetchAccounts = () => {
    axios({
      baseURL: SERVER_URL,
      method: "get",
      headers: { "Content-Type": "application/json" },
      url: "/account/get_all"
    }).then(res => {
      const results = res.data.data.sort((a, b) => a.id - b.id).map((row, index) => ({
        key: row.id,
        index: index + 1,
        ...row
      }))

      setData(results);
    })
  }

  const onSearch = (keyword) => {
    setKeyword(keyword);
  }

  useEffect(() => {
    const intervalId = setInterval(fetchAccounts, 5000)

    return () => {
      clearInterval(intervalId);
    }
  }, []);

  return (
    <div className="form-container account-page-container">
      <Header active="accounts" onSearch={onSearch} />
      <main>
        <Table data={data.filter(d => keyword ? d.address.includes(keyword) : true)} fetchData={fetchAccounts} />
      </main>
    </div>
  );
};

export default AccountPage;

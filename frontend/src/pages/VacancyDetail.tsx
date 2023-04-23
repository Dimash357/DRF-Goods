import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

export default function Page() {
  const [getterVacansies, setterVacansies] = useState({});
  const pk = useParams().id;

  async function getDetailVacansies() {
    const response = await axios.get(
      `http://127.0.0.1:8000/api/vacansies/detail/${pk}`
    );
    if (response.status === 200) {
      setterVacansies(response.data);
    } else {
      console.log(response.status);
    }
  }

  useEffect(() => {
    getDetailVacansies();
  }, []);

  return (
    <div>
      <div className={"input-group"}>
        <Link className={"btn btn-lg btn-outline-primary"} to={"/"}>
          все вакансии
        </Link>
        <Link className={"btn btn-lg btn-outline-success"} to={"/create"}>
          опубликовать вакансию
        </Link>
      </div>
      <h1>Просмотр вакансии</h1>
      <div>
        {
          // @ts-ignore
          getterVacansies && getterVacansies.title
        }
        <hr />
        {
          // @ts-ignore
          getterVacansies && getterVacansies.description
        }
      </div>
    </div>
  );
}

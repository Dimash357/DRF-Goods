import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

export default function Page() {
  const [getterVacansies, setterVacansies] = useState({});
  const [title, setterTitle] = useState("");
  const [salary, setterSalary] = useState(1);

  async function postNewVacancy() {
    const response = await axios.post(
      "http://127.0.0.1:8000/api/vacansies/create/",
      { title: title, salary: salary }
      // {
      //   headers: {
      //     // @ts-ignore
      //     Authorization:
      //       `JWT_Bearer ` +
      //       "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjgxNDAzNzIzLCJpYXQiOjE2ODEzOTI5MjMsImp0aSI6Ijc1ZmU1OTE5M2EyYjQ4MWNiNDQ1ZjdjZGIxODU2YjRlIiwidXNlcl9pZCI6Mn0.AXYn5OL7pqQqEstbYC0Xe-RPmsC7S5vj8GW84d2kuck",
      //   },
      // }
    );
    if (response.status === 201) {
    } else {
      console.log(response.status);
    }
  }

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
      <h1>Публикация вакансии</h1>
      <div>
        <form
          className={"shadow m-5 p-5"}
          onSubmit={(event) => {
            event.preventDefault();
            postNewVacancy();
          }}
        >
          <div className={"m-1 p-1"}>
            <label>Название вакансии</label>
            <input
              type={"text"}
              className={"form-control w-50"}
              required
              name={"title"}
              value={title}
              onChange={(event) => setterTitle(event.target.value)}
            />
          </div>
          <div className={"m-1 p-1"}>
            <label>Уровень оплаты</label>
            <input
              type={"number"}
              className={"form-control w-50"}
              required
              name={"salary"}
              value={salary}
              onChange={(event) => setterSalary(parseInt(event.target.value))}
            />
          </div>
          <div className={"m-1 p-1"}>
            <label>Опыт</label>
            <select
              className={"form-control w-50"}
              name={"experience"}
              required
            >
              <option value={""}>выберите желаемый опыт кандидата</option>
              <option value={"0"}>без опыта</option>
              <option value={"1"}>1-3 лет</option>
              <option value={"3"}>3-5 лет</option>
              <option value={"10"}>от 10 лет</option>
            </select>
          </div>
          <div className={"m-1 p-1"}>
            <label>График работ</label>
            <select className={"form-control w-50"} name={"work_type"} required>
              <option value={""}>выберите график работ для вакансии</option>
              <option value={"удалённая"}>удалённая</option>
              <option value={"вахта"}>вахта</option>
              <option value={"15/15"}>15/15</option>
              <option value={"5/2"}>5/2</option>
            </select>
          </div>
          <div className={"m-1 p-1"}>
            <label>Описание вакансии</label>
            <textarea
              className={"form-control w-75"}
              required
              name={"description"}
              rows={5}
            ></textarea>
          </div>
          <button type={"submit"} className={"btn btn-lg btn-outline-warning"}>
            отправить
          </button>
        </form>
      </div>
    </div>
  );
}

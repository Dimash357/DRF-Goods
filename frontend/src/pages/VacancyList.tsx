import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Page() {
  const vacancies1 = [
    { id: 1, title: "Продавец", salary: 5000 },
    { id: 2, title: "Разносчик", salary: 2000 },
    { id: 3, title: "Повар", salary: 3000 },
  ];
  const [getterVacansies, setterVacansies] = useState([]);
  const [token, setteToken] = useState({});
  const [getterUsername, setterUsername] = useState("admin@gmail.com");
  const [getterPassword, setterPassword] = useState("Qwerty!12345");
  const [search, setterSearch] = useState("");
  const [experience, setterExperience] = useState(0);
  const [sort, setterSort] = useState("");

  async function getAllVacansies() {
    const response = await axios.get(
      `http://127.0.0.1:8000/api/vacansies/list/?search=${search}&experience=${experience}&sort=${sort}`
      // {
      //   headers: {
      //     // @ts-ignore
      //     Authorization: `JWT_Bearer ${token.access}`,
      //   },
      // }
    );
    if (response.status === 200) {
      console.log(response.data);

      setterVacansies(response.data);
    } else {
      console.log(response.status);
    }
  }

  async function deleteVacancy(id: number) {
    const response = await axios.delete(
      `http://127.0.0.1:8000/api/vacansies/delete/${id}/`
    );
    if (response.status === 200) {
      getAllVacansies();
    } else {
      console.log(response.status);
    }
  }

  useEffect(() => {
    // @ts-ignore
    getAllVacansies();
  }, []);

  async function loginForm() {
    const response = await axios.post("http://127.0.0.1:8000/api/token/", {
      username: getterUsername,
      password: getterPassword,
    });
    console.log(response);
    if (response.status === 200) {
      setteToken(response.data);
    }
  }

  return (
    <div>
      {token === undefined ? (
        <div className={"display-6 lead text-danger"}>Вы не авторизованы!</div>
      ) : (
        <div className={"display-6 lead text-success"}>
          Вы успешно авторизованы!
        </div>
      )}
      <div>
        <div className={"m-1 p-1"}>
          <label>Опыт</label>
          <select
            className={"form-control w-50"}
            onChange={(event) => setterExperience(parseInt(event.target.value))}
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
          <label>Порядок отображения</label>
          <select
            className={"form-control w-50"}
            onChange={(event) => setterSort(event.target.value)}
            required
          >
            <option value={""}>выберите способ отображения</option>
            <option value={"salary_asc"}>По возрастанию зарплаты</option>
            <option value={"salary_desc"}>По убыванию зарплаты</option>
            <option value={"by_created"}>По времени создания</option>
          </select>
        </div>

        <label>Поиск по названию:</label>
        <div className={"input-group"}>
          <input
            type={"text"}
            className={"form-control m-1 p-1 w-50"}
            value={search}
            onChange={(event) => setterSearch(event.target.value)}
          />
          <button
            onClick={getAllVacansies}
            className={"btn btn-sm btn-outline-primary w-25"}
          >
            Искать
          </button>
        </div>
      </div>
      {token === undefined ? (
        <form
          className={"form-control"}
          onSubmit={(event) => {
            event.preventDefault();
            loginForm();
          }}
        >
          <div className={"input-group w-100 shadow p-3"}>
            <input
              type={"email"}
              className={"form-control w-50"}
              value={getterUsername}
              onChange={(event) => setterUsername(event.target.value)}
            />
            <input
              type={"password"}
              className={"form-control w-25"}
              value={getterPassword}
              onChange={(event) => setterPassword(event.target.value)}
            />
            <button
              type={"submit"}
              className={"btn btn-lg btn-outline-primary w-25"}
            >
              войти в аккаунт
            </button>
          </div>
        </form>
      ) : (
        <div>
          <div className={"input-group"}>
            <Link className={"btn btn-lg btn-outline-primary"} to={"/"}>
              все вакансии
            </Link>
            <Link className={"btn btn-lg btn-outline-success"} to={"/create"}>
              опубликовать вакансию
            </Link>
          </div>
          <h1>Список вакансий!</h1>
          <div className={"row row-cols-3"}>
            {getterVacansies && getterVacansies.length > 0 ? (
              getterVacansies.map((item, index) => (
                <div className={"card col-2 m-1 p-1"}>
                  <Link
                    // @ts-ignore
                    to={`/${item.id}`}
                    className={"text-decoration-none text-dark"}
                  >
                    <div className={"lead"}>
                      {
                        // @ts-ignore
                        item.title
                      }
                    </div>
                    (
                    {
                      // @ts-ignore
                      item.salary
                    }
                    )
                  </Link>
                  <button
                    onClick={
                      // @ts-ignore
                      () => deleteVacancy(item.id)
                    }
                  >
                    удалить
                  </button>
                </div>
              ))
            ) : (
              <div>Данных пока нет!</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.scss";
import db from "./firebase";
import {
  collection,
  onSnapshot,
  addDoc,
  orderBy,
  query,
  updateDoc,
  doc,
} from "firebase/firestore";
import Table from "./components/Table";
import "./App.scss";

function App() {
  // dbが入る配列
  const [datas, setDatas] = useState([]);
  // フォーム
  const [selectGrade, setSelectGrade] = useState();
  const [selectName, setSelectName] = useState();
  const [selectPoint, setSelectPoint] = useState(1);
  const [selectId, setSelectId] = useState("");
  const [selectIndex, setSelectIndex] = useState("");
  const [showGrade, setShowGrade] = useState(1);

  // ソート順 0:学年, 1:ポイント
  const [sort, setSort] = useState(1);

  // リロード時に実行
  useEffect(() => {
    // データを取得する;
    const getData = () => {
      const postData = collection(db, "students");

      // ソート順

      if (sort === 0) {
        const q_grade = query(
          postData,
          orderBy("grade"),
          orderBy("name", "desc")
        );
        onSnapshot(q_grade, (snapshot) => {
          setDatas(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
        });
      } else if (sort === 1) {
        const q_point = query(postData, orderBy("point", "desc"));
        onSnapshot(q_point, (snapshot) => {
          setDatas(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
        });
      }
    };
    getData();
    // console.log(datas);
  }, [sort]);

  const addData = () => {
    // データを追加
    // console.log(selectGrade, selectName, selectPoint);

    addDoc(collection(db, "students"), {
      grade: Number(selectGrade),
      name: selectName,
      point: Number(selectPoint),
    });
  };

  const addPoint = () => {
    // 入力内容確認
    console.log(selectIndex, selectPoint, selectId);
    console.log(
      `Index: ${selectIndex}, Point: ${selectPoint}, ID: ${selectId}`
    );

    // その人の元々持っている奉仕POINT
    const beforePoint = datas[selectIndex].point;

    // 足したあとのポイント
    const updatedPoint = beforePoint + selectPoint;

    // データの更新
    const updateData = doc(db, "students", selectId);
    updateDoc(updateData, {
      point: updatedPoint,
    });
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path={"/admin"}
          element={
            <>
              <div className="App">
                <h1>＜奉仕ポイント寮長専用管理画面＞</h1>
                <h2>！！！名前はダミーです！！！</h2>

                {/* ポイント選択 */}

                <div className="housiInput">
                  <select
                    id="selectGrade"
                    onChange={(e) => {
                      setSelectGrade(Number(e.target.value));
                    }}
                  >
                    <option value="">--学年選択--</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                  </select>

                  {/* 名前選択 */}

                  <select
                    id="selectName"
                    onChange={(e) => {
                      let dataArr = e.target.value.split(",");

                      setSelectId(dataArr[0]);
                      setSelectIndex(Number(dataArr[1]));
                    }}
                  >
                    <option value="">--氏名選択--</option>
                    {datas.map((i, index) => {
                      if (i.grade === selectGrade) {
                        return <option value={[i.id, index]}>{i.name}</option>;
                      }
                    })}
                  </select>
                  <select
                    id="selectHoushi"
                    onChange={(e) => {
                      setSelectPoint(Number(e.target.value));
                    }}
                  >
                    <option value="">--ポイント--</option>
                    <option value={5}>点呼中スマホ +5</option>
                    <option value={5}>風呂道具 +5</option>
                    <option value={10}>鍵関係 +10</option>
                    <option value={10}>登校点呼後戻り +10</option>
                    <option value={15}>掃除来ない +15</option>
                    <option value={20}>点呼遅れ +20</option>
                    <option value={20}>時間外入浴 +20</option>
                    <option value={10}>ゴミ分別 +10</option>
                    <option value={5}>迷惑行為 +5</option>
                    <option value={10}>迷惑行為 +10</option>
                    <option value={15}>迷惑行為 +15</option>
                    <option value={20}>迷惑行為 +20</option>
                    <option value={25}>迷惑行為 +25</option>
                    <option value={30}>迷惑行為 +30</option>
                    <option value={-5}>奉仕活動 -5</option>
                    <option value={-10}>奉仕活動 -10</option>
                    <option value={-15}>奉仕活動 -15</option>
                    <option value={-20}>奉仕活動 -20</option>
                  </select>

                  <button onClick={addPoint}>送信</button>
                </div>

                {/* 生徒を追加 */}

                <div className="devMode">
                  <h2>生徒を追加</h2>
                  <select
                    id="selectAddName"
                    onChange={(e) => {
                      setSelectGrade(e.target.value);
                    }}
                  >
                    <option value="">--選択--</option>
                    <option value="1">1年生</option>
                    <option value="2">2年生</option>
                    <option value="3">3年生</option>
                  </select>
                  <input
                    type="text"
                    placeholder="氏名"
                    onChange={(e) => {
                      setSelectName(e.target.value);
                    }}
                  />
                  <input
                    type="number"
                    placeholder="point"
                    onChange={(e) => {
                      setSelectPoint(e.target.value);
                    }}
                  />
                  <button onClick={addData}>submit</button>
                </div>

                <div className="students">
                  <h2>生徒一覧</h2>
                  <button onClick={() => setSort(0)}>
                    学年&名前で並び替え
                  </button>
                  <button onClick={() => setSort(1)}>
                    ポイント数で並び替え
                  </button>

                  {/* テーブル生成 */}
                  <div className="tables">
                    <Table datas={datas} grade={1} />
                    <Table datas={datas} grade={2} />
                    <Table datas={datas} grade={3} />
                  </div>
                </div>
              </div>
            </>
          }
        />

        <Route
          path="/"
          element={
            <>
              <h1>奉仕ポイント一覧(ポイント順)</h1>
              <p>
                ※奉仕ポイントは、禁止行為を寮長/先生が発見した場合に加算する
              </p>
              <p>
                ※奉仕ポイントは、多い者から順に奉仕活動(不定期)を行ってもらう。
              </p>
              <p>※100Pt以上は赤くなります</p>
              <br />
              <p style={{ fontWeight: "bold" }}>
                ★試験運用中です!!! 突然動かなくなるかも...
              </p>
              <br />
              <div className="tables">
                <Table datas={datas} grade={1} />
                <Table datas={datas} grade={2} />
                <Table datas={datas} grade={3} />
              </div>
            </>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

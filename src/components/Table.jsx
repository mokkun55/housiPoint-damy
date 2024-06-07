import React from "react";
import "./Table.scss";

function Table({ datas, grade, dev }) {
  return (
    <table border={1}>
      <tr className={`tableGrade${grade}`}>
        <th>学年</th>
        <th>名前</th>
        <th>ポイント</th>
        <th className="devMode">--管理用ID--</th>
      </tr>

      {datas.map((i, index) => {
        if (i.grade === grade) {
          return (
            <tr key={index}>
              <td className={`tableGrade${grade}`}>{i.grade}年</td>
              <td>{i.name}</td>
              {/* TODO ほんとはしっかりしたい */}
              <td className={`point${Math.floor(i.point / 100)}`}>
                {i.point} Pt
              </td>
              <td className={dev && "devMode"}>{i.id}</td>
            </tr>
          );
        }
      })}
    </table>
  );
}

export default Table;

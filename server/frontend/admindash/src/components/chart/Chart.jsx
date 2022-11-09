import "./chart.scss";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const Chart = () => {
  var dayminusone = new Date();
  var dd = String(dayminusone.getDate() - 1).padStart(2, "0");
  var mm = String(dayminusone.getMonth() + 1).padStart(2, "0");
  dayminusone = dd + "/" + mm;

  var dayminustwo = new Date();
  var dd = String(dayminustwo.getDate() - 2).padStart(2, "0");
  var mm = String(dayminustwo.getMonth() + 1).padStart(2, "0");
  dayminustwo = dd + "/" + mm;

  var dayminusthree = new Date();
  var dd = String(dayminusthree.getDate() - 3).padStart(2, "0");
  var mm = String(dayminusthree.getMonth() + 1).padStart(2, "0");
  dayminusthree = dd + "/" + mm;

  var dayminusfour = new Date();
  var dd = String(dayminusfour.getDate() - 4).padStart(2, "0");
  var mm = String(dayminusfour.getMonth() + 1).padStart(2, "0");
  dayminusfour = dd + "/" + mm;

  var dayminusfive = new Date();
  var dd = String(dayminusfive.getDate() - 5).padStart(2, "0");
  var mm = String(dayminusfive.getMonth() + 1).padStart(2, "0");
  dayminusfive = dd + "/" + mm;

  var dayminussix = new Date();
  var dd = String(dayminussix.getDate() - 6).padStart(2, "0");
  var mm = String(dayminussix.getMonth() + 1).padStart(2, "0");
  dayminussix = dd + "/" + mm;

  var dayminusseven = new Date();
  var dd = String(dayminusseven.getDate() - 7).padStart(2, "0");
  var mm = String(dayminusseven.getMonth() + 1).padStart(2, "0");
  dayminusseven = dd + "/" + mm;

  const data = [
    {
      name: dayminusseven.toLocaleString(),
      uv: 4000,
    },
    {
      name: dayminussix.toLocaleString(),
      uv: 3000,
    },
    {
      name: dayminusfive.toLocaleString(),
      uv: 2000,
    },
    {
      name: dayminusfour.toLocaleString(),
      uv: 2780,
    },
    {
      name: dayminusthree.toLocaleString(),
      uv: 1890,
    },
    {
      name: dayminustwo.toLocaleString(),
      uv: 2390,
    },
    {
      name: dayminusone.toLocaleString(),
      uv: 3490,
    },
  ];

  return (
    <div className="chart">
      <ResponsiveContainer width="100%" aspect={2 / 1}>
        <AreaChart
          width={500}
          height={400}
          data={data}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Area type="monotone" dataKey="uv" stroke="#8884d8" fill="#8884d8" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Chart;

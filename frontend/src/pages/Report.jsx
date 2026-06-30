import { FileText, Download, Calendar } from "lucide-react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import {
  downloadFinancialReport,
  downloadMonthlyReport as downloadMonthlyPdf
} from "../api/reportsApi";
import { useState } from "react";

export default function Reports() {

  const currentYear = new Date().getFullYear();

  const [month, setMonth] = useState(
    new Date().getMonth() + 1
  );

  const [year, setYear] = useState(
    currentYear
  );

const downloadFullReport = async () => {

  try {

    const blob =
      await downloadFinancialReport();

    const url =
      window.URL.createObjectURL(blob);

    const link =
      document.createElement("a");

    link.href = url;
    link.download =
      "financial-report.pdf";

    document.body.appendChild(link);

    link.click();

    link.remove();

    window.URL.revokeObjectURL(url);

  } catch (error) {

    console.error(
      "Failed to download report",
      error
    );
  }
};

const handleMonthlyReport = async () => {

  try {

    const blob =
      await downloadMonthlyPdf(
        month,
        year
      );

    const url =
      window.URL.createObjectURL(blob);

    const link =
      document.createElement("a");

    link.href = url;

    link.download =
      `monthly-report-${month}-${year}.pdf`;

    document.body.appendChild(link);

    link.click();

    link.remove();

    window.URL.revokeObjectURL(url);

  } catch (error) {

    console.error(
      "Failed to download monthly report",
      error
    );
  }
};
  return (

    <div className="flex min-h-screen bg-[#020617]">

      <Sidebar />

      <div className="flex-1 lg:ml-72">

        <Navbar />

        <main className="p-8">

          <div className="space-y-8">

            <div>
              <h1 className="text-4xl font-black text-white">
                Financial Reports
              </h1>

              <p className="text-slate-400 mt-2">
                Download detailed financial reports.
              </p>
            </div>

            {/* FULL REPORT */}

            <div
              className="
              bg-slate-900/60
              border border-cyan-500/20
              rounded-3xl
              p-8
              "
            >

              <div className="text-center">

                <FileText
                  size={70}
                  className="
                  text-cyan-400
                  mx-auto
                  "
                />

                <h2
                  className="
                  text-3xl
                  font-bold
                  mt-4
                  "
                >
                  Complete Financial Report
                </h2>

                <p
                  className="
                  text-slate-400
                  mt-3
                  max-w-xl
                  mx-auto
                  "
                >
                  Download a complete report
                  including expenses,
                  investments, forecasts,
                  AI insights and
                  recommendations.
                </p>

                <button
                  onClick={
                    downloadFullReport
                  }
                  className="
                  mt-6
                  px-8
                  py-4
                  rounded-2xl
                  bg-gradient-to-r
                  from-cyan-500
                  to-purple-500
                  font-semibold
                  flex
                  items-center
                  gap-2
                  mx-auto
                  "
                >
                  <Download size={20}/>
                  Download Full Report
                </button>

              </div>

            </div>

            {/* MONTHLY REPORT */}

            <div
              className="
              bg-slate-900/60
              border border-purple-500/20
              rounded-3xl
              p-8
              "
            >

              <div className="text-center">

                <Calendar
                  size={70}
                  className="
                  text-purple-400
                  mx-auto
                  "
                />

                <h2
                  className="
                  text-3xl
                  font-bold
                  mt-4
                  "
                >
                  Monthly Report
                </h2>

                <p
                  className="
                  text-slate-400
                  mt-3
                  "
                >
                  Generate a report for a
                  specific month and year.
                </p>

                <div
                  className="
                  flex
                  gap-4
                  justify-center
                  mt-6
                  flex-wrap
                  "
                >

                  <select
                    value={month}
                    onChange={(e) =>
                      setMonth(
                        e.target.value
                      )
                    }
                    className="
                    bg-slate-800
                    border
                    border-slate-700
                    rounded-xl
                    px-4
                    py-3
                    "
                  >

                    {[
                      "January",
                      "February",
                      "March",
                      "April",
                      "May",
                      "June",
                      "July",
                      "August",
                      "September",
                      "October",
                      "November",
                      "December"
                    ].map(
                      (m, index) => (

                        <option
                          key={index}
                          value={
                            index + 1
                          }
                        >
                          {m}
                        </option>

                      )
                    )}

                  </select>

                  <select
                    value={year}
                    onChange={(e) =>
                      setYear(
                        e.target.value
                      )
                    }
                    className="
                    bg-slate-800
                    border
                    border-slate-700
                    rounded-xl
                    px-4
                    py-3
                    "
                  >

                    {[2024,2025,2026,2027]
                      .map((y) => (

                        <option
                          key={y}
                          value={y}
                        >
                          {y}
                        </option>

                    ))}

                  </select>

                </div>

             <button
  onClick={handleMonthlyReport}
  className="
    mt-6
    px-8
    py-4
    rounded-2xl
    bg-gradient-to-r
    from-purple-500
    to-pink-500
    font-semibold
    flex
    items-center
    gap-2
    mx-auto
  "
>
  <Download size={20} />
  Download Monthly Report
</button>

              </div>

            </div>

          </div>

        </main>

      </div>

    </div>
  );
}
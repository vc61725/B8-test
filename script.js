function convertCSV() {

    const file =
        document.getElementById("csvFile").files[0];

    if (!file) {
        alert("請先選擇CSV檔");
        return;
    }

    const reader = new FileReader();

    reader.onload = function (e) {

        const text = e.target.result;

        const workbook = XLSX.read(text, {
            type: "string"
        });

        const sheet =
            workbook.Sheets[
            workbook.SheetNames[0]
            ];

        const rows =
            XLSX.utils.sheet_to_json(
                sheet,
                {
                    header: 1,
                    defval: ""
                }
            );

        // 全台物流資料表頭在第9列
        const headerRow = 8;

        const headers = rows[headerRow];

        const dataRows =
            rows.slice(headerRow + 1);

        const idx = {};

        headers.forEach((h, i) => {
            idx[h] = i;
        });

        const result = [];

        dataRows.forEach(row => {

            if (!row[idx["品代"]]) return;

            result.push({

                "採購日期":
                    row[idx["採購日期"]] || "",

                "進貨指定日":
                    "",

                "採購通知單代號":
                    "",

                "進貨倉庫":
                    "",

                "序號":
                    row[idx["序號"]] || "",

                "訂貨驗收單":
                    row[idx["訂貨驗收單"]] || "",

                "品名":
                    row[idx["品名"]] || "",

                "品代":
                    row[idx["品代"]] || "",

                "訂購總數":
                    row[idx["訂購總數"]] || "",

                "條碼":
                    row[idx["條碼"]] || "",

                "物流中心":
                    row[idx["物流中心"]] || ""

            });

        });

        const newWorkbook =
            XLSX.utils.book_new();

        const newSheet =
            XLSX.utils.json_to_sheet(result);

        XLSX.utils.book_append_sheet(
            newWorkbook,
            newSheet,
            "轉換結果"
        );

        XLSX.writeFile(
            newWorkbook,
            "轉換完成.xlsx"
        );

    };

    reader.readAsBinaryString(file);

}

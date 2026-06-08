function convertCSV() {

    const file = document.getElementById("csvFile").files[0];

    if (!file) {
        alert("請先選擇CSV檔案");
        return;
    }

    const fileName = file.name.replace(".csv", "");

    const reader = new FileReader();

    reader.onload = function (e) {

        const workbook = XLSX.read(
            e.target.result,
            {
                type: "binary"
            }
        );

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

        // ===== 讀取上方資訊 =====

        let purchaseDate = "";
        let warehouse = "";

        rows.forEach(row => {

            const text = row.join(" ");

            if (
                text.includes("採購日期")
            ) {

                const match =
                    text.match(
                        /\d{4}\/\d{2}\/\d{2}/
                    );

                if (match)
                    purchaseDate =
                    match[0];
            }

            if (
                text.includes("物流中心")
            ) {

                warehouse =
                    text
                    .replace(
                        "物流中心",
                        ""
                    )
                    .trim();

            }

        });

        // ===== 商品資料表頭 =====

        const headerRow = 8;

        const headers =
            rows[headerRow];

        const dataRows =
            rows.slice(
                headerRow + 1
            );

        const idx = {};

        headers.forEach(
            (h, i) => {

                idx[h] = i;

            }
        );

        const result = [];

        dataRows.forEach(row => {

            if (
                !row[idx["品代"]]
            )
                return;

            result.push({

                採購日期:
                    purchaseDate,

                進貨指定日:
                    purchaseDate,

                採購通知單代號:
                    fileName,

                進貨倉庫:
                    warehouse,

                序號:
                    row[idx["序號"]] || "",

                訂貨驗收單:
                    row[idx["訂貨驗收單"]] || "",

                品名:
                    row[idx["品名"]] || "",

                品代:
                    row[idx["品代"]] || "",

                訂購總數:
                    row[idx["訂購總數"]] || "",

                條碼:
                    row[idx["條碼"]] || "",

                物流中心:
                    row[idx["物流中心"]] || ""

            });

        });

        const outputBook =
            XLSX.utils.book_new();

        const outputSheet =
            XLSX.utils.json_to_sheet(
                result
            );

        XLSX.utils.book_append_sheet(
            outputBook,
            outputSheet,
            "進貨資料"
        );

        XLSX.writeFile(
            outputBook,
            fileName +
            "_轉換完成.xlsx"
        );

    };

    reader.readAsBinaryString(
        file
    );

}

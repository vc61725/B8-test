function convertCSV() {

```
const file = document.getElementById("csvFile").files[0];

if (!file) {
    alert("請先選擇檔案");
    return;
}

const reader = new FileReader();

reader.onload = function(e) {

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

    console.clear();

    console.log("===== 前20列資料 =====");

    rows.slice(0, 20).forEach(
        (row, index) => {

            console.log(
                "列",
                index,
                row
            );

        }
    );

    let headerRow = -1;

    rows.forEach(
        (row, index) => {

            if (
                row.includes("品代")
            ) {

                headerRow = index;

            }

        }
    );

    console.log(
        "找到表頭列：",
        headerRow
    );

    if (headerRow >= 0) {

        console.log(
            "表頭內容："
        );

        console.log(
            rows[headerRow]
        );

    }

    alert(
        "請按 F12 → Console，把畫面截圖給 ChatGPT"
    );

};

reader.readAsBinaryString(file);
```

}

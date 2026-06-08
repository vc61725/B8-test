function convertCSV() {

alert("開始讀取檔案");

const file =
    document.getElementById("csvFile").files[0];

if (!file) {
    alert("請先選擇CSV");
    return;
}

const reader = new FileReader();

reader.onload = function(e) {

    alert("檔案已讀取");

    try {

        const workbook = XLSX.read(
            e.target.result,
            {
                type: "binary"
            }
        );

        alert("XLSX解析成功");

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

        console.log(rows);

        alert(
            "資料列數：" +
            rows.length
        );

    }
    catch(err) {

        console.error(err);

        alert(
            "錯誤：" +
            err.message
        );

    }

};

reader.readAsBinaryString(file);

}


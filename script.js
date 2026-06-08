function convertCSV() {


const file =
    document.getElementById("csvFile").files[0];

if (!file) {
    alert("請先選擇CSV");
    return;
}

const reader = new FileReader();

reader.onload = function(e) {

    const workbook =
        XLSX.read(
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

    rows.forEach((row, index) => {

        console.log(
            "第" + index + "列",
            row
        );

    });

    alert(
        "請按F12查看Console"
    );

};

reader.readAsBinaryString(file);


}



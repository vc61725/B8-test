function convertCSV() {

    const file =
        document.getElementById("csvFile").files[0];

    if (!file) {

        alert("請先選擇 CSV 檔案");

        return;
    }

    document.getElementById("result").innerHTML =
        "CSV 已成功選取：<br><br>" + file.name;
}

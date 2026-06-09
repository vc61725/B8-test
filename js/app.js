let b8Data = [];

window.onload = async function () {

    try {

        const response =
            await fetch("./data/B8.json");

        b8Data = await response.json();

        document.getElementById("result").innerHTML =
            `成功載入 ${b8Data.length} 筆商品資料`;

        console.log(b8Data);

    } catch (error) {

        console.error(error);

        document.getElementById("result").innerHTML =
            "B8資料載入失敗";
    }
};

function convertCSV() {

    const file =
        document.getElementById("csvFile").files[0];

    if (!file) {

        alert("請先選擇CSV檔");

        return;
    }

    document.getElementById("result").innerHTML =
        `B8資料筆數：${b8Data.length}<br><br>` +
        `CSV檔案：${file.name}`;
}

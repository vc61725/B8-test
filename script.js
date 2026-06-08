function convertCSV() {


const file =
    document.getElementById("csvFile").files[0];

if (!file) {
    alert("請先選擇CSV");
    return;
}

const reader = new FileReader();

reader.onload = function(e) {

    const decoder =
        new TextDecoder("big5");

    const text =
        decoder.decode(
            e.target.result
        );

    const lines =
        text.split(/\r?\n/);

    const result = [];

    let purchaseDate = "";
    let warehouse = "";
    let noticeNo = "";

    for (const line of lines) {

        if (
            line.includes("採購日期")
        ) {

            const match =
                line.match(
                    /\d{4}\/\d{1,2}\/\d{1,2}/
                );

            if (match)
                purchaseDate =
                match[0];
        }

        if (
            line.includes("物流中心")
        ) {

            warehouse =
                line.split(",")[1] || "";
        }

        if (
            line.includes("2944-QF")
        ) {

            noticeNo =
                line.split(",")[2] || "";
        }

    }

    let startIndex = -1;

    lines.forEach(
        (line,index)=>{

            if(
                line.includes("訂貨驗收單")
                &&
                line.includes("品代")
            ){

                startIndex = index;

            }

        }
    );

    if(startIndex < 0){

        alert("找不到商品資料表頭");
        return;

    }

    for(
        let i=startIndex+1;
        i<lines.length;
        i++
    ){

        const cols =
            lines[i].split(",");

        if(
            cols.length < 10
        )
            continue;

        result.push({

            採購日期:
                purchaseDate,

            進貨指定日:
                purchaseDate,

            採購通知單代號:
                noticeNo,

            進貨倉庫:
                warehouse,

            序號:
                cols[0],

            訂貨驗收單:
                cols[1],

            品名:
                cols[2],

            品代:
                cols[3],

            訂購總數:
                cols[7],

            條碼:
                cols[16],

            物流中心:
                cols[17]

        });

    }

    const wb =
        XLSX.utils.book_new();

    const ws =
        XLSX.utils.json_to_sheet(
            result
        );

    XLSX.utils.book_append_sheet(
        wb,
        ws,
        "進貨資料"
    );

    XLSX.writeFile(
        wb,
        "轉換完成.xlsx"
    );

};

reader.readAsArrayBuffer(file);


}

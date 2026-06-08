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

    let warehouse = "";
    let noticeNo = "";

    lines.forEach(line => {

        if (
            line.includes("2944-QF")
        ) {

            const cols =
                line.split(",");

            noticeNo =
                cols[2] || "";
        }

        if (
            line.includes("物流中心")
            &&
            line.includes("大肚")
        ) {

            const cols =
                line.split(",");

            warehouse =
                cols[1] || "";
        }

    });

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

        alert("找不到商品資料");
        return;

    }

    const result = [];

    for(
        let i=startIndex+1;
        i<lines.length;
        i++
    ){

        const cols =
            lines[i].split(",");

        if(cols.length < 18)
            continue;

        result.push({

            "採購日期":
                cols[17],

            "進貨指定日":
                cols[17],

            "採購通知單代號":
                noticeNo,

            "進貨倉庫":
                warehouse,

            "序號":
                i - startIndex,

            "訂貨驗收單":
                cols[0],

            "品名":
                cols[2],

            "品代":
                cols[3],

            "訂購總數":
                cols[7],

            "條碼":
                cols[15],

            "物流中心":
                cols[16]

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

    alert(
        "轉換完成"
    );

};

reader.readAsArrayBuffer(file);


}


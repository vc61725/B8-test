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

        alert("找不到表頭");
        return;

    }

    const firstRow =
        lines[startIndex + 1];

    const cols =
        firstRow.split(",");

    console.clear();

    cols.forEach(
        (value,index)=>{

            console.log(
                index,
                value
            );

        }
    );

    alert(
        "請到F12 Console複製內容給ChatGPT"
    );

};

reader.readAsArrayBuffer(file);


}

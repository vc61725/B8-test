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

    console.clear();

    console.log(
        text.substring(0, 3000)
    );

    alert(
        "已輸出前3000字到Console"
    );

};

reader.readAsArrayBuffer(file);


}

function convertCSV() {

```
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

    console.log(text);

    alert(
        "已用Big5讀取，請查看Console"
    );

};

reader.readAsArrayBuffer(file);
```

}

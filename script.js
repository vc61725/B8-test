function convertCSV() {

    const file =
      document.getElementById("csvFile").files[0];

    const reader =
      new FileReader();

    reader.onload = function(e){

        const text = e.target.result;

        const rows =
          text.split("\n")
              .map(x => x.split(","));
const headerRow = 8;

const headers = rows[headerRow];

console.log("表頭：");
console.log(headers);
        console.log(rows);

        alert("成功讀取CSV");

    };

    reader.readAsText(
      file,
      "big5"
    );

}
